"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { proyectos, type Brand, type Project } from "../../data/projects";

type Report = {
  id: number;
  name: string;
  brand: Brand;
  month: string;
  createdAt: string;
};

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const [report] = useState<Report | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = window.localStorage.getItem("procore-reportes");
    if (!saved) return null;
    try {
      return (JSON.parse(saved) as Report[]).find((item) => String(item.id) === params.id) ?? null;
    } catch {
      return null;
    }
  });
  const brandProjects = report ? proyectos.filter((project) => project.marca === report.brand) : [];

  if (!report) {
    return <div className="min-h-screen bg-[#f3f4f6] p-8 text-zinc-900"><Link href="/reportes" className="text-[#1766c7] hover:underline">← Volver a reportes</Link><h1 className="mt-8 text-2xl font-bold">Reporte no encontrado</h1></div>;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
          <div><Link href="/reportes" className="text-sm text-[#1766c7] hover:underline">Reportes 360</Link><h1 className="mt-2 text-2xl font-bold">{report.name}</h1><p className="mt-1 text-sm text-zinc-500">{report.brand} · {report.month} · {formatDate(report.createdAt)}</p></div>
          <Link href="/reportes" className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">Volver</Link>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-6 py-7">
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-5 py-5"><h2 className="text-xl font-bold">Proyectos de {report.brand}</h2><p className="mt-1 text-sm text-zinc-500">Crea el formulario de inspección de {report.month} para cada proyecto.</p></div>
          <div className="divide-y divide-zinc-200">{brandProjects.map((project) => <ProjectRow key={project.slug} project={project} reportId={report.id} />)}</div>
        </section>
      </main>
    </div>
  );
}

function ProjectRow({ project, reportId }: { project: Project; reportId: number }) {
  return <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50"><div><Link href={`/proyecto/${project.slug}`} className="font-semibold text-[#1766c7] hover:underline">{project.nombre}</Link><p className="mt-1 text-sm text-zinc-500">{project.tipo} · {project.region}</p></div><Link href={`/proyecto/${project.slug}/formulario?reporte=${reportId}`} className="rounded-md bg-[#ff5b25] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e94e1a]">Crear formulario</Link></div>;
}

function formatDate(value: string) { return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "numeric", year: "numeric" }).format(new Date(value)); }
