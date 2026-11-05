import { FormEvent, useState } from "react";
import { getToken } from "../../api/client";
import { materialType } from "../../lib/labels";
import type { Material } from "../../types";
import { AdminBar, Field, isoDate, Modal, useCrud } from "./crud";

export function MaterialsAdmin() {
  const { items, reload, remove, toast } = useCrud<Material>("/api/materials");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const token = getToken();
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Помилка завантаження");
      setSaving(false);
      return;
    }
    setSaving(false);
    setOpen(false);
    reload();
  }

  return (
    <>
      <AdminBar title="Матеріали" onCreate={() => setOpen(true)} />
      {items.map((m) => (
        <article className="card list-row" key={m.id}>
          <div>
            <strong>{m.title}</strong>
            <div className="muted">{m.type}</div>
          </div>
          <button className="btn danger" onClick={() => remove(m.id)}>
            Видалити
          </button>
        </article>
      ))}
      {toast && <div className="toast">{toast}</div>}
      {open && (
        <Modal title="Новий матеріал" onClose={() => setOpen(false)}>
          <form onSubmit={save}>
            <Field label="Назва">
              <input name="title" required />
            </Field>
            <Field label="Опис">
              <textarea name="description" />
            </Field>
            <Field label="Тип">
              <select name="type" defaultValue="PDF">
                {Object.keys(materialType).map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </Field>
            <Field label="Категорія">
              <input name="category" defaultValue="Загальне" />
            </Field>
            <Field label="Автор">
              <input name="author" required />
            </Field>
            <Field label="Дата">
              <input type="date" name="date" defaultValue={isoDate(new Date().toISOString())} />
            </Field>
            <Field label="URL (якщо немає файлу)">
              <input name="url" />
            </Field>
            <Field label="Файл">
              <input type="file" name="file" />
            </Field>
            <button className="btn" disabled={saving}>
              {saving ? "Завантаження…" : "Зберегти"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
