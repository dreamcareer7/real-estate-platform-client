import React from 'react'
import _ from 'underscore'
import CrudRole from './crud-role'
import RoleItem from './role-item'

const BUYING = 'Buying'
const SELLING = 'Selling'

function getRoles(side) {
  if (side === BUYING) {
    return ['Buyer', 'Tenant']
  } else if (side === SELLING) {
    return ['Seller', 'Landlord']
  } else {
    return []
  }
}

export default ({
  clients,
  dealSide,
  display,
  onUpsertClient,
  onRemoveClient
}) => {
  const allowedRoles = getRoles(dealSide)

  if (!display) {
    return false
  }

  return (
    <div className="form-section deal-people deal-client">
      <div className="hero">
        Who are the {dealSide === 'Buying' ? 'buyers' : 'sellers'}&nbsp;
        <span className="required">*</span>
      </div>

      <div className="people-container">
        {
          _.map(clients, (agent, id) =>
            <CrudRole
              key={id}
              role={agent}
              modalTitle="Edit client"
              allowedRoles={allowedRoles}
              onRemoveRole={(id) => onRemoveClient(id)}
              onUpsertRole={onUpsertClient}
            />
          )
        }

        <CrudRole
          modalTitle="Add your client"
          ctaTitle="Add your client"
          allowedRoles={allowedRoles}
          onUpsertRole={onUpsertClient}
        />
      </div>
    </div>
  )
}
