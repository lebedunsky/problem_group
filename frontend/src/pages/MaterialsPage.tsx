import { useState } from "react";
import { Badge, Empty, ErrorBox, Spinner } from "../components/ui";
import { useApi } from "../hooks/useApi";
import { mediaUrl } from "../api/client";
import { formatDate, materialType } from "../lib/labels";
import type { Material } from "../types";

export function MaterialsPage() {
  const [type, setType] = useState("");
  const [q, setQ] = useState("");
  const query = new URLSearchParams();
  if (type) query.set("type", type);
  if (q) query.set("q", q);
  const { data, loading, error } = useApi<Material[]>(`/api/materials?${query.toString()}`);

  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title">Навчальні матеріали</h1>
        <div className="filters">
          <input placeholder="Пошук" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Усі типи</option>
            {Object.entries(materialType).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        {loading && <Spinner />}
        {error && <ErrorBox message={error} />}
        {!loading && (data || []).length === 0 && <Empty title="Матеріалів немає" />}
        <div className="grid grid-2">
          {(data || []).map((m) => {
            const href = mediaUrl(m.fileUrl) || m.url;
            return (
              <article className="card" key={m.id}>
                <Badge value={m.type} map={materialType} />
                <h3 className="serif">{m.title}</h3>
                <p>{m.description}</p>
                <p className="muted">
                  {m.category} · {m.author} · {formatDate(m.date)}
                </p>
                {href && (
                  <a href={href} target="_blank" rel="noreferrer">
                    Відкрити матеріал
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
