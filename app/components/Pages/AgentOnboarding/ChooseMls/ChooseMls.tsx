import React from 'react'
import { useSelector } from 'react-redux'
import { WithRouterProps, Link } from 'react-router'
import { Form } from 'react-final-form'
import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import idx from 'idx'

import { IAppState } from 'reducers'
import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import Header from '../Header'
import Container from '../Container'
import SkipButton from '../SkipButton'
import NextButton from '../NextButton'
import { useDocumentTitle } from '../use-document-title'

import { MlsSelect } from './MlsSelect'

interface FormValues {
  agentId: UUID
}

export function ChooseMls(props: WithRouterProps) {
  useDocumentTitle('Confirm Agent ID')

  const agents: IAgent[] = idx(props, p => p.location.state.agents)
  const mlsId = props.location.query.mlsId
  const brand = useSelector((store: IAppState) => store.brand)

  if (!Array.isArray(agents) || agents.length === 0) {
    props.router.push('/oops')

    return null
  }

  const onSubmit = (values: FormValues) => {
    const agent = agents.find(a => a.id === values.agentId)

    props.router.push({
      pathname: '/onboarding/confirm-agent-id/security-question',
      state: { agent }
    })
  }

  return (
    <Container>
      <Header
        brand={brand}
        title="Choose MLS"
        subtitle={`You entred ${mlsId} for MLS #, Choose which MLS you are in.`}
      />

      <Form
        onSubmit={onSubmit}
        initialValues={{ agentId: agents[0].id }}
        render={({ handleSubmit, form }) => {
          const { submitError, submitting } = form.getState()

          return (
            <form onSubmit={handleSubmit}>
              <Box mb={5}>
                <Box mb={5}>
                  <MlsSelect items={agents} />
                  {submitError && !submitting && (
                    <Box mt={3}>
                      <Alert severity="error">{submitError}</Alert>
                    </Box>
                  )}
                </Box>

                {submitting ? (
                  <CircleSpinner />
                ) : (
                  <Box display="flex" justifyContent="center">
                    <SkipButton to="/onboarding/config-brand" />
                    <NextButton type="submit" disabled={submitting} />
                  </Box>
                )}
              </Box>
            </form>
          )
        }}
      />

      <Link to={`/onboarding/confirm-agent-id?mlsId=${mlsId}`}>Back</Link>
    </Container>
  )
}
