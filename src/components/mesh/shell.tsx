import { useEffect, useRef, useState } from "react";
import { Activity, KeyRound, Network, Palette, RefreshCw, ScrollText, Shield } from "lucide-react";
import { Toaster } from "sonner";
import { Board } from "./board";
import { ConnectView } from "./connect";
import { Inspector } from "./inspector";
import { PolicyView } from "./policy";
import { Topology } from "./topology";
import { WatchView } from "./watch";
import { Button } from "./ui";
import { LAB_TAILNET, type ViewId } from "@/lib/mesh/types";
import { useMesh } from "@/lib/mesh/store";
import { PALETTES, applyPalette, readPalette, type PaletteId } from "@/lib/mesh/palette";

const NAV: { id: ViewId; label: string; icon: typeof Activity }[] = [
  { id: "board", label: "Board", icon: Activity },
  { id: "map", label: "Map", icon: Network },
  { id: "watch", label: "Watchdog", icon: Shield },
  { id: "policy", label: "Policy", icon: ScrollText },
  { id: "link", label: "Link", icon: KeyRound },
];

export function MeshApp() {
  const view = useMesh((state) => state.view);
  const mode = useMesh((state) => state.mode);
  const setView = useMesh((state) => state.setView);
  const select = useMesh((state) => state.select);
  const selectedId = useMesh((state) => state.selectedId);
  const syncing = useMesh((state) => state.syncing);
  const allowActions = useMesh((state) => state.allowActions);
  const tailnet = useMesh((state) => state.tailnet);
  const linkGeneration = useMesh((state) => state.linkGeneration);
  const pollSec = useMesh((state) => state.pollSec);
  const findings = useMesh((state) => state.findings);
  const [palette, setPalette] = useState<PaletteId>("olive");
  const [colorsOpen, setColorsOpen] = useState(false);

  useEffect(() => {
    setPalette(applyPalette(readPalette()));
  }, []);

  useEffect(() => {
    const mesh = useMesh.getState();
    mesh.alignClock();
    mesh.loadPrefs();
    const clock = window.setInterval(() => useMesh.getState().touchClock(), 5000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    if (mode !== "lab") return;
    const id = window.setInterval(() => useMesh.getState().tickLab(), 2000);
    return () => window.clearInterval(id);
  }, [mode]);

  useEffect(() => {
    if (mode !== "live" || linkGeneration === 0) return;
    let stop = false;
    const beat = () => {
      if (!stop) void useMesh.getState().sync();
    };
    beat();
    const id = window.setInterval(beat, pollSec * 1000);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, [mode, linkGeneration, pollSec]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (event.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        event.preventDefault();
        setView("board");
        document.getElementById("fleet-search")?.focus();
      }
      if (event.key === "Escape") {
        if (document.querySelector("dialog[open]")) return;
        select(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select, setView]);

  const tailnetLabel = mode === "lab" ? LAB_TAILNET : tailnet === "-" ? "credential tailnet" : tailnet;
  const critical = findings.filter((finding) => finding.severity === "critical").length;

  return (
    <div className="min-h-dvh">
      <Toaster
        theme={palette === "paper" ? "light" : "dark"}
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-surface)",
            color: "var(--color-fg)",
            border: "1px solid var(--color-line)",
          },
        }}
      />
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-bg/90 px-3 py-2 backdrop-blur sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-bg" aria-hidden>
            <Mark />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold tracking-tight">Meshwarden</p>
            <p className="truncate font-mono text-xs text-muted">{tailnetLabel}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {critical > 0 ? (
            <span className="hidden font-mono text-xs text-danger sm:inline">{critical} critical</span>
          ) : null}
          {mode === "live" && allowActions ? (
            <span className="rounded-md bg-accent/15 px-2 py-1 font-mono text-xs text-accent">Armed</span>
          ) : null}
          <button
            type="button"
            className="grid size-11 place-items-center rounded-lg text-muted hover:bg-surface hover:text-fg"
            aria-label="Colors"
            aria-haspopup="dialog"
            onClick={() => setColorsOpen(true)}
          >
            <Palette className="size-4" />
          </button>
          <span className="rounded-md bg-surface px-2 py-1 font-mono text-xs text-muted">{mode === "lab" ? "Lab" : "Live"}</span>
          {mode === "live" ? (
            <button
              type="button"
              className="grid size-11 place-items-center rounded-lg text-muted hover:bg-surface hover:text-fg"
              aria-label="Sync now"
              onClick={() => void useMesh.getState().sync()}
            >
              <RefreshCw className={syncing ? "size-4 motion-safe:animate-spin" : "size-4"} />
            </button>
          ) : null}
        </div>
      </header>

      <div className="flex">
        <nav aria-label="Sections" className="sticky top-16 hidden max-h-dvh w-56 shrink-0 flex-col gap-1 self-start overflow-y-auto border-r border-line p-3 lg:flex">
          {NAV.map((item) => (
            <NavButton key={item.id} item={item} current={view === item.id} onClick={() => setView(item.id)} />
          ))}
        </nav>
        <main id="content" className="min-w-0 flex-1 px-3 py-4 pb-24 sm:px-5 lg:pb-6">
          {view === "board" ? <Board /> : null}
          {view === "map" ? <Topology /> : null}
          {view === "watch" ? <WatchView /> : null}
          {view === "policy" ? <PolicyView /> : null}
          {view === "link" ? <ConnectView /> : null}
        </main>
        {selectedId && view !== "link" ? (
          <div className="sticky top-16 hidden max-h-dvh w-96 shrink-0 self-start overflow-y-auto xl:block">
            <Inspector onClose={() => select(null)} />
          </div>
        ) : null}
      </div>

      {selectedId && view !== "link" ? (
        <div className="fixed inset-0 z-30 overflow-y-auto bg-bg xl:hidden">
          <Inspector onClose={() => select(null)} />
        </div>
      ) : null}

      <nav aria-label="Sections" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-bg/95 backdrop-blur lg:hidden">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-current={view === item.id ? "page" : undefined}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 text-xs ${view === item.id ? "text-primary" : "text-muted"}`}
            onClick={() => setView(item.id)}
          >
            <item.icon className="size-4" aria-hidden />
            {item.label}
          </button>
        ))}
      </nav>
      {colorsOpen ? (
        <ColorDialog
          palette={palette}
          onChoose={(id) => setPalette(applyPalette(id))}
          onClose={() => setColorsOpen(false)}
        />
      ) : null}
    </div>
  );
}

