import { mediaUrl } from "../api/client";
import { ErrorBox, Spinner } from "../components/ui";
import { useApi } from "../hooks/useApi";
import { splitLines } from "../lib/labels";
import type { GroupSettings } from "../types";

export function AboutPage() {
  const { data, loading, error } = useApi<GroupSettings>("/api/settings");
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;
  if (!data) return null;

  return (
    <main className="page">
      <div className="container">
        <p className="eyebrow">Про групу</p>
        <h1 className="page-title">{data.name}</h1>
        <p className="lead">{data.topic}</p>
        <div className="grid grid-2" style={{ marginTop: 28 }}>
          <article className="card">
            <h3 className="serif">Опис</h3>
            <p>{data.description}</p>
          </article>
          <article className="card">
            <h3 className="serif">Мета створення</h3>
            <p>{data.goal}</p>
          </article>
          <article className="card">
            <h3 className="serif">Основні завдання</h3>
            <ul>
              {splitLines(data.tasks).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h3 className="serif">Напрямки діяльності</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {splitLines(data.activityDirections).map((t) => (
                <span className="badge navy" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </article>
        </div>
        <article className="card person" style={{ marginTop: 18 }}>
          {data.leaderPhotoUrl && <img className="avatar" src={mediaUrl(data.leaderPhotoUrl)} alt="" />}
          <div>
            <p className="eyebrow">Керівник</p>
            <h3 className="serif" style={{ margin: "0 0 6px" }}>
              {data.leaderName}
            </h3>
            <p className="muted">{data.leaderTitle}</p>
            <p>{data.leaderBio}</p>
          </div>
        </article>
        <article className="card" style={{ marginTop: 18 }}>
          <h3 className="serif">Діяльність групи</h3>
          <p>{data.activityInfo}</p>
          <p className="muted">{data.scheduleNote}</p>
        </article>
      </div>
    </main>
  );
}
