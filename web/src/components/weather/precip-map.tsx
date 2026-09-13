import { CloudRain } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel, PanelTitle } from "@/components/ui/panel";
import { getRadarFrame, type Weather } from "@/lib/weather";

const ZOOM = 6;
const TILE = 256;
/**
 * A square 3x3 block of tiles. Square matters: the cells then match the
 * tiles' own aspect, so neighbours line up seamlessly instead of each being
 * cropped or stretched on its own.
 */
const COLS = 3;
const ROWS = 3;

/** Web-Mercator tile coordinates, fractional so the centre can be offset. */
function project(lat: number, lon: number, zoom: number) {
  const n = 2 ** zoom;
  const x = ((lon + 180) / 360) * n;
  const radians = (lat * Math.PI) / 180;
  const y =
    ((1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2) *
    n;
  return { x, y };
}

/**
 * Live rain radar over a dark basemap, centred on the forecast location.
 *
 * Plain <img> tiles rather than a mapping library: six images beat shipping
 * Leaflet for a widget nobody pans. OpenStreetMap supplies the basemap and
 * RainViewer the radar frame, both keyless. The basemap is inverted in CSS to
 * sit under the dark sky — CARTO's dark style needs an API key.
 *
 * OSM's tile policy suits a small app; a production deployment should point
 * BASEMAP at a provider whose terms cover the traffic.
 */
export async function PrecipMap({ weather }: { weather: Weather }) {
  const frame = await getRadarFrame();
  const { x, y } = project(weather.coords.lat, weather.coords.lon, ZOOM);
  const originX = Math.floor(x) - Math.floor(COLS / 2);
  const originY = Math.floor(y) - Math.floor(ROWS / 2);

  /**
   * Tiles land on integer boundaries, so the location would sit off-centre.
   * The grid is drawn at 150% of the box and slid until the location is at
   * the middle; 150% is the smallest scale that still covers every edge for
   * any sub-tile offset.
   */
  const OVERSCAN = 150;
  const gridLeft = 50 - ((x - originX) / COLS) * OVERSCAN;
  const gridTop = 50 - ((y - originY) / ROWS) * OVERSCAN;

  const tiles = Array.from({ length: COLS * ROWS }, (_, i) => ({
    col: i % COLS,
    row: Math.floor(i / COLS),
    tx: originX + (i % COLS),
    ty: originY + Math.floor(i / COLS),
  }));

  return (
    <Panel className="flex flex-col px-5 py-4">
      <PanelTitle icon={CloudRain}>Precipitation</PanelTitle>
      <div className="relative mt-3 aspect-square w-full overflow-hidden rounded-xl bg-[#1b2340]">
        {/* Absolute, not `size-full`: every child is positioned, so a
            percentage-height grid would collapse to nothing. */}
        <div
          className="absolute grid"
          style={{
            width: `${OVERSCAN}%`,
            height: `${OVERSCAN}%`,
            left: `${gridLeft}%`,
            top: `${gridTop}%`,
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
        >
          {tiles.map((tile) => (
            <div key={`${tile.tx}-${tile.ty}`} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://tile.openstreetmap.org/${ZOOM}/${tile.tx}/${tile.ty}.png`}
                alt=""
                width={TILE}
                height={TILE}
                className="absolute inset-0 size-full opacity-70 [filter:invert(1)_hue-rotate(180deg)_saturate(0.5)_brightness(0.85)_contrast(1.1)]"
                loading="lazy"
              />
              {frame && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`${frame}/${TILE}/${ZOOM}/${tile.tx}/${tile.ty}/2/1_1.png`}
                  alt=""
                  width={TILE}
                  height={TILE}
                  className="absolute inset-0 size-full"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>

        {/* The location, with its temperature, as on the reference. The grid
            is slid so this is dead centre. */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="grid size-8 place-items-center rounded-full bg-[#1b2340] text-[12.5px] font-semibold text-[#EFEFEA] ring-2 ring-white/70">
            {weather.now.temp}°
          </span>
          <span className="mt-0.5 block text-[10px] font-medium text-[#EFEFEA] [text-shadow:0_1px_2px_rgba(0,0,0,.6)]">
            {weather.place.split(",")[0]}
          </span>
        </div>
      </div>
      <p className="pt-2.5 text-[11px] text-ink-soft">
        Radar: RainViewer · Map: OpenStreetMap
      </p>
    </Panel>
  );
}

/** Same footprint while the radar index is in flight. */
export function PrecipMapSkeleton() {
  return (
    <Skeleton className="min-h-[240px]" />
  );
}
