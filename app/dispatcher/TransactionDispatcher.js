// TransactionDispatcher.js
import { Dispatcher } from 'flux'

// Transaction actions
import newTransaction from '../actions/transactions/new'
import createTransaction from '../actions/transactions/create'
import deleteTransaction from '../actions/transactions/delete'
import getAllTransactions from '../actions/transactions/get'
import uploadFiles from '../actions/transactions/upload-files'
import editTransaction from '../actions/transactions/edit'
import addRole from '../actions/transactions/add-role'
import deleteRole from '../actions/transactions/delete-role'
import deleteFile from '../actions/transactions/delete-file'
import getTransaction from '../actions/transactions/get-transaction'
import acknowledgeTransaction from '../actions/transactions/acknowledge-transaction'

const TransactionDispatcher = new Dispatcher()

// Register callback with TransactionDispatcher
TransactionDispatcher.register(payload => {
  const action = payload.action
  switch (action) {
    case 'init':
      newTransaction.init()
      break

    case 'go-to-step':
      newTransaction.goToStep(payload.step)
      break

    case 'set-type':
      newTransaction.setType(payload.type)
      break

    case 'create':
      createTransaction(payload.user, payload.new_transaction)
      break

    case 'get-all':
      getAllTransactions(payload.user)
      break

    case 'get-transaction':
      getTransaction(payload.user, payload.id)
      break

    case 'edit-transaction':
      editTransaction(payload.user, payload.transaction, payload.listing_data)
      break

    case 'delete-transaction':
      deleteTransaction(payload.user, payload.id)
      break

    case 'acknowledge-transaction':
      acknowledgeTransaction(payload.user, payload.transaction)
      break

    case 'upload-files':
      uploadFiles(payload.user, payload.transaction, payload.files)
      break

    case 'add-role':
      addRole(payload.user, payload.transaction, payload.contact)
      break

    case 'delete-role':
      deleteRole(payload.user, payload.transaction, payload.contact)
      break

    case 'delete-file':
      deleteFile(payload.user, payload.transaction, payload.file)
      break

    default:
      return true
  }
  return true
})

export default TransactionDispatcher