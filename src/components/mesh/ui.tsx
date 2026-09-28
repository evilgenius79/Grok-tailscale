import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Laptop, Monitor, Radio, Server, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

type Tone = "solid" | "ghost" | "danger" | "quiet";

export function Button({
  tone = "ghost",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        tone === "solid" && "bg-primary text-bg hover:bg-primary/90",
        tone === "ghost" && "border border-line bg-surface text-fg hover:bg-surface-2",
        tone === "quiet" && "text-muted hover:bg-surface-2 hover:text-fg",
        tone === "danger" && "bg-danger text-bg hover:bg-danger/90",
        className,
      )}
      {...props}
    />
  );
}

export function Chip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs",
        tone === "neutral" && "bg-surface-2 text-muted",
        tone === "good" && "bg-primary/15 text-primary",
        tone === "warn" && "bg-accent/15 text-accent",
        tone === "bad" && "bg-danger/15 text-danger",
      )}
    >
      {children}
    </span>
  );
}

export function OsIcon({ os }: { os: string }) {
  const className = "size-4 shrink-0 text-muted";
  if (os === "iOS" || os === "android") return <Smartphone className={className} aria-hidden />;
  if (os === "macOS") return <Laptop className={className} aria-hidden />;
  if (os === "windows") return <Monitor className={className} aria-hidden />;
  if (os === "linux" || os === "freebsd") return <Server className={className} aria-hidden />;
  return <Radio className={className} aria-hidden />;
}

export async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success("Copied");
  } catch {
    toast.error("Clipboard is blocked in this browser");
  }
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "min-h-11 w-full rounded-lg border border-line bg-bg px-3 font-mono text-sm text-fg placeholder:text-muted";

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  danger,
  challenge,
  onConfirm,
  onClose,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  challenge?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [typed, setTyped] = useState("");

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

  const locked = challenge != null && typed !== challenge;

  return (
    <dialog ref={ref} className="mesh-dialog" aria-labelledby="confirm-title">
      <form
        className="flex flex-col gap-4 p-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!locked) onConfirm();
        }}
      >
        <div className="flex flex-col gap-2">
          <h2 id="confirm-title" className="text-lg font-semibold text-balance">
            {title}
          </h2>
          <p className="text-sm text-pretty text-muted">{body}</p>
        </div>
        {challenge ? (
          <label className="flex flex-col gap-1.5 text-sm">
            <span>
              Type <span className="font-mono text-fg">{challenge}</span> to confirm
            </span>
            <input
              className={inputClass}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              autoFocus
            />
          </label>
        ) : null}
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" tone="quiet" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" tone={danger ? "danger" : "solid"} disabled={locked}>
            {confirmLabel}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
