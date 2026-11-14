import { FormEvent, useState } from "react";
import { post, put } from "../../api/client";
import { materialType } from "../../lib/labels";
import type { Material } from "../../types";
import { AdminBar, Field, isoDate, Modal, SaveForm, useCrud } from "./crud";
import { FileField } from "./FileField";

const empty = (): Partial<Material> => ({
  title: "",
  description: "",
  type: "PDF",
  category: "Загальне",
  author: "",
  date: isoDate(new Date().toISOString()),
  url: "",
  fileUrl: "",
});

export function MaterialsAdmin() {
  const { items, reload, remove, toast } = useCrud<Material>("/api/materials");
  const [edit, setEdit] = useState<Partial<Material> | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setSaving(true);
    const body = {
      ...edit,
      url: edit.url || null,
      fileUrl: edit.fileUrl || null,
    };
    try {
      if (edit.id) await put(`/api/materials/${edit.id}`, body);
      else await post("/api/materials", body);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Помилка збереження");
      setSaving(false);
      return;
    }
    setSaving(false);
    setEdit(null);
    reload();
  }

  return (
    <>
      <AdminBar title="Матеріали" onCreate={() => setEdit(empty())} />
      {items.map((m) => (
        <article className="card list-row" key={m.id}>
          <div>
            <strong>{m.title}</strong>
            <div className="muted">{m.type}</div>
          </div>
          <div>
            <button className="btn ghost" onClick={() => setEdit({ ...m, date: isoDate(m.date) })}>
              Редагувати
            </button>
            <button className="btn danger" onClick={() => remove(m.id)}>
              Видалити
            </button>
          </div>
        </article>
      ))}
      {toast && <div className="toast">{toast}</div>}
      {edit && (
        <Modal title={edit.id ? "Редагувати матеріал" : "Новий матеріал"} onClose={() => setEdit(null)}>
          <SaveForm onSubmit={save} saving={saving}>
            <Field label="Назва">
              <input required value={edit.title || ""} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
            </Field>
            <Field label="Опис">
              <textarea value={edit.description || ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
            </Field>
            <Field label="Тип">
              <select value={edit.type || "PDF"} onChange={(e) => setEdit({ ...edit, type: e.target.value })}>
                {Object.keys(materialType).map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </Field>
            <Field label="Категорія">
              <input value={edit.category || ""} onChange={(e) => setEdit({ ...edit, category: e.target.value })} />
            </Field>
            <Field label="Автор">
              <input required value={edit.author || ""} onChange={(e) => setEdit({ ...edit, author: e.target.value })} />
            </Field>
            <Field label="Дата">
              <input type="date" value={isoDate(edit.date)} onChange={(e) => setEdit({ ...edit, date: e.target.value })} />
            </Field>
            <FileField
              label="Файл з комп’ютера"
              value={edit.fileUrl || ""}
              onChange={(fileUrl) => setEdit({ ...edit, fileUrl })}
            />
            <Field label="Або зовнішнє посилання">
              <input value={edit.url || ""} onChange={(e) => setEdit({ ...edit, url: e.target.value })} />
            </Field>
          </SaveForm>
        </Modal>
      )}
    </>
  );
}
