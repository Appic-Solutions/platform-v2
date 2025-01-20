"use client"
import { FormProvider } from "react-hook-form";
import LogicHelper from "./_logic";
import Step1 from "./_components/step-1";
import Step2 from "./_components/step-2";

export default function AdvancedPage() {
  const {
    step,
    setStep,
    isLoading,
    newTwinMeta,
    methods,
    onSubmit,
    chainIdWatch,
  } = LogicHelper()

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full h-full overflow-y-auto md:flex md:justify-center md:items-center"
      >
        {step === 1 && <Step1
          methods={methods}
          chainIdWatch={chainIdWatch}
          isLoading={isLoading}
        />}
        {step === 2 && <Step2
          isLoading={isLoading}
          newTwinMeta={newTwinMeta}
          prevStepHandler={() => setStep(1)}
        />}
      </form>
    </FormProvider>
  );
};