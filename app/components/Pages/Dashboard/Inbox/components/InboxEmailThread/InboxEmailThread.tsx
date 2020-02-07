import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Box, IconButton, Typography } from '@material-ui/core'
import { addNotification } from 'reapop'

import { getEmailThread } from 'models/email/get-email-thread'

import Loading from 'partials/Loading'
import Avatar from 'components/Avatar'
import { normalizeThreadMessageToThreadEmail } from 'components/EmailThread/helpers/normalize-to-email-thread-email'
import { EmailThreadEmails } from 'components/EmailThread'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'

import NoContentMessage from '../NoContentMessage'
import setSelectedEmailThreadId from '../../helpers/set-selected-email-thread-id'
import markEmailThreadAsRead from '../../helpers/mark-email-thread-as-read'

interface Props {
  emailThreadId?: UUID
}

export default function InboxEmailThread({ emailThreadId }: Props) {
  const [status, setStatus] = useState<
    'empty' | 'fetching' | 'error' | 'fetched'
  >('empty')
  const [emailThread, setEmailThread] = useState<IEmailThread<
    'messages' | 'contacts'
  > | null>(null)

  const dispatch = useDispatch()

  const fetchEmailThread = useCallback(async () => {
    if (emailThreadId) {
      setStatus('fetching')

      try {
        const emailThread = await getEmailThread(emailThreadId)

        setEmailThread(emailThread)
        setStatus('fetched')

        try {
          await markEmailThreadAsRead(emailThread)
        } catch (reason) {
          console.error(reason)
          dispatch(
            addNotification({
              status: 'error',
              message:
                'Something went wrong while marking the email as read. Please reload the page.'
            })
          )
        }
      } catch (reason) {
        console.error(reason)
        dispatch(
          addNotification({
            status: 'error',
            message:
              'Something went wrong while fetching the email. Please, reload the page.'
          })
        )
        setStatus('error')
      }
    } else {
      setStatus('empty')
    }
  }, [dispatch, emailThreadId])

  useEffect(() => {
    fetchEmailThread()
  }, [fetchEmailThread])

  useEffect(() => {
    const socket: SocketIOClient.Socket = (window as any).socket

    async function handleDeleteEmailThreads(emailThreadIds: UUID[]) {
      if (emailThreadId && emailThreadIds.includes(emailThreadId)) {
        setSelectedEmailThreadId(undefined)
      }

      if (emailThread && emailThreadIds.includes(emailThread.id)) {
        setEmailThread(null)
        setStatus('empty')
      }
    }
    async function handleUpdateEmailThreads(emailThreadIds: UUID[]) {
      if (emailThreadId && emailThreadIds.includes(emailThreadId)) {
        fetchEmailThread()
      }
    }

    socket.on('email_thread:delete', handleDeleteEmailThreads)
    socket.on('email_thread:update', handleUpdateEmailThreads)

    return () => {
      socket.off('email_thread:delete', handleDeleteEmailThreads)
      socket.off('email_thread:update', handleUpdateEmailThreads)
    }
  }, [emailThreadId, emailThread, fetchEmailThread])

  const emails = useMemo(
    () =>
      emailThread
        ? emailThread.messages.map(normalizeThreadMessageToThreadEmail)
        : [],
    [emailThread]
  )

  if (
    status === 'fetching' &&
    (!emailThread || emailThread.id !== emailThreadId)
  ) {
    return (
      <Box paddingTop={2}>
        <Loading />
      </Box>
    )
  }

  if (status === 'error') {
    return <NoContentMessage error>Error Opening Conversation</NoContentMessage>
  }

  if (status === 'empty' || !emailThread) {
    return <NoContentMessage>No Conversation Selected</NoContentMessage>
  }

  return (
    <Box padding="20px" paddingTop="20px">
      <Box display="flex" padding="12px 20px">
        <Box flexGrow={1}>
          <Typography variant="h6" noWrap>
            {emailThread.subject || '(No Subject)'}
          </Typography>
        </Box>
        {!!emailThread.contacts && emailThread.contacts.length > 0 && (
          <Box marginRight={3}>
            {emailThread.contacts.map(c => (
              <Box key={c.id} display="inline-block" marginLeft={0.5}>
                <Avatar
                  size={32}
                  image={c.profile_image_url}
                  title={
                    c.display_name === c.email
                      ? c.display_name
                      : `${c.display_name}\n${c.email}`
                  }
                />
              </Box>
            ))}
          </Box>
        )}
        <IconButton
          size="small"
          onClick={() => {
            setSelectedEmailThreadId(undefined)
            setEmailThread(null)
            setStatus('empty')
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box overflow="auto">
        <EmailThreadEmails emails={emails} />
      </Box>
    </Box>
  )
}
