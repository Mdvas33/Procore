"use client";

import { useState } from "react";
import type { ChecklistSection } from "../../../data/checklist";

type Result = "Pasa" | "No pasa" | "N/A";

export default function FormularioChecklist({ checklist }: { checklist: ChecklistSection[] }) {
  const [answers, setAnswers] = useState<Record<string, Result>>({});
  const total = checklist.reduce((count, section) => count + section.items.length, 0);
  const counts = {
    Pasa: Object.values(answers).filter((answer) => answer === "Pasa").length,
    "No pasa": Object.values(answers).filter((answer) => answer === "No pasa").length,
    "N/A": Object.values(answers).filter((answer) => answer === "N/A").length,
  };
  const completed = counts.Pasa + counts["No pasa"] + counts["N/A"];

  function setAnswer(id: string, result: Result) {
    setAnswers((current) => ({ ...current, [id]: result }));
  }

  return (
    <>
      <section className="mb-5 flex flex-wrap items-center justify-center gap-12 border-b border-zinc-200 bg-white px-8 py-6 shadow-sm sm:justify-between">
        <ProgressRing value={completed} total={total} color="#277b37" />
        <div className="flex items-center gap-7 text-sm text-zinc-700">
          <ResultCount color="text-emerald-700" icon="✓" value={counts.Pasa} />
          <ResultCount color="text-red-600" icon="×" value={counts["No pasa"]} />
          <ResultCount color="text-zinc-500" icon="／" value={counts["N/A"]} />
        </div>
        <div className="text-center text-sm text-zinc-500">
          <strong className="block text-2xl text-zinc-900">{completed}/{total}</strong>
          Ítems respondidos
        </div>
      </section>

      <main className="mx-auto max-w-[1320px] px-4 py-5 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900">Ítems de inspección</h1>
          <span className="hidden text-sm text-zinc-500 sm:block">Selecciona una opción en cada pregunta</span>
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
                            <input type="radio" name={`item-${item.id}`} value={result} checked={answer === result} onChange={() => setAnswer(item.id, result)} className="sr-only" />
                            {result}
                          </label>
                        ))}
                      </div>
                      <button type="button" className="text-left text-sm font-semibold text-zinc-700 hover:text-zinc-950" onClick={() => setAnswer(item.id, answer ?? "N/A")}>
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
          <button type="button" className="rounded-md bg-[#ff6b2c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e65d1e]">Enviar formulario</button>
        </div>
      </main>
    </>
  );
}

function ResultCount({ color, icon, value }: { color: string; icon: string; value: number }) {
  return <span className={`flex items-center gap-1 ${color}`}><strong className="text-2xl">{icon}</strong>{value}</span>;
}

function ProgressRing({ value, total, color }: { value: number; total: number; color: string }) {
  const progress = total ? (value / total) * 360 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-[72px] w-[72px] place-items-center rounded-full" style={{ background: `conic-gradient(${color} ${progress}deg, #d9dde0 0deg)` }}>
        <div className="grid h-[56px] w-[56px] place-items-center rounded-full bg-white text-sm font-bold text-zinc-800">{Math.round((value / total) * 100)}%</div>
      </div>
      <div><strong className="block text-sm text-zinc-900">Estado de ítems de inspección</strong><span className="text-xs text-zinc-500">{value}/{total} inspeccionado</span></div>
    </div>
  );
}
