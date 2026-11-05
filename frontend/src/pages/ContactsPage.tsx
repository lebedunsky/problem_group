import { ErrorBox, Spinner } from "../components/ui";
import { useApi } from "../hooks/useApi";
import type { GroupSettings } from "../types";

export function ContactsPage() {
  const { data, loading, error } = useApi<GroupSettings>("/api/settings");
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} />;
  if (!data) return null;
  return (
    <main className="page">
      <div className="container grid grid-2">
        <div>
          <h1 className="page-title">Контакти</h1>
          <div className="card">
            <p>
              <strong>Email:</strong> {data.email}
            </p>
            <p>
              <strong>Телефон:</strong> {data.phone}
            </p>
            <p>
              <strong>Адреса:</strong> {data.address}
            </p>
            <p>
              <strong>Графік:</strong> {data.scheduleNote}
            </p>
            <p>
              <strong>Керівник:</strong> {data.leaderName}, {data.leaderTitle}
            </p>
          </div>
        </div>
        <div className="card">
          <h3 className="serif">Як долучитися</h3>
          <p>Надішліть заявку через форму реєстрації. Після розгляду керівник додасть вас до складу групи.</p>
        </div>
      </div>
    </main>
  );
}
