"use client";

import Link from "next/link";
import { useState } from "react";
import type { Brand } from "../data/projects";

type Report = {
  id: number;
  name: string;
  brand: Brand;
  month: string;
  createdAt: string;
};

const brands: Brand[] = ["Almagro", "Socovesa", "Pilares"];
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("Reportes");
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [reports, setReports] = useState<Report[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = window.localStorage.getItem("procore-reportes");
    if (!saved) return [];
    try {
      return JSON.parse(saved) as Report[];
    } catch {
      return [];
    }
  });

  const visibleReports = reports.filter((report) => report.name.toLowerCase().includes(query.toLowerCase()) || report.brand.toLowerCase().includes(query.toLowerCase()));

  function createReport(name: string, brand: Brand, month: string) {
    const report: Report = { id: Date.now(), name, brand, month, createdAt: new Date().toISOString() };
    const nextReports = [report, ...reports];
    setReports(nextReports);
    window.localStorage.setItem("procore-reportes", JSON.stringify(nextReports));
    setShowCreate(false);
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-6 py-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Reportes 360</h1>
            <p className="mt-1 text-sm text-zinc-600">Consulte y cree reportes 360 por marca y período de inspección.</p>
          </div>
          <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-md bg-[#ff5b25] px-3 py-2 text-sm font-bold text-white hover:bg-[#e94e1a]"><span className="text-xl leading-none">+</span> Crear reporte <span className="text-xs">▼</span></button>
        </div>
        <nav className="mt-5 flex gap-8 text-sm font-medium" aria-label="Secciones de reportes">
          {["Reportes", "Todas las plantillas", "Tableros"].map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`border-b-2 pb-2 ${activeTab === tab ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-600 hover:text-zinc-900"}`}>{tab}</button>)}
        </nav>
      </header>

      <div className="mx-auto flex max-w-[1500px]">
        <aside className="hidden w-56 shrink-0 border-r border-zinc-200 bg-[#f7f8f9] p-3 md:block">
          {["Mis reportes", "Reportes asignados", "Plantillas populares", "Reportes predefinidos"].map((item, index) => <button key={item} type="button" className={`block w-full border-l-4 px-2 py-2 text-left text-sm ${index === 0 ? "border-zinc-900 bg-[#e2e5e7] font-medium text-zinc-900" : "border-transparent text-zinc-700 hover:bg-zinc-200"}`}>{item}</button>)}
          <Link href="/" className="mt-6 block px-2 text-sm text-[#1766c7] hover:underline">Volver al portafolio</Link>
        </aside>

        <main className="min-w-0 flex-1 p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <label className="flex h-10 w-72 items-center rounded-md border border-zinc-300 bg-white px-3 shadow-sm"><span className="mr-2 text-zinc-400">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Buscar reportes" placeholder="Buscar" className="w-full bg-transparent text-sm outline-none" /></label>
            <span className="text-sm text-zinc-500">{reports.length} reportes creados</span>
          </div>

          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4"><div><h2 className="text-xl font-bold text-zinc-900">Mis reportes <span className="text-sm font-normal text-zinc-500">({visibleReports.length})</span></h2><p className="mt-1 text-sm text-zinc-500">Reportes personalizados por marca y mes de inspección.</p></div><button type="button" onClick={() => setShowCreate(true)} className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200">Crear reporte</button></div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm text-zinc-700"><thead className="bg-zinc-100 text-xs text-zinc-700"><tr><th className="px-4 py-4 font-semibold">Nombre del reporte</th><th className="px-4 py-4 font-semibold">Marca</th><th className="px-4 py-4 font-semibold">Mes de inspección</th><th className="px-4 py-4 font-semibold">Creado por</th><th className="px-4 py-4 font-semibold">Fecha de creación</th><th className="px-4 py-4" /></tr></thead><tbody>{visibleReports.length === 0 ? <tr><td colSpan={6} className="px-4 py-16 text-center text-zinc-500">Aún no hay reportes creados. Comienza creando el reporte de la marca que inspeccionarás este mes.</td></tr> : visibleReports.map((report) => <tr key={report.id} className="border-t border-zinc-200 hover:bg-zinc-50"><td className="px-4 py-4 font-medium text-zinc-800">{report.name}</td><td className="px-4 py-4"><span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">{report.brand}</span></td><td className="px-4 py-4">{report.month}</td><td className="px-4 py-4">Usuario actual</td><td className="px-4 py-4">{formatDate(report.createdAt)}</td><td className="px-4 py-4 text-lg text-zinc-500">⋮</td></tr>)}</tbody></table>
            </div>
          </section>
        </main>
      </div>

      {showCreate && <CreateReportModal onClose={() => setShowCreate(false)} onCreate={createReport} />}
    </div>
  );
}

function CreateReportModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, brand: Brand, month: string) => void }) {
  const [brand, setBrand] = useState<Brand>("Almagro");
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [name, setName] = useState(`Reporte ${brand} - ${month} ${new Date().getFullYear()}`);

  function changeBrand(value: Brand) { setBrand(value); setName(`Reporte ${value} - ${month} ${new Date().getFullYear()}`); }
  function changeMonth(value: string) { setMonth(value); setName(`Reporte ${brand} - ${value} ${new Date().getFullYear()}`); }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"><div className="w-full max-w-lg rounded-lg bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4"><h2 className="text-xl font-bold">Crear reporte</h2><button type="button" onClick={onClose} aria-label="Cerrar" className="text-2xl text-zinc-500">×</button></div><form onSubmit={(event) => { event.preventDefault(); onCreate(name, brand, month); }} className="space-y-4 p-5"><label className="block text-sm font-medium">Nombre del reporte<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-[#ff5b25]" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Marca<select value={brand} onChange={(event) => changeBrand(event.target.value as Brand)} className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 font-normal">{brands.map((item) => <option key={item}>{item}</option>)}</select></label><label className="block text-sm font-medium">Mes de inspección<select value={month} onChange={(event) => changeMonth(event.target.value)} className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 font-normal">{months.map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="flex justify-end gap-3 pt-3"><button type="button" onClick={onClose} className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700">Cancelar</button><button type="submit" className="rounded-md bg-[#ff5b25] px-4 py-2 text-sm font-semibold text-white">Guardar reporte</button></div></form></div></div>;
}

function formatDate(value: string) { return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "numeric", year: "numeric" }).format(new Date(value)); }
