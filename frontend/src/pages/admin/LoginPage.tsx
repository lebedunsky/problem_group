import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { post, setToken } from "../../api/client";
import { Field } from "../../components/ui";

export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    try {
      const res = await post<{ token: string }>("/api/auth/login", {
        login: form.get("login"),
        password: form.get("password"),
      });
      setToken(res.token);
      navigate("/admin");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 420 }}>
        <h1 className="page-title">Вхід адміністратора</h1>
        <form className="card" onSubmit={onSubmit}>
          <Field label="Логін">
            <input name="login" required autoComplete="username" />
          </Field>
          <Field label="Пароль">
            <input name="password" type="password" required autoComplete="current-password" />
          </Field>
          {error && <p className="error-box">{error}</p>}
          <button className="btn" disabled={loading}>
            {loading ? "Вхід…" : "Увійти"}
          </button>
        </form>
      </div>
    </main>
  );
}
