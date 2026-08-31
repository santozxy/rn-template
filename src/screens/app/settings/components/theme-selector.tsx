import { useTheme } from "@/hooks/use-theme";
import type { ThemePreference } from "@/theme/colors";
import { clsx } from "clsx";
import { Moon, Smartphone, Sun, type LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

const options: {
  value: ThemePreference;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "system", label: "Sistema", icon: Smartphone },
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
];

export function ThemeSelector() {
  const { preference, setThemePreference } = useTheme();

  return (
    <View
      accessibilityRole="radiogroup"
      className="flex-row gap-0.5 rounded-full border border-border bg-surface-muted p-0.5"
    >
      {options.map((option) => {
        const selected = option.value === preference;
        const Icon = option.icon;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={`Tema ${option.label}`}
            onPress={() => void setThemePreference(option.value)}
            className={clsx(
              "h-8 w-8 items-center justify-center rounded-full active:opacity-80",
              selected ? "bg-primary" : "bg-transparent",
            )}
          >
            <Icon
              className={clsx(
                "h-4 w-4",
                selected ? "text-white" : "text-foreground",
              )}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
