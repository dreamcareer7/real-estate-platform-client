import { useState, useRef, useEffect, ComponentProps } from 'react'

import { makeStyles } from '@material-ui/core'
import { useInView } from 'react-intersection-observer'
import { useDeepCompareEffect } from 'react-use'

import { PdfThumbnail } from 'components/PdfThumbnail'
import getMockListing from 'components/SearchListingDrawer/helpers/get-mock-listing'
import TemplateThumbnail from 'components/TemplateThumbnail'
import { getFileType } from 'utils/file-utils/get-file-type'
import { getTemplateImage } from 'utils/marketing-center/helpers'
import { getActiveBrand } from 'utils/user-teams'

const useStyles = makeStyles(
  () => ({
    image: {
      width: '100%'
    },
    templateThumbnailWrapper: {
      margin: '0 auto'
    }
  }),
  {
    name: 'MarketingTemplateCardThumbnail'
  }
)

interface Props {
  user: IUser
  template: IMarketingTemplateInstance | IBrandMarketingTemplate
  listing?: IListing
  useStaticImage?: boolean

  onClick?: ComponentProps<typeof TemplateThumbnail>['onClick']
}

export function Thumbnail({
  user,
  template,
  listing: receivedListing,
  useStaticImage,
  onClick
}: Props) {
  const { ref, inView } = useInView({ delay: 100 })
  const alreadyLoaded = useRef<boolean>(false)
  const classes = useStyles()
  const brand = getActiveBrand(user)
  const [listing, setListing] = useState<Optional<IListing>>(undefined)

  useDeepCompareEffect(() => {
    async function fetchListingIfNeeded() {
      if (receivedListing) {
        setListing(receivedListing)

        return
      }

      const listing = await getMockListing()

      setListing(listing as unknown as IListing)
    }

    fetchListingIfNeeded()
  }, [receivedListing])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!alreadyLoaded.current && inView) {
        alreadyLoaded.current = true
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [inView])

  if (
    template.type === 'template_instance' &&
    getFileType(template.file) === 'pdf'
  ) {
    return (
      <div ref={ref}>
        <PdfThumbnail url={template.file.url} />
      </div>
    )
  }

  if (!brand) {
    return null
  }

  const shouldRender = alreadyLoaded.current || inView

  if (useStaticImage) {
    const { thumbnail } = getTemplateImage(template)

    return template.template.video ? (
      <div ref={ref}>
        {shouldRender && <video src={thumbnail} muted autoPlay />}
      </div>
    ) : (
      <div ref={ref}>
        {shouldRender && (
          <img
            alt={template.template.name}
            src={thumbnail}
            className={classes.image}
          />
        )}
      </div>
    )
  }

  return (
    <div className={classes.templateThumbnailWrapper} ref={ref}>
      {shouldRender && (
        <TemplateThumbnail
          template={template}
          brand={brand}
          data={{ listing, user }}
          onClick={onClick}
        />
      )}
    </div>
  )
}
