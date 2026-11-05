import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import type { GroupSettings } from "../types";

const links = [
  ["/", "Головна"],
  ["/about", "Про групу"],
  ["/participants", "Учасники"],
  ["/plan", "План роботи"],
  ["/schedule", "Графік"],
  ["/meetings", "Засідання"],
  ["/results", "Результати"],
  ["/news", "Новини"],
  ["/materials", "Матеріали"],
  ["/register", "Реєстрація"],
  ["/contacts", "Контакти"],
];

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useApi<GroupSettings>("/api/settings");

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark">DB</span>
            <span>{settings?.name || "DataLab"}</span>
          </NavLink>
          <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Меню">
            Меню
          </button>
          <nav className={`nav ${open ? "open" : ""}`}>
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>
                {label}
              </NavLink>
            ))}
            <NavLink to="/admin/login" onClick={() => setOpen(false)}>
              Вхід
            </NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <strong>{settings?.name}</strong>
            <p className="muted">{settings?.topic}</p>
          </div>
          <div>
            <div>{settings?.email}</div>
            <div>{settings?.address}</div>
          </div>
        </div>
      </footer>
    </>
  );
}
