import { useCallback, useEffect, useRef, useState } from "react";
import {
  decideInitialMode,
  readCapability,
  readStoredMode,
  storeMode,
  type ModeSource,
  type WorldViewMode,
} from "./capability";

type State = { mode: WorldViewMode; source: ModeSource };

/**
 * Resolves the world view on the client only: SSR cannot probe WebGL, and a
 * server-rendered guess would either flash the wrong view or hydrate a markup
 * mismatch. `null` means "not resolved yet" — the page shows the loader.
 */
export function useWorldMode() {
  const [state, setState] = useState<State | null>(null);
  const sourceRef = useRef<ModeSource>("measured");

  useEffect(() => {
    const stored = readStoredMode();
    const resolved: State =
      stored ?? { mode: decideInitialMode(readCapability()), source: "measured" };
    sourceRef.current = resolved.source;
    setState(resolved);
  }, []);

  const choose = useCallback((mode: WorldViewMode) => {
    sourceRef.current = "user";
    storeMode(mode, "user");
    setState({ mode, source: "user" });
  }, []);

  /**
   * Called when the live frame probe says the globe is not fluid. Never
   * overrides a view the user chose themselves.
   */
  const degrade = useCallback(() => {
    if (sourceRef.current === "user") return;
    sourceRef.current = "measured";
    storeMode("map", "measured");
    setState({ mode: "map", source: "measured" });
  }, []);

  return { mode: state?.mode ?? null, choose, degrade };
}
