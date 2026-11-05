import { FormEvent, useState } from "react";
import { post, put } from "../../api/client";
import { useApi } from "../../hooks/useApi";
import { formatDate, fullName, planStatus } from "../../lib/labels";
import type { Participant, WorkPlanItem } from "../../types";
import { AdminBar, Field, isoDate, Modal, SaveForm, useCrud } from "./crud";

export function PlanAdmin() {
  const { items, reload, remove, toast, error } = useCrud<WorkPlanItem>("/api/work-plan");
  const people = useApi<Participant[]>("/api/participants");
  const [edit, setEdit] = useState<Partial<WorkPlanItem> | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setSaving(true);
    const body = { ...edit, date: edit.date };
    if (edit.id) await put(`/api/work-plan/${edit.id}`, body);
    else await post("/api/work-plan", body);
    setSaving(false);
    setEdit(null);
    reload();
  }

  return (
    <>
      <AdminBar title="План роботи" onCreate={() => setEdit({ status: "PLANNED", workType: "Семінар", date: isoDate(new Date().toISOString()) })} />
      {error && <p className="error-box">{error}</p>}
      <table>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{formatDate(i.date)}</td>
              <td>{i.title}</td>
              <td>{planStatus[i.status]}</td>
              <td>
                <button className="btn ghost" onClick={() => setEdit({ ...i, date: isoDate(i.date), responsibleId: i.responsible?.id })}>
                  Редагувати
                </button>
                <button className="btn danger" onClick={() => remove(i.id)}>
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {toast && <div className="toast">{toast}</div>}
      {edit && (
        <Modal title="Пункт плану" onClose={() => setEdit(null)}>
          <SaveForm onSubmit={save} saving={saving}>
            <Field label="Дата">
              <input type="date" value={isoDate(edit.date)} onChange={(e) => setEdit({ ...edit, date: e.target.value })} />
            </Field>
            <Field label="Назва">
              <input value={edit.title || ""} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
            </Field>
            <Field label="Опис">
              <textarea value={edit.description || ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
            </Field>
            <Field label="Тип роботи">
              <input value={edit.workType || ""} onChange={(e) => setEdit({ ...edit, workType: e.target.value })} />
            </Field>
            <Field label="Статус">
              <select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
                {Object.entries(planStatus).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Відповідальний">
              <select
                value={edit.responsibleId || ""}
                onChange={(e) => setEdit({ ...edit, responsibleId: e.target.value })}
              >
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
