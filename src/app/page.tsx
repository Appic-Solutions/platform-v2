"use client";

import FeatureBox from "@/components/layout/FeatureBox";
import ShapesPage from "@/components/layout/shapes";
import TransformDataHorizontalIcon from "@/components/icons/transform-data-horizontal";
import TokenPlaceHolderIcon from "@/components/icons/token-placeholder";
import ArrowDownIcon from "@/components/icons/arrow-down";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import { useState } from "react";
import Button from "@/components/ui/button/button";

const BridgeHome = () => {
  const [isFirstTokenSelected] = useState(false);
  const [isSecondTokenSelected] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full flex justify-center px-6 h-full",
        "xl:px-12"
      )}
    >
      <ShapesPage />
      <div
        className={cn(
          "flex justify-center items-center w-full z-10 pt-12",
          "md:w-min md:pb-12"
        )}
      >
        <FeatureBox>
          <div
            className={cn(
              "flex flex-col gap-8 items-center w-full",
              "max-w-lg lg:max-w-full justify-between h-full"
            )}
          >
            <div className="flex justify-between items-center w-full">
              <h3 className="text-mobile-heading-2 md:text-heading-3 font-bold text-primary">
                Bridge
              </h3>
              <button className="flex items-center gap-2 text-primary opacity-90">
                <TransformDataHorizontalIcon className="text-primary" />
                <span className="text-caption-bold font-medium">
                  Change to swap
                </span>
              </button>
            </div>
            <div className="flex flex-col gap-12 items-center w-full">
              <div className="w-full flex flex-col gap-4 items-center">
                <Card>
                  <p className="text-caption-bold font-medium text-primary opacity-50 mb-3">
                    From
                  </p>
                  <div className="flex items-center gap-4 text-primary">
                    <TokenPlaceHolderIcon className="stroke-white dark:stroke-black" />
                    <span className="text-mobile-heading-2 text-primary">
                      Select Token
                    </span>
                    <span
                      className={cn(
                        "p-4 rounded-round flex items-center gap-4 bg-muted",
                        "dark:bg-background-dark border-2 border-white border-opacity-25",
                        "absolute left-1/2 -translate-x-1/2 -bottom-9 z-10"
                      )}
                    >
                      <ArrowDownIcon className="text-primary" />
                    </span>
                  </div>
                </Card>
                <Card>
                  <p className="text-caption-bold font-medium text-primary opacity-50 mb-3">
                    To
                  </p>
                  <div className="flex items-center gap-4 text-primary">
                    <TokenPlaceHolderIcon className="stroke-white dark:stroke-black " />
                    <span className=" text-mobile-heading-2 text-primary">
                      Select Token
                    </span>
                  </div>
                </Card>
              </div>
            </div>
            <Button
              isDisable={isFirstTokenSelected || isSecondTokenSelected}
              variant="contained"
              color="primary"
              className="w-full"
            >
              Confirm
            </Button>
          </div>
        </FeatureBox>
      </div>
    </div>
  );
};

export default BridgeHome;
