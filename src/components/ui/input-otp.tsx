import React, { useRef, useState } from "react";
import { TextInput } from "react-native";
import { View } from "@/components/ui/view";

interface OTPInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  focusError?: boolean; // <- indica erro do controller
  disabled?: boolean;
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  focusError,
  disabled = false,
}: OTPInputProps) {
  const inputs = useRef<(TextInput | null)[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (text: string, index: number) => {
    if (disabled) return;

    const newValue = value.split("");
    const digit = text.replace(/\D/g, "").slice(-1);
    newValue[index] = digit;
    const joined = newValue.join("");
    onChange(joined);

    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const newValue = value.split("");
      newValue[index - 1] = "";
      onChange(newValue.join(""));
    }
  };

  // Define cor da borda
  const getBorderColor = () => {
    if (focusError) return "border-error";
    if (isFocused) return "border-primary";
    return "border-border";
  };

  return (
    <View
      className={`flex-row items-center justify-center gap-2 ${disabled ? "opacity-60" : ""}`}
    >
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          className={`h-14 w-12 rounded-md border-2 text-center font-semibold text-2xl text-foreground ${
            disabled ? "bg-input-disabled" : "bg-input"
          } ${getBorderColor()}`}
          keyboardType="number-pad"
          editable={!disabled}
          maxLength={1}
          value={value[i] || ""}
          onChangeText={(text) => handleChange(text, i)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            const stillFocused = inputs.current.some((el) => el?.isFocused());
            if (!stillFocused) setIsFocused(false);
          }}
          onKeyPress={(e) => handleKeyPress(e, i)}
        />
      ))}
    </View>
  );
}
