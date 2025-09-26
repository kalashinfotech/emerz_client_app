import { Link, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import type { SignInRq } from '@/types'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { useAppForm } from '@/hooks/use-app-form'
import { useAuth } from '@/hooks/use-auth'

import { signInRqSchema } from '@/lib/schemas/auth'

type RedirectSearch = {
  redirect: string
}
export const Route = createFileRoute('/_auth/login')({
  validateSearch: (search: Record<string, unknown>): RedirectSearch => {
    return {
      redirect: (search.redirect as string) || '/dashboard',
    }
  },
  beforeLoad: ({ context, search }) => {
    if (context.auth.authInitialized && context.auth.sessionInfo) {
      throw redirect({ to: search.redirect })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { signIn } = useAuth()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const router = useRouter()
  const form = useAppForm({
    defaultValues: {
      emailId: '',
      password: '',
      rememberMe: false,
      showPassword: false,
    } as SignInRq,
    validators: {
      onSubmit: signInRqSchema,
    },
    onSubmit: async ({ value: { emailId, password, rememberMe } }) => {
      const response = await signIn({ emailId, password, rememberMe })
      if (response.status !== 200) {
        toast.error(response.error)
      } else {
        await router.invalidate()
        // @ts-expect-error unknown route
        await navigate({ to: search.redirect })
      }
    },
  })

  return (
    <div className="flex flex-col items-center space-y-4">
      <Card className="from-background/50 via-background/50 to-primary-10/50 w-[90%] rounded-2xl bg-radial-[at_50%_75%] to-90% px-4 py-4 backdrop-blur-md md:w-[400px] md:py-16">
        <CardHeader>
          <CardTitle className="flex items-center gap-1 text-base font-normal md:text-xl">
            <span>Welcome</span>
            <span>to</span>
            <img src="/logo-full.png" className="w-[80px]" />
          </CardTitle>
          <CardDescription className="text-xs">Please enter your login details.</CardDescription>
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
                  <field.FloatingTextField label="Email ID" placeholder="Enter your email" autoComplete="username" />
                )}
              </form.AppField>
              <form.AppField
                name="password"
                validators={{
                  onChangeListenTo: ['showPassword'],
                }}>
                {(field) => (
                  <field.FloatingTextField
                    type={form.getFieldValue('showPassword') ? 'text' : 'password'}
                    label="Password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                )}
              </form.AppField>
              <div className="mt-0 flex flex-col gap-4 text-xs md:flex-row md:items-center md:justify-between">
                <form.AppField name="showPassword">
                  {(field) => (
                    <div className="flex items-center gap-2">
                      <field.Checkbox label="Show Password" labelClass="text-xs items-center" />
                    </div>
                  )}
                </form.AppField>
                <form.AppField name="rememberMe">
                  {(field) => <field.Checkbox label="Remember Me" labelClass="text-xs items-center" />}
                </form.AppField>
              </div>
              <div className="w-full">
                <form.Subscribe
                  selector={(state) => [state.isValid && !state.isPristine, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <>
                      <Button className="w-full" type="submit" disabled={!canSubmit}>
                        {isSubmitting ? '...' : 'Login'}
                      </Button>
                    </>
                  )}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-xs">
          <div>
            Forgot your password?{' '}
            <Link to="/forgot-password" className="font-medium underline-offset-2 hover:underline">
              Click here
            </Link>
          </div>
          <div>
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-medium underline-offset-2 hover:underline" search={{ code: '' }}>
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
      <div>
        <p className="mx-auto w-[90%] text-center text-xs md:w-full">
          By logging in with Emerz, you agree to our{' '}
          <Link className="font-semibold underline" to="/terms-and-conditions">
            {' '}
            terms of service.
          </Link>
        </p>
      </div>
    </div>
  )
}
