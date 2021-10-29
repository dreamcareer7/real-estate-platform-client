import { Typography, Button, makeStyles } from '@material-ui/core'

import useSafeState from '@app/hooks/use-safe-state'
import { MultiSelectionBrandSelectorDrawer } from '@app/views/components/BrandSelector'

import { useIsSuperCampaignResultMode } from '../../hooks/use-is-super-campaign-result-mode'
import SuperCampaignCard, { SuperCampaignCardProps } from '../SuperCampaignCard'
import SuperCampaignCardHeader from '../SuperCampaignCardHeader'
import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'

import { useUpdateSuperCampaignEligibility } from './use-update-super-campaign-eligibility'

const useStyles = makeStyles(
  theme => ({
    subtitle: { color: theme.palette.grey[500] },
    actions: { marginTop: theme.spacing(1.5) }
  }),
  { name: 'SuperCampaignEligibleParticipants' }
)

type SuperCampaignEligibleParticipantsProps = SuperCampaignCardProps

function SuperCampaignEligibleParticipants(
  props: SuperCampaignEligibleParticipantsProps
) {
  const classes = useStyles()
  const [isBrandSelectorOpen, setIsBrandSelectorOpen] = useSafeState(false)

  const { superCampaign, setSuperCampaign } = useSuperCampaignDetail()

  const updateSuperCampaignEligibility = useUpdateSuperCampaignEligibility(
    superCampaign,
    setSuperCampaign
  )

  const isReadOnly = useIsSuperCampaignResultMode(superCampaign)

  const openBrandSelector = () => setIsBrandSelectorOpen(true)

  const closeBrandSelector = () => setIsBrandSelectorOpen(false)

  const saveSelectedBrands = async (teamIds: string[]) => {
    await updateSuperCampaignEligibility(teamIds)
    closeBrandSelector()
  }

  const eligibleBrands: UUID[] = superCampaign.eligible_brands ?? []

  return (
    <SuperCampaignCard {...props}>
      <SuperCampaignCardHeader title="Eligible Participants" />
      <Typography className={classes.subtitle} variant="body2">
        Add offices and teams which are eligible to participate to this
        campaign.
      </Typography>
      <div className={classes.actions}>
        {eligibleBrands.length === 0 ? (
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={openBrandSelector}
          >
            Add Eligible Offices & Teams
          </Button>
        ) : (
          <>
            <Typography variant="subtitle2" component="span">
              {eligibleBrands.length > 1
                ? `${eligibleBrands.length} offices & teams have `
                : '1 office or team has '}
              been selected
            </Typography>
            <Button color="primary" size="small" onClick={openBrandSelector}>
              {isReadOnly ? 'View' : 'Edit'}
            </Button>
          </>
        )}
      </div>
      <MultiSelectionBrandSelectorDrawer
        open={isBrandSelectorOpen}
        title="Select Offices or Teams"
        onClose={closeBrandSelector}
        onSave={saveSelectedBrands}
        selectedBrands={eligibleBrands}
        readOnly={isReadOnly}
      />
    </SuperCampaignCard>
  )
}

export default SuperCampaignEligibleParticipants
