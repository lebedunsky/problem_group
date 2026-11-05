import type { FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { api, del } from "../../api/client";
import { Field, Modal } from "../../components/ui";

export function isoDate(value?: string) {
  if (!value) return "";
  return value.slice(0, 10);
}

export function useCrud<T extends { id: string }>(path: string) {
  const [items, setItems] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    try {
      setItems(await api<T[]>(path));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, [path]);

  async function remove(id: string) {
    if (!confirm("Видалити запис?")) return;
    try {
      await del(`${path}/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setToast("Видалено");
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return { items, error, toast, setToast, loading, reload, remove };
}

export function AdminBar({ title, onCreate }: { title: string; onCreate: () => void }) {
  return (
    <div className="list-row" style={{ marginBottom: 16 }}>
      <h1 className="serif" style={{ margin: 0 }}>
        {title}
      </h1>
      <button className="btn" onClick={onCreate}>
        Додати
      </button>
    </div>
  );
}

export function SaveForm({
  children,
  onSubmit,
  saving,
}: {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  saving: boolean;
}) {
  return (
    <form onSubmit={onSubmit}>
      {children}
      <button className="btn" disabled={saving}>
        {saving ? "Збереження…" : "Зберегти"}
      </button>
    </form>
  );
}

export { Field, Modal };
