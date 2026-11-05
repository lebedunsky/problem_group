import { useMemo, useState } from "react";
import { Empty, ErrorBox, Spinner } from "../components/ui";
import { useApi } from "../hooks/useApi";
import { fullName } from "../lib/labels";
import type { Participant } from "../types";

export function ParticipantsPage() {
  const { data, loading, error } = useApi<Participant[]>("/api/participants");
  const [q, setQ] = useState("");
  const [course, setCourse] = useState("");
  const [direction, setDirection] = useState("");

  const directions = useMemo(
    () => Array.from(new Set((data || []).map((p) => p.direction))).sort(),
    [data]
  );
  const courses = useMemo(
    () => Array.from(new Set((data || []).map((p) => p.course))).sort(),
    [data]
  );

  const filtered = (data || []).filter((p) => {
    const hay = `${p.firstName} ${p.lastName} ${p.academicGroup} ${p.role}`.toLowerCase();
    return (
      (!q || hay.includes(q.toLowerCase())) &&
      (!course || String(p.course) === course) &&
      (!direction || p.direction === direction)
    );
  });

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;

  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title">Учасники</h1>
        <p className="muted">Склад проблемної групи та напрями досліджень.</p>
        <div className="filters">
          <input placeholder="Пошук" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">Усі курси</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c} курс
              </option>
            ))}
          </select>
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="">Усі напрямки</option>
            {directions.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        {filtered.length === 0 ? (
          <Empty title="Учасників не знайдено" text="Змініть фільтри або дочекайтеся нових заявок." />
        ) : (
          <div className="grid grid-2">
            {filtered.map((p) => (
              <article className="card person" key={p.id}>
                <img className="avatar" src={p.photoUrl || ""} alt="" />
                <div>
                  <h3 className="serif" style={{ margin: "0 0 4px" }}>
                    {fullName(p)}
                  </h3>
                  <p className="muted">
                    {p.academicGroup} · {p.course} курс · {p.role}
                  </p>
                  <span className="badge">{p.direction}</span>
                  <p>{p.bio}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
