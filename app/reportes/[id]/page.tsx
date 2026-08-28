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
type SavedProjectForm = {
  submitted?: boolean;
  createdAt?: string;
  answers?: Record<string, string>;
  observations?: Record<string, unknown>;
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
  const completedProjects = brandProjects.filter((project) => {
    if (typeof window === "undefined") return false;
    const saved = window.localStorage.getItem(`procore-formulario-${project.slug}`);
    if (!saved) return false;
    try {
      return (JSON.parse(saved) as SavedProjectForm).submitted === true;
    } catch {
      return false;
    }
  });
  const [activeTab, setActiveTab] = useState<"summary" | "observations">("summary");
  const completedFormData = brandProjects.map((project) => ({
    project,
    form: readSavedForm(project.slug),
  })).filter(({ form }) => form?.submitted);

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
        <section className="overflow-hidden border border-zinc-300 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-300 px-5 py-4"><div className="flex gap-6"><button type="button" onClick={() => setActiveTab("summary")} className={`border-b-2 pb-2 text-sm font-semibold ${activeTab === "summary" ? "border-[#ff6b2c] text-zinc-900" : "border-transparent text-zinc-600"}`}>Resumen de inspección</button><button type="button" onClick={() => setActiveTab("observations")} className={`border-b-2 pb-2 text-sm font-semibold ${activeTab === "observations" ? "border-[#ff6b2c] text-zinc-900" : "border-transparent text-zinc-600"}`}>Observaciones</button></div><span className="text-sm text-zinc-500">{completedFormData.length} inspecciones realizadas</span></div>
          {activeTab === "summary" ? <InspectionSummary reports={completedFormData} /> : <ObservationSummary reports={completedFormData} />}
        </section>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"><div className="border-b border-zinc-200 px-5 py-5"><h2 className="text-xl font-bold">Proyectos de {report.brand}</h2><p className="mt-1 text-sm text-zinc-500">Crea el formulario de inspección de {report.month} para cada proyecto.</p></div><div className="divide-y divide-zinc-200">{brandProjects.map((project) => <ProjectRow key={project.slug} project={project} reportId={report.id} completed={completedProjects.some((completedProject) => completedProject.slug === project.slug)} />)}</div></section>
          <CompletedForms projects={completedProjects} reportId={report.id} />
        </div>
      </main>
    </div>
  );
}

function readSavedForm(slug: string): SavedProjectForm | null {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(`procore-formulario-${slug}`);
  if (!saved) return null;
  try { return JSON.parse(saved) as SavedProjectForm; } catch { return null; }
}

function InspectionSummary({ reports }: { reports: { project: Project; form: SavedProjectForm | null }[] }) {
  return <div className="p-5"><h2 className="mb-5 text-center text-base font-semibold text-zinc-800">Cantidad de inspecciones</h2>{reports.length === 0 ? <EmptyChart text="Aún no hay inspecciones enviadas." /> : <div className="space-y-4">{reports.map(({ project }) => <BarRow key={project.slug} label={project.nombre} value={1} max={1} />)}</div>}</div>;
}

function ObservationSummary({ reports }: { reports: { project: Project; form: SavedProjectForm | null }[] }) {
  const items = reports.map(({ project, form }) => ({ project, value: Object.values(form?.answers ?? {}).filter((answer) => answer === "No pasa").length }));
  const max = Math.max(...items.map((item) => item.value), 1);
  return <div className="p-5"><h2 className="mb-5 text-center text-base font-semibold text-zinc-800">Resumen de observaciones</h2>{items.length === 0 ? <EmptyChart text="Aún no hay observaciones realizadas." /> : <div className="space-y-4">{items.filter((item) => item.value > 0).map(({ project, value }) => <BarRow key={project.slug} label={project.nombre} value={value} max={max} />)}{items.every((item) => item.value === 0) && <EmptyChart text="Los formularios enviados no tienen observaciones." />}</div>}</div>;
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  return <div className="grid grid-cols-[minmax(130px,210px)_1fr_32px] items-center gap-3 text-sm"><span className="truncate text-zinc-700" title={label}>{label}</span><div className="h-7 rounded-sm bg-zinc-100"><div className="h-full rounded-sm bg-[#5795cc]" style={{ width: `${Math.max((value / max) * 100, 5)}%` }} /></div><strong className="text-right text-zinc-700">{value}</strong></div>;
}

function EmptyChart({ text }: { text: string }) { return <p className="py-14 text-center text-sm text-zinc-500">{text}</p>; }

function ProjectRow({ project, reportId, completed }: { project: Project; reportId: number; completed: boolean }) {
  return <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50"><div><Link href={`/proyecto/${project.slug}`} className="font-semibold text-[#1766c7] hover:underline">{project.nombre}</Link><p className="mt-1 text-sm text-zinc-500">{project.tipo} · {project.region}</p></div><Link href={`/proyecto/${project.slug}/formulario?reporte=${reportId}`} className={`rounded-md px-4 py-2 text-sm font-semibold ${completed ? "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50" : "bg-[#ff5b25] text-white hover:bg-[#e94e1a]"}`}>{completed ? "Ver formulario" : "Crear formulario"}</Link></div>;
}

function CompletedForms({ projects, reportId }: { projects: Project[]; reportId: number }) {
  return <section className="h-fit overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"><div className="border-b border-zinc-200 px-5 py-5"><h2 className="text-xl font-bold">Formularios rellenados <span className="text-sm font-normal text-zinc-500">({projects.length})</span></h2><p className="mt-1 text-sm text-zinc-500">Formularios completados dentro de este reporte.</p></div>{projects.length === 0 ? <p className="px-5 py-10 text-center text-sm text-zinc-500">Aún no hay formularios rellenados.</p> : <div className="divide-y divide-zinc-200">{projects.map((project) => <Link key={project.slug} href={`/proyecto/${project.slug}/formulario?reporte=${reportId}`} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-zinc-50"><div><strong className="block text-sm text-[#1766c7]">{project.nombre}</strong><span className="text-xs text-zinc-500">Formulario de {project.nombre}</span></div><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Completado</span></Link>)}</div>}</section>;
}

function formatDate(value: string) { return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "numeric", year: "numeric" }).format(new Date(value)); }
