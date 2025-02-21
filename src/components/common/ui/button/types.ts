import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

export type variantStylesTypes = 'contained';

export type sizeStylesTypes = 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon-md' | 'icon-lg';

export type colorStylesTypes = 'primary';

export type ButtonProps = {
  variant?: variantStylesTypes;
  size?: sizeStylesTypes;
  color?: colorStylesTypes;
  isLoading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
} & (
  | ({ asLink: true; href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ asLink?: false; href?: never } & ButtonHTMLAttributes<HTMLButtonElement>)
);
