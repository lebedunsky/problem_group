import type { ReactNode } from "react";

export function Spinner() {
  return <div className="loading">Завантаження…</div>;
}

export function Empty({ title, text }: { title: string; text?: string }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      {text && <p className="muted">{text}</p>}
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return <div className="error-box">{message}</div>;
}

export function Badge({ value, map }: { value: string; map?: Record<string, string> }) {
  const tone =
    value === "DONE" || value === "APPROVED" || value === "PUBLISHED" || value === "COMPLETED" || value === "CONFIRMED"
      ? "ok"
      : value === "REJECTED" || value === "CANCELLED"
        ? "danger"
        : value === "IN_PROGRESS" || value === "REVIEWING"
          ? "warn"
          : value === "NEW" || value === "PLANNED"
            ? "gold"
            : "navy";
  return <span className={`badge ${tone}`}>{map?.[value] || value}</span>;
}

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="list-row">
          <h3 className="serif" style={{ marginTop: 0 }}>
            {title}
          </h3>
          <button className="btn ghost" onClick={onClose}>
            Закрити
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}
