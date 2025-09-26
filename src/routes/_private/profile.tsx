import { createFileRoute } from '@tanstack/react-router'
import { KeyRound, Palette, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ProfileAccount } from '@/components/blocks/profile-account'
import { ProfileChangePassword } from '@/components/blocks/profile-change-password'
import { Container } from '@/components/elements/container'
import { ThemeSelector } from '@/components/elements/theme-selector'
import { ProfileCompletion } from '@/components/widgets/profile-completion'

export const Route = createFileRoute('/_private/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Container title="My Profile" className="w-full px-8 sm:px-16">
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
                value="change-password"
                className="data-[state=active]:bg-border w-full justify-start data-[state=active]:shadow-none">
                <KeyRound className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                Change Password
              </TabsTrigger>
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
            <ProfileAccount />
          </TabsContent>
          <TabsContent value="change-password">
            <ProfileChangePassword />
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
