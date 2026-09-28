import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react-native";

export function ToggleTheme() {
  const { theme, toggleTheme, colors } = useTheme();
  const icon = {
    dark: <Moon size={21} className="color-primary" />,
    light: <Sun size={21} className="color-primary" />,
  }[theme];
  return (
    <Button
      variant="unstyled"
      size="content"
      className="h-12 w-12 items-center justify-center rounded-full border border-border bg-background"
      hitSlop={8}
      style={{
        shadowColor: colors.black,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        shadowRadius: 4,
      }}
      onPress={toggleTheme}
    >
      {icon}
    </Button>
  );
}
