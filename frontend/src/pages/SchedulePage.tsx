import { useMemo, useState } from "react";
import { Badge, Empty, ErrorBox, Spinner } from "../components/ui";
import { useApi } from "../hooks/useApi";
import { formatDate, fullName, scheduleStatus } from "../lib/labels";
import type { ScheduleItem } from "../types";

export function SchedulePage() {
  const { data, loading, error } = useApi<ScheduleItem[]>("/api/schedule");
  const [view, setView] = useState<"list" | "calendar">("list");
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;
  const items = data || [];

  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title">Графік роботи</h1>
        <div className="filters">
          <button className={`btn ${view === "list" ? "" : "ghost"}`} onClick={() => setView("list")}>
            Список
          </button>
          <button className={`btn ${view === "calendar" ? "" : "ghost"}`} onClick={() => setView("calendar")}>
            Календар
          </button>
        </div>
        {items.length === 0 && <Empty title="Графік ще не опубліковано" />}
        {view === "list" && items.length > 0 && (
          <div className="grid">
            {items.map((i) => (
              <article className="card list-row" key={i.id}>
                <div>
                  <h3 className="serif" style={{ marginTop: 0 }}>
                    {i.topic}
                  </h3>
                  <p>
                    {formatDate(i.date)} · {i.time} · {i.location}
                  </p>
                  <p className="muted">
                    Відповідальний: {i.responsible ? fullName(i.responsible) : "—"}
                  </p>
                </div>
                <Badge value={i.status} map={scheduleStatus} />
              </article>
            ))}
          </div>
        )}
        {view === "calendar" && <MonthCalendar items={items} />}
      </div>
    </main>
  );
}

function MonthCalendar({ items }: { items: ScheduleItem[] }) {
  const base = items[0] ? new Date(items[0].date) : new Date();
  const year = base.getFullYear();
  const month = items.some((i) => new Date(i.date) >= new Date())
    ? new Date(items.find((i) => new Date(i.date) >= new Date())!.date).getMonth()
    : base.getMonth();
  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: last }, (_, i) => i + 1).map((d) => ({
      d,
      items: items.filter((it) => {
        const dt = new Date(it.date);
        return dt.getFullYear() === year && dt.getMonth() === month && dt.getDate() === d;
      }),
    }));
  }, [items, year, month]);

  return (
    <>
      <p className="muted">
        {new Intl.DateTimeFormat("uk-UA", { month: "long", year: "numeric" }).format(new Date(year, month, 1))}
      </p>
      <div className="calendar">
        {days.map((day) => (
          <div className="cal-day" key={day.d}>
            <b>{day.d}</b>
            {day.items.map((i) => (
              <div className="cal-item" key={i.id}>
                {i.time} {i.topic}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
