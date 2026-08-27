import Link from "next/link";
import { proyectos } from "./data/projects";

function Home() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-zinc-900">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <nav className="flex items-center gap-8 text-[15px] font-medium text-zinc-700">
          <button className="transition hover:text-zinc-900">Inicio</button>
          <button className="border-b-2 border-zinc-900 pb-1 text-zinc-900">Portafolio</button>
        </nav>

        <button className="rounded-md border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-200">
          Reportes
        </button>
      </header>

      <main className="mx-auto max-w-[1500px] px-6 py-8">
        <section className="rounded-xl border border-zinc-200 bg-[#f5f5f5] shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <h1 className="text-[20px] font-semibold text-zinc-800">Lista de proyectos</h1>
            <button className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-xl text-zinc-500 shadow-sm">
              ⋮
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 items-center rounded-md border border-zinc-300 bg-white pl-2.5 pr-2 shadow-sm">
                <span className="text-zinc-400">⌕</span>
                <input
                  aria-label="Buscar proyecto"
                  placeholder="Buscar"
                  className="h-full w-56 border-0 bg-transparent px-2 text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
                />
              </div>

              <button className="flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm">
                <span>⎇</span>
                <span>Todos los filtros</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm">
                Seleccionar columna p...
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-300 bg-white text-lg text-zinc-700 shadow-sm">
                ⚙
              </button>
            </div>
          </div>

          <div className="px-5 pb-3">
            <span className="inline-flex items-center gap-2 rounded-md bg-[#e8f0fe] px-2.5 py-1 text-sm font-medium text-[#1f5bbf]">
              Activo: Sí
              <span className="text-base">×</span>
            </span>
          </div>

          <div className="overflow-hidden border-t border-zinc-200">
            <table className="min-w-full border-collapse text-left text-sm text-zinc-700">
              <thead className="bg-zinc-100 text-zinc-700">
                <tr>
                  <th className="border-r border-zinc-200 px-4 py-3 font-semibold">Nombre del proyecto</th>
                  <th className="border-r border-zinc-200 px-4 py-3 font-semibold">Número</th>
                  <th className="border-r border-zinc-200 px-4 py-3 font-semibold">Dirección</th>
                  <th className="border-r border-zinc-200 px-4 py-3 font-semibold">Etapa</th>
                  <th className="border-r border-zinc-200 px-4 py-3 font-semibold">Tipo de proyecto</th>
                  <th className="border-r border-zinc-200 px-4 py-3 font-semibold">Región</th>
                  <th className="border-r border-zinc-200 px-4 py-3 font-semibold">Agrupamiento</th>
                  <th className="border-r border-zinc-200 px-4 py-3 font-semibold">Departamento</th>
                  <th className="px-4 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {proyectos.map((proyecto) => (
                  <tr key={proyecto.nombre} className="border-t border-zinc-200 hover:bg-zinc-50">
                    <td className="border-r border-zinc-200 px-4 py-3 text-zinc-800">
                      <Link href={`/proyecto/${proyecto.slug}`} className="inline-flex items-center gap-2 text-[15px] font-medium text-[#1766c7] transition hover:text-[#0e4da8]">
                        {proyecto.nombre}
                      </Link>
                    </td>
                    <td className="border-r border-zinc-200 px-4 py-3 text-zinc-600">{proyecto.numero}</td>
                    <td className="border-r border-zinc-200 px-4 py-3 text-zinc-600">{proyecto.direccion}</td>
                    <td className="border-r border-zinc-200 px-4 py-3">
                      <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                        {proyecto.etapa}
                      </span>
                    </td>
                    <td className="border-r border-zinc-200 px-4 py-3 text-zinc-600">{proyecto.tipo}</td>
                    <td className="border-r border-zinc-200 px-4 py-3 text-zinc-600">{proyecto.region}</td>
                    <td className="border-r border-zinc-200 px-4 py-3 text-zinc-600">{proyecto.agrupamiento}</td>
                    <td className="border-r border-zinc-200 px-4 py-3 text-zinc-600">{proyecto.departamento}</td>
                    <td className="px-4 py-3 text-zinc-500">
                      <button className="rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium hover:bg-zinc-100">
                        Notas
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
