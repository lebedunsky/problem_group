import { useState } from "react";
import { Link } from "react-router-dom";
import { Empty, ErrorBox, Spinner } from "../components/ui";
import { useApi } from "../hooks/useApi";
import { formatDate } from "../lib/labels";
import type { Category, NewsItem } from "../types";

export function NewsPage() {
  const cats = useApi<Category[]>("/api/news/categories");
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (q) query.set("q", q);
  const { data, loading, error } = useApi<NewsItem[]>(`/api/news?${query.toString()}`);

  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title">Новини технологій БД</h1>
        <div className="filters">
          <input placeholder="Пошук" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Усі категорії</option>
            {(cats.data || []).map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {loading && <Spinner />}
        {error && <ErrorBox message={error} />}
        {!loading && (data || []).length === 0 && <Empty title="Новин не знайдено" />}
        <div className="grid grid-2">
          {(data || []).map((n) => (
            <Link className="card" key={n.id} to={`/news/${n.id}`}>
              <span className="badge">{n.category.name}</span>
              <h3 className="serif">{n.title}</h3>
              <p>{n.excerpt}</p>
              <p className="muted">
                {formatDate(n.date)} · {n.author}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
