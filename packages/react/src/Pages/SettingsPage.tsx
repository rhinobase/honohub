import {
  Card,
  CardContent,
  CardHeader,
  Label,
  Select,
  SelectItem,
} from "@rafty/ui";
import { PageTitle } from "../Components";

export function SettingsPage() {
  return (
    <div className="flex-1 px-10 py-4 overflow-x-hidden overflow-y-auto scroll-smooth">
      <div className="flex flex-col min-h-0 w-full h-full flex-grow gap-5">
        <PageTitle>Settings</PageTitle>
        <div className="max-w-4xl mx-auto space-y-4 w-full">
          <Card>
            <CardHeader>
              <h4 className="text-lg font-semibold">Theme</h4>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 items-center">
              <Label>Select a theme for your app</Label>
              <Select className="w-full">
                <SelectItem>System</SelectItem>
                <SelectItem>Light</SelectItem>
                <SelectItem>Dark</SelectItem>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
