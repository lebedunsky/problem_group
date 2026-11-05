import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import type { RegistrationRequest, Stats } from "../../types";

export function DashboardPage() {
  const stats = useApi<Stats>("/api/stats");
  const requests = useApi<RegistrationRequest[]>("/api/registrations");
  const newCount = (requests.data || []).filter((r) => r.status === "NEW" || r.status === "REVIEWING").length;

  return (
    <>
      <h1 className="serif">Огляд</h1>
      <div className="grid grid-4">
        <div className="card stat">
          <b>{stats.data?.participants ?? "—"}</b>Учасники
        </div>
        <div className="card stat">
          <b>{stats.data?.meetings ?? "—"}</b>Засідання
        </div>
        <div className="card stat">
          <b>{stats.data?.news ?? "—"}</b>Новини
        </div>
        <div className="card stat">
          <b>{newCount}</b>Заявки в роботі
        </div>
      </div>
      <p style={{ marginTop: 24 }}>
        <Link className="btn" to="/admin/requests">
          Перейти до заявок
        </Link>
      </p>
    </>
  );
}
