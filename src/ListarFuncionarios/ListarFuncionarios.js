import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ListarFuncionarios.css";

const ListagemFuncionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); 
    } else {
      fetchFuncionarios(token); 
    }
  }, [navigate]);

  const fetchFuncionarios = (token) => {
    setLoading(true);
    fetch("https://localhost:7140/api/Funcionario", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem("token"); 
          navigate("/login"); 
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          setFuncionarios(data);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar funcionários", error);
        setMensagem("Erro ao buscar funcionários.");
      })
      .finally(() => setLoading(false)); 
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      navigate("/login");
      return;
    }
    if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
      setLoading(true);
      fetch(`https://localhost:7140/api/Funcionario/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao excluir funcionário");
          }
          return response.json();
        })
        .then((data) => {
          setMensagem(data.message || "Funcionário excluído com sucesso!");
          setFuncionarios(funcionarios.filter((func) => func.id !== id));
        })
        .catch((error) => {
          console.error("Erro ao excluir funcionário", error);
          setMensagem("Erro ao excluir funcionário.");
        })
        .finally(() => setLoading(false));
    }
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="listagem-container">
      <div className="header">
        <h2>Listagem de Funcionários</h2>
      </div>

      {mensagem && <p className="mensagem fade-in">{mensagem}</p>}
      <Link to="/cadastrarFuncionario" className="btn btn-cadastrar">
        Cadastrar Funcionário
      </Link>
      {loading && <p className="loading">Carregando...</p>}

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Gestor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((funcionario) => (
            <tr key={funcionario.id}>
              <td>{funcionario.nome} {funcionario.sobrenome}</td>
              <td>{funcionario.email}</td>
              <td>{funcionario.gestor || "Nenhum"}</td>
              <td style={{ display: "flex", gap: "8px" }}>
                <Link to={`/DetalhesFuncionario/${funcionario.id}`} className="btn btn-detalhes">
                  Detalhes
                </Link>
                <button className="btn btn-excluir" onClick={() => handleDelete(funcionario.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="header-btn">
        <button className="btn btn-sair" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  );
};

export default ListagemFuncionarios;
