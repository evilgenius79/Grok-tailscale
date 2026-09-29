type Pending = {
  resolve: (value: { status: number; body: string }) => void;
  reject: (error: Error) => void;
  timer: number;
};

const pending = new Map<string, Pending>();

function decode(payload: string): string {
  const binary = atob(payload);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

declare global {
  interface Window {
    Meshwarden?: {
      request: (
        id: string,
        method: string,
        path: string,
        body: string,
        authorization: string,
        contentType: string,
      ) => void;
      setChrome?: (color: string) => void;
    };
    __meshDone?: (id: string, ok: boolean, status: number, payload: string) => void;
  }
}

if (typeof window !== "undefined") {
  window.__meshDone = (id, ok, status, payload) => {
    const item = pending.get(id);
    if (!item) return;
    pending.delete(id);
    window.clearTimeout(item.timer);
    let body = "";
    try {
      body = payload ? decode(payload) : "";
    } catch {
      body = "";
    }
    if (!ok) item.reject(new Error(body || "Could not reach Tailscale."));
    else item.resolve({ status, body });
  };
}

export function isPhoneApp(): boolean {
  return typeof window !== "undefined" && "Meshwarden" in window && window.Meshwarden != null;
}

export function meshRequest(
  method: string,
  path: string,
  body: string,
  authorization: string,
  contentType: string,
): Promise<{ status: number; body: string }> {
  const bridge = typeof window !== "undefined" ? window.Meshwarden : undefined;
  if (!bridge) return Promise.reject(new Error("This install cannot reach Tailscale."));
  const id = crypto.randomUUID?.() ?? `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      pending.delete(id);
      reject(new Error("Tailscale took too long to answer."));
    }, 20_000);
    pending.set(id, { resolve, reject, timer });
    bridge.request(id, method, path, body, authorization, contentType);
  });
}
