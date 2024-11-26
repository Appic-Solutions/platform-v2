"use client"
import Step1 from "@/components/pages/advanced/step-1";
import Step2 from "@/components/pages/advanced/step-2";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const AdvancedPage = () => {
  const [step, setStep] = useState(1);

  const methods = useForm({
    defaultValues: {
      name: "",
      symbol: "",
      test: "",
      file: ""
    },
  });

  const submitHandler = (data: unknown) => {
    console.log(data);
  }

  const stepHandler = (mode: "next" | "prev") => {
    if (mode === "next") setStep(step + 1);
    if (mode === "prev") setStep(step - 1);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submitHandler)} className="w-full h-full md:flex md:justify-center md:items-center">
        {step === 1 && <Step1 stepHandler={stepHandler} />}
        {step === 2 && <Step2 stepHandler={stepHandler} />}
      </form>
    </FormProvider>
  );
};

export default AdvancedPage;
