import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Para acessar o ID da URL e navegar
import "./DetalhesFuncionario.css"; // Adicione um arquivo CSS para estilizar

const DetalhesFuncionario = () => {
  const { id } = useParams(); // Pega o id da URL
  const [funcionario, setFuncionario] = useState(null);
  const [mensagem, setMensagem] = useState(""); // Estado para armazenar a mensagem da API
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
      fetch(`https://localhost:7140/api/Funcionario/${id}`, {
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

    if (!token) {
      setMensagem("Usuário não autenticado. Redirecionando para login...");
      setTimeout(() => navigate("/login"), 2000); 
      return;
    }

    fetch(`https://localhost:7140/api/Funcionario/${id}`, {
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
