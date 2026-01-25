import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

import type { TError } from '@/types'
import type { CreateMeetingCreditRqDto } from '@/types/meeting'

import { Button } from '@/components/ui/button'
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza'

import { UseCreateMeetingCredit } from '@/api/meeting'

import { useAppForm } from '@/hooks/use-app-form'

import { createMeetingCreditRqSchema } from '@/lib/schemas/meeting'

import { Confirmation } from './confirmation'

/**
 * ⚠️ TEST MODE FLAG
 * In production, this flow will be backed by a payment gateway
 * and users will choose from predefined meeting credit packages.
 */
const TEST_MODE = true

type BuyMeetingCreditModalProps = {
  ideaId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const BuyMeetingCreditModal = ({ ideaId, open, onOpenChange }: BuyMeetingCreditModalProps) => {
  const [openConfirm, setOpenConfirm] = useState(false)
  const { createMeetingCredit, isPending } = UseCreateMeetingCredit(ideaId)
  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: { noOfCredits: '0' } as CreateMeetingCreditRqDto,
    validators: { onSubmit: createMeetingCreditRqSchema },
    onSubmit: async ({ value }) => {
      try {
        await createMeetingCredit(value)
        queryClient.invalidateQueries({ queryKey: ['ideas', ideaId] })

        toast.success('Meeting credits purchased', {
          description: 'Your meeting credits have been added successfully.',
        })

        setOpenConfirm(false)
        onOpenChange(false)
        form.reset()
      } catch (e1) {
        const err = e1 as AxiosError<TError>
        toast.error('Purchase failed', {
          description: err.response?.data.error?.message ?? err.message,
        })
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}>
      <Credenza
        open={open}
        onOpenChange={(o) => {
          if (!o) {
            onOpenChange(false)
            form.reset()
          } else {
            onOpenChange(true)
          }
        }}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Buy Meeting Credits</CredenzaTitle>
            <CredenzaDescription>
              Purchase meeting credits to schedule and conduct meetings related to this idea.
            </CredenzaDescription>
          </CredenzaHeader>

          <CredenzaBody className="space-y-4">
            {TEST_MODE && (
              <div className="border-warning/30 bg-warning/10 rounded-md border p-3 text-xs">
                <p className="font-medium">🧪 Test Mode Enabled</p>
                <p className="text-muted-foreground mt-1">
                  Payments are bypassed in test mode. You can enter any number of credits for testing purposes. In
                  production, this will be integrated with a payment gateway and predefined meeting packages.
                </p>
              </div>
            )}

            <form.AppField name="noOfCredits">
              {(field) => (
                <field.TextField
                  type="number"
                  label="Number of Credits"
                  placeholder="Enter credits to purchase"
                  mandatory
                />
              )}
            </form.AppField>

            {!TEST_MODE && (
              <p className="text-muted-foreground text-xs">
                You’ll be redirected to a secure payment page to complete your purchase.
              </p>
            )}
          </CredenzaBody>

          <CredenzaFooter>
            <Button
              onClick={() => {
                const val = form.validate('submit')
                if (Object.keys(val).length > 0) return
                setOpenConfirm(true)
              }}>
              Proceed to Purchase
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>

      <Confirmation
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        loading={isPending}
        onClick={form.handleSubmit}
        title="Confirm Credit Purchase"
        desc={
          <>
            <span className="block">
              You are about to purchase <strong>{form.getFieldValue('noOfCredits')}</strong> meeting credits.
            </span>

            {TEST_MODE ? (
              <span className="text-muted-foreground mt-2 block">
                This is a test purchase. No payment will be charged.
              </span>
            ) : (
              <span className="text-muted-foreground mt-2 block">
                You’ll be charged according to the selected package and payment method.
              </span>
            )}
          </>
        }
      />
    </form>
  )
}
