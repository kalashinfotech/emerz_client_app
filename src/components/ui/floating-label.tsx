import * as React from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return <Input placeholder=" " className={cn('peer', className)} ref={ref} {...props} />
})
FloatingInput.displayName = 'FloatingInput'

const FloatingLabel = React.forwardRef<React.ComponentRef<typeof Label>, React.ComponentPropsWithoutRef<typeof Label>>(
  ({ className, ...props }, ref) => {
    return (
      <Label
        className={cn(
          'peer-focus:bg-background peer-focus:dark:bg-input bg-background absolute start-2 top-2 z-10 origin-left scale-75 transform dark:bg-transparent',
          'text-muted-foreground -translate-y-4 cursor-text px-2 text-xs duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2',
          'peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto',
          'rounded-xl rtl:peer-focus:translate-x-1/4',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
FloatingLabel.displayName = 'FloatingLabel'

type FloatingLabelInputProps = InputProps & { label?: string }

const FloatingLabelInput = React.forwardRef<
  React.ComponentRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, ...props }, ref) => {
  return (
    <div className="relative">
      <FloatingInput ref={ref} id={id} {...props} />
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
    </div>
  )
})
FloatingLabelInput.displayName = 'FloatingLabelInput'

export { FloatingInput, FloatingLabel, FloatingLabelInput }
