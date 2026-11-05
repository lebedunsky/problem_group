import { useState } from "react";
import { Link } from "react-router-dom";
import { Empty, ErrorBox, Spinner } from "../components/ui";
import { useApi } from "../hooks/useApi";
import { formatDate, fullName } from "../lib/labels";
import type { Meeting } from "../types";

export function MeetingsPage() {
  const [from, setFrom] = useState("");
  const [q, setQ] = useState("");
  const query = new URLSearchParams();
  if (from) query.set("from", from);
  if (q) query.set("q", q);
  const { data, loading, error } = useApi<Meeting[]>(`/api/meetings?${query.toString()}`);

  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title">Засідання</h1>
        <p className="muted">Протоколи засідань: порядок денний, обговорення, виступи та результати.</p>
        <div className="filters">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input placeholder="Пошук за темою" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {loading && <Spinner />}
        {error && <ErrorBox message={error} />}
        {!loading && (data || []).length === 0 && <Empty title="Засідань не знайдено" />}
        <div className="grid">
          {(data || []).map((m) => (
            <Link className="card" key={m.id} to={`/meetings/${m.id}`}>
              <span className="badge navy">Засідання №{m.number}</span>
              <h3 className="serif">{m.topic}</h3>
              <p>{m.shortDescription}</p>
              <p className="muted">
                {formatDate(m.date)} · {m.time} · виступів: {m.presentations.length}
              </p>
              {m.presentations[0] && (
                <p>
                  Виступали:{" "}
                  {m.presentations
                    .map((p) => (p.participant ? `${fullName(p.participant)} — «${p.title}»` : p.title))
                    .join("; ")}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
