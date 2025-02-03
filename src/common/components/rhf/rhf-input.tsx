"use client";
import { cn } from "@/common/helpers/utils";
import { InputHTMLAttributes } from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function RHFInput({ name, label, className, ...props }: { name: string, label?: string, className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("flex flex-col gap-1", className)}>
          {label && <label htmlFor={name} className="text-white md:text-black dark:text-white capitalize">{label}</label>}
          <input
            id={name}
            autoComplete="off"
            {...field}
            {...props}
            className={cn(
              "border-none outline-none ring-0",
              "flex items-center w-full h-[42px]",
              "bg-white/50 dark:bg-white/60 rounded-lg",
              "text-[#0A0A0B] dark:text-[#333333]",
              "placeholder:text-[#0A0A0B] dark:placeholder:text-[#333333]",
              "px-3.5 py-2.5",
              error ? "border-red-500" : "border-gray-300"
            )}
          />
          {error && <span className="text-sm text-red-500">{error.message}</span>}
        </div>
      )}
    />
  );
}
