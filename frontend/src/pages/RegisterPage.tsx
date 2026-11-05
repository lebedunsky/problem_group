import { FormEvent, useState } from "react";
import { post } from "../api/client";
import { Field } from "../components/ui";
import { useApi } from "../hooks/useApi";
import type { GroupSettings } from "../types";

const directions = [
  "Проєктування реляційних БД",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "NoSQL",
  "MongoDB",
  "Нормалізація",
  "Оптимізація SQL",
  "Безпека БД",
  "Хмарні БД",
  "AI + дані",
];

export function RegisterPage() {
  const { data: settings } = useApi<GroupSettings>("/api/settings");
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setOk("");
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = Object.fromEntries(form.entries());
    if (!payload.firstName || !payload.lastName || !payload.email || !payload.phone) {
      setError("Заповніть обов'язкові поля.");
      return;
    }
    setLoading(true);
    try {
      await post("/api/registrations", payload);
      formEl.reset();
      setOk("Заявку збережено. Адміністратор розгляне її найближчим часом.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="page-title">Реєстрація учасника</h1>
        <p className="muted">
          Заповніть форму, щоб приєднатися до {settings?.name || "проблемної групи"}.
        </p>
        <form className="card" onSubmit={onSubmit}>
          <div className="grid grid-2">
            <Field label="Ім'я *">
              <input name="firstName" required />
            </Field>
            <Field label="Прізвище *">
              <input name="lastName" required />
            </Field>
            <Field label="Email *">
              <input type="email" name="email" required />
            </Field>
            <Field label="Телефон *">
              <input name="phone" required />
            </Field>
            <Field label="Навчальна група *">
              <input name="academicGroup" required placeholder="КН-22" />
            </Field>
            <Field label="Курс *">
              <select name="course" required defaultValue="1">
                {[1, 2, 3, 4].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Напрямок, який цікавить *">
            <select name="direction" required defaultValue={directions[0]}>
              {directions.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Коротка інформація про себе">
            <textarea name="about" rows={3} />
          </Field>
          <Field label="Мотивація приєднання">
            <textarea name="motivation" rows={3} />
          </Field>
          {error && <p className="error-box">{error}</p>}
          {ok && <p className="badge ok">{ok}</p>}
          <button className="btn" disabled={loading}>
            {loading ? "Надсилання…" : "Надіслати заявку"}
          </button>
        </form>
      </div>
    </main>
  );
}
