import React from 'react'
import type { ReactNode } from 'react'

import { useStore } from '@tanstack/react-form'
import { format } from 'date-fns'
import { CircleCheck, Loader2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { ButtonProps } from '@/components/ui/button'
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as ShadcnSelect from '@/components/ui/select'
import { Slider as ShadcnSlider } from '@/components/ui/slider'
import { Switch as ShadcnSwitch } from '@/components/ui/switch'
import { TagsInput } from '@/components/ui/tags-input'
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import { useFieldContext, useFormContext } from '../context/form-context'
import { FloatingLabelInput } from './ui/floating-label'

export function SubscribeButton({ label, icon: Icon, ...props }: { label: string; icon?: LucideIcon } & ButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting} {...props}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : <>{Icon && <Icon />}</>}
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}
export function ResetButton({ label = 'Reset', icon: Icon }: { label?: string; icon?: LucideIcon }) {
  const form = useFormContext()

  return (
    <Button type="reset" variant="cancel" onClick={() => form.reset()}>
      {Icon && <Icon />}
      {label}
    </Button>
  )
}

export function SubscribeButton1({ label }: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

function ErrorMessages({ errors }: { errors: Array<string | { message: string }> }) {
  const uniqueErrors = Array.from(
    new Map(
      errors.map((item) => {
        const message = typeof item === 'string' ? item : item.message
        return [message, item]
      }),
    ).values(),
  )

  return (
    <>
      {uniqueErrors.slice(0, 1).map((error) => (
        <div
          key={typeof error === 'string' ? error : error.message}
          className="text-destructive mt-1 flex items-center gap-1 text-[0.7rem] italic">
          {typeof error === 'string' ? error : error.message}
        </div>
      ))}
    </>
  )
}
export function TextFieldNoLabel({
  charCount,
  note,
  ...props
}: {
  charCount?: number
  note?: string
} & React.ComponentProps<'input'>) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  const id = React.useId()

  return (
    <>
      <Input
        id={id}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
      {note && <p className="text-muted-foreground text-xs">{note}</p>}
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </>
  )
}

export function TextField({
  label,
  subLabel,
  charCount,
  note,
  mandatory,
  ...props
}: {
  label?: string
  mandatory?: boolean
  subLabel?: ReactNode
  charCount?: number
  note?: string
} & React.ComponentProps<'input'>) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor={label} className="mb-2 ml-1 flex justify-between leading-5">
        <div className="flex items-center gap-2">
          {label}{' '}
          {subLabel && (
            <>
              {typeof subLabel === 'string' ? (
                <span className="text-muted-foreground text-xs">{subLabel}</span>
              ) : (
                subLabel
              )}
            </>
          )}
          {mandatory && <sup>*</sup>}
        </div>
        {typeof charCount !== 'undefined' && charCount >= 0 ? (
          <div className="text-muted-foreground text-xs">
            {props.maxLength ? (
              <div>
                {charCount} / {props.maxLength} characters
              </div>
            ) : (
              <div>{charCount} characters</div>
            )}
          </div>
        ) : null}
      </Label>
      <Input
        id={label}
        value={field.state.value ? field.state.value : ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
      {note && <p className="text-muted-foreground text-xs">{note}</p>}
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function FloatingTextField({
  label,
  subLabel,
  charCount,
  note,
  mandatory,
  placeholder,
  showValid,
  ...props
}: {
  label: string
  mandatory?: boolean
  subLabel?: string
  charCount?: number
  note?: string
  showValid?: boolean
} & React.ComponentProps<'input'>) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <FloatingLabelInput
        id={label}
        label={label}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
      {note && <p className="text-muted-foreground text-xs">{note}</p>}
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
      {field.state.meta.isValidating ? <em className="text-[0.675rem]">Validating...</em> : null}
      {showValid &&
      field.state.meta.isTouched &&
      field.state.meta.isValid &&
      !field.state.meta.isValidating &&
      field.state.value ? (
        <div className="text-success mt-1 flex items-center gap-1 text-[0.675rem]">
          <CircleCheck className="text-success size-3" /> Promo code is valid.
        </div>
      ) : null}
    </div>
  )
}

