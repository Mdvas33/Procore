"use client";

import { useState } from "react";
import Link from "next/link";

type SavedForm = {
  submitted?: boolean;
  formName?: string;
  createdAt?: string;
};

export default function ProjectInspections({ projectSlug }: { projectSlug: string }) {
  const [savedForm] = useState<SavedForm | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = window.localStorage.getItem(`procore-formulario-${projectSlug}`);
    if (!saved) return null;
    try {
      return JSON.parse(saved) as SavedForm;
    } catch {
      return null;
    }
  });

  const inspections = savedForm?.submitted && savedForm.createdAt
    ? [[savedForm.formName ?? "Inspección de Marketing", "Completada", formatDate(savedForm.createdAt), ""]]
    : [];

  return (
    <>
      <div className="grid gap-4 border-b border-zinc-200 p-4 md:grid-cols-3">
        <StatCard label="Total" value={String(inspections.length)} tone="blue" />
        <StatCard label="Completadas" value={String(inspections.length)} tone="green" />
        <StatCard label="Pendientes" value="0" tone="amber" />
      </div>
      <table className="min-w-full border-collapse text-left text-sm text-zinc-700">
        <thead className="bg-zinc-100 text-zinc-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Nombre</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3 font-semibold">Fecha</th>
            <th className="px-4 py-3 font-semibold">Responsable</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {inspections.length === 0 ? (
            <tr><td colSpan={4} className="px-4 py-8 text-center text-zinc-500">Aún no hay inspecciones realizadas.</td></tr>
          ) : inspections.map(([name, estado, fecha, responsable]) => (
            <tr key={`${name}-${fecha}`} className="border-t border-zinc-200">
              <td className="px-4 py-3"><Link href={`/proyecto/${projectSlug}/formulario`} className="font-medium text-zinc-800 hover:text-[#ff6b2c] hover:underline">{name}</Link></td>
              <td className="px-4 py-3"><span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">{estado}</span></td>
              <td className="px-4 py-3">{fecha}</td>
              <td className="px-4 py-3">{responsable || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "blue" | "green" | "amber" }) {
  const toneClasses = { blue: "bg-blue-50 text-blue-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700" };
  return <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm text-zinc-500">{label}</p><div className={`mt-3 inline-flex rounded-full px-3 py-1 text-lg font-bold ${toneClasses[tone]}`}>{value}</div></div>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
