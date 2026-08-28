import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, proyectos } from "../../data/projects";

export function generateStaticParams() {
  return proyectos.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f2f3f5] text-zinc-900">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-[#1e1f22] px-6 py-4 text-white">
        <div className="flex items-center gap-4 text-sm text-zinc-200">
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#f0f2f5] text-xs font-bold text-zinc-900">A</span>
            EMPRESAS SOCOVESA
          </div>
          <div className="text-zinc-400">•</div>
          <span>{project.numero} - {project.nombre}</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <button className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-zinc-200">Favoritos</button>
          <Link href={`/proyecto/${project.slug}/formulario`} className="rounded-md bg-[#ff6b2c] px-3 py-1.5 font-medium text-white">Crear formulario</Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-800">Inicio</Link>
          <span>/</span>
          <span className="text-zinc-800">{project.nombre}</span>
        </div>

        <section className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-xl font-bold text-zinc-700">
                {project.nombre.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">Proyecto</p>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{project.nombre}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                {project.completadas} completas
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                {project.pendientes} pendientes
              </span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-900">Inspecciones</h2>
              <Link
                href={`/proyecto/${project.slug}/formulario`}
                className="rounded-md bg-[#ff6b2c] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#e65d1e]"
              >
                Crear formulario
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <StatCard label="Total" value={String(project.inspecciones)} tone="blue" />
              <StatCard label="Completadas" value={String(project.completadas)} tone="green" />
              <StatCard label="Pendientes" value={String(project.pendientes)} tone="amber" />
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200">
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
                  {[
                    ["Inspección de estructura", "Completada", "12 Ago 2026", "G. Hernandez"],
                    ["Control de calidad", "Pendiente", "18 Ago 2026", "P. Duran"],
                    ["Revisión de obra civil", "En curso", "22 Ago 2026", "M. Lucho"],
                    ["Inspección final", "Pendiente", "30 Ago 2026", "A. García"],
                  ].map(([name, estado, fecha, responsable]) => (
                    <tr key={name} className="border-t border-zinc-200">
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
                      <td className="px-4 py-3">{responsable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-zinc-900">Resumen</h3>
              <ul className="space-y-3 text-sm text-zinc-700">
                <li className="flex justify-between"><span>Dirección</span><span className="font-medium text-zinc-900">{project.direccion}</span></li>
                <li className="flex justify-between"><span>Etapa</span><span className="font-medium text-zinc-900">{project.etapa}</span></li>
                <li className="flex justify-between"><span>Tipo</span><span className="font-medium text-zinc-900">{project.tipo}</span></li>
                <li className="flex justify-between"><span>Región</span><span className="font-medium text-zinc-900">{project.region}</span></li>
                <li className="flex justify-between"><span>Prioridad</span><span className="font-medium text-zinc-900">{project.prioridad}</span></li>
              </ul>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-zinc-900">Acciones rápidas</h3>
              <div className="flex flex-col gap-3">
                <Link href={`/proyecto/${project.slug}/formulario`} className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100">
                  Ver checklist
                </Link>
                <button className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100">Agregar inspección</button>
                <button className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100">Exportar reportes</button>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "blue" | "green" | "amber";
}) {
  const toneClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-lg font-bold ${toneClasses[tone]}`}>
        {value}
      </div>
    </div>
  );
}
