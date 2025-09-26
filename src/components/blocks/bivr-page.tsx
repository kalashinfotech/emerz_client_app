import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Loader } from '@/components/elements/loader'
import { Confirmation } from '@/components/modals/confirmation'

import { fetchBivrGroupsList } from '@/api/idea-bivr'

import { BivrGroup } from './bivr-group'

type BivrPageProps = {
  ideaId: string
}
export const BivrPage = ({ ideaId }: BivrPageProps) => {
  const { data: groups } = useQuery(fetchBivrGroupsList(ideaId))
  const [activeTab, setActiveTab] = useState('group-1')
  const [nextTab, setNextTab] = useState<string>('')
  const [dirtyMap, setDirtyMap] = useState<Record<string, boolean>>({})
  const [showDialog, setShowDialog] = useState(false)
  if (!groups) return <Loader />
  return (
    <>
      <Tabs
        defaultValue={`group-${groups[0].id}`}
        value={activeTab}
        orientation="vertical"
        className="w-full flex-col-reverse sm:flex-row"
        onValueChange={(e) => {
          if (dirtyMap[activeTab] === true) {
            setShowDialog(true)
            setNextTab(e)
            return
          } else {
            setActiveTab(e)
          }
        }}>
        <div className="grow rounded-md text-start">
          {groups.map((group) => (
            <TabsContent key={`group-${group.id}`} value={`group-${group.id}`} className="">
              <BivrGroup
                ideaId={ideaId}
                groupId={group.id}
                setIsDirty={(isDirty) => {
                  setDirtyMap((prev) => ({ ...prev, [`group-${group.id}`]: isDirty }))
                }}
              />
            </TabsContent>
          ))}
        </div>
        <TabsList className="h-full w-[484px] flex-row overflow-x-auto rounded-none border-l bg-transparent sm:w-auto sm:shrink-0 sm:flex-col">
          {groups.map((group, index) => (
            <TabsTrigger
              key={`group-${group.id}`}
              value={`group-${group.id}`}
              className="group data-[state=active]:after:bg-primary relative w-full justify-start rounded-none py-2 after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <p className="group-data-[state=active]:bg-primary group-data-[state=active]:text-background bg-muted hidden size-7 items-center justify-center rounded-full text-xs sm:flex">
                {index + 1}
              </p>
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Confirmation
        open={showDialog}
        onOpenChange={setShowDialog}
        title="Unsaved Changes"
        desc="You have unsaved changes. If you continue, those changes will be lost. Please save before proceeding."
        onClick={() => {
          setActiveTab(nextTab)
          setShowDialog(false)
        }}
      />
    </>
  )
}
