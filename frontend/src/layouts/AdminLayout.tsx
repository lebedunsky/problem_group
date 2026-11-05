import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, getToken, setToken } from "../api/client";

const links = [
  ["/admin", "Огляд"],
  ["/admin/participants", "Учасники"],
  ["/admin/requests", "Заявки"],
  ["/admin/meetings", "Засідання"],
  ["/admin/plan", "План роботи"],
  ["/admin/schedule", "Графік"],
  ["/admin/results", "Результати"],
  ["/admin/news", "Новини"],
  ["/admin/materials", "Матеріали"],
  ["/admin/settings", "Налаштування"],
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      navigate("/admin/login");
      return;
    }
    api("/api/auth/me")
      .then(() => setReady(true))
      .catch(() => {
        setToken(null);
        navigate("/admin/login");
      });
  }, [navigate]);

  if (!ready) return <div className="loading">Перевірка доступу…</div>;

  return (
    <div className="admin">
      <aside className="admin-nav">
        <strong className="brand" style={{ padding: "0 10px 16px", display: "block" }}>
          Адмін-панель
        </strong>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === "/admin"}>
            {label}
          </NavLink>
        ))}
        <NavLink to="/">На сайт</NavLink>
        <button
          className="btn ghost"
          style={{ margin: "16px 10px", width: "calc(100% - 20px)" }}
          onClick={() => {
            setToken(null);
            navigate("/admin/login");
          }}
        >
          Вийти
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
