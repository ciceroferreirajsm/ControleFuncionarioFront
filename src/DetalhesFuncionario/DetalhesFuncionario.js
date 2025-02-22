import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetalhesFuncionario.css"; 

const DetalhesFuncionario = () => {
  const { id } = useParams(); 
  const [funcionario, setFuncionario] = useState(null);
  const [mensagem, setMensagem] = useState(""); 
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    gestor: "",
    cargo: "",
    dtNascimento: "",
    telefone: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); 

    if (!token) {
      navigate("/login"); 
    } else {
      const urlDocker = `https://localhost:65124/api/Funcionario/${id}`;
      const url = `https://localhost:7140/api/Funcionario/${id}`;
      fetch(urlDocker, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const formatarData = (dataString) => {
            if (!dataString) return "";
            const [dia, mes, ano] = dataString.split(" ")[0].split("/");
            return `${ano}-${mes}-${dia}`;
          };

          setFuncionario(data);
          setFormData({
            id: data.id,
            nome: data.nome,
            sobrenome: data.sobrenome,
            email: data.email,
            gestor: data.gestor || "",
            cargo: data.cargo || "",
            dtNascimento: formatarData(data.dtNascimento),
            telefone: data.telefone || "",
            ativo: data.ativo || false,
          });
        })
        .catch((error) => {
          console.error("Erro ao buscar detalhes", error);
          setMensagem("Erro ao buscar detalhes do funcionário.");
        });
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const funcionarioAtualizado = {
      ...formData,
      id: id,
    };

    const token = localStorage.getItem("token"); 

    if (!formData.dtNascimento) {
      setMensagem("Informe a data de nascimento.");
      return;
    }
    const birthDate = new Date(formData.dtNascimento);
    if (isNaN(birthDate.getTime())) {
      setMensagem("Data de nascimento inválida.");
      return;
    }
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      setMensagem("O funcionário deve ser maior de 18 anos.");
      return;
    }

    if (!token) {
      setMensagem("Usuário não autenticado. Redirecionando para login...");
      setTimeout(() => navigate("/login"), 2000); 
      return;
    }
    const urlDocker = `https://localhost:65124/api/Funcionario/${id}`;
    const url = `https://localhost:7140/api/Funcionario/${id}`;
    fetch(urlDocker, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(funcionarioAtualizado),
    })
      .then((response) => response.json())
      .then((data) => {
        setMensagem(data.message || "Funcionário atualizado com sucesso!"); 
        setTimeout(() => navigate("/ListarFuncionarios"), 2000); 
      })
      .catch((error) => {
        console.error("Erro ao atualizar funcionário", error);
        setMensagem("Erro ao atualizar funcionário.");
      });
  };

  if (!funcionario) return <p>Carregando...</p>;

  return (
    <div className="detalhes-container">
      <h2>Detalhes do Funcionário</h2>

      {mensagem && <p className="mensagem">{mensagem}</p>} {}

      <form onSubmit={handleSubmit} className="detalhes-card">
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="sobrenome">Sobrenome:</label>
          <input
            type="text"
            id="sobrenome"
            name="sobrenome"
            value={formData.sobrenome}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="gestor">Gestor:</label>
          <input
            type="text"
            id="gestor"
            name="gestor"
            value={formData.gestor}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="cargo">Cargo:</label>
          <input
            type="text"
            id="cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="dtNascimento">Data de Nascimento:</label>
          <input
            type="date"
            id="dtNascimento"
            name="dtNascimento"
            value={formData.dtNascimento}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="telefone">Telefone:</label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-atualizar">
          Atualizar
        </button>
      </form>

      <br />
      <button className="btn-voltar" onClick={() => navigate("/ListarFuncionarios")}>
        Voltar à Listagem
      </button>
    </div>
  );
};

export default DetalhesFuncionario;
