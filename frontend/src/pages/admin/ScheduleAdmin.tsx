import { FormEvent, useState } from "react";
import { post, put } from "../../api/client";
import { useApi } from "../../hooks/useApi";
import { formatDate, fullName, scheduleStatus } from "../../lib/labels";
import type { Participant, ScheduleItem } from "../../types";
import { AdminBar, Field, isoDate, Modal, SaveForm, useCrud } from "./crud";

export function ScheduleAdmin() {
  const { items, reload, remove, toast } = useCrud<ScheduleItem>("/api/schedule");
  const people = useApi<Participant[]>("/api/participants");
  const [edit, setEdit] = useState<Partial<ScheduleItem> | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setSaving(true);
    if (edit.id) await put(`/api/schedule/${edit.id}`, edit);
    else await post("/api/schedule", edit);
    setSaving(false);
    setEdit(null);
    reload();
  }

  return (
    <>
      <AdminBar
        title="Графік"
        onCreate={() => setEdit({ status: "PLANNED", time: "15:00", date: isoDate(new Date().toISOString()) })}
      />
      {items.map((i) => (
        <article className="card list-row" key={i.id}>
          <div>
            <strong>{i.topic}</strong>
            <div className="muted">
              {formatDate(i.date)} {i.time} · {i.location}
            </div>
          </div>
          <div>
            <button className="btn ghost" onClick={() => setEdit({ ...i, date: isoDate(i.date), responsibleId: i.responsible?.id })}>
              Редагувати
            </button>
            <button className="btn danger" onClick={() => remove(i.id)}>
              Видалити
            </button>
          </div>
        </article>
      ))}
      {toast && <div className="toast">{toast}</div>}
      {edit && (
        <Modal title="Подія графіка" onClose={() => setEdit(null)}>
          <SaveForm onSubmit={save} saving={saving}>
            <Field label="Дата">
              <input type="date" value={isoDate(edit.date)} onChange={(e) => setEdit({ ...edit, date: e.target.value })} />
            </Field>
            <Field label="Час">
              <input value={edit.time || ""} onChange={(e) => setEdit({ ...edit, time: e.target.value })} />
            </Field>
            <Field label="Місце">
              <input value={edit.location || ""} onChange={(e) => setEdit({ ...edit, location: e.target.value })} />
            </Field>
            <Field label="Тема">
              <input value={edit.topic || ""} onChange={(e) => setEdit({ ...edit, topic: e.target.value })} />
            </Field>
            <Field label="Статус">
              <select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
                {Object.entries(scheduleStatus).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Відповідальний">
              <select value={edit.responsibleId || ""} onChange={(e) => setEdit({ ...edit, responsibleId: e.target.value })}>
                <option value="">—</option>
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
