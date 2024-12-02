"use client";

import React, { useContext, useEffect, useState } from "react";
import { ExpandLeftIcon } from "../icons";
import { cn } from "@/lib/utils";
import { PreviousPathnameContext } from "@/app/providers";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BackButton = ({
  iconWidth = 18,
  iconHeight = 18,
}: {
  href?: string;
  iconWidth?: number;
  iconHeight?: number;
}) => {
  const [previousPathname, setPreviousPathname] = useState<string>("/");
  const prevRoute = useContext(PreviousPathnameContext);
  const currentPathname = usePathname();

  useEffect(() => {
    if (prevRoute) {
      if (prevRoute !== currentPathname) {
        setPreviousPathname(prevRoute);
      }
    }
  }, [prevRoute, currentPathname]);

  if (previousPathname) {
    return (
      <Link
        href={previousPathname}
        className={cn(
          "flex items-center justify-center gap-x-1",
          "absolute left-0 font-semibold md:left-8"
        )}
      >
        <ExpandLeftIcon width={iconWidth} height={iconHeight} />
        Back
      </Link>
    );
  }
};

export default BackButton;
