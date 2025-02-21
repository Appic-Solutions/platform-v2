export interface SelectProps {
  name: string;
  options: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}
