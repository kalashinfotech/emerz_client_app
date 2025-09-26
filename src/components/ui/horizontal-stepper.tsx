import { Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTrigger } from '@/components/ui/stepper'

type HorizontalStepperProps = {
  noOfSteps: number
  currentStep: number
  setStep: (step: number) => void
}
export function HorizontalStepper({ noOfSteps, setStep, currentStep = 0 }: HorizontalStepperProps) {
  const steps = Array.from({ length: noOfSteps }, (_, i) => i)
  return (
    <div className="mx-auto space-y-8 text-center">
      <Stepper defaultValue={0} value={currentStep} onValueChange={setStep}>
        {steps.map((step) => (
          <StepperItem key={step} step={step} className="not-last:flex-1">
            <StepperTrigger type="button" className="cursor-pointer">
              <StepperIndicator asChild>{step + 1}</StepperIndicator>
            </StepperTrigger>
            {step < steps.length && <StepperSeparator />}
          </StepperItem>
        ))}
      </Stepper>
    </div>
  )
}
