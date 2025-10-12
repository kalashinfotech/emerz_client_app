import { createFileRoute } from '@tanstack/react-router'
import { KeyRound, Palette, Settings, Shield, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { AccountTab } from '@/components/blocks/settings/account-tab'
import { ChangePasswordTab } from '@/components/blocks/settings/change-password-tab'
import { ProfileTab } from '@/components/blocks/settings/profile-tab'
import { SetPasswordTab } from '@/components/blocks/settings/set-password-tab'
import { Container } from '@/components/elements/container'
import { ThemeSelector } from '@/components/elements/theme-selector'
import { ProfileCompletion } from '@/components/widgets/profile-completion'

import { useAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/_private/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const { sessionInfo } = useAuth()
  return (
    <>
      <Container title="Settings" Icon={Settings} className="w-full px-8 sm:px-16">
        <Tabs defaultValue="overview" orientation="vertical" className="w-full flex-row gap-4">
          <div className="space-y-4">
            <TabsList className="w-60 flex-col gap-1 border bg-transparent p-2">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-border w-full justify-start data-[state=active]:shadow-none">
                <User className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="data-[state=active]:bg-border w-full justify-start data-[state=active]:shadow-none">
                <Shield className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                Account
              </TabsTrigger>
              {sessionInfo?.lastLoginProvider === 'password' && (
                <TabsTrigger
                  value="change-password"
                  className="data-[state=active]:bg-border w-full justify-start data-[state=active]:shadow-none">
                  <KeyRound className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                  Change Password
                </TabsTrigger>
              )}
              {sessionInfo?.lastLoginProvider === 'google' && (
                <TabsTrigger
                  value="set-password"
                  className="data-[state=active]:bg-border w-full justify-start data-[state=active]:shadow-none">
                  <KeyRound className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                  Set Password
                </TabsTrigger>
              )}
              <TabsTrigger
                value="appearance"
                className="data-[state=active]:bg-border w-full justify-start data-[state=active]:shadow-none">
                <Palette className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                Appearance
              </TabsTrigger>
            </TabsList>
            <ProfileCompletion className="w-auto bg-transparent" />
          </div>
          <TabsContent value="overview">
            <ProfileTab />
          </TabsContent>
          <TabsContent value="change-password">
            <ChangePasswordTab />
          </TabsContent>
          <TabsContent value="set-password">
            <SetPasswordTab />
          </TabsContent>
          <TabsContent value="account">
            <AccountTab />
          </TabsContent>
          <TabsContent value="appearance" className="w-[70%]">
            <Card className="w-[80%]">
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Select the theme for the application.</CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeSelector />
              </CardContent>
              <CardFooter>
                <Button>Update Preference</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </>
  )
}
