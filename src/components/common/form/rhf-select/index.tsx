import { Controller, useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/components/ui/select";
import { SelectProps } from "./types";

export default function RHFSelect({
    name,
    options,
    placeholder = "Select an option",
    label = "",
    className,
    disabled
}: SelectProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="flex flex-col gap-y-1 min-w-fit w-full">
                    {label && <label className="text-white md:text-black dark:text-white">{label}</label>}
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={disabled}
                    >
                        <SelectTrigger className={className}>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {error && (
                        <p className="text-sm text-red-500">
                            {error.message}
                        </p>
                    )}
                </div>
            )}
        />
    );
}