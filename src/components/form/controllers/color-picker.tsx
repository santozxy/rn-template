import { ColorPicker } from "@/components/ui/color-picker";
import {
  type FieldValues,
  type UseControllerProps,
  useController,
} from "react-hook-form";

interface ControlledColorPickerProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  modalTitle?: string;
  swatches?: string[];
}

export function ControlledColorPicker<FormType extends FieldValues>({
  name,
  control,
  rules,
  label,
  placeholder,
  disabled,
  modalTitle,
  swatches,
}: ControlledColorPickerProps & UseControllerProps<FormType>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController<FormType>({
    name,
    control,
    rules,
  });

  return (
    <ColorPicker
      value={value}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      modalTitle={modalTitle}
      swatches={swatches}
      error={error?.message}
    />
  );
}
