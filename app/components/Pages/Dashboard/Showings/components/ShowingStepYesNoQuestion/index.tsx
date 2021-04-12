import React, { memo } from 'react'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'
import { RadioGroup, RadioItem } from 'components/RadioGroup'

import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'

export type YesNoAnswer = 'Yes' | 'No'

interface ShowingStepYesNoQuestionProps {
  question: string
  value: Nullable<YesNoAnswer>
  onChange: (value: YesNoAnswer) => void
  goNext?: boolean
  yesLabel?: string
  noLabel?: string
}

function ShowingStepYesNoQuestion({
  question,
  value,
  onChange,
  goNext = true,
  yesLabel = 'Yes',
  noLabel = 'No'
}: ShowingStepYesNoQuestionProps) {
  const nextStep = useQuestionWizardSmartNext()

  const handleChange = (value: YesNoAnswer) => {
    onChange(value)

    if (goNext) {
      nextStep()
    }
  }

  const yesNoOptions: RadioItem<YesNoAnswer>[] = [
    {
      label: yesLabel,
      value: 'Yes'
    },
    {
      label: noLabel,
      value: 'No'
    }
  ]

  return (
    <QuestionSection>
      <QuestionTitle>{question}</QuestionTitle>
      <QuestionForm>
        <RadioGroup
          defaultValue={value}
          name="approvalType"
          options={yesNoOptions}
          onChange={handleChange}
        />
      </QuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepYesNoQuestion)
