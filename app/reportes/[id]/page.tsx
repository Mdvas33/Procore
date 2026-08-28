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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
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
  })).filter(({ form }) => {
    if (!form?.submitted || !form.createdAt) return false;
    const createdAt = form.createdAt.slice(0, 10);
    return (!fromDate || createdAt >= fromDate) && (!toDate || createdAt <= toDate);
  });
  const filteredCompletedProjects = completedFormData.map(({ project }) => project);

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
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-300 px-5 py-4 print:hidden"><div className="flex gap-6"><button type="button" onClick={() => setActiveTab("summary")} className={`border-b-2 pb-2 text-sm font-semibold ${activeTab === "summary" ? "border-[#ff6b2c] text-zinc-900" : "border-transparent text-zinc-600"}`}>Resumen de inspección</button><button type="button" onClick={() => setActiveTab("observations")} className={`border-b-2 pb-2 text-sm font-semibold ${activeTab === "observations" ? "border-[#ff6b2c] text-zinc-900" : "border-transparent text-zinc-600"}`}>Observaciones</button></div><div className="flex flex-wrap items-center gap-2"><label className="text-xs font-semibold text-zinc-600">Desde<input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="ml-1 rounded border border-zinc-300 px-2 py-1 text-sm font-normal text-zinc-700" /></label><label className="text-xs font-semibold text-zinc-600">Hasta<input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="ml-1 rounded border border-zinc-300 px-2 py-1 text-sm font-normal text-zinc-700" /></label><button type="button" onClick={() => window.print()} className="rounded-md bg-[#ff5b25] px-3 py-2 text-sm font-semibold text-white hover:bg-[#e94e1a]">Exportar PDF</button></div></div>
          {activeTab === "summary" ? <InspectionSummary reports={completedFormData} /> : <ObservationSummary reports={completedFormData} />}
        </section>
        <PrintableReport report={report} reports={completedFormData} />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm print:hidden"><div className="border-b border-zinc-200 px-5 py-5"><h2 className="text-xl font-bold">Proyectos de {report.brand}</h2><p className="mt-1 text-sm text-zinc-500">Crea el formulario de inspección de {report.month} para cada proyecto.</p></div><div className="divide-y divide-zinc-200">{brandProjects.map((project) => <ProjectRow key={project.slug} project={project} reportId={report.id} completed={completedProjects.some((completedProject) => completedProject.slug === project.slug)} />)}</div></section>
          <CompletedForms projects={filteredCompletedProjects} reportId={report.id} />
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
  return <div className="p-5"><h2 className="mb-5 text-center text-base font-semibold text-zinc-800">Cantidad de inspecciones</h2>{reports.length === 0 ? <EmptyChart text="Aún no hay inspecciones enviadas." /> : <VerticalChart items={reports.map(({ project }) => ({ label: project.nombre, value: 1 }))} />}</div>;
}

function ObservationSummary({ reports }: { reports: { project: Project; form: SavedProjectForm | null }[] }) {
  const items = reports.map(({ project, form }) => ({ project, value: Object.values(form?.answers ?? {}).filter((answer) => answer === "No pasa").length }));
  return <div className="p-5"><h2 className="mb-5 text-center text-base font-semibold text-zinc-800">Resumen de observaciones</h2>{items.length === 0 ? <EmptyChart text="Aún no hay observaciones realizadas." /> : items.every((item) => item.value === 0) ? <EmptyChart text="Los formularios enviados no tienen observaciones." /> : <VerticalChart items={items.filter((item) => item.value > 0).map(({ project, value }) => ({ label: project.nombre, value }))} />}</div>;
}

