import { FormEvent, useState } from "react";
import { post, put } from "../../api/client";
import { useApi } from "../../hooks/useApi";
import { formatDate, fullName } from "../../lib/labels";
import type { Meeting, Participant, Presentation } from "../../types";
import { AdminBar, Field, isoDate, Modal, SaveForm, useCrud } from "./crud";

type FormMeeting = Partial<Meeting> & {
  participantIds?: string[];
};

export function MeetingsAdmin() {
  const { items, reload, remove, toast } = useCrud<Meeting>("/api/meetings");
  const people = useApi<Participant[]>("/api/participants");
  const [edit, setEdit] = useState<FormMeeting | null>(null);
  const [saving, setSaving] = useState(false);

  function open(m?: Meeting) {
    if (!m) {
      setEdit({
        number: (items[0]?.number || 0) + 1,
        date: isoDate(new Date().toISOString()),
        time: "15:00",
        topic: "",
        shortDescription: "",
        agenda: "",
        discussion: "",
        results: "",
        conclusions: "",
        participantIds: [],
        presentations: [],
      });
      return;
    }
    setEdit({
      ...m,
      date: isoDate(m.date),
      participantIds: m.participants.map((p) => p.participant.id),
      presentations: m.presentations.map((p) => ({
        participantId: p.participantId || p.participant?.id || "",
        title: p.title,
        description: p.description,
        materialUrl: p.materialUrl,
        durationMinutes: p.durationMinutes,
      })),
    });
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setSaving(true);
    const body = {
      ...edit,
      participantIds: edit.participantIds,
      presentations: edit.presentations,
    };
    if (edit.id) await put(`/api/meetings/${edit.id}`, body);
    else await post("/api/meetings", body);
    setSaving(false);
    setEdit(null);
    reload();
  }

  function updateTalk(index: number, patch: Partial<Presentation>) {
    const presentations = [...(edit?.presentations || [])];
    presentations[index] = { ...presentations[index], ...patch };
    setEdit({ ...edit, presentations });
  }

  return (
    <>
      <AdminBar title="Засідання" onCreate={() => open()} />
      {items.map((m) => (
        <article className="card list-row" key={m.id}>
          <div>
            <strong>
              №{m.number}. {m.topic}
            </strong>
            <div className="muted">{formatDate(m.date)}</div>
          </div>
          <div>
            <button className="btn ghost" onClick={() => open(m)}>
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
        <Modal title="Засідання та виступи" onClose={() => setEdit(null)}>
          <SaveForm onSubmit={save} saving={saving}>
            <Field label="Номер">
              <input type="number" value={edit.number || 1} onChange={(e) => setEdit({ ...edit, number: Number(e.target.value) })} />
            </Field>
            <Field label="Дата">
              <input type="date" value={isoDate(edit.date)} onChange={(e) => setEdit({ ...edit, date: e.target.value })} />
            </Field>
            <Field label="Час">
              <input value={edit.time || ""} onChange={(e) => setEdit({ ...edit, time: e.target.value })} />
            </Field>
            <Field label="Тема">
              <input value={edit.topic || ""} onChange={(e) => setEdit({ ...edit, topic: e.target.value })} />
            </Field>
            <Field label="Короткий опис">
              <textarea value={edit.shortDescription || ""} onChange={(e) => setEdit({ ...edit, shortDescription: e.target.value })} />
            </Field>
            <Field label="Порядок денний">
              <textarea value={edit.agenda || ""} onChange={(e) => setEdit({ ...edit, agenda: e.target.value })} />
            </Field>
            <Field label="Обговорювали">
              <textarea value={edit.discussion || ""} onChange={(e) => setEdit({ ...edit, discussion: e.target.value })} />
            </Field>
            <Field label="Результати">
              <textarea value={edit.results || ""} onChange={(e) => setEdit({ ...edit, results: e.target.value })} />
            </Field>
            <Field label="Висновки">
              <textarea value={edit.conclusions || ""} onChange={(e) => setEdit({ ...edit, conclusions: e.target.value })} />
            </Field>
            <Field label="Фото URL">
              <input value={edit.photoUrl || ""} onChange={(e) => setEdit({ ...edit, photoUrl: e.target.value })} />
            </Field>
            <Field label="Учасники">
              <select
                multiple
                value={edit.participantIds}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    participantIds: Array.from(e.target.selectedOptions).map((o) => o.value),
                  })
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
            <h4>Виступи</h4>
            {(edit.presentations || []).map((p, i) => (
              <div className="card" key={i}>
                <Field label="Учасник">
                  <select value={p.participantId} onChange={(e) => updateTalk(i, { participantId: e.target.value })}>
                    {(people.data || []).map((person) => (
                      <option key={person.id} value={person.id}>
                        {fullName(person)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Тема виступу">
                  <input value={p.title} onChange={(e) => updateTalk(i, { title: e.target.value })} />
                </Field>
                <Field label="Опис">
                  <textarea value={p.description} onChange={(e) => updateTalk(i, { description: e.target.value })} />
                </Field>
                <Field label="Посилання на матеріал">
                  <input value={p.materialUrl || ""} onChange={(e) => updateTalk(i, { materialUrl: e.target.value })} />
                </Field>
                <Field label="Тривалість, хв">
                  <input
                    type="number"
                    value={p.durationMinutes}
                    onChange={(e) => updateTalk(i, { durationMinutes: Number(e.target.value) })}
                  />
                </Field>
              </div>
            ))}
            <button
              type="button"
              className="btn ghost"
              onClick={() =>
                setEdit({
                  ...edit,
                  presentations: [
                    ...(edit.presentations || []),
                    {
                      participantId: people.data?.[0]?.id || "",
                      title: "",
                      description: "",
                      durationMinutes: 15,
                    },
                  ],
                })
              }
            >
              Додати виступ
            </button>
          </SaveForm>
        </Modal>
      )}
    </>
  );
}
