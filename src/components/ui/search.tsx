import { Button } from "@/components/ui/button";
// src/components/ui/search.tsx
import { Icon } from "@/components/ui/icon";
import { useDebounce } from "@/hooks/use-debounce";
import { useTheme } from "@/hooks/use-theme";
import React, { useEffect, useRef, useState } from "react";
import MaskInput from "react-native-mask-input";
import { View } from "@/components/ui/view";

interface SearchProps extends React.ComponentProps<typeof MaskInput> {
  value: string;
  onChangeText: (text: string) => void;
  debounceDelay?: number;
  loading?: boolean;
}

export function Search({
  value: controlledValue = "",
  onChangeText,
  debounceDelay = 400,
  loading = false,
  ...maskProps
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

  const handleChangeText = (masked?: string, unmasked?: string) => {
    const nextValue = unmasked ?? masked ?? "";
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
        maskProps.editable === false ? "bg-input-disabled" : "bg-input"
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
        <MaskInput
          value={internalValue}
          onChangeText={handleChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={colors.placeholder}
          className="py-3 font-medium text-foreground"
          autoCapitalize="characters"
          {...maskProps}
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
