import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MeshApp } from "@/components/mesh/shell";
import "@/lib/mesh/bridge";
import { applyPalette, readPalette } from "@/lib/mesh/palette";
import "@/styles.css";

applyPalette(readPalette());

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <MeshApp />
    </StrictMode>,
  );
}
