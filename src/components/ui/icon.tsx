import {
  ArrowLeft,
  Bell,
  BellOff,
  Camera,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  CircleX,
  CloudOff,
  Edit3,
  EllipsisVertical,
  Eye,
  EyeOff,
  FileText,
  Home,
  Image,
  Info,
  LoaderCircle,
  Lock,
  MinusCircle,
  Moon,
  PlusCircle,
  Search,
  Settings,
  Star,
  Sun,
  Tag,
  Trash2,
  Upload,
  User,
  UserRoundX,
  Users,
  WifiOff,
  X,
  type LucideIcon,
  type LucideProps,
} from "lucide-react-native";

export const iconMap = {
  alert: CircleAlert,
  "alert-circle": CircleAlert,
  "arrow-back": ArrowLeft,
  bell: Bell,
  "bell-off": BellOff,
  camera: Camera,
  check: Check,
  "check-circle": CheckCircle,
  "checkmark-circle": CircleCheck,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  circle: Circle,
  "close-circle": CircleX,
  "cloud-off-outline": CloudOff,
  "document-text-outline": FileText,
  "edit-2": Edit3,
  "ellipsis-vertical": EllipsisVertical,
  eye: Eye,
  "eye-off": EyeOff,
  help: CircleHelp,
  home: Home,
  image: Image,
  "information-circle": Info,
  loader: LoaderCircle,
  lock: Lock,
  "minus-circle": MinusCircle,
  "plus-circle": PlusCircle,
  search: Search,
  settings: Settings,
  star: Star,
  "star-o": Star,
  "tag-outline": Tag,
  "trash-2": Trash2,
  upload: Upload,
  user: User,
  "account-off-outline": UserRoundX,
  users: Users,
  "wifi-off": WifiOff,
  x: X,
  moon: Moon,
  sun: Sun,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

export interface IconProps extends LucideProps {
  name: IconName;
}

export const iconNames = Object.keys(iconMap) as IconName[];

export function isIconName(value: string): value is IconName {
  return value in iconMap;
}

export function Icon({ name, ...props }: IconProps) {
  const Component = iconMap[name];
  return <Component {...props} />;
}
