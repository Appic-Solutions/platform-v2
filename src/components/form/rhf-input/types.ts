import { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  wrapperClassName?: string;
  className?: string;
  showError?: boolean;
}
