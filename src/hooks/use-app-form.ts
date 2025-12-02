import { createFormHook } from '@tanstack/react-form'

import {
  Checkbox,
  DateField,
  FloatingPasswordField,
  FloatingTextField,
  PasswordField,
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
    PasswordField,
    FloatingPasswordField,
  },
  formComponents: {
    SubscribeButton,
    ResetButton,
  },
  fieldContext,
  formContext,
})
