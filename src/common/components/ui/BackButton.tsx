"use client";
import React from "react";
import { ExpandLeftIcon } from "../icons";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center justify-center gap-x-1 absolute left-4 font-semibold md:left-8">
      <ExpandLeftIcon width={18} height={18} className="min-w-[18px] min-h-[18px]" />
      Back
    </button >
  );
};