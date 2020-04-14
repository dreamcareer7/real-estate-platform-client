import React, { MouseEvent, useState } from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import { Item } from './types'
import Button from './Button'
import items from './items'
import Menu from './Menu'

interface Props {
  onCreateEvent: (event: IEvent) => void
  onCreateContact: (contact: IContact) => void
  onCreateTour: (
    tour: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => void
  onCreateOpenHouse: (
    oh: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => void
}

export default function GlobalActionsButton(props: Props) {
  const user = useSelector((state: IAppState) => state.user as IUser)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedItem, setSelectedItem] = useState<null | Item>(null)

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleItemClick = (item: Item) => {
    setSelectedItem(item)
    handleMenuClose()
  }

  const handleCloseRenderedItem = () => {
    setSelectedItem(null)
  }

  const handleSubmitEvent = (event: IEvent) => {
    props.onCreateEvent(event)
    handleCloseRenderedItem()
  }

  const handleSubmitContact = (contact: IContact) => {
    props.onCreateContact(contact)
    handleCloseRenderedItem()
  }

  const handleSubmitTour = (
    tour: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => {
    props.onCreateTour(tour)
    handleCloseRenderedItem()
  }

  const handleSubmitOpenHouse = (
    oh: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => {
    props.onCreateOpenHouse(oh)
    handleCloseRenderedItem()
  }

  const renderSelectedItem = () => {
    if (!selectedItem) {
      return
    }

    switch (selectedItem.type) {
      case 'email':
        return selectedItem.render({
          isOpen: true,
          initialValues: {
            from: user
          },
          onClose: handleCloseRenderedItem,
          onSent: handleCloseRenderedItem
        })

      case 'event':
        return selectedItem.render({
          user,
          isOpen: true,
          onClose: handleCloseRenderedItem,
          submitCallback: handleSubmitEvent
        })

      case 'contact':
        return selectedItem.render({
          user,
          isOpen: true,
          onClose: handleCloseRenderedItem,
          submitCallback: handleSubmitContact
        })

      case 'deal':
        selectedItem.redirectTo('/dashboard/deals/create')

        return null

      case 'openhouse':
        return selectedItem.render({
          isOpen: true,
          onClose: handleCloseRenderedItem,
          submitCallback: handleSubmitOpenHouse
        })

      case 'tour':
        return selectedItem.render({
          user,
          isOpen: true,
          listings: [],
          onClose: handleCloseRenderedItem,
          submitCallback: handleSubmitTour
        })
    }
  }

  return (
    <>
      <Button onClick={handleMenuOpen} />
      <Menu
        items={items}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        onItemClick={handleItemClick}
      />

      {renderSelectedItem()}
    </>
  )
}
