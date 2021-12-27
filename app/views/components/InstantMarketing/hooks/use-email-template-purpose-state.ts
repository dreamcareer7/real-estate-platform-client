import { useState } from 'react'

import { ACL } from '@app/constants/acl'
import { TemplateData } from '@app/utils/marketing-center/render-branded-template'
import { useAcl } from '@app/views/components/Acl/use-acl'

import getTemplateObject from '../helpers/get-template-object'
import { EmailTemplatePurpose } from '../types'

interface UseEmailTemplatePurposeState {
  isEmailPurposeDrawerOpen: boolean
  closeEmailPurposeDrawer: () => void
  emailTemplatePurpose: Optional<EmailTemplatePurpose>
  setEmailTemplatePurpose: (emailTemplatePurpose: EmailTemplatePurpose) => void
  correctedTemplateData: TemplateData
}

function getUserWithVariableFields(user: IUser): IUser {
  return {
    ...user,
    profile_image_url: '{{user.profile_image_url}}',
    display_name: '{{user.display_name}}',
    phone_number: '{{user.phone_number}}',
    email: '{{user.email}}',
    facebook: '{{user.facebook}}',
    twitter: '{{user.twitter}}',
    linkedin: '{{user.linkedin}}',
    youtube: '{{user.youtube}}',
    instagram: '{{user.instagram}}'
  }
}

export function useEmailTemplatePurposeState(
  template: Nullable<IBrandMarketingTemplate>,
  templateData: TemplateData,
  initialEmailTemplatePurpose: Optional<EmailTemplatePurpose>
): UseEmailTemplatePurposeState {
  const isAdmin = useAcl(ACL.ADMIN)

  const isEmailTemplate =
    !!template && getTemplateObject(template).medium === 'Email'

  const [isEmailPurposeDrawerOpen, setIsDrawerOpen] = useState<boolean>(
    isAdmin && isEmailTemplate && !initialEmailTemplatePurpose
  )

  const [emailTemplatePurpose, setEmailTemplatePurpose] = useState<
    Optional<EmailTemplatePurpose>
  >(initialEmailTemplatePurpose)

  const closeEmailPurposeDrawer = () => setIsDrawerOpen(false)

  const correctedTemplateData: TemplateData =
    templateData.user &&
    emailTemplatePurpose &&
    ['ForOtherAgents', 'ForCampaigns'].includes(emailTemplatePurpose)
      ? {
          ...templateData,
          user: getUserWithVariableFields(templateData.user)
        }
      : templateData

  return {
    isEmailPurposeDrawerOpen,
    closeEmailPurposeDrawer,
    emailTemplatePurpose,
    setEmailTemplatePurpose,
    correctedTemplateData
  }
}
