import { useState } from "react";
import { post, put } from "../../api/client";
import { Badge, Empty } from "../../components/ui";
import { formatDate, requestStatus } from "../../lib/labels";
import type { RegistrationRequest } from "../../types";
import { useCrud } from "./crud";

export function RequestsAdmin() {
  const { items, error, toast, reload, remove } = useCrud<RegistrationRequest>("/api/registrations");
  const [busyId, setBusyId] = useState<string | null>(null);
  const pending = items.filter((r) => r.status === "NEW" || r.status === "REVIEWING");

  async function setStatus(id: string, status: string) {
    setBusyId(id);
    try {
      await put(`/api/registrations/${id}`, { status });
      await reload();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  async function approve(id: string) {
    setBusyId(id);
    try {
      await post(`/api/registrations/${id}/approve`, {});
      await reload();
    } catch (err) {
      alert((err as Error).message);
      await reload();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <h1 className="serif">Заявки</h1>
      {error && <p className="error-box">{error}</p>}
      {pending.length === 0 && <Empty title="Немає заявок на розгляд" text="Схвалені та відхилені заявки приховано." />}
      <div className="grid">
        {pending.map((r) => (
          <article className="card" key={r.id}>
            <div className="list-row">
              <h3>
                {r.firstName} {r.lastName}
              </h3>
              <Badge value={r.status} map={requestStatus} />
            </div>
            <p>
              {r.email} · {r.phone}
            </p>
            <p>
              {r.academicGroup}, {r.course} курс · {r.direction}
            </p>
            <p>{r.about}</p>
            <p className="muted">{r.motivation}</p>
            <p className="muted">{formatDate(r.createdAt)}</p>
            <div className="actions">
              <button className="btn ghost" disabled={busyId === r.id} onClick={() => setStatus(r.id, "REVIEWING")}>
                Розглядається
              </button>
              <button className="btn" disabled={busyId === r.id} onClick={() => approve(r.id)}>
                {busyId === r.id ? "Обробка…" : "Схвалити й додати"}
              </button>
              <button className="btn danger" disabled={busyId === r.id} onClick={() => setStatus(r.id, "REJECTED")}>
                Відхилити
              </button>
              <button className="btn ghost" disabled={busyId === r.id} onClick={() => remove(r.id)}>
                Видалити
              </button>
            </div>
          </article>
        ))}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
