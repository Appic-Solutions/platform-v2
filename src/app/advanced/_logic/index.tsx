import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { DefaultValuesType, UseLogicReturn } from "../_types";

export default function LogicHelper(): UseLogicReturn {
    const [step, setStep] = useState(1);

    const methods = useForm<DefaultValuesType>({
        defaultValues: {
            chain_id: "",
            contract_address: "",
            transfer_fee: "",
        },
    });

    const chainIdWatch = useWatch({
        control: methods.control,
        name: "chain_id"
    })

    const onSubmit = (data: DefaultValuesType) => {
        console.log(data);
    }

    return {
        // State
        step,

        // Form
        methods,
        onSubmit,
        chainIdWatch,
    }
}