import type { WorldViewMode } from "./capability";

export type { WorldViewMode };

/** What the page needs from either world view; the map and the globe both do this. */
export type WorldViewApi = {
  flyTo: (lat: number, lng: number, altitude?: number) => void;
  flyToIso: (iso: string) => void;
};
