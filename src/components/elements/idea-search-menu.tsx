import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import { Error } from '@/components/elements/error'
import { Loader } from '@/components/elements/loader'

import { fetchMyIdeasList } from '@/api/ideas'

import { useAuth } from '@/hooks/use-auth'
import { useDebouncedSearch } from '@/hooks/use-debounced-search'

import { Badge } from '../ui/badge'

type IdeasSearchCommandProps = {
  onSelect?: (value: string, params?: Record<string, string>) => void
}

export function IdeasSearchCommand({ onSelect }: IdeasSearchCommandProps) {
  const { sessionInfo } = useAuth()
  const [open, setOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedSearch(searchInput, 300)
  const columnFilters = debouncedSearch ? [{ id: 'search', value: debouncedSearch }] : []
  const { data, isError, isLoading, error } = useQuery(
    fetchMyIdeasList(sessionInfo?.id || '', 0, columnFilters, [{ id: 'createdAt', desc: true }], 5),
  )
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen} modal={true}>
        <DialogTrigger asChild>
          <div className="flex w-fit items-center gap-4">
            <Button
              variant="outline"
              className="hover:bg-background text-muted-foreground w-80 justify-between pr-4"
              onClick={() => setOpen(true)}>
              <p>Search my ideas...</p>
              <div className="flex gap-1">
                <Badge className="size-6 rounded-sm text-xs" variant="outline">
                  ⌘
                </Badge>
                <Badge className="size-6 rounded-sm text-xs" variant="outline">
                  K
                </Badge>
              </div>
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="p-0">
          <Command shouldFilter={false}>
            <CommandInput
              className="h-12"
              value={searchInput}
              onValueChange={(e) => setSearchInput(e)}
              placeholder="Idea title, description..."
            />
            <CommandList>
              <CommandEmpty>No ideas found.</CommandEmpty>
              <CommandGroup>
                {isLoading ? (
                  <Loader />
                ) : isError ? (
                  <Error message={error.response?.data.error?.message} />
                ) : (
                  <>
                    {data?.data.map((item) => {
                      return (
                        <CommandItem
                          className="py-4"
                          onSelect={(val) => {
                            if (onSelect) {
                              onSelect(val, { patientId: item.id.toString() })
                            }
                            setOpen(false)
                          }}
                          key={item.id}>
                          <span>{item.title} </span>
                          <span className="text-muted-foreground text-[0.625rem] font-medium">({item.displayId})</span>
                        </CommandItem>
                      )
                    })}
                  </>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
