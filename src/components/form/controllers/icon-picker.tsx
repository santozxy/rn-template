import { IconPicker } from "@/components/ui/icon-picker";
import {
  type FieldValues,
  type UseControllerProps,
  useController,
} from "react-hook-form";

interface ControlledIconPickerProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  modalTitle?: string;
}

export function ControlledIconPicker<FormType extends FieldValues>({
  name,
  control,
  rules,
  label,
  placeholder,
  disabled,
  modalTitle,
}: ControlledIconPickerProps & UseControllerProps<FormType>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController<FormType>({
    name,
    control,
    rules,
  });

  return (
    <IconPicker
      value={typeof value === "string" ? value : undefined}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      modalTitle={modalTitle}
      error={error?.message}
    />
  );
}
