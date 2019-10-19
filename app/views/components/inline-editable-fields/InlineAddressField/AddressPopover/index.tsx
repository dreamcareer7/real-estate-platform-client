import React, { useRef } from 'react'

import { Popover } from '@material-ui/core'

import { InlineAddressForm } from '../InlineAddressForm'

interface Props {
  isOpen: boolean
  address: string | object
  formStyle: React.CSSProperties
  showDeleteButton: boolean
  preSaveFormat(): void
  postLoadFormat(): void
  onDelete(): void
  onSubmit(): void
  onClose(): void
}

export function AddressPopover({
  isOpen,
  address,
  formStyle,
  showDeleteButton,
  preSaveFormat,
  postLoadFormat,
  onDelete,
  onSubmit,
  onClose
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  return (
    <div ref={containerRef}>
      <Popover
        id={isOpen ? 'inline-address-popover' : undefined}
        open={isOpen}
        anchorEl={containerRef && containerRef.current}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        style={{ zIndex: 1002 }}
      >
        <InlineAddressForm
          address={address}
          style={formStyle}
          preSaveFormat={preSaveFormat}
          postLoadFormat={postLoadFormat}
          showDeleteButton={showDeleteButton}
          handleCancel={onClose}
          handleDelete={onDelete}
          handleSubmit={onSubmit}
        />
      </Popover>
    </div>
  )
}