export function TextArea({
  label,
  subLabel,
  charCount,
  mandatory,
  note,
  ...props
}: {
  label: React.ReactNode
  subLabel?: string
  charCount?: number
  note?: string
  mandatory?: boolean
} & React.ComponentProps<'textarea'>) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  const id = typeof label === 'string' ? label : React.useId()

  return (
    <div>
      <Label htmlFor={id} className="mb-2 ml-1 flex justify-between leading-5">
        <div>
          {label} {subLabel && <span className="text-muted-foreground text-xs">{subLabel}</span>}
          {mandatory && (
            <span>
              <sup>*</sup>
            </span>
          )}
        </div>
        {typeof charCount !== 'undefined' && charCount >= 0 ? (
          <div className="text-muted-foreground text-xs">
            {props.maxLength ? (
              <div>
                {charCount} / {props.maxLength} characters
              </div>
            ) : (
              <div>{charCount} characters</div>
            )}
          </div>
        ) : null}
      </Label>
      <ShadcnTextarea
        id={id}
        value={field.state.value || ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
      {note && <p className="text-muted-foreground text-xs">{note}</p>}
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Select({
  label,
  title,
  values,
  placeholder,
  mandatory = false,
  ...props
}: {
  label?: ReactNode
  title?: string
  values: Array<{ label: string; value: string }>
  placeholder?: string
  mandatory?: boolean
  disabled?: boolean
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  const id = typeof label === 'string' ? label : React.useId()
  // @ts-expect-error never value
  const val = typeof field.state.value === 'number' ? field.state.value.toString() : field.state.value || ''

  return (
    <div>
      <Label htmlFor={id} className="mb-2 ml-1 flex justify-between leading-5">
        <div>
          {label}
          {mandatory && (
            <span>
              <sup>*</sup>
            </span>
          )}
        </div>
      </Label>
      <ShadcnSelect.Select name={field.name} value={val} onValueChange={(value) => field.handleChange(value)} {...props}>
        <ShadcnSelect.SelectTrigger className="w-full">
          <ShadcnSelect.SelectValue placeholder={placeholder} />
        </ShadcnSelect.SelectTrigger>
        <ShadcnSelect.SelectContent>
          <ShadcnSelect.SelectGroup>
            {title && <ShadcnSelect.SelectLabel>{title}</ShadcnSelect.SelectLabel>}
            {values.map((value) => (
              <ShadcnSelect.SelectItem key={value.value} value={value.value}>
                {value.label}
              </ShadcnSelect.SelectItem>
            ))}
          </ShadcnSelect.SelectGroup>
        </ShadcnSelect.SelectContent>
      </ShadcnSelect.Select>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Slider({ label }: { label: string }) {
  const field = useFieldContext<number>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor={label} className="mb-2">
        {label}
      </Label>
      <ShadcnSlider
        id={label}
        onBlur={field.handleBlur}
        value={[field.state.value]}
        onValueChange={(value) => field.handleChange(value[0])}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Switch({ label }: { label: string }) {
  const field = useFieldContext<boolean>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <div className="flex items-center gap-2">
        <ShadcnSwitch
          id={label}
          onBlur={field.handleBlur}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked)}
        />
        <Label htmlFor={label}>{label}</Label>
      </div>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Checkbox({
  label,
  labelClass,
  className,
}: {
  label: ReactNode
  labelClass?: string
  className?: string
}) {
  const field = useFieldContext<boolean>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  // Generate an id if label is a string; otherwise fall back to a generic one
  const id = typeof label === 'string' ? label.replace(/\s+/g, '-').toLowerCase() : 'checkbox-' + field.name

  return (
    <div>
      <div className="flex items-center gap-2">
        <ShadcnCheckbox
          className={cn('size-5', className)}
          id={id}
          onBlur={field.handleBlur}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked as boolean)}
        />
        <Label htmlFor={id} className={cn(labelClass)}>
          {label}
        </Label>
      </div>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Checkbox1({ label }: { label: string }) {
  const field = useFieldContext<boolean>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <div className="flex items-center gap-2">
        <ShadcnCheckbox
          id={label}
          onBlur={field.handleBlur}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked as boolean)}
        />
        <Label htmlFor={label}>{label}</Label>
      </div>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Tags({ label, placeholder, note }: { label?: string; placeholder: string; note?: string }) {
  const field = useFieldContext<string[]>()
  const formErrors = useStore(field.form.store, (state) => state.errors)
  const fieldErrors = useStore(field.store, (state) => state.meta.errors)

  const values = field.state.value
  const errorsMap = formErrors[0]
  const updatedErrors = []
  const regex = new RegExp(field.name + '\\[(\\d+)\\]')

  for (const key in errorsMap) {
    let match = key.match(regex)
    if (!match) {
      match = key.match(field.name)
    }
    const index = match ? Number(match[1]) : null
    const value = index !== null ? values[index] : ''
    const errors = errorsMap[key]
    if (value) {
      for (const error of errors) {
        updatedErrors.push({
          ...error,
          message: `${error.message} - ${value}`,
        })
      }
    }
  }

  return (
    <div>
      <div>
        {label && (
          <Label htmlFor={label} className="mb-2">
            {label}
          </Label>
        )}
        {note && <p className="text-muted-foreground mb-2 text-xs">{note}</p>}
        <TagsInput id={label} setInputTags={field.handleChange} inputTags={field.state.value} placeholder={placeholder} />
      </div>
      {field.state.meta.isTouched && <ErrorMessages errors={fieldErrors.length > 0 ? fieldErrors : updatedErrors} />}
    </div>
  )
}
export function DateField({
  label,
  subLabel,
  note,
  mandatory,
  ...props
}: {
  label?: string
  mandatory?: boolean
  subLabel?: ReactNode
  note?: string
  placeholder?: string
  minDate?: Date
  maxDate?: Date
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor={label} className="mb-2 ml-1 flex justify-between leading-5">
        <div className="flex items-center gap-2">
          {label}{' '}
          {subLabel && (
            <>
              {typeof subLabel === 'string' ? (
                <span className="text-muted-foreground text-xs">{subLabel}</span>
              ) : (
                subLabel
              )}
            </>
          )}
          {mandatory && <sup>*</sup>}
        </div>
      </Label>
      <DatePicker
        id={label}
        // onBlur={field.handleBlur}
        value={field.state.value}
        onChange={(value) => value && field.handleChange(format(value, 'yyyy-MM-dd'))}
        {...props}
      />
      {note && <p className="text-muted-foreground text-xs">{note}</p>}
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}
