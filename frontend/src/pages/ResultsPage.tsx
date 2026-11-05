import { useState } from "react";
import { Badge, Empty, ErrorBox, Spinner } from "../components/ui";
import { useApi } from "../hooks/useApi";
import { formatDate, fullName, resultStatus, resultType } from "../lib/labels";
import type { ResultItem } from "../types";

export function ResultsPage() {
  const [type, setType] = useState("");
  const { data, loading, error } = useApi<ResultItem[]>(`/api/results${type ? `?type=${type}` : ""}`);
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;

  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title">Результати</h1>
        <div className="filters">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Усі типи</option>
            {Object.entries(resultType).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        {(data || []).length === 0 ? (
          <Empty title="Результатів поки немає" />
        ) : (
          <div className="grid">
            {(data || []).map((r) => (
              <article className="card" key={r.id}>
                <div className="list-row">
                  <h3 className="serif" style={{ marginTop: 0 }}>
                    {r.title}
                  </h3>
                  <Badge value={r.type} map={resultType} />
                </div>
                <p>{r.description}</p>
                <p className="muted">
                  {formatDate(r.date)} · {r.category} · керівник: {r.supervisor}
                </p>
                <p>
                  Автори: {r.authors.map((a) => fullName(a.participant)).join(", ")}
                </p>
                <Badge value={r.status} map={resultStatus} />
                {r.link && (
                  <p>
                    <a href={r.link} target="_blank" rel="noreferrer">
                      Посилання
                    </a>
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
