import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { UpdateCacheActions, updateCacheComposer } from '@app/utils/react-query'

import { list as enrollmentList } from './query-keys/enrollment'
import { updateCacheList, updateCacheDetail } from './query-update/campaign'
import { updateSuperCampaignTags } from './update-super-campaign-tags'

interface DataInput {
  superCampaignId: UUID
  tags: string[]
}

export type UseUpdateSuperCampaignTags = UseMutationResult<
  ISuperCampaign,
  ResponseError,
  DataInput,
  { cache: UpdateCacheActions }
>

export type UseUpdateSuperCampaignTagsOptions = Omit<
  UseMutationOptions<
    ISuperCampaign,
    ResponseError,
    DataInput,
    { cache: UpdateCacheActions }
  >,
  'notify' | 'onMutate'
>

export function useUpdateSuperCampaignTags(
  options?: UseUpdateSuperCampaignTagsOptions
): UseUpdateSuperCampaignTags {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ superCampaignId, tags }) =>
      updateSuperCampaignTags(superCampaignId, tags),
    {
      ...options,
      notify: {
        onSuccess: 'The tags were updated',
        onError: 'Something went wrong while saving the tags. Please try again.'
      },
      invalidates: (_, { superCampaignId }) => [
        enrollmentList(superCampaignId) // We need to invalidate the enrollment list when the tags were changed
      ],
      onMutate: async ({ superCampaignId, tags }) => ({
        cache: await updateCacheComposer(
          updateCacheDetail(queryClient, superCampaignId, {
            tags
          }),
          updateCacheList(queryClient, superCampaignId, {
            tags
          })
        )
      }),
      onError: (error, variables, context) => {
        context?.cache.revert()
        options?.onError?.(error, variables, context)
      },
      onSettled: (data, error, variables, context) => {
        context?.cache.invalidate()
        options?.onSettled?.(data, error, variables, context)
      }
    }
  )
}
