import { Link, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import type { SignInRq } from '@/types'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { useAppForm } from '@/hooks/use-app-form'
import { useAuth } from '@/hooks/use-auth'

import { useTheme } from '@/context/theme-context'
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
  const { theme } = useTheme()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const router = useRouter()
  const form = useAppForm({
    defaultValues: {
      emailId: '',
      password: '',
      rememberMe: false,
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
    <div className="flex w-full flex-col items-center space-y-4 px-16 md:px-0">
      <Card className="w-full rounded-2xl px-0 py-4 shadow-xl backdrop-blur-md md:w-[400px] md:px-4 md:py-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-1 text-base font-normal md:text-xl">
            <span>Welcome</span>
            <span>to</span>
            <img src={theme === 'dark' ? '/logo-white.png' : '/logo-full.png'} className="w-20" />
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
                {(field) => <field.TextField label="Email ID" placeholder="Enter your email" autoComplete="username" />}
              </form.AppField>
              <form.AppField name="password">
                {(field) => (
                  <field.PasswordField
                    label="Password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                )}
              </form.AppField>
              <div className="mt-0 flex flex-col gap-4 text-xs md:flex-row md:items-center md:justify-between">
                <form.AppField name="rememberMe">
                  {(field) => <field.Checkbox label="Remember Me" labelClass="text-xs items-center" />}
                </form.AppField>
              </div>
              <div className="w-full space-y-4">
                <form.AppForm>
                  <form.SubscribeButton label="Login" onClick={() => form.handleSubmit()} className="w-full" />
                </form.AppForm>
                <div className="flex items-center gap-2">
                  <div className="bg-muted h-px w-full" />
                  <p className="shrink-0 text-xs">Or continue with</p>
                  <div className="bg-muted h-px w-full" />
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={() => {
                    const apiBase = import.meta.env.VITE_BACKEND_URL
                    const returnTo = encodeURIComponent(window.location.pathname || '/dashboard')
                    window.location.href = `${apiBase}/client/auth/google?state=${returnTo}`
                  }}>
                  <img src="/google-logo.svg" width="16" />
                  Google
                </Button>
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
