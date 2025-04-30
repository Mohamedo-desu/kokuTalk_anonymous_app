export interface ButtonProps {
  isSubmitting: boolean;
  isValid: boolean;
  onPress: () => void;
  label: string;
}
