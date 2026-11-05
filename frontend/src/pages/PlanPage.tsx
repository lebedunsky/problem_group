import { useState } from "react";
import { Badge, Empty, ErrorBox, Spinner } from "../components/ui";
import { useApi } from "../hooks/useApi";
import { formatDate, fullName, planStatus } from "../lib/labels";
import type { WorkPlanItem } from "../types";

export function PlanPage() {
  const { data, loading, error } = useApi<WorkPlanItem[]>("/api/work-plan");
  const [status, setStatus] = useState("");
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;
  const items = (data || []).filter((i) => !status || i.status === status);

  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title">План роботи</h1>
        <div className="filters">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Усі статуси</option>
            {Object.entries(planStatus).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        {items.length === 0 ? (
          <Empty title="План порожній" />
        ) : (
          <div className="table-wrap card" style={{ padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Тема</th>
                  <th>Тип</th>
                  <th>Відповідальний</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td>{formatDate(i.date)}</td>
                    <td>
                      <strong>{i.title}</strong>
                      <div className="muted">{i.description}</div>
                    </td>
                    <td>{i.workType}</td>
                    <td>{i.responsible ? fullName(i.responsible) : "—"}</td>
                    <td>
                      <Badge value={i.status} map={planStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
