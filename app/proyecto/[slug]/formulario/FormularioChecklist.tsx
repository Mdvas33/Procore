"use client";

import { useState } from "react";
import type { ChecklistSection } from "../../../data/checklist";

type Result = "Pasa" | "No pasa" | "N/A";
type Observation = {
  number: number;
  title: string;
  description: string;
  files: string[];
};
type SavedForm = { answers?: Record<string, Result>; observations?: Record<string, Observation>; submitted?: boolean; formName?: string; createdAt?: string };

export default function FormularioChecklist({ checklist, projectSlug }: { checklist: ChecklistSection[]; projectSlug: string }) {
  const storageKey = `procore-formulario-${projectSlug}`;
  const [savedForm] = useState<SavedForm | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return null;
    try {
      return JSON.parse(saved) as SavedForm;
    } catch {
      window.localStorage.removeItem(storageKey);
      return null;
    }
  });
  const [answers, setAnswers] = useState<Record<string, Result>>(savedForm?.answers ?? {});
  const [observations, setObservations] = useState<Record<string, Observation>>(savedForm?.observations ?? {});
  const [activeObservation, setActiveObservation] = useState<{ id: string; title: string } | null>(null);
  const [submitted, setSubmitted] = useState(savedForm?.submitted ?? false);
  const total = checklist.reduce((count, section) => count + section.items.length, 0);
  const counts = {
    Pasa: Object.values(answers).filter((answer) => answer === "Pasa").length,
    "No pasa": Object.values(answers).filter((answer) => answer === "No pasa").length,
    "N/A": Object.values(answers).filter((answer) => answer === "N/A").length,
  };
  const completed = counts.Pasa + counts["No pasa"] + counts["N/A"];
  const observationCount = Object.keys(observations).length;

  function setAnswer(id: string, result: Result) {
    setAnswers((current) => ({ ...current, [id]: result }));
    if (result === "No pasa") {
      setObservations((current) => ({
        ...current,
        [id]: current[id] ?? { number: Object.keys(current).length + 1, title: "", description: "", files: [] },
      }));
    }
  }

  function openObservation(id: string, title: string) {
    setActiveObservation({ id, title });
  }

  function updateObservation(id: string, changes: Partial<Observation>) {
    setObservations((current) => ({ ...current, [id]: { ...current[id], ...changes } }));
  }

  function submitForm() {
    if (completed < total) {
      window.alert(`Debes responder las ${total} preguntas antes de enviar el formulario.`);
      return;
    }

    const existing = window.localStorage.getItem(storageKey);
    const previous = existing ? JSON.parse(existing) as SavedForm : null;
    window.localStorage.setItem(storageKey, JSON.stringify({
      answers,
      observations,
      submitted: true,
      formName: "Inspección de Marketing",
      createdAt: previous?.createdAt ?? new Date().toISOString(),
    }));
    setSubmitted(true);
  }

  return (
    <>
      <section className="mb-5 overflow-hidden rounded-[18px] border border-zinc-200 bg-[#f3f3f3] px-6 py-4 shadow-sm lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:divide-x lg:divide-zinc-300">
          <InspectionChart counts={counts} completed={completed} total={total} />
          <ObservationChart count={observationCount} />
        </div>
      </section>

      <main className="mx-auto max-w-[1320px] px-4 py-5 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900">Ítems de inspección</h1>
          <span className={`hidden text-sm font-semibold sm:block ${submitted ? "text-emerald-700" : "text-zinc-500"}`}>{submitted ? "Formulario enviado y guardado" : "Selecciona una opción en cada pregunta"}</span>
        </div>

        <div className="overflow-hidden border border-zinc-200 bg-white shadow-sm">
          {checklist.map((section) => (
            <section key={section.section}>
              <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-5 py-4">
                <span className="text-xl text-zinc-700">⌄</span>
                <h2 className="font-bold text-zinc-800">{section.section}</h2>
                <span className="ml-auto text-xs text-zinc-500">{section.items.length} preguntas</span>
              </div>
              <div>
                {section.items.map((item) => {
                  const answer = answers[item.id];
                  return (
                    <div key={item.id} className="grid gap-4 border-b border-zinc-200 px-5 py-4 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_330px_120px] lg:items-center">
                      <div className="flex gap-3">
                        <span className="pt-0.5 text-sm font-bold text-zinc-700">{item.id}</span>
                        <p className="text-sm leading-6 text-zinc-700">{item.text}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(["Pasa", "No pasa", "N/A"] as Result[]).map((result) => (
                          <label key={result} className={`flex cursor-pointer items-center justify-center rounded-md px-2 py-2 text-sm font-semibold transition ${answer === result ? result === "Pasa" ? "bg-[#277b37] text-white" : result === "No pasa" ? "bg-red-600 text-white" : "bg-zinc-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
                            <input type="radio" name={`item-${item.id}`} value={result} checked={answer === result} onChange={() => { setAnswer(item.id, result); if (result === "No pasa") openObservation(item.id, item.text); }} className="sr-only" />
                            {result}
                          </label>
                        ))}
                      </div>
                      <button type="button" className="text-left text-sm font-semibold text-zinc-700 hover:text-zinc-950" onClick={() => answer === "No pasa" ? openObservation(item.id, item.text) : undefined}>
                        ● Actividad
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="flex justify-end gap-3 py-6">
          <button type="button" className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">Guardar borrador</button>
          <button type="button" onClick={submitForm} className="rounded-md bg-[#ff6b2c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e65d1e]">{submitted ? "Formulario enviado" : "Enviar formulario"}</button>
        </div>
      </main>
      {activeObservation && (
        <ObservationModal
          observation={observations[activeObservation.id]}
          question={activeObservation.title}
          onChange={(changes) => updateObservation(activeObservation.id, changes)}
          onClose={() => setActiveObservation(null)}
        />
      )}
    </>
  );
}

function ObservationModal({
  observation,
  question,
  onChange,
  onClose,
}: {
  observation: Observation;
  question: string;
  onChange: (changes: Partial<Observation>) => void;
  onClose: () => void;
}) {
  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    onChange({ files: Array.from(event.target.files ?? []).map((file) => file.name) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8" role="dialog" aria-modal="true" aria-labelledby="observation-title">
      <div className="w-full max-w-4xl rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <h2 id="observation-title" className="text-xl font-bold text-zinc-900">Nueva observación</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar observación" className="text-2xl leading-none text-zinc-500 hover:text-zinc-900">×</button>
        </div>
        <div className="space-y-5 p-5">
          <div className="border-b border-zinc-200 pb-5">
            <h3 className="mb-4 text-base font-bold text-zinc-800">⌄ Información general</h3>
            <p className="mb-4 text-xs text-zinc-500">Origen: Inspección de Marketing &gt; Ítem {question}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tipo *"><input value="Marketing" readOnly className="field bg-zinc-50" /></Field>
              <Field label="N.° *"><input value={observation.number} readOnly className="field bg-zinc-50" /></Field>
              <Field label="Título *"><input value={question} readOnly className="field bg-zinc-50" /></Field>
              <Field label="Estatus *"><select defaultValue="Iniciado" className="field"><option>Iniciado</option><option>En revisión</option><option>Cerrado</option></select></Field>
            </div>
          </div>
          <div>
            <label htmlFor="observation-description" className="mb-2 block text-sm font-medium text-zinc-700">Descripción</label>
            <textarea id="observation-description" value={observation.description} onChange={(event) => onChange({ description: event.target.value })} rows={6} className="w-full resize-y rounded-md border border-zinc-300 p-3 text-sm outline-none focus:border-[#ff6b2c] focus:ring-1 focus:ring-[#ff6b2c]" placeholder="Describe la observación..." />
          </div>
          <div>
            <span className="mb-2 block text-sm font-medium text-zinc-700">Adjuntos</span>
            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-zinc-400 bg-zinc-50 px-4 py-6 text-center hover:bg-zinc-100">
              <span className="mb-2 text-3xl text-zinc-500">▧</span>
              <span className="text-sm font-semibold text-zinc-700">Adjuntar imágenes</span>
              <span className="mt-1 text-xs text-zinc-500">Selecciona una o varias imágenes</span>
              <input type="file" accept="image/*" multiple onChange={handleFiles} className="sr-only" />
            </label>
            {observation.files.length > 0 && <p className="mt-2 text-xs text-zinc-600">{observation.files.join(", ")}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-zinc-200 px-5 py-4">
          <button type="button" onClick={onClose} className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">Cancelar</button>
          <button type="button" onClick={onClose} className="rounded-md bg-[#ff6b2c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e65d1e]">Guardar observación</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-zinc-700">{label}<span className="mt-1 block">{children}</span></label>;
}

function InspectionChart({ counts, completed, total }: { counts: { Pasa: number; "No pasa": number; "N/A": number }; completed: number; total: number }) {
  const notInspected = Math.max(total - completed, 0);
  const segments = [
    { label: "En cumplimiento", value: counts.Pasa, color: "#2d7a52" },
    { label: "Deficiente", value: counts["No pasa"], color: "#d83637" },
    { label: "Datos ingresados", value: 0, color: "#1f8dd6" },
    { label: "N/A", value: counts["N/A"], color: "#7a7a7a" },
    { label: "No inspeccionado", value: notInspected, color: "#dfe4e7" },
  ];

  return (
    <div className="px-1 py-1">
      <h2 className="mb-4 text-[18px] font-bold text-zinc-800">Estatus de ítems de inspección</h2>
      <div className="flex items-center justify-center gap-8 sm:justify-start sm:pl-8">
        <DonutChart total={total} center={`${completed}/${total}`} subtitle="Inspeccionado" segments={segments} />
        <ChartLegend segments={segments} />
      </div>
    </div>
  );
}

function ObservationChart({ count }: { count: number }) {
  const total = Math.max(count, 1);
  const segments = [{ label: "Iniciado", value: count, color: "#1f3c8f" }];

  return (
    <div className="px-1 py-1 lg:pl-6">
      <h2 className="mb-4 text-[18px] font-bold text-zinc-800">Observaciones creadas de la inspección</h2>
      <div className="flex items-center justify-center gap-8 sm:justify-start sm:pl-8">
        <DonutChart total={total} center={`0/${total}`} subtitle="Cerrado" segments={segments} />
        <ChartLegend segments={[
          ...segments,
          { label: "Listo para revisión", value: 0, color: "#4a90e2" },
          { label: "Rechazado", value: 0, color: "#9abef4" },
          { label: "Cerrado", value: 0, color: "#dfeaff" },
        ]} />
      </div>
    </div>
  );
}

function DonutChart({ total, center, subtitle, segments }: { total: number; center: string; subtitle: string; segments: { label: string; value: number; color: string }[] }) {
  const visibleSegments = segments.filter((segment) => segment.value > 0);
  const effectiveTotal = visibleSegments.reduce((sum, segment) => sum + segment.value, 0) || total || 1;
  const gradient = visibleSegments.reduce<{ stops: string[]; offset: number }>((result, segment) => {
    const nextOffset = result.offset + (effectiveTotal ? (segment.value / effectiveTotal) * 360 : 0);
    return {
      stops: [...result.stops, `${segment.color} ${result.offset}deg ${nextOffset}deg`],
      offset: nextOffset,
    };
  }, { stops: [], offset: 0 }).stops.join(", ");

  return (
    <div className="relative grid h-40 w-40 shrink-0 place-items-center rounded-full border border-[#e5e7eb] bg-[#f3f3f3] p-3" style={{ background: gradient ? `conic-gradient(${gradient})` : "#dfe4e7" }}>
      <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center shadow-inner">
        <strong className="block text-[18px] font-semibold leading-5 text-zinc-900">{center}</strong>
        <span className="mt-0.5 text-[10px] font-medium text-zinc-700">{subtitle}</span>
      </div>
    </div>
  );
}

function ChartLegend({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  return (
    <div className="space-y-2 text-[15px] text-zinc-700">
      {segments.map((segment) => (
        <div key={segment.label} className="flex items-center gap-2 whitespace-nowrap leading-none">
          <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: segment.color }} />
          <span className="min-w-[18px] text-left font-medium text-zinc-800">{segment.value}</span>
          <span>{segment.label}</span>
        </div>
      ))}
    </div>
  );
}
