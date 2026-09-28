import { useState } from "react";
import { toast } from "sonner";
import { Button, ConfirmDialog, Field, inputClass } from "./ui";
import { isPhoneApp } from "@/lib/mesh/bridge";
import { useMesh } from "@/lib/mesh/store";

export function ConnectView() {
  const mode = useMesh((state) => state.mode);
  const authKind = useMesh((state) => state.authKind);
  const tailnet = useMesh((state) => state.tailnet);
  const token = useMesh((state) => state.token);
  const clientId = useMesh((state) => state.clientId);
  const clientSecret = useMesh((state) => state.clientSecret);
  const pollSec = useMesh((state) => state.pollSec);
  const allowActions = useMesh((state) => state.allowActions);
  const linkGeneration = useMesh((state) => state.linkGeneration);
  const syncing = useMesh((state) => state.syncing);
  const lastError = useMesh((state) => state.lastError);
  const lastSync = useMesh((state) => state.lastSync);
  const setDraft = useMesh((state) => state.setDraft);
  const setPollSec = useMesh((state) => state.setPollSec);
  const setAllowActions = useMesh((state) => state.setAllowActions);
  const enterLab = useMesh((state) => state.enterLab);
  const enterLive = useMesh((state) => state.enterLive);
  const markLinked = useMesh((state) => state.markLinked);
  const disconnect = useMesh((state) => state.disconnect);
  const resetLab = useMesh((state) => state.resetLab);
  const setView = useMesh((state) => state.setView);
  const [reveal, setReveal] = useState(false);
  const [armAsk, setArmAsk] = useState(false);

  const linked = mode === "live" && linkGeneration > 0 && (authKind === "oauth" ? clientSecret.length > 0 : token.length > 0);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-balance">Link</h2>
          <p className="text-sm text-pretty text-muted">
            {isPhoneApp()
              ? "Watch the fictional lab, or hand Meshwarden a credential for a real tailnet. This phone app calls Tailscale itself. The credential stays in memory and is not sent to a Meshwarden server."
              : "Watch the fictional lab, or hand Meshwarden a credential for a real tailnet. The credential is not written to disk, a database, or browser storage."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-pressed={mode === "lab"}
            className={`min-h-11 rounded-lg px-3 text-sm ${mode === "lab" ? "bg-primary text-bg" : "bg-surface text-muted"}`}
            onClick={() => {
              if (mode !== "lab") enterLab();
            }}
          >
            Lab rehearsal
          </button>
          <button
            type="button"
            aria-pressed={mode === "live"}
            className={`min-h-11 rounded-lg px-3 text-sm ${mode === "live" ? "bg-primary text-bg" : "bg-surface text-muted"}`}
            onClick={() => {
              if (mode !== "live") enterLive();
            }}
          >
            Live tailnet
          </button>
        </div>

        {mode === "lab" ? (
          <section className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4">
            <p className="text-sm text-pretty text-muted">
              Hearthline is invented. You can authorize the guest laptop, expire a key, or delete a machine to see the
              watchdog move. Reset restores the original fifteen hosts.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setView("board")}>Back to the board</Button>
              <Button
                onClick={() => {
                  resetLab();
                  toast.success("Lab restored");
                }}
              >
                Reset lab
              </Button>
            </div>
          </section>
        ) : (
          <form
            className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (authKind === "token" && token.trim().length < 8) {
                toast.error("Paste an access token first");
                return;
              }
              if (authKind === "oauth" && (clientId.trim().length < 8 || clientSecret.trim().length < 8)) {
                toast.error("Client id and secret are both required");
                return;
              }
              markLinked();
              setView("board");
              toast.success("Watching. The credential stays in this tab.");
            }}
          >
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                aria-pressed={authKind === "token"}
                className={`min-h-11 rounded-lg px-3 text-sm ${authKind === "token" ? "bg-surface-2 text-fg" : "text-muted"}`}
                onClick={() => setDraft({ authKind: "token" })}
              >
                Access token
              </button>
              <button
                type="button"
                aria-pressed={authKind === "oauth"}
                className={`min-h-11 rounded-lg px-3 text-sm ${authKind === "oauth" ? "bg-surface-2 text-fg" : "text-muted"}`}
                onClick={() => setDraft({ authKind: "oauth" })}
              >
                OAuth client
              </button>
            </div>

            {authKind === "token" ? (
              <Field label="API access token" hint="From Tailscale admin, Settings, Keys. Prefer the shortest expiry you can tolerate.">
                <div className="flex gap-2">
                  <input
                    className={inputClass}
                    type={reveal ? "text" : "password"}
                    name="meshwarden-credential"
                    autoComplete="off"
                    spellCheck={false}
                    autoCapitalize="off"
                    value={token}
                    onChange={(event) => setDraft({ token: event.target.value })}
                  />
                  <Button type="button" onClick={() => setReveal((open) => !open)}>
                    {reveal ? "Hide" : "Show"}
                  </Button>
                </div>
              </Field>
            ) : (
              <>
                <Field label="Client id" hint="Not a secret. Saved only in this tab’s memory, same as the secret.">
                  <input
                    className={inputClass}
                    name="meshwarden-client-id"
                    autoComplete="off"
                    spellCheck={false}
                    value={clientId}
                    onChange={(event) => setDraft({ clientId: event.target.value })}
                  />
                </Field>
                <Field label="Client secret" hint="Exchanged for a short-lived access token. The secret is not stored.">
                  <input
                    className={inputClass}
                    type={reveal ? "text" : "password"}
                    name="meshwarden-client-secret"
                    autoComplete="off"
                    spellCheck={false}
                    value={clientSecret}
                    onChange={(event) => setDraft({ clientSecret: event.target.value })}
                  />
                </Field>
              </>
            )}

            <Field label="Tailnet" hint="Use - to mean whichever tailnet the credential belongs to.">
              <input
                className={inputClass}
                value={tailnet}
                spellCheck={false}
                autoCapitalize="off"
                onChange={(event) => setDraft({ tailnet: event.target.value })}
              />
            </Field>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium">Sync every</legend>
              <div className="flex gap-2">
                {([15, 30, 60] as const).map((seconds) => (
                  <button
                    key={seconds}
                    type="button"
                    aria-pressed={pollSec === seconds}
                    className={`min-h-11 flex-1 rounded-lg text-sm ${pollSec === seconds ? "bg-primary text-bg" : "bg-bg text-muted"}`}
                    onClick={() => setPollSec(seconds)}
                  >
                    {seconds}s
                  </button>
                ))}
              </div>
            </fieldset>

            {lastError ? (
              <p role="alert" className="text-sm text-danger">
                {lastError}
              </p>
            ) : null}
            {linked ? (
              <p className="text-sm text-muted">
                {syncing ? "Syncing…" : lastSync ? "Credential is in memory and a sync has landed." : "Credential is in memory."}{" "}
                Reloading this page drops it.
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" tone="solid">
                Watch this tailnet
              </Button>
              {linked ? (
                <Button
                  type="button"
                  onClick={() => {
                    disconnect();
                    toast.success("Credential dropped from this tab");
                  }}
                >
                  Disconnect
                </Button>
              ) : null}
            </div>

            <button
              type="button"
              aria-pressed={allowActions}
              disabled={!linked}
              className={`min-h-11 rounded-lg border px-3 text-left text-sm disabled:opacity-50 ${allowActions ? "border-accent text-accent" : "border-line text-muted"}`}
              onClick={() => {
                if (allowActions) setAllowActions(false);
                else setArmAsk(true);
              }}
            >
              {allowActions ? "Control actions armed — click to disarm" : "Control actions off — click to arm"}
            </button>
            <p className="text-xs text-pretty text-muted">
              Arming resets when you reload. That is deliberate. Authorize, expire, delete, and route approval stay
              hidden until then, and each one still asks you to confirm.
            </p>
          </form>
        )}
      </div>

      <aside className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4 text-sm">
        <h3 className="font-medium">What this tab will and will not do</h3>
        <ul className="flex flex-col gap-3 text-pretty text-muted">
          <li>Calls only api.tailscale.com, and only devices, DNS, the policy file, authorize, expire, delete, and routes.</li>
          <li>Strips machine keys and node keys before they reach the page.</li>
          <li>Does not log the credential. Errors are scrubbed if a token ever appears in them.</li>
          <li>Saves the tailnet name, the poll interval, and watchdog thresholds in this browser. Never the credential.</li>
          <li>The arm switch stops misclicks. It is not a vault. Anyone holding the credential can call Tailscale themselves.</li>
          <li>Prefer an OAuth client over a full access token. Read scopes are enough until you arm actions.</li>
        </ul>
        <div className="flex flex-col gap-2">
          <p className="font-medium text-fg">Scopes worth asking for</p>
          <ul className="flex flex-col gap-1 font-mono text-xs text-muted">
            <li>devices:core:read or devices:core — the machine list</li>
            <li>devices:routes:read — subnet and exit routes</li>
            <li>dns:read — MagicDNS and resolvers</li>
            <li>devices:core and devices:routes — only if you will arm actions</li>
          </ul>
          <p className="text-muted">
            Policy-file read is separate. If it is missing, the rest of the board still syncs and the policy tab says so.
          </p>
        </div>
        <p className="text-muted">
          Docs:{" "}
          <a className="text-primary underline decoration-line underline-offset-2" href="https://tailscale.com/docs/reference/tailscale-api" target="_blank" rel="noreferrer">
            Tailscale API
          </a>
          {" · "}
          <a className="text-primary underline decoration-line underline-offset-2" href="https://tailscale.com/docs/features/oauth-clients" target="_blank" rel="noreferrer">
            OAuth clients
          </a>
        </p>
      </aside>

      {armAsk ? (
        <ConfirmDialog
          title="Arm control actions?"
          body="This tab will be allowed to expire keys, delete machines, change authorization, and push route approval. Each action still asks you to confirm. Reload disarms. Do this only with a credential you meant to grant those scopes."
          confirmLabel="Arm"
          danger
          onClose={() => setArmAsk(false)}
          onConfirm={() => {
            setAllowActions(true);
            setArmAsk(false);
          }}
        />
      ) : null}
    </div>
  );
}
