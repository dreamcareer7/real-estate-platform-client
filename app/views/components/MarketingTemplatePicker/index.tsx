import React, { RefObject } from 'react'
import { Box, Grid, makeStyles } from '@material-ui/core'

import { useInfinitePagination } from 'hooks/use-infinite-pagination'
import { getActiveTeamId } from 'utils/user-teams'

import LoadingContainer from 'components/LoadingContainer'
import Masonry from 'components/Masonry'
import MarketingTemplateCard from 'components/MarketingTemplateCard'

import { useTemplates } from '../../../components/Pages/Dashboard/Marketing/hooks/use-templates'

const useStyles = makeStyles(
  () => ({
    templateItemContainer: {
      cursor: 'pointer'
    }
  }),
  {
    name: 'MarketingTemplatePicker'
  }
)

interface Props {
  user: IUser
  templateTypes?: IMarketingTemplateType[]
  mediums?: IMarketingTemplateMedium[]
  containerRef?: RefObject<HTMLElement>
  onSelect: (template: IBrandMarketingTemplate) => void
}

export default function MarketingTemplatePicker({
  user,
  templateTypes = [],
  mediums = [],
  containerRef,
  onSelect
}: Props) {
  const classes = useStyles()
  const activeBrand = getActiveTeamId(user)

  const { templates, isLoading } = useTemplates(
    activeBrand,
    mediums,
    templateTypes
  )

  const paginatedTemplates = useInfinitePagination<IBrandMarketingTemplate>({
    items: templates,
    infiniteScrollProps: {
      container: containerRef
    }
  })

  if (isLoading) {
    return (
      <Grid container justify="center">
        <Box py={10}>
          <LoadingContainer noPaddings />
        </Box>
      </Grid>
    )
  }

  return (
    <Grid container>
      <Masonry>
        {paginatedTemplates.map(template => (
          <div
            key={template.id}
            className={classes.templateItemContainer}
            onClick={() => onSelect(template)}
          >
            <MarketingTemplateCard template={template} />
          </div>
        ))}
      </Masonry>
    </Grid>
  )
}
