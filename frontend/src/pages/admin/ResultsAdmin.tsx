import { FormEvent, useState } from "react";
import { post, put } from "../../api/client";
import { useApi } from "../../hooks/useApi";
import { fullName, resultStatus, resultType } from "../../lib/labels";
import type { Participant, ResultItem } from "../../types";
import { AdminBar, Field, isoDate, Modal, SaveForm, useCrud } from "./crud";
import { FileField } from "./FileField";

export function ResultsAdmin() {
  const { items, reload, remove, toast } = useCrud<ResultItem>("/api/results");
  const people = useApi<Participant[]>("/api/participants");
  const [edit, setEdit] = useState<Partial<ResultItem> & { authorIds?: string[] } | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setSaving(true);
    if (edit.id) await put(`/api/results/${edit.id}`, edit);
    else await post("/api/results", edit);
    setSaving(false);
    setEdit(null);
    reload();
  }

  return (
    <>
      <AdminBar
        title="Результати"
        onCreate={() =>
          setEdit({
            type: "PROJECT",
            status: "COMPLETED",
            date: isoDate(new Date().toISOString()),
            authorIds: [],
          })
        }
      />
      {items.map((r) => (
        <article className="card list-row" key={r.id}>
          <strong>{r.title}</strong>
          <div>
            <button
              className="btn ghost"
              onClick={() =>
                setEdit({ ...r, date: isoDate(r.date), authorIds: r.authors.map((a) => a.participant.id) })
              }
            >
              Редагувати
            </button>
            <button className="btn danger" onClick={() => remove(r.id)}>
              Видалити
            </button>
          </div>
        </article>
      ))}
      {toast && <div className="toast">{toast}</div>}
      {edit && (
        <Modal title="Результат" onClose={() => setEdit(null)}>
          <SaveForm onSubmit={save} saving={saving}>
            <Field label="Назва">
              <input value={edit.title || ""} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
            </Field>
            <Field label="Опис">
              <textarea value={edit.description || ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
            </Field>
            <Field label="Дата">
              <input type="date" value={isoDate(edit.date)} onChange={(e) => setEdit({ ...edit, date: e.target.value })} />
            </Field>
            <Field label="Керівник">
              <input value={edit.supervisor || ""} onChange={(e) => setEdit({ ...edit, supervisor: e.target.value })} />
            </Field>
            <Field label="Тип">
              <select value={edit.type} onChange={(e) => setEdit({ ...edit, type: e.target.value })}>
                {Object.entries(resultType).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Категорія">
              <input value={edit.category || ""} onChange={(e) => setEdit({ ...edit, category: e.target.value })} />
            </Field>
            <Field label="Посилання">
              <input value={edit.link || ""} onChange={(e) => setEdit({ ...edit, link: e.target.value })} />
            </Field>
            <FileField
              label="Файл"
              value={edit.fileUrl || ""}
              onChange={(fileUrl) => setEdit({ ...edit, fileUrl })}
            />
            <Field label="Статус">
              <select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
                {Object.entries(resultStatus).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Автори">
              <select
                multiple
                value={edit.authorIds}
                onChange={(e) =>
                  setEdit({ ...edit, authorIds: Array.from(e.target.selectedOptions).map((o) => o.value) })
                }
                style={{ minHeight: 120 }}
              >
                {(people.data || []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {fullName(p)}
                  </option>
                ))}
              </select>
            </Field>
          </SaveForm>
        </Modal>
      )}
    </>
  );
}
