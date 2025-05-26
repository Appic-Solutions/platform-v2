/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { UploadIcon } from '@/components/icons';
import { UploadFileProps } from './types';

export default function RHFUploadFile({
  name,
  label = '',
  accept = 'image/*',
  disabled,
  maxSize = 5,
  maxWidth = 100,
  maxHeight = 100,
}: UploadFileProps) {
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
        <div className="flex w-full min-w-fit flex-col gap-y-1">
          {label && <label className="text-white dark:text-white md:text-black">{label}</label>}

          <div className="flex flex-col gap-x-5 gap-y-6 md:flex-row md:items-center md:gap-y-0">
            <label
              htmlFor={`${name}-upload`}
              className={cn(
                'flex flex-col items-center justify-center gap-y-2',
                'h-[155px] min-h-fit w-full min-w-fit max-w-[238px]',
                'rounded-lg bg-white/50 dark:bg-white/60',
                'cursor-pointer text-[#0A0A0B] dark:text-[#333333]',
                'relative overflow-hidden',
              )}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-contain" />
              ) : (
                <>
                  <UploadIcon />
                  {label && <span>{label}</span>}
                </>
              )}
            </label>

            <div className="flex w-full flex-col gap-y-2.5">
              <label
                htmlFor={`${name}-upload`}
                className={cn(
                  'items-center justify-center',
                  'h-[38px] min-h-fit w-full min-w-fit max-w-[102px]',
                  'rounded-lg bg-white/50 dark:bg-white/60',
                  'cursor-pointer text-[#0A0A0B] dark:text-[#333333]',
                  'hidden md:flex',
                )}
              >
                upload
              </label>
              <span className="text-xs text-white dark:text-white md:max-w-[155px] md:text-[#0A0A0B]">
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
            <p className="text-sm text-red-500">{error || fieldError?.message}</p>
          )}
        </div>
      )}
    />
  );
}
