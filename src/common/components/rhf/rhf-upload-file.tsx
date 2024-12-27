/* eslint-disable @next/next/no-img-element */
"use client"
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/common/helpers/utils";
import { UploadIcon } from "../icons";
import { useState } from "react";

export default function RHFUploadFile({
  name,
  label = "",
  accept = "image/*",
  disabled,
  maxSize = 5, // Max size in MB
  maxWidth = 100,
  maxHeight = 100
}: {
  name: string;
  label?: string;
  accept?: string;
  disabled?: boolean;
  maxSize?: number;
  maxWidth?: number;
  maxHeight?: number;
}) {
  const { control } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = async (file: File): Promise<boolean> => {
    // Check file size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Check image dimensions
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width > maxWidth || img.height > maxHeight) {
          setError(`Image dimensions must be ${maxWidth}x${maxHeight} pixels or smaller`);
          resolve(false);
        }
        resolve(true);
      };
    });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange }, fieldState: { error: fieldError } }) => (
        <div className="flex flex-col gap-y-1 min-w-fit w-full">
          {label && <label className="text-white md:text-black dark:text-white">{label}</label>}

          <div className="flex flex-col gap-x-5 gap-y-6 md:flex-row md:items-center md:gap-y-0">
            <label
              htmlFor={`${name}-upload`}
              className={cn(
                "flex flex-col items-center justify-center gap-y-2",
                "min-w-fit w-full max-w-[238px] min-h-fit h-[155px]",
                "bg-white/50 dark:bg-white/60 rounded-lg",
                "text-[#0A0A0B] dark:text-[#333333] cursor-pointer",
                "relative overflow-hidden"
              )}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <>
                  <UploadIcon />
                  {label && <span>{label}</span>}
                </>
              )}
            </label>

            <div className="flex flex-col gap-y-2.5 w-full">
              <label
                htmlFor={`${name}-upload`}
                className={cn(
                  "items-center justify-center",
                  "min-w-fit w-full max-w-[102px] min-h-fit h-[38px]",
                  "bg-white/50 dark:bg-white/60 rounded-lg",
                  "text-[#0A0A0B] dark:text-[#333333] cursor-pointer",
                  "hidden md:flex"
                )}
              >
                upload
              </label>
              <span className="text-xs text-white md:text-[#0A0A0B] dark:text-white md:max-w-[155px]">
                Upload a {maxWidth}x{maxHeight} pixel PNG or JPG (max {maxSize}MB)
              </span>
            </div>
          </div>

          <input
            id={`${name}-upload`}
            type="file"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                setError(null);
                const isValid = await validateFile(file);

                if (isValid) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                  onChange(file);
                } else {
                  e.target.value = '';
                  onChange(null);
                }
              }
            }}
            accept={accept}
            disabled={disabled}
            className="sr-only appearance-none"
          />

          {(error || fieldError) && (
            <p className="text-sm text-red-500">
              {error || fieldError?.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
