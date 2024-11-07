import { HTMLAttributes, ReactNode } from "react";

export type ButtonProps = {
  variant?: "contained" | "outlined" | "text" | "link";
  size?: "sm" | "md" | "lg" | "icon-sm" | "icon-md" | "icon-lg";
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  isLoading?: boolean;
  loadingContent?: string | ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
  isDisable?: boolean;
} & (
  | {
      asLink: true;
      href: string;
      target?: "_blank" | "_self" | "_parent" | "_top";
      rel?:
        | "alternate"
        | "author"
        | "bookmark"
        | "external"
        | "help"
        | "license"
        | "next"
        | "nofollow"
        | "noopener"
        | "noreferrer"
        | "prev"
        | "search"
        | "tag"
        | "noindex"
        | "unindex";
    }
  | { asLink?: false; href?: never; target?: never; rel?: never }
) &
  HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>;
