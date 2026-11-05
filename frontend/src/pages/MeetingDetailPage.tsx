import { useParams } from "react-router-dom";
import { ErrorBox, Spinner } from "../components/ui";
import { useApi } from "../hooks/useApi";
import { formatDate, fullName, splitLines } from "../lib/labels";
import type { Meeting } from "../types";

export function MeetingDetailPage() {
  const { id } = useParams();
  const { data, loading, error } = useApi<Meeting>(id ? `/api/meetings/${id}` : null);
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;
  if (!data) return null;

  return (
    <main className="page">
      <div className="container">
        <p className="eyebrow">Засідання №{data.number}</p>
        <h1 className="page-title">{data.topic}</h1>
        <p className="muted">
          {formatDate(data.date)} · {data.time}
        </p>
        {data.photoUrl && <img src={data.photoUrl} alt="" style={{ borderRadius: 16, margin: "16px 0" }} />}
        <div className="grid grid-2">
          <article className="card">
            <h3>Короткий опис</h3>
            <p>{data.shortDescription}</p>
          </article>
          <article className="card">
            <h3>Порядок денний</h3>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{data.agenda}</pre>
          </article>
          <article className="card">
            <h3>Що обговорювали</h3>
            <ul>
              {splitLines(data.discussion).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h3>Результати</h3>
            <ul>
              {splitLines(data.results).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        </div>
        <article className="card" style={{ marginTop: 18 }}>
          <h3>Висновки</h3>
          <p>{data.conclusions}</p>
        </article>
        <article className="card" style={{ marginTop: 18 }}>
          <h3>Учасники</h3>
          <p>{data.participants.map((p) => fullName(p.participant)).join(", ") || "—"}</p>
        </article>
        <h2>Виступи</h2>
        <div className="grid">
          {data.presentations.map((p) => (
            <article className="card" key={p.id || p.title}>
              <h3 className="serif">
                {p.participant ? fullName(p.participant) : "Учасник"} — «{p.title}»
              </h3>
              <p>{p.description}</p>
              <p className="muted">Тривалість: {p.durationMinutes} хв.</p>
              {p.materialUrl && (
                <a href={p.materialUrl} target="_blank" rel="noreferrer">
                  Матеріал виступу
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
