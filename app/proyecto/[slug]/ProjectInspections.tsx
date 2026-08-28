"use client";

import { useState } from "react";

type SavedForm = {
  submitted?: boolean;
  formName?: string;
  createdAt?: string;
};

const baseInspections = [
  ["Inspección de estructura", "Completada", "12 Ago 2026", "G. Hernandez"],
  ["Control de calidad", "Pendiente", "18 Ago 2026", "P. Duran"],
  ["Revisión de obra civil", "En curso", "22 Ago 2026", "M. Lucho"],
  ["Inspección final", "Pendiente", "30 Ago 2026", "A. García"],
];

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
    ? [...baseInspections, [savedForm.formName ?? "Inspección de Marketing", "Completada", formatDate(savedForm.createdAt), ""]]
    : baseInspections;

  return (
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
        {inspections.map(([name, estado, fecha, responsable]) => (
          <tr key={`${name}-${fecha}`} className="border-t border-zinc-200">
            <td className="px-4 py-3">{name}</td>
            <td className="px-4 py-3">
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                estado === "Completada"
                  ? "bg-emerald-100 text-emerald-700"
                  : estado === "En curso"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
              }`}>
                {estado}
              </span>
            </td>
            <td className="px-4 py-3">{fecha}</td>
            <td className="px-4 py-3">{responsable || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
