import { useMemo, useState } from 'react'

import { TagInput } from 'emblor'
import type { Tag } from 'emblor'

type TagsInputProps = {
  inputTags: string[]
  setInputTags: (tags: string[]) => void
  placeholder: string
} & React.ComponentProps<'input'>

export function TagsInput({ inputTags, setInputTags, placeholder, id, onBlur }: TagsInputProps) {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)
  // Convert string[] to Tag[]
  const tagObjects = useMemo<Tag[]>(() => inputTags.map((text, i) => ({ id: String(i), text })), [inputTags])

  return (
    <TagInput
      id={id}
      onBlur={onBlur}
      tags={tagObjects}
      setTags={(newTagObjects) => {
        const tagTexts = Array.isArray(newTagObjects) ? newTagObjects.map((tag) => tag.text) : []
        setInputTags(tagTexts)
      }}
      placeholder={placeholder}
      styleClasses={{
        tagList: {
          container: 'gap-1',
        },
        input:
          'rounded-md transition-[color,box-shadow] bg-background dark:bg-input/30 placeholder:text-muted-foreground focus-visible:border-ring outline-none focus-visible:ring-[0px] focus-visible:ring-ring/50',
        tag: {
          body: 'text-foreground relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7',
          closeButton:
            'absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[0px] text-muted-foreground/80 hover:text-foreground',
        },
      }}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      inlineTags={false}
      inputFieldPosition="top"
    />
  )
}
