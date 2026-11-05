import { useParams } from "react-router-dom";
import { ErrorBox, Spinner } from "../components/ui";
import { useApi } from "../hooks/useApi";
import { formatDate } from "../lib/labels";
import type { NewsItem } from "../types";

export function NewsDetailPage() {
  const { id } = useParams();
  const { data, loading, error } = useApi<NewsItem>(id ? `/api/news/${id}` : null);
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;
  if (!data) return null;
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <span className="badge">{data.category.name}</span>
        <h1 className="page-title">{data.title}</h1>
        <p className="muted">
          {formatDate(data.date)} · {data.author}
        </p>
        {data.imageUrl && <img src={data.imageUrl} alt="" />}
        <article className="card">
          <p>{data.excerpt}</p>
          <p style={{ whiteSpace: "pre-wrap" }}>{data.content}</p>
        </article>
      </div>
    </main>
  );
}
