import { Control, FieldError, FieldValues } from 'react-hook-form';

export interface InputProps<T extends FieldValues = any> {
  control: Control<T>;
  errors: FieldError | undefined;
  label: string;
  name: string;
  placeholder?: string;
}
