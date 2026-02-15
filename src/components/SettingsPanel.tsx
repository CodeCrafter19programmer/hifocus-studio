import { useSettings } from "@/contexts/SettingsContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

const themes = [
  { id: "midnight" as const, label: "Midnight", color: "bg-[hsl(0,0%,4%)]" },
  { id: "charcoal" as const, label: "Charcoal", color: "bg-[hsl(0,0%,12%)]" },
  { id: "navy" as const, label: "Navy", color: "bg-[hsl(220,40%,8%)]" },
  { id: "forest" as const, label: "Forest", color: "bg-[hsl(150,30%,6%)]" },
];

const SettingsPanel = ({ open, onClose }: SettingsPanelProps) => {
  const { settings, updateSettings } = useSettings();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-mono text-lg font-semibold text-foreground">Settings</h2>
          <button onClick={onClose} className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Time Display */}
          <section className="space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Time Display</h3>
            <SettingRow label="24-Hour Format">
              <Switch checked={settings.is24Hour} onCheckedChange={(v) => updateSettings({ is24Hour: v })} />
            </SettingRow>
            <SettingRow label="Show Seconds">
              <Switch checked={settings.showSeconds} onCheckedChange={(v) => updateSettings({ showSeconds: v })} />
            </SettingRow>
            <SettingRow label="Show Date">
              <Switch checked={settings.showDate} onCheckedChange={(v) => updateSettings({ showDate: v })} />
            </SettingRow>
          </section>

          {/* Theme */}
          <section className="space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Theme</h3>
            <div className="grid grid-cols-4 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => updateSettings({ theme: t.id })}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                    settings.theme === t.id ? "border-primary" : "border-transparent hover:border-border"
                  }`}
                >
                  <div className={`h-8 w-8 rounded-full ${t.color} ring-1 ring-border`} />
                  <span className="text-xs text-muted-foreground">{t.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const SettingRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <Label className="text-sm text-secondary-foreground">{label}</Label>
    {children}
  </div>
);

export default SettingsPanel;