function NavButton({
  item,
  current,
  onClick,
}: {
  item: (typeof NAV)[number];
  current: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      aria-current={current ? "page" : undefined}
      onClick={onClick}
      className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm ${current ? "bg-surface text-fg" : "text-muted hover:bg-surface hover:text-fg"}`}
    >
      <Icon className="size-4" aria-hidden />
      {item.label}
    </button>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="size-5" aria-hidden>
      <path d="M16 16 L8 9 M16 16 L24 10 M16 16 L23 23" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <circle cx="16" cy="16" r="2.4" fill="currentColor" />
      <circle cx="8" cy="9" r="1.7" fill="currentColor" />
      <circle cx="24" cy="10" r="1.7" fill="currentColor" />
      <circle cx="23" cy="23" r="1.7" fill="currentColor" />
    </svg>
  );
}

function ColorDialog({
  palette,
  onChoose,
  onClose,
}: {
  palette: PaletteId;
  onChoose: (id: PaletteId) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.showModal();
    const onCancel = (event: Event) => {
      event.preventDefault();
      onCloseRef.current();
    };
    el.addEventListener("cancel", onCancel);
    return () => {
      el.removeEventListener("cancel", onCancel);
      if (el.open) el.close();
    };
  }, []);

  return (
    <dialog ref={ref} className="mesh-dialog" aria-labelledby="color-title">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <h2 id="color-title" className="text-lg font-semibold text-balance">
            Colors
          </h2>
          <p className="text-sm text-pretty text-muted">
            Saved on this device only. It does not change the tailnet, and it is not a credential.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {PALETTES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={palette === item.id}
              onClick={() => onChoose(item.id)}
              className={`flex min-h-14 w-full items-center gap-3 rounded-lg border px-3 py-2 text-left ${palette === item.id ? "border-primary bg-surface-2" : "border-line bg-surface"}`}
            >
              <span className={`size-6 shrink-0 rounded-full border border-line swatch-${item.id}`} aria-hidden />
              <span className="min-w-0">
                <span className="block font-medium">{item.label}</span>
                <span className="block text-xs text-muted">{item.hint}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <Button tone="quiet" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </dialog>
  );
}
