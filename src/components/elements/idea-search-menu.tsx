import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { SearchIcon } from 'lucide-react'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

import { Error } from '@/components/elements/error'
import { Loader } from '@/components/elements/loader'

import { fetchMyIdeasList } from '@/api/ideas'

import { useAuth } from '@/hooks/use-auth'
import { useDebouncedSearch } from '@/hooks/use-debounced-search'

import { Kbd } from '../ui/kbd'

type IdeasSearchCommandProps = {
  onSelect?: (ideaId: string) => void
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
          <div className="flex w-full max-w-xs flex-col gap-6">
            <InputGroup>
              <InputGroupInput placeholder="Search my ideas..." onClick={() => setOpen(true)} />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </DialogTrigger>
        <DialogContent className="p-0">
          <DialogTitle hidden={true} />
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
                          className="flex-col items-start gap-1 py-4"
                          onSelect={() => {
                            onSelect?.(item.id)
                            setOpen(false)
                          }}
                          key={item.id}>
                          <span>{item.title} </span>
                          <span className="text-muted-foreground text-xs font-medium">({item.displayId})</span>
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
