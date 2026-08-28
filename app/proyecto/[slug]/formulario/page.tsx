import Link from "next/link";
import { notFound } from "next/navigation";
import { checklist } from "../../../data/checklist";
import { getProjectBySlug, proyectos } from "../../../data/projects";
import FormularioChecklist from "./FormularioChecklist";

export function generateStaticParams() {
  return proyectos.map((project) => ({ slug: project.slug }));
}

export default async function FormularioPage({
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
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#f0f2f5] text-xs font-bold text-zinc-900">A</span>
            EMPRESAS SOCOVESA
          </Link>
          <div className="text-zinc-400">•</div>
          <span>{project.numero} - {project.nombre}</span>
        </div>
        <Link href={`/proyecto/${project.slug}/formulario`} className="rounded-md bg-[#ff6b2c] px-3 py-1.5 text-sm font-medium text-white">Crear formulario</Link>
      </header>

      <div className="border-b border-zinc-200 bg-white px-6 py-3 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-900">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href={`/proyecto/${project.slug}`} className="hover:text-zinc-900">{project.nombre}</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">Formulario</span>
      </div>

      <FormularioChecklist checklist={checklist} projectSlug={project.slug} />
    </div>
  );
}
