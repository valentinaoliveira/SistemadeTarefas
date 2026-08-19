import { Link } from "react-router";

function NotFound() {
  return (
    <div>
      <h1>404</h1>

      <p>Página não encontrada.</p>

      <Link to="/">
        Voltar para o login
      </Link>
    </div>
  );
}

export default NotFound;