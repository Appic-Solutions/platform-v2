export interface UploadFileProps {
    name: string;
    label?: string;
    accept?: string;
    disabled?: boolean;
    maxSize?: number;
    maxWidth?: number;
    maxHeight?: number;
}