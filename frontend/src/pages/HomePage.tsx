import { Link } from "react-router-dom";
import { Empty, ErrorBox, Spinner } from "../components/ui";
import { useApi } from "../hooks/useApi";
import { formatDate, fullName } from "../lib/labels";
import type { GroupSettings, Meeting, NewsItem, ResultItem, ScheduleItem, Stats } from "../types";

export function HomePage() {
  const settings = useApi<GroupSettings>("/api/settings");
  const stats = useApi<Stats>("/api/stats");
  const upcoming = useApi<ScheduleItem | null>("/api/schedule/upcoming");
  const latest = useApi<Meeting | null>("/api/meetings/latest");
  const news = useApi<NewsItem[]>("/api/news");
  const results = useApi<ResultItem[]>("/api/results");

  if (settings.loading || stats.loading) return <Spinner />;
  if (settings.error) return <ErrorBox message={settings.error} />;
  const s = settings.data!;

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">Університетська проблемна група</p>
          <h1>{s.name}</h1>
          <p className="lead">
            Тема: {s.topic}. {s.shortDescription}
          </p>
          <p className="lead">Мета: {s.goal}</p>
          <div className="actions">
            <Link className="btn" to="/register">
              Приєднатися до групи
            </Link>
            <Link className="btn secondary" to="/about">
              Про групу
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-4">
          {[
            [stats.data?.participants, "Учасників"],
            [stats.data?.meetings, "Засідань"],
            [stats.data?.results, "Проєктів / результатів"],
            [stats.data?.materials, "Матеріалів"],
          ].map(([n, label]) => (
            <div className="card stat" key={String(label)}>
              <b>{n ?? "—"}</b>
              <span className="muted">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid grid-2">
          <article className="card">
            <p className="eyebrow">Найближче засідання</p>
            {upcoming.data ? (
              <>
                <h2 className="serif">{upcoming.data.topic}</h2>
                <p>
                  {formatDate(upcoming.data.date)}, {upcoming.data.time} · {upcoming.data.location}
                </p>
                {upcoming.data.responsible && (
                  <p className="muted">Відповідальний: {fullName(upcoming.data.responsible)}</p>
                )}
                <Link to="/schedule">Весь графік →</Link>
              </>
            ) : (
              <Empty title="Немає запланованих засідань" />
            )}
          </article>
          <article className="card">
            <p className="eyebrow">Останнє засідання</p>
            {latest.data ? (
              <>
                <h2 className="serif">
                  №{latest.data.number}. {latest.data.topic}
                </h2>
                <p>{latest.data.shortDescription}</p>
                <p className="muted">{formatDate(latest.data.date)}</p>
                <Link to={`/meetings/${latest.data.id}`}>Деталі засідання →</Link>
              </>
            ) : (
              <Empty title="Ще немає записів про засідання" />
            )}
          </article>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2>Останні новини</h2>
          <div className="grid grid-3">
            {(news.data || []).slice(0, 4).map((n) => (
              <Link className="card" key={n.id} to={`/news/${n.id}`}>
                <span className="badge">{n.category?.name ?? "Без категорії"}</span>
                <h3 className="serif">{n.title}</h3>
                <p className="muted">{n.excerpt}</p>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 16 }}>
            <Link to="/news">Усі новини →</Link>
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2>Останні результати</h2>
          <div className="grid grid-2">
            {(results.data || []).slice(0, 4).map((r) => (
              <article className="card" key={r.id}>
                <h3 className="serif">{r.title}</h3>
                <p className="muted">{r.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
