import { FormEvent, useState } from "react";
import { post, put } from "../../api/client";
import { useApi } from "../../hooks/useApi";
import type { Category, NewsItem } from "../../types";
import { AdminBar, Field, isoDate, Modal, SaveForm, useCrud } from "./crud";

export function NewsAdmin() {
  const { items, reload, remove, toast } = useCrud<NewsItem>("/api/news?published=all");
  const cats = useApi<Category[]>("/api/news/categories");
  const [edit, setEdit] = useState<Partial<NewsItem> | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setSaving(true);
    if (edit.id) await put(`/api/news/${edit.id}`, edit);
    else await post("/api/news", edit);
    setSaving(false);
    setEdit(null);
    reload();
  }

  return (
    <>
      <AdminBar
        title="Новини"
        onCreate={() =>
          setEdit({
            published: true,
            date: isoDate(new Date().toISOString()),
            categoryId: cats.data?.[0]?.id,
            author: "Адміністратор",
          })
        }
      />
      {items.map((n) => (
        <article className="card list-row" key={n.id}>
          <div>
            <strong>{n.title}</strong>
            <div className="muted">{n.published ? "Опубліковано" : "Приховано"}</div>
          </div>
          <div>
            <button className="btn ghost" onClick={() => setEdit({ ...n, date: isoDate(n.date) })}>
              Редагувати
            </button>
            <button className="btn danger" onClick={() => remove(n.id)}>
              Видалити
            </button>
          </div>
        </article>
      ))}
      {toast && <div className="toast">{toast}</div>}
      {edit && (
        <Modal title="Новина" onClose={() => setEdit(null)}>
          <SaveForm onSubmit={save} saving={saving}>
            <Field label="Заголовок">
              <input value={edit.title || ""} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
            </Field>
            <Field label="Короткий опис">
              <textarea value={edit.excerpt || ""} onChange={(e) => setEdit({ ...edit, excerpt: e.target.value })} />
            </Field>
            <Field label="Повний текст">
              <textarea rows={6} value={edit.content || ""} onChange={(e) => setEdit({ ...edit, content: e.target.value })} />
            </Field>
            <Field label="Дата">
              <input type="date" value={isoDate(edit.date)} onChange={(e) => setEdit({ ...edit, date: e.target.value })} />
            </Field>
            <Field label="Автор">
              <input value={edit.author || ""} onChange={(e) => setEdit({ ...edit, author: e.target.value })} />
            </Field>
            <Field label="Категорія">
              <select value={edit.categoryId} onChange={(e) => setEdit({ ...edit, categoryId: e.target.value })}>
                {(cats.data || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Зображення URL">
              <input value={edit.imageUrl || ""} onChange={(e) => setEdit({ ...edit, imageUrl: e.target.value })} />
            </Field>
            <label>
              <input
                type="checkbox"
                checked={Boolean(edit.published)}
                onChange={(e) => setEdit({ ...edit, published: e.target.checked })}
              />{" "}
              Опубліковано
            </label>
          </SaveForm>
        </Modal>
      )}
    </>
  );
}
