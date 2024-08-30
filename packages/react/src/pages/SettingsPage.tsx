import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardContent,
  CardHeader,
  Label,
  ToggleGroup,
  ToggleGroupItem,
} from "@rafty/ui";
import { PageHeader, PageTitle, PageWrapper } from "../components";
import { ColorMode, useTheme } from "../providers";

export function SettingsPage() {
  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
      </PageHeader>
      <div className="max-w-4xl mx-auto space-y-3 md:space-y-4 lg:space-y-5 w-full">
        <Card>
          <CardHeader className="p-3 lg:p-4">
            <h4 className="text-lg font-semibold">Theme</h4>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 items-center px-3 pb-3 lg:px-4 lg:pb-4">
            <Label>Choose your preferred theme</Label>
            <ThemeSelector />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={theme}
      onValueChange={(val) => val && setTheme(val as ColorMode)}
      className="w-full p-1 gap-1 rounded-md"
    >
      <ToggleGroupItem
        className="w-full rounded flex items-center justify-center gap-1 data-[state=on]:bg-primary-100"
        value={ColorMode.SYSTEM}
      >
        <ComputerDesktopIcon className="size-4 stroke-2" />
        System
      </ToggleGroupItem>
      <ToggleGroupItem
        className="w-full rounded flex items-center justify-center gap-1 data-[state=on]:bg-primary-100"
        value={ColorMode.LIGHT}
      >
        <SunIcon className="size-4 stroke-2" />
        Light
      </ToggleGroupItem>
      <ToggleGroupItem
        className="w-full rounded flex items-center justify-center gap-1 data-[state=on]:bg-primary-100"
        value={ColorMode.DARK}
      >
        <MoonIcon className="size-4 stroke-2" />
        Dark
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
