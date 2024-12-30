import { useState } from "react";
import { useForm } from "react-hook-form";
import { EvmToken, IcpToken } from "@/blockchain_api/types/tokens";
import { DefaultValuesType } from "../_types";

export default function LogicHelper() {
    const [step, setStep] = useState(1);
    const [selectedToken, setSelectedToken] = useState<EvmToken | IcpToken | null>(null)

    const stepHandler = (mode: "next" | "prev") => {
        if (mode === "next") setStep(step + 1);
        if (mode === "prev") setStep(step - 1);
    }

    const methods = useForm({
        defaultValues: {
            name: "",
            symbol: "",
            test: "",
            file: ""
        },
    });

    const onSubmit = (data: DefaultValuesType) => {
        console.log(data);
    }

    return {
        step,
        methods,
        onSubmit,
        selectedToken,
        setSelectedToken,
        stepHandler
    }
}