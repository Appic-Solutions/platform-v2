"use client";
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import Skeleton from "../skeleton";

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
    src?: string;
    alt?: string;
    fallback?: React.ReactNode;
}

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    AvatarProps
>(({ className, src, alt = "", fallback = <Skeleton />, ...props }, ref) => {
    return (
        <AvatarPrimitive.Root
            ref={ref}
            className={cn(
                "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                "*:w-full *:h-full",
                className)}
            {...props}
        >
            <AvatarPrimitive.Image className="aspect-square" src={src} alt={alt} />
            <AvatarPrimitive.Fallback className="flex items-center justify-center rounded-full bg-muted">
                {fallback}
            </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
    );
});

Avatar.displayName = "Avatar";

export { Avatar };
