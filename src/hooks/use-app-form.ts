import { createFormHook } from '@tanstack/react-form'

import {
  Checkbox,
  DateField,
  FloatingTextField,
  ResetButton,
  Select,
  SubscribeButton,
  Tags,
  TextArea,
  TextField,
  TextFieldNoLabel,
} from '../components/form-components'
import { fieldContext, formContext } from '../context/form-context'

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    FloatingTextField,
    TextField,
    TextFieldNoLabel,
    Select,
    TextArea,
    Checkbox,
    Tags,
    DateField,
  },
  formComponents: {
    SubscribeButton,
    ResetButton,
  },
  fieldContext,
  formContext,
})
