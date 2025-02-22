import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./CadastrarLogin.css";

const CadastrarLogin = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [permissao, setPermissao] = useState(0);
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validarSenha = (senha) => {
    const regexNumero = /\d/;
    return senha.length >= 8 && regexNumero.test(senha);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha || !confirmarSenha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (!validarSenha(senha)) {
      setError("A senha deve ter no mínimo 8 caracteres e pelo menos um número.");
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não são iguais.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7140/api/Login/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha, permissao }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário.");
      }

      const data = await response.json();
      console.log("Cadastro realizado:", data);

      setSuccess("Cadastro realizado com sucesso!");
      setError("");
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");

      navigate("/ListarFuncionarios");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <div className="login-container">
      <h2>Cadastrar Usuário</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label>Nome:</label>
          <input
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>E-mail:</label>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
        <label>Permissão:</label>
        <select value={permissao} onChange={(e) => setPermissao(e.target.value)} required>
          <option value="">Selecione uma opção</option>
          <option value="3">Diretor</option>
          <option value="2">Gerente</option>
          <option value="1">Funcionário</option>
        </select>
      </div>
        <div className="input-group">
          <label>Senha:</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Confirmar Senha:</label>
          <input
            type="password"
            placeholder="Confirme sua senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        
        <div className="button-group">
          <button type="submit" className="login-button">Cadastrar</button>
          <br/>
          <br/>
          <button type="button" className="back-button" onClick={() => navigate("/ListarFuncionarios")}>
            Voltar ao Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastrarLogin;
