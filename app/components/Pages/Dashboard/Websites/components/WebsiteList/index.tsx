import React, { useEffect } from 'react'

import { Box, Grid } from '@material-ui/core'

import useAsync from 'hooks/use-async'
import getWebsiteList from 'models/website/get-my-websites'

import WebsiteCard from '../WebsiteCard'
import WebsiteCardProvider from '../WebsiteCardProvider'
import WebsiteListProvider from '../WebsiteListProvider'
import WebsiteListState from '../WebsiteListState'

const defaultData: IWebsite[] = []

interface Props {
  title: string
  typesWhiteList?: IWebsiteTemplateType[]
  typesBlackList?: IWebsiteTemplateType[]
}

function WebsiteList({ title, typesWhiteList, typesBlackList }: Props) {
  const {
    data: instances,
    run,
    isLoading,
    setData
  } = useAsync({
    data: defaultData,
    status: 'pending'
  })
  const isEmpty = !isLoading && instances.length === 0

  useEffect(() => {
    run(async () => {
      const websites = await getWebsiteList()

      // To filter websites based on white and black list of template types
      function filterTemplateTypes(
        template_instance: IMarketingTemplateInstance,
        typesWhiteList?: IWebsiteTemplateType[],
        typesBlackList?: IWebsiteTemplateType[]
      ) {
        return (
          (typesWhiteList
            ? typesWhiteList.includes(
                template_instance.template.template_type as IWebsiteTemplateType
              )
            : true) &&
          (typesBlackList
            ? !typesBlackList.includes(
                template_instance.template.template_type as IWebsiteTemplateType
              )
            : true)
        )
      }

      /**
       * We are heavily relied on `template_instance` on the new website builder but
       * the old websites do not have this property on their records.
       * To avoid white screen error, I have to skip the old websites on this list and
       * keep just the new ones.
       */
      return websites.filter(website => {
        return (
          !!website.template_instance &&
          filterTemplateTypes(
            website.template_instance,
            typesWhiteList,
            typesBlackList
          )
        )
      })
    })
  }, [run, typesBlackList, typesWhiteList])

  if (isLoading || isEmpty) {
    return (
      <WebsiteListState title={title} isLoading={isLoading} isEmpty={isEmpty} />
    )
  }

  return (
    <Box paddingLeft={2} paddingRight={2} paddingTop={3}>
      <Grid container spacing={2}>
        <WebsiteListProvider setData={setData}>
          {instances.map(instance => (
            <WebsiteCardProvider key={instance.id} website={instance}>
              <WebsiteCard {...instance} />
            </WebsiteCardProvider>
          ))}
        </WebsiteListProvider>
      </Grid>
    </Box>
  )
}

export default WebsiteList
