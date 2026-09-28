import { createFileRoute } from "@tanstack/react-router";
import { MeshApp } from "@/components/mesh/shell";

export const Route = createFileRoute("/")({ component: MeshApp });
