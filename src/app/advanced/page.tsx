"use client"
import Step1 from "@/common/components/pages/advanced/step-1";
import Step2 from "@/common/components/pages/advanced/step-2";
import { FormProvider } from "react-hook-form";
import LogicHelper from "./_logic";

const AdvancedPage = () => {
  const { step, methods, onSubmit, selectedToken, setSelectedToken, stepHandler } = LogicHelper()

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full h-full md:flex md:justify-center md:items-center overflow-y-auto"
      >
        {step === 1 && <Step1 stepHandler={stepHandler} selectedToken={selectedToken} setSelectedToken={setSelectedToken} />}
        {step === 2 && <Step2 stepHandler={stepHandler} selectedToken={selectedToken} setSelectedToken={setSelectedToken} />}
      </form>
    </FormProvider>
  );
};

export default AdvancedPage;
