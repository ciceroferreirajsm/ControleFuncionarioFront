import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login/Login.js";
import CadastrarFuncionario from "./CadastrarFuncionario/CadastrarFuncionario.js";
import CadastrarLogin from "./CadastrarLogin/CadastrarLogin.js";
import ListarFuncionarios from "./ListarFuncionarios/ListarFuncionarios.js";
import DetalhesFuncionario from "./DetalhesFuncionario/DetalhesFuncionario.js";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
        <Route path="/CadastrarFuncionario" element={<CadastrarFuncionario />} />
        <Route path="/CadastrarLogin" element={<CadastrarLogin />} />
        <Route path="/ListarFuncionarios" element={<ListarFuncionarios />} />
        <Route path="/DetalhesFuncionario/:id" element={<DetalhesFuncionario />} />
      </Routes>
    </Router>
  );
}

export default App;
