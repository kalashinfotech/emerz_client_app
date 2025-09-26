import { Link, createFileRoute } from '@tanstack/react-router'
import { CircleHelp } from 'lucide-react'
import { toast } from 'sonner'

import type { CreateParticipantRqDto } from '@/types'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { validatePromoCode } from '@/api/public'

import { useAppForm } from '@/hooks/use-app-form'
import { useAuth } from '@/hooks/use-auth'

import { createParticipantRqSchema } from '@/lib/schemas/client'

export const Route = createFileRoute('/_auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  const { signUp } = useAuth()
  const router = Route.useNavigate()
  const form = useAppForm({
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      emailId: '',
      password: '',
      confirmPassword: '',
      promoCode: '',
      showPassword: false,
      tosAgreed: false,
    } as CreateParticipantRqDto,
    validators: {
      onSubmit: createParticipantRqSchema,
      onChange: createParticipantRqSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await signUp(value)
      if (response.status !== 201) {
        toast.error('Registration Error!', { description: response.error || 'Please try again after sometime.' })
      } else {
        await router({ to: '/login', search: { redirect: '/dashboard' } })
        const msg =
          import.meta.env.MODE === 'production' && !import.meta.env.VITE_NO_ACTIVATION_EMAIL
            ? 'Please check your email to activate your account.'
            : 'You may login using your account password now.'
        toast.success('Registration Successful!', { description: msg })
      }
    },
  })

  return (
    <div className="flex flex-col items-center space-y-4">
      <Card className="from-background/10 via-background/20 to-primary-100/10 rounded-2xl bg-radial-[at_50%_75%] to-90% px-0 py-4 shadow-xl backdrop-blur-md md:w-[600px] md:px-4 md:py-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-1 text-base font-normal md:text-xl">
            <span>Welcome</span>
            <span>to</span>
            <img src="/logo-full.png" className="w-[80px]" />
          </CardTitle>
          <CardDescription className="text-xs">Sign up with email ID to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}>
            <div className="grid w-full items-center gap-4">
              <form.AppField name="emailId">
                {(field) => (
                  <field.FloatingTextField label="Email ID" autoComplete="username" placeholder="Enter your email ID" />
                )}
              </form.AppField>
              <div className="grid gap-4 md:grid-cols-2">
                <form.AppField
                  name="password"
                  validators={{
                    onChangeListenTo: ['showPassword'],
                    onBlurListenTo: ['showPassword'],
                  }}>
                  {(field) => (
                    <field.FloatingTextField
                      type={form.getFieldValue('showPassword') === true ? 'text' : 'password'}
                      label="Password"
                      autoComplete="new-password"
                    />
                  )}
                </form.AppField>
                <form.AppField
                  name="confirmPassword"
                  validators={{
                    onChangeListenTo: ['password', 'showPassword'],
                    onChange: ({ value, fieldApi }) => {
                      if (value !== fieldApi.form.getFieldValue('password')) {
                        return { message: 'Passwords do not match' }
                      }
                      return undefined
                    },
                  }}>
                  {(field) => (
                    <field.FloatingTextField
                      type={form.getFieldValue('showPassword') === true ? 'text' : 'password'}
                      label="Confirm Password"
                      autoComplete="new-password"
                    />
                  )}
                </form.AppField>
              </div>
              <form.AppField
                name="showPassword"
                validators={{
                  onChangeListenTo: ['password', 'confirmPassword'],
                }}>
                {(field) => (
                  <div className="flex items-center gap-2">
                    <field.Checkbox label="Show password" labelClass="text-xs items-center" />
                  </div>
                )}
              </form.AppField>
              <div className="grid gap-4 md:grid-cols-2">
                <form.AppField name="firstName">
                  {(field) => <field.FloatingTextField label="First Name" placeholder="Enter your name" />}
                </form.AppField>
                <form.AppField name="lastName">
                  {(field) => <field.FloatingTextField label="Last Name" placeholder="Enter your last name" />}
                </form.AppField>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <form.AppField
                      name="promoCode"
                      asyncDebounceMs={500}
                      validators={{
                        onChangeAsync: async ({
                          value,
                          fieldApi: {
                            form: {
                              state: {
                                values: { emailId },
                              },
                            },
                          },
                        }) => {
                          if (value) {
                            const res = await validatePromoCode(value, emailId)
                            if (res.status !== 204) {
                              return { message: res.data?.error.message || 'Invalid promo code' }
                            }
                          }
                        },
                      }}>
                      {(field) => <field.FloatingTextField label="Promo Code" showValid={true} />}
                    </form.AppField>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost">
                        <CircleHelp />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2 text-xs">
                      <p className="text-muted-foreground text-xs">
                        Enter promo code provided by your instituion or by any other means.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <form.AppField name="tosAgreed">
                  {(field) => (
                    <field.Checkbox
                      className="size-5"
                      label={
                        <div className="flex gap-1 text-xs font-normal">
                          I agree to
                          <Link
                            className="shrink-0 font-medium underline-offset-4 hover:underline"
                            to="/terms-and-conditions">
                            Terms of Service
                          </Link>
                          and
                          <Link to="/privacy-policy" className="shrink-0 font-medium underline-offset-4 hover:underline">
                            Privacy Policy
                          </Link>
                        </div>
                      }
                    />
                  )}
                </form.AppField>
              </div>
              <div className="w-full">
                <form.AppForm>
                  <form.SubscribeButton className="w-full" label="Register" />
                </form.AppForm>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="text-xs">
          Already have an account?
          <Link
            to="/login"
            className="ml-1 font-medium underline-offset-2 hover:underline"
            search={{ redirect: '/dashboard' }}>
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
