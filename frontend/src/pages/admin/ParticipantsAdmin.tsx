import { FormEvent, useState } from "react";
import { post, put } from "../../api/client";
import { fullName } from "../../lib/labels";
import type { Participant } from "../../types";
import { AdminBar, Field, Modal, SaveForm, useCrud } from "./crud";
import { FileField } from "./FileField";

const empty = {
  firstName: "",
  lastName: "",
  photoUrl: "",
  academicGroup: "",
  course: 1,
  role: "Учасник",
  direction: "SQL",
  bio: "",
  email: "",
};

export function ParticipantsAdmin() {
  const { items, error, toast, loading, reload, remove } = useCrud<Participant>("/api/participants");
  const [edit, setEdit] = useState<Partial<Participant> | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!edit) return;
    setSaving(true);
    try {
      const body = { ...edit, course: Number(edit.course) };
      if (edit.id) await put(`/api/participants/${edit.id}`, body);
      else await post("/api/participants", body);
      setEdit(null);
      await reload();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminBar title="Учасники" onCreate={() => setEdit({ ...empty })} />
      {error && <p className="error-box">{error}</p>}
      {loading && <p>Завантаження…</p>}
      <div className="table-wrap card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>ПІБ</th>
              <th>Група</th>
              <th>Роль</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{fullName(p)}</td>
                <td>
                  {p.academicGroup}
                  {p.course > 0 ? `, ${p.course} курс` : ""}
                </td>
                <td>{p.role}</td>
                <td>
                  <button className="btn ghost" onClick={() => setEdit(p)}>
                    Редагувати
                  </button>{" "}
                  <button className="btn danger" onClick={() => remove(p.id)}>
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toast && <div className="toast">{toast}</div>}
      {edit && (
        <Modal title={edit.id ? "Редагувати учасника" : "Новий учасник"} onClose={() => setEdit(null)}>
          <SaveForm onSubmit={save} saving={saving}>
            <Field label="Ім'я">
              <input value={edit.firstName || ""} onChange={(e) => setEdit({ ...edit, firstName: e.target.value })} />
            </Field>
            <Field label="Прізвище">
              <input value={edit.lastName || ""} onChange={(e) => setEdit({ ...edit, lastName: e.target.value })} />
            </Field>
            <FileField
              label="Фото"
              accept="image/*"
              value={edit.photoUrl || ""}
              onChange={(photoUrl) => setEdit({ ...edit, photoUrl })}
            />
            <Field label="Навчальна група">
              <input
                value={edit.academicGroup || ""}
                onChange={(e) => setEdit({ ...edit, academicGroup: e.target.value })}
              />
            </Field>
            <Field label="Курс">
              <input
                type="number"
                value={edit.course || 1}
                onChange={(e) => setEdit({ ...edit, course: Number(e.target.value) })}
              />
            </Field>
            <Field label="Роль">
              <input value={edit.role || ""} onChange={(e) => setEdit({ ...edit, role: e.target.value })} />
            </Field>
            <Field label="Напрямок">
              <input value={edit.direction || ""} onChange={(e) => setEdit({ ...edit, direction: e.target.value })} />
            </Field>
            <Field label="Опис">
              <textarea value={edit.bio || ""} onChange={(e) => setEdit({ ...edit, bio: e.target.value })} />
            </Field>
            <Field label="Email">
              <input value={edit.email || ""} onChange={(e) => setEdit({ ...edit, email: e.target.value })} />
            </Field>
          </SaveForm>
        </Modal>
      )}
    </>
  );
}
