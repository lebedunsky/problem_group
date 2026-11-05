import { FormEvent, useEffect, useState } from "react";
import { put } from "../../api/client";
import { Field } from "../../components/ui";
import { useApi } from "../../hooks/useApi";
import type { GroupSettings } from "../../types";

export function SettingsAdmin() {
  const { data, loading } = useApi<GroupSettings>("/api/settings");
  const [form, setForm] = useState<Partial<GroupSettings>>({});
  const [ok, setOk] = useState("");

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  async function save(e: FormEvent) {
    e.preventDefault();
    await put("/api/settings", form);
    setOk("Збережено");
  }

  if (loading) return <p>Завантаження…</p>;

  return (
    <>
      <h1 className="serif">Налаштування групи</h1>
      <form className="card" onSubmit={save}>
        {(
          [
            ["name", "Назва"],
            ["topic", "Тема"],
            ["shortDescription", "Короткий опис"],
            ["description", "Опис"],
            ["goal", "Мета"],
            ["tasks", "Завдання"],
            ["activityDirections", "Напрямки"],
            ["activityInfo", "Діяльність"],
            ["leaderName", "Керівник"],
            ["leaderTitle", "Посада керівника"],
            ["leaderBio", "Біографія керівника"],
            ["leaderPhotoUrl", "Фото керівника"],
            ["email", "Email"],
            ["phone", "Телефон"],
            ["address", "Адреса"],
            ["scheduleNote", "Графік"],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label}>
            {key.includes("description") ||
            key === "goal" ||
            key === "tasks" ||
            key === "activityDirections" ||
            key === "activityInfo" ||
            key === "leaderBio" ||
            key === "shortDescription" ? (
              <textarea
                value={String(form[key] || "")}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            ) : (
              <input value={String(form[key] || "")} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            )}
          </Field>
        ))}
        {ok && <p className="badge ok">{ok}</p>}
        <button className="btn">Зберегти</button>
      </form>
    </>
  );
}
