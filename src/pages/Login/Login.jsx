import { useAuth } from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleFakeLogin(event) {
    event.preventDefault();
    login({ id: "123", email: "demo@squash.app" });
    navigate("/dashboard");
  }

  return (
    <main className="login">
      <div className="login__card fade-in">
        <h1 className="login__title">Login</h1>

        <button className="login__button" onClick={handleFakeLogin}>
          Log in as Demo User
        </button>
      </div>
    </main>
  );
}

export default Login;
