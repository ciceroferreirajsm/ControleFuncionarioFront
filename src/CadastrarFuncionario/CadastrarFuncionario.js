import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CadastrarFuncionario.css";

function App() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    gestor: "",
    telefone: "",
    sobrenome: "",
    documento: "",
    cargo: "",
    dtNascimento: "",
    permissao: ""
  });
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token ", token)
    if (!token) {
      navigate("/login"); 
    } else {
      const isTokenValid = validateToken(token);
      if (!isTokenValid) {
        localStorage.removeItem("token"); 
        navigate("/login"); 
      }
    }
  }, [navigate]);

  const validateToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expDate = new Date(payload.exp * 1000); 
      return expDate > new Date(); 
    } catch (e) {
      return false; 
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (senha.length < 8 || !/\d/.test(senha)) {
      setError("A senha deve ter no mínimo 8 caracteres e conter pelo menos um número.");
      return;
    }
    if (senha !== confirmarSenha) {
      setError("As senhas não conferem.");
      return;
    }
  
    if (!formData.dtNascimento) {
      setError("Informe a data de nascimento.");
      return;
    }
    const birthDate = new Date(formData.dtNascimento);
    if (isNaN(birthDate.getTime())) {
      setError("Data de nascimento inválida.");
      return;
    }
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      setError("O funcionário deve ser maior de 18 anos.");
      return;
    }
  
    setError("");
  
    const dataToSend = { ...formData, senha };
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }
  
    try {
      const urlDocker = "https://localhost:65124/api/Funcionario";
      const url = "https://localhost:7140/api/Funcionario";
      const response = await fetch(urlDocker, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.Permissao?.errors?.[0]?.errorMessage || "Erro ao cadastrar funcionário";
        setError(errorMessage); 
        return;
      }
  
      const data = await response.json();
      console.log("Funcionário cadastrado:", data);
      alert("Funcionário cadastrado com sucesso!");
  
      setFormData({
        nome: "",
        email: "",
        gestor: "",
        telefone: "",
        sobrenome: "",
        documento: "",
        dtNascimento: "",
        permissao: ""
      });
      setSenha("");
      setConfirmarSenha("");

      navigate("/ListarFuncionarios");
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao cadastrar funcionário. Tente novamente.");
    }
  };
  
  

  return (
    <div className="App">
      <h2>Cadastro de Funcionário</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Sobrenome:</label>
          <input
            type="text"
            name="sobrenome"
            value={formData.sobrenome}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Gestor:</label>
          <input
            type="text"
            name="gestor"
            value={formData.gestor}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Telefone:</label>
          <input
            type="telephone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Documento:</label>
          <input
            type="text"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Cargo:</label>
          <input
            type="text"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label>Permissão:</label>
          <select
            name="permissao"
            value={formData.permissao}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma opção</option>
            <option value="3">Diretor</option>
            <option value="2">Lider</option>
            <option value="1">Funcionário</option>
          </select>
        </div>
        
        {/* Container para os campos de senha */}
        <div className="senha-group">
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
        </div>
        
        <div>
          <label>Data de Nascimento:</label>
          <input
            type="date"
            name="dtNascimento"
            value={formData.dtNascimento}
            onChange={handleChange}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Cadastrar</button>
      </form>
      <br />
      <br />      
      <button onClick={() => navigate("/ListarFuncionarios")} className="back-button">
        Voltar a Listagem
      </button>
    </div>
  );
}

export default App;
