import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  
import "./Login.css"; 
import gatinhoImg from './gatinho.png';

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    // Remove o token quando o componente de login for carregado
    localStorage.removeItem("token");
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
  
    if (!email || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    const urlDocker = "https://localhost:65124/api/Login/logar";
    const url = "https://localhost:7140/api/Login/logar";
    fetch(urlDocker, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Credenciais inválidas. Verifique seu email e senha.");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        navigate("/ListarFuncionarios");
      })
      .catch((error) => {
        setError(error.message);
      });
    
  };
  
  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (!email || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    const urlDocker = "https://localhost:65124/api/Login/registrar";
    const url = "https://localhost:7140/api/Login/registrar";
    fetch(urlDocker, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erro ao criar conta");
        }
      })
      .then((data) => {
        console.log("Cadastro bem-sucedido:", data);
        alert("Conta criada com sucesso!");
        navigate("/ListarFuncionarios");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const redirectToCadastroFuncionario = () => {
    navigate("/CadastrarLogin"); // Redireciona para a rota de cadastroFuncionario
  };

  return (
    <div className="login-container">
      <div className="welcome-image-container">
      <img src={gatinhoImg} alt="Boas-vindas" className="welcome-image" />

      </div>

      <h2>{isRegistering ? "Cadastro" : "Login"}</h2>
      <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-button">{isRegistering ? "Cadastrar" : "Entrar"}</button>
      </form>

      <div className="toggle-container">
        <p>
          {isRegistering ? (
            <>
              Já tem uma conta?{" "}
              <button onClick={() => setIsRegistering(false)}>Faça login</button>
            </>
          ) : (
            <>
              Não tem uma conta?{" "}
              <button onClick={redirectToCadastroFuncionario}>Cadastre-se</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
