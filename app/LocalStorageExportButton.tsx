"use client";

import { useState } from "react";

type ExportEntry = {
  value: unknown;
  rawValue: string;
};

export default function LocalStorageExportButton() {
  const [exported, setExported] = useState(false);

  function exportLocalStorage() {
    const data: Record<string, ExportEntry> = {};

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key) continue;

      const rawValue = window.localStorage.getItem(key) ?? "";
      let value: unknown = rawValue;

      try {
        value = JSON.parse(rawValue);
      } catch {
        // Keep non-JSON values as strings.
      }

      data[key] = { value, rawValue };
    }

    const payload = {
      exportedAt: new Date().toISOString(),
      storage: data,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `procore-localstorage-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setExported(true);
    window.setTimeout(() => setExported(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={exportLocalStorage}
      title="Descargar toda la información guardada en este navegador"
      className="fixed bottom-5 right-5 z-40 rounded-md bg-[#1766c7] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0e4da8] focus:outline-none focus:ring-2 focus:ring-[#1766c7] focus:ring-offset-2"
    >
      {exported ? "Datos exportados" : "Exportar datos"}
    </button>
  );
}
