import { useState } from "react";
import { api, mediaUrl } from "../../api/client";
import { Field } from "../../components/ui";

function looksLikeImage(url: string) {
  return /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(url);
}

export function FileField({
  label,
  value,
  onChange,
  accept,
  placeholder = "Або вставте посилання",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  placeholder?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const showPreview = Boolean(value) && (accept?.includes("image") || looksLikeImage(value));

  async function onFile(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api<{ url: string }>("/api/uploads", { method: "POST", body: form });
      onChange(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося завантажити файл");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Field label={label}>
      <input type="file" accept={accept} disabled={busy} onChange={(e) => onFile(e.target.files?.[0])} />
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ marginTop: 8 }}
      />
      {busy && <p className="muted">Завантаження…</p>}
      {error && <p className="error-box">{error}</p>}
      {showPreview && (
        <img src={mediaUrl(value)} alt="" style={{ marginTop: 8, maxWidth: 180, maxHeight: 120, borderRadius: 8 }} />
      )}
      {value && !showPreview && (
        <p className="muted" style={{ marginTop: 8 }}>
          <a href={mediaUrl(value)} target="_blank" rel="noreferrer">
            Відкрити файл
          </a>
        </p>
      )}
    </Field>
  );
}
