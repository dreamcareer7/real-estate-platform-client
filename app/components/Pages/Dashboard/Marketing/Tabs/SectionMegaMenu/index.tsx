import React from 'react'

import { Grid } from '@material-ui/core'

import { Section, SectionItem } from 'components/PageSideNav/types'

import Item from './components/Item'

interface Props {
  data: Section
  mediums: { [key: string]: IMarketingTemplateMedium[] }
  onClose: () => void
}

export const SectionMegaMenu = ({ data, mediums, onClose }: Props) => {
  const { items } = data

  const sanitizeMediums = (item: SectionItem) => {
    const mediumKey = Array.isArray(item.value) ? item.title : item.value

    if (mediumKey && mediums[mediumKey]) {
      return mediums[mediumKey]
    }

    return []
  }

  return (
    <Grid container spacing={2}>
      {items.map((item, i) => {
        const currentSectionMediums = sanitizeMediums(item)

        return (
          <Item
            key={i}
            data={item}
            mediums={currentSectionMediums}
            onClose={onClose}
          />
        )
      })}
    </Grid>
  )
}

export default SectionMegaMenu
