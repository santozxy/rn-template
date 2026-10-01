import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { View } from "@/components/ui/view";
import { useDebounce } from "@/hooks/use-debounce";
import { useTheme } from "@/hooks/use-theme";
import { applyMask, removeMask, type MaskType } from "@/utils/masks";
import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "react-native";

interface SearchProps extends Omit<
  React.ComponentProps<typeof TextInput>,
  "value" | "onChangeText"
> {
  value: string;
  onChangeText: (text: string) => void;
  debounceDelay?: number;
  loading?: boolean;
  mask?: MaskType;
}

export function Search({
  value: controlledValue = "",
  onChangeText,
  debounceDelay = 400,
  loading = false,
  mask,
  maxLength,
  onFocus,
  onBlur,
  ...inputProps
}: SearchProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(controlledValue);
  const lastEmittedValueRef = useRef(controlledValue);
  const isImmediateMode = debounceDelay <= 0;
  const debouncedValue = useDebounce(internalValue, debounceDelay);

  useEffect(() => {
    if (isImmediateMode) return;
    if (debouncedValue === lastEmittedValueRef.current) return;

    lastEmittedValueRef.current = debouncedValue;
    onChangeText(debouncedValue);
  }, [debouncedValue, isImmediateMode, onChangeText]);

  useEffect(() => {
    // Sincroniza somente quando o valor vem externamente (reset/carga inicial).
    if (controlledValue === lastEmittedValueRef.current) return;
    lastEmittedValueRef.current = controlledValue;
    setInternalValue(controlledValue);
  }, [controlledValue]);

  const handleChangeText = (text: string) => {
    const nextValue = mask ? removeMask(text, mask) : text;
    setInternalValue(nextValue);

    if (isImmediateMode) {
      lastEmittedValueRef.current = nextValue;
      onChangeText(nextValue);
    }
  };

  const handleClear = () => {
    setInternalValue("");
    lastEmittedValueRef.current = "";
    onChangeText("");
  };

  return (
    <View
      className={`h-12 w-full flex-row items-center gap-2 rounded-xl border border-border px-3 ${
        inputProps.editable === false ? "bg-input-disabled" : "bg-input"
      } ${focused ? "border-primary" : "border-border"}`}
    >
      {loading && (
        <Icon
          name="loader"
          size={18}
          color={colors.primary}
          className="animate-spin"
        />
      )}
      {!loading && <Icon name="search" size={20} className="text-primary" />}

      <View className="flex-1">
        <TextInput
          value={mask ? applyMask(internalValue, mask) : internalValue}
          onChangeText={handleChangeText}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor={colors.placeholder}
          maxLength={mask ? (maxLength ?? mask.length) : maxLength}
          className="py-3 font-medium text-foreground"
          autoCapitalize="characters"
          {...inputProps}
        />
      </View>

      {internalValue.length > 0 && !loading && (
        <Button
          variant="unstyled"
          size="content"
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          onPress={handleClear}
        >
          <Icon name="x" size={20} color={colors.destructive} />
        </Button>
      )}
    </View>
  );
}
