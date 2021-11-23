import { memo } from 'react'

import {
  Grid,
  makeStyles,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  TextField,
  InputLabel,
  LinearProgress
} from '@material-ui/core'
import { mdiDeleteOutline } from '@mdi/js'

import { getTemplateMediumLabel } from '@app/utils/marketing-center/get-template-medium-label'
import { getTemplateTypeLabel } from '@app/utils/marketing-center/get-template-type-label'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { TEMPLATE_TYPES, MEDIUMS } from '../../constants'
import { Asset } from '../../types'

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      height: '100%'
    },
    uploadContainer: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(1.5, 2, 2),
      height: theme.spacing(7),
      border: `1px dashed ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    },
    image: {
      width: '100%',
      objectFit: 'cover',
      height: theme.spacing(14),
      borderRadius: theme.shape.borderRadius
    },
    clickToUpload: {
      color: theme.palette.primary.main,
      cursor: 'pointer'
    },
    deleteContainer: {
      flexGrow: 1,
      textAlign: 'right'
    },
    progressBar: {
      height: `${theme.spacing(3)}px !important`
    }
  }),
  {
    name: 'MarketingAssetUploadDrawerAssetItem'
  }
)

interface Props {
  asset: Asset
  uploadProgress?: number
  onUpdateAsset: (asset: Asset) => void
  onDeleteAsset: (asset: Asset) => void
}

export default memo(function AssetItem({
  asset,
  uploadProgress,
  onUpdateAsset,
  onDeleteAsset
}: Props) {
  const classes = useStyles()

  const renderUploadProgress = () => {
    return (
      <Grid item xs={9}>
        <LinearProgress
          className={classes.progressBar}
          value={uploadProgress}
          variant="determinate"
        />
      </Grid>
    )
  }

  const renderUploadForm = () => {
    return (
      <>
        <Grid container item direction="column" xs={9} spacing={4}>
          <Grid item xs>
            <FormControl fullWidth>
              <TextField
                autoFocus
                variant="outlined"
                size="small"
                id="asset-label"
                label="Label"
                value={asset.label}
                onChange={event => {
                  onUpdateAsset({
                    ...asset,
                    label: event.target.value
                  })
                }}
              />
            </FormControl>
          </Grid>
          <Grid container item direction="row" spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel
                  id="asset-template-type-label"
                  htmlFor="asset-template-type"
                >
                  Add To
                </InputLabel>
                <Select
                  id="asset-template-type"
                  labelId="asset-template-type-label"
                  label="Add To"
                  value={asset.templateType}
                  onChange={event =>
                    onUpdateAsset({
                      ...asset,
                      templateType: event.target.value as IMarketingTemplateType
                    })
                  }
                >
                  {TEMPLATE_TYPES.map(type => (
                    <MenuItem key={type} value={type}>
                      {getTemplateTypeLabel(type)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="asset-medium-label" htmlFor="asset-medium">
                  Medium
                </InputLabel>
                <Select
                  id="asset-medium"
                  labelId="asset-medium-label"
                  label="Medium"
                  value={asset.medium}
                  onChange={event =>
                    onUpdateAsset({
                      ...asset,
                      medium: event.target.value as IMarketingTemplateMedium
                    })
                  }
                >
                  {MEDIUMS.map(type => (
                    <MenuItem key={type} value={type}>
                      {getTemplateMediumLabel(type)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.deleteContainer}>
          <IconButton onClick={() => onDeleteAsset(asset)}>
            <SvgIcon size={muiIconSizes.small} path={mdiDeleteOutline} />
          </IconButton>
        </Grid>
      </>
    )
  }

  return (
    <Grid
      container
      item
      alignItems="center"
      direction="row"
      spacing={2}
      key={asset.label}
    >
      <Grid item xs={2}>
        <img
          src={asset.file.url}
          alt={asset.label ?? 'image'}
          className={classes.image}
        />
      </Grid>
      {uploadProgress === undefined
        ? renderUploadForm()
        : renderUploadProgress()}
    </Grid>
  )
})
