# Controle Funcionario

Este repositório contém o frontend e backend para o gerenciamento de funcionários. A aplicação permite que os usuários se registrem, façam login, e gerenciem informações de funcionários com funcionalidades de adicionar, listar, atualizar e deletar.

## Tecnologias Utilizadas

### Backend:
- **ASP.NET Core**: Framework para desenvolvimento de APIs RESTful.
- **JWT**: Para autenticação baseada em token.
- **Entity Framework Core**: ORM para interação com o banco de dados.
- **SQL Server**: Banco de dados relacional.

### Frontend:
- **React**: Framework JavaScript para construir interfaces de usuário.
- **React Router**: Biblioteca para roteamento entre páginas.
- **Axios**: Cliente HTTP para interagir com o backend.
- **JWT (JSON Web Tokens)**: Utilizado para autenticação de usuários.

## Funcionalidades do Backend

O backend oferece uma API RESTful para gerenciamento de usuários e funcionários.

### 1. **Login**
- **Rota de backend**: `/api/login/logar`
  - Método: POST
  - Payload:
    ```json
    {
      "email": "user@example.com",
      "senha": "senha123"
    }
    ```
- **Rota de registro**: `/api/login/registrar`
  - Método: POST
  - Payload:
    ```json
    {
      "nome": "Funcionario Nome",
      "email": "user@example.com",
      "senha": "senha123"
    }
    ```

### 2. **Funcionario**
- **Registrar Funcionario**
  - **Rota de backend**: `/api/funcionario/registrar`
  - Método: POST
  - Payload:
    ```json
    {
      "nome": "Nome do Funcionario",
      "sobrenome": "Sobrenome",
      "email": "email@exemplo.com",
      "cargo": "Cargo",
      "telefone": "1234567890",
      "gestor": true,
      "documento": "123456789",
      "senha": "senha123",
      "dt_nascimento": "1990-01-01",
      "permissao": "admin"
    }
    ```

- **Listar Funcionarios**
  - **Rota de backend**: `/api/funcionario`
  - Método: GET

- **Detalhes do Funcionario**
  - **Rota de backend**: `/api/funcionario/{id}`
  - Método: GET

- **Atualizar Funcionario**
  - **Rota de backend**: `/api/funcionario/{id}`
  - Método: PUT

- **Deletar Funcionario**
  - **Rota de backend**: `/api/funcionario/{id}`
  - Método: DELETE

## Estrutura do Projeto



## Frontend - Controle Funcionario

### Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/ciceroferreirajsm/ControleFuncionarioFront.git


npm install


REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_JWT_SECRET=seu_token_secreto_aqui


npm start


import axios from 'axios';

// Obtendo o token do localStorage
const token = localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Exemplo de requisição GET para listar funcionários
axiosInstance.get('/funcionario')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

