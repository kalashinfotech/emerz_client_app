import React from 'react'

import { LoaderCircleIcon } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type ConfirmationProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClick: () => void
  loading?: boolean
  title?: React.ReactNode
  desc?: React.ReactNode
}

const Confirmation: React.FC<ConfirmationProps> = ({
  open,
  onOpenChange,
  onClick,
  loading = false,
  title = 'Are you absolutely sure?',
  desc = 'This action cannot be undone. This will permanently delete the record from our database.',
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="w-24" onClick={onClick} disabled={loading}>
            {loading ? (
              <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />
            ) : (
              <span>Continue</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { Confirmation }
