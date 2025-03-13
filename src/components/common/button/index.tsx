import { FC, HTMLAttributes } from "react";
import Link, { LinkProps } from "next/link";
import { ButtonProps } from "./types";
import { cn } from "@/lib/utils";
import Spinner from "@/components/ui/spinner";

const variantStyles = {
    contained: {
        primary: "bg-primary-buttons text-white bg-center bg-no-repeat bg-cover hover:opacity-85",
    },
};

const sizeStyles = {
    sm: "h-9 px-4 [&>svg]:w-4 [&>svg]:h-4",
    md: "h-12 px-4 [&>svg]:w-5 [&>svg]:h-5",
    lg: "h-[56px] px-4 [&>svg]:w-6 [&>svg]:h-6",
    "icon-sm": "w-9 h-9 rounded-full [&>svg]:w-4 [&>svg]:h-4",
    "icon-md": "w-12 h-12 rounded-full [&>svg]:w-5 [&>svg]:h-5",
    "icon-lg": "w-[56px] h-[56px] rounded-full [&>svg]:w-6 [&>svg]:h-6",
};

const Button: FC<ButtonProps> = ({
    variant = "contained",
    size = "md",
    color = "primary",
    asLink = false,
    isLoading,
    startIcon,
    endIcon,
    children,
    className,
    ...other
}) => {
    const colorStyle = variantStyles[variant]?.[color];
    const commonProps = {
        className: cn(
            "flex items-center justify-center gap-2 rounded-2xl",
            "font-medium transition-all duration-300",
            colorStyle,
            sizeStyles[size],
            className
        ),
        children: (
            <>
                {startIcon && startIcon}
                {isLoading ? <Spinner /> : children}
                {endIcon && endIcon}
            </>
        ),
    };

    if (asLink) {
        return <Link {...commonProps} {...other as LinkProps} className="" />;
    }

    return <button {...commonProps} {...other as HTMLAttributes<HTMLButtonElement>} />;
};

export default Button;