function VerticalChart({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  const chartMax = Math.max(4, max);
  const axisSteps = Array.from({ length: chartMax + 1 }, (_, index) => chartMax - index);

  return <div className="grid grid-cols-[42px_1fr] gap-3"><div className="relative flex h-[390px] flex-col justify-between pb-14 text-right text-xs text-zinc-600"><span className="absolute -left-5 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-medium tracking-wide text-zinc-700">CUENTA</span>{axisSteps.map((step) => <span key={step}>{step}</span>)}</div><div className="relative h-[390px] border-b border-zinc-300"><div className="absolute inset-x-0 top-0 flex h-[310px] flex-col justify-between">{axisSteps.map((step) => <span key={step} className="border-t border-zinc-200" />)}</div><div className="relative flex h-[310px] items-end justify-around gap-2 px-3">{items.map((item) => <div key={item.label} className="flex h-full flex-1 items-end justify-center"><div className="relative w-full max-w-28 rounded-t-sm" style={{ height: `${Math.max((item.value / chartMax) * 100, 1.5)}%`, backgroundColor: "#5795cc" }} /></div>)}</div><div className="flex h-16 items-start justify-around gap-2 px-3 pt-3">{items.map((item) => <div key={item.label} className="min-w-0 flex-1 text-center text-xs text-zinc-700"><span className="block truncate" title={item.label}>{item.label}</span></div>)}</div><div className="absolute bottom-0 left-1/2 translate-y-8 -translate-x-1/2 text-xs font-medium text-zinc-700">Nombre del proyecto</div><div className="absolute bottom-0 left-1/2 translate-y-14 -translate-x-1/2 text-xs text-zinc-600"><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-[#5795cc] align-[-1px]" />Inspecciones</div></div></div>;
}

function EmptyChart({ text }: { text: string }) { return <p className="py-14 text-center text-sm text-zinc-500">{text}</p>; }

function PrintableReport({ report, reports }: { report: Report; reports: { project: Project; form: SavedProjectForm | null }[] }) {
  const inspectionItems = reports.map(({ project }) => ({ label: project.nombre, value: 1 }));
  const observationItems = reports.map(({ project, form }) => ({ label: project.nombre, value: Object.values(form?.answers ?? {}).filter((answer) => answer === "No pasa").length }));

  return <section className="hidden print:block"><h2 className="mb-2 text-xl font-bold">{report.name}</h2><p className="mb-5 text-sm text-zinc-600">{report.brand} · {report.month} · {formatDate(report.createdAt)}</p><div className="grid grid-cols-2 gap-5"><div className="border border-zinc-300"><h3 className="border-b border-zinc-200 p-3 text-center font-semibold">Resumen de inspección</h3>{inspectionItems.length === 0 ? <EmptyChart text="Aún no hay inspecciones enviadas." /> : <VerticalChart items={inspectionItems} />}</div><div className="border border-zinc-300"><h3 className="border-b border-zinc-200 p-3 text-center font-semibold">Observaciones realizadas</h3>{observationItems.length === 0 ? <EmptyChart text="Aún no hay observaciones realizadas." /> : <VerticalChart items={observationItems} />}</div></div><h3 className="mb-4 mt-8 text-lg font-bold">Detalle por proyecto inspeccionado</h3><div className="grid grid-cols-2 gap-5">{reports.map(({ project, form }) => <ProjectDonut key={project.slug} project={project} form={form} />)}</div></section>;
}

function ProjectDonut({ project, form }: { project: Project; form: SavedProjectForm | null }) {
  const answers = Object.values(form?.answers ?? {});
  const segments = [{ label: "Pasa", value: answers.filter((answer) => answer === "Pasa").length, color: "#247b35" }, { label: "No pasa", value: answers.filter((answer) => answer === "No pasa").length, color: "#df2429" }, { label: "N/A", value: answers.filter((answer) => answer === "N/A").length, color: "#647078" }];
  const total = answers.length;
  const gradient = segments.reduce<{ stops: string[]; offset: number }>((result, segment) => { const nextOffset = result.offset + (total ? (segment.value / total) * 360 : 0); return { stops: [...result.stops, `${segment.color} ${result.offset}deg ${nextOffset}deg`], offset: nextOffset }; }, { stops: [], offset: 0 }).stops.join(", ");

  return <div className="print-break-inside-avoid flex items-center gap-5 border border-zinc-300 p-4"><div className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full" style={{ background: gradient || "#d8dddf" }}><div className="grid h-20 w-20 place-items-center rounded-full bg-white text-center"><strong className="text-lg">{total}</strong><span className="text-[10px]">respondidas</span></div></div><div className="min-w-0"><h4 className="truncate font-bold" title={project.nombre}>{project.nombre}</h4><p className="mb-2 text-xs text-zinc-500">Inspección completada</p>{segments.map((segment) => <div key={segment.label} className="flex items-center gap-2 text-xs"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />{segment.label}: {segment.value}</div>)}</div></div>;
}

function ProjectRow({ project, reportId, completed }: { project: Project; reportId: number; completed: boolean }) {
  return <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50"><div><Link href={`/proyecto/${project.slug}`} className="font-semibold text-[#1766c7] hover:underline">{project.nombre}</Link><p className="mt-1 text-sm text-zinc-500">{project.tipo} · {project.region}</p></div><Link href={`/proyecto/${project.slug}/formulario?reporte=${reportId}`} className={`rounded-md px-4 py-2 text-sm font-semibold ${completed ? "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50" : "bg-[#ff5b25] text-white hover:bg-[#e94e1a]"}`}>{completed ? "Ver formulario" : "Crear formulario"}</Link></div>;
}

function CompletedForms({ projects, reportId }: { projects: Project[]; reportId: number }) {
  return <section className="h-fit overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"><div className="border-b border-zinc-200 px-5 py-5"><h2 className="text-xl font-bold">Formularios rellenados <span className="text-sm font-normal text-zinc-500">({projects.length})</span></h2><p className="mt-1 text-sm text-zinc-500">Formularios completados dentro de este reporte.</p></div>{projects.length === 0 ? <p className="px-5 py-10 text-center text-sm text-zinc-500">Aún no hay formularios rellenados.</p> : <div className="divide-y divide-zinc-200">{projects.map((project) => <Link key={project.slug} href={`/proyecto/${project.slug}/formulario?reporte=${reportId}`} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-zinc-50"><div><strong className="block text-sm text-[#1766c7]">{project.nombre}</strong><span className="text-xs text-zinc-500">Formulario de {project.nombre}</span></div><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Completado</span></Link>)}</div>}</section>;
}

function formatDate(value: string) { return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "numeric", year: "numeric" }).format(new Date(value)); }
