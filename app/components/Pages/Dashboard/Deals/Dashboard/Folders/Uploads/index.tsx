import React, { useState } from 'react'

import Flex from 'styled-flex-component'

import ActionButton from 'components/Button/ActionButton'

import UploadPlaceholder from './UploadPlaceholder'
import UploadManager from '../../../UploadManager'

import Files from './Files'

import {
  FolderContainer,
  Header,
  HeaderTitle,
  ItemsContainer,
  ArrowIcon
} from '../styled'

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

export function UploadFolder(props: Props) {
  const [isFolderExpanded, setIsFolderExpanded] = useState<boolean>(true)

  const hasStashFiles = (): boolean =>
    Array.isArray(props.deal.files) && props.deal.files.length > 0

  const toggleFolderOpen = () => {
    if (hasStashFiles() === false) {
      return false
    }

    setIsFolderExpanded(!isFolderExpanded)
  }

  return (
    <FolderContainer>
      <Header>
        <Flex
          alignCenter
          style={{ cursor: 'pointer' }}
          onClick={toggleFolderOpen}
        >
          <ArrowIcon isOpen={isFolderExpanded} show={hasStashFiles()} />
          <HeaderTitle>Unorganized Files</HeaderTitle>
        </Flex>

        <Flex>
          {/*
          // @ts-ignore TODO: js component */}
          <UploadManager deal={props.deal}>
            <ActionButton
              size="small"
              as="span"
              style={{
                width: '9rem',
                justifyContent: 'center'
              }}
            >
              Upload
            </ActionButton>
          </UploadManager>
        </Flex>
      </Header>

      <UploadPlaceholder deal={props.deal} />

      <ItemsContainer isOpen={isFolderExpanded}>
        {/*
        // @ts-ignore TODO: js component */}
        <Files deal={props.deal} />
      </ItemsContainer>
    </FolderContainer>
  )
}