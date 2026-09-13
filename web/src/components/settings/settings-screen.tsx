"use client";

import { PageHeader } from "@/components/page-header";
import { FieldSelect } from "@/components/wardrobe/field-select";
import { FORMALITIES } from "@/data/options";
import { useOutfitter } from "@/lib/store";
import { SLOT_KINDS, type Formality, type SlotKind } from "@/lib/types";
import { CitySearch } from "./city-search";
import { UseMyLocation } from "./use-my-location";

const REST_OPTIONS = ["3 days", "5 days", "7 days", "10 days"];

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-b border-dashed border-stitch py-4">
      <div>
        <div className="text-[15px]">{label}</div>
        {hint ? <div className="mt-0.5 text-[13px] text-ink-soft">{hint}</div> : null}
      </div>
      <div className="text-[14.5px] text-ink-soft">{children}</div>
    </div>
  );
}

export function SettingsScreen() {
  const settings = useOutfitter((s) => s.settings);
  const updateSettings = useOutfitter((s) => s.updateSettings);

  const setFormality = (kind: SlotKind, value: string) =>
    updateSettings({
      formalityMap: { ...settings.formalityMap, [kind]: value as Formality },
    });

  return (
    <>
      <PageHeader
        title="Settings"
        lede="Everything here changes what shows up on Today."
      />

      <div className="max-w-[620px]">
        <Row label="Location" hint="Used for the forecast">
          <div className="flex flex-wrap items-center justify-end gap-3">
            <UseMyLocation />
            <CitySearch />
          </div>
        </Row>

        <Row label="Temperature units">
          <FieldSelect
            label="Temperature units"
            value={settings.units}
            options={["Celsius", "Fahrenheit"]}
            onChange={(value) =>
              updateSettings({ units: value as "Celsius" | "Fahrenheit" })
            }
          />
        </Row>

        <Row
          label="Rest period"
          hint="How long an item sits out after you wear it"
        >
          <FieldSelect
            label="Rest period"
            value={`${settings.restDays} days`}
            options={REST_OPTIONS}
            onChange={(value) =>
              updateSettings({ restDays: Number.parseInt(value, 10) })
            }
          />
        </Row>

        {/* Every kind a slot can be, not just the ones the seed happened to
            name — otherwise Casual and Travel can never be configured. */}
        {SLOT_KINDS.map((kind) => (
          <Row key={kind} label={`${kind} counts as`}>
            <FieldSelect
              label={`${kind} counts as`}
              value={settings.formalityMap[kind] ?? "Casual"}
              options={FORMALITIES}
              onChange={(value) => setFormality(kind, value)}
            />
          </Row>
        ))}

        <Row label="Account">{settings.email}</Row>

        {/* There is no account system behind this demo; saying so beats a
            button that does nothing, or a toast claiming it worked. */}
        <p className="mt-3 text-[13px] text-ink-soft">
          Accounts aren&apos;t wired up in this preview — your wardrobe lives in
          this browser only.
        </p>
      </div>
    </>
  );
}
