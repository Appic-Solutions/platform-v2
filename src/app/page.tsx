"use client";
import ArrowDownIcon from "@/components/icons/arrow-down";
import TransformDataHorizontalIcon from "@/components/icons/transform-data-horizontal";
import Box from "@/components/ui/box";
import Card from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

const BridgeHome = () => {
  return (
    <Box className="md:max-w-[617px] md:max-h-[607px] md:pb-10">
      <div className="flex flex-col items-center justify-center gap-y-7 w-full max-w-[482px]">
        {/* Header Section */}
        <div className="flex items-center justify-between w-full px-4 md:px-0">
          <h1 className={cn(
            "text-black dark:text-white",
            "text-[26px] leading-7 md:text-[40px] md:leading-10 font-bold"
          )}>
            Bridge
          </h1>
          <button
            className={cn(
              "flex items-center justify-center gap-x-2",
              "text-black/90 dark:text-white/90",
              "text-sm font-medium max-md:hidden",
            )}>
            <TransformDataHorizontalIcon />
            Change to swap
          </button>

          {/* Mobile Avatar */}
          <button className={cn(
            "flex items-center justify-center md:hidden",
            "*:rounded-round",
          )}>
            <Image
              src="/images/logo5/white-logo.png"
              alt="avatar"
              width={38}
              height={38}
            />
          </button>
        </div>

        {/* Select Token Section */}
        <div className="relative flex flex-col gap-y-4 w-full">
          <Card className="max-h-[133px] md:max-h-[155px]">
            <div
              className={cn(
                "relative flex flex-col gap-y-2",
                "*:rounded-round",
              )}>
              <p className="text-sm font-semibold">From</p>
              <div
                className="w-11 h-11 bg-white"
              />
              <div
                className="w-5 h-5 bg-black absolute right-0 bottom-0 border-[2.5px] border-black dark:border-white"
              />
            </div>
            <p>Select Token</p>
          </Card>
          <div className={cn(
            "absolute rounded-round inset-0 w-14 h-14 m-auto z-20",
            "flex items-center justify-center",
            "bg-[#C0C0C0] text-black dark:bg-[#0B0B0B] dark:text-white",
            "border-2 border-white dark:border-white/30"
          )}>
            <ArrowDownIcon />
          </div>
          <Card className="max-h-[133px] md:max-h-[155px]">
            <div
              className={cn(
                "relative flex flex-col gap-y-2",
                "*:rounded-round",
              )}>
              <p className="text-sm font-semibold">To</p>
              <div
                className="w-11 h-11 bg-white"
              />
              <div
                className="w-5 h-5 bg-black absolute right-0 bottom-0 border-[2.5px] border-black dark:border-white"
              />
            </div>
            <p>Select Token</p>
          </Card>
        </div>
        <button
          className={cn(
            "flex items-center self-start gap-x-2 ml-4 md:ml-0",
            "text-black/90 dark:text-white/90",
            "text-caption-regular font-medium md:hidden",
          )}>
          <TransformDataHorizontalIcon />
          Change to swap
        </button>
      </div>

      {/* Submit Button */}
      <button
        className={cn(
          "bg-primary-buttons w-full h-14 rounded-ml max-w-[482px]",
          "text-highlight-standard font-normal text-white",
        )}
      >
        Confirm
      </button>
    </Box>
  );
};

export default BridgeHome;
