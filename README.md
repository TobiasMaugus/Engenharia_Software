# 🛒 Sistema Web de Vendas e Controle de Estoque

## 1. 🧭 Contexto do Problema e Solução

### 📌 Problema
Pequenos e médios comerciantes frequentemente enfrentam dificuldades no controle do estoque e no registro de vendas. Quando feitos manualmente, esses processos podem gerar erros, perda de informações, falta de visibilidade sobre o inventário e dificuldades na tomada de decisão.

### 💡 Solução
Este projeto é um **sistema web de vendas e controle de estoque**, desenvolvido com foco em simplicidade, desempenho e facilidade de uso.  
Ele permite:

- Cadastro e gerenciamento de **produtos** e **clientes**  
- Controle automático de **estoque**, atualizando quantidades conforme vendas são realizadas  
- Registro e gerenciamento de **vendas**  
- Comunicação entre **Frontend (React + Vite)** e **Backend (Spring Boot)**  
- Persistência de dados em **MySQL 8**  

O objetivo é fornecer uma solução moderna, acessível via navegador e fácil de implantar.

---

## 2. 🚀 Instruções para Uso (Usuários Finais)

As instruções abaixo são para quem **não é desenvolvedor** e apenas deseja instalar e utilizar o sistema.

---

### 📥 2.1 – Baixar o Projeto

Você pode baixar o projeto diretamente no GitHub:

1. Acesse o repositório  
2. Clique em **Code → Download ZIP**  
3. Extraia o arquivo ZIP na sua máquina  

---

### 🛠️ 2.2 – Instalando o Backend

#### ✔ Pré-requisitos
- **Java JDK 21**
- **MySQL 8.4**
- (Opcional) **IntelliJ IDEA, Eclipse ou VS Code**

#### ▶ Passos
1. Abra o terminal e acesse a pasta do backend:
```bash
cd backend
```

2. Crie o banco de dados no MYSQL:
Rode o arquivo createBD.sql

3. No arquivo application.properties, configure:
```bash
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
spring.datasource.url=jdbc:mysql://localhost:3306/BACKEND
```

4. Execute o backend:
```bash
./mvnw spring-boot:run
```
ou
```bash
mvn spring-boot:run
```
📌 O backend ficará disponível em:
👉 http://localhost:8080

### 🎨 2.3 – Instalando o Frontend
✔ Pré-requisitos
* NodeJS v20.17.0
* NPM ou Yarn

▶ Passos
1. Acesse a pasta do frontend:
```bash
cd frontend
```

3. Instale as dependências:
```bash
npm install
```
5. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

📌 O frontend ficará disponível em:
👉 http://localhost:5173

## 3. 🧑‍💻 Instruções para Desenvolvedores

Estas instruções são para quem deseja contribuir com o desenvolvimento do projeto.

### 3.1 – Clonar o Repositório
```bash
git clone https://github.com/TobiasMaugus/Engenharia_Software.git
```

### 3.2 – Instalar Dependências
Backend
```bash
cd backend
mvn install
```

Frontend
```bash
cd frontend
npm install
```

3.3 – Executar o Projeto no Ambiente de Desenvolvimento
Backend
```bash
cd backend
mvn spring-boot:run
```

Acesse:
👉 http://localhost:8080

Frontend
```bash
cd frontend
npm run dev
```

Acesse:
👉 http://localhost:5173

## 4. 🧩 Tecnologias

Este projeto foi desenvolvido utilizando as seguintes tecnologias e ferramentas:

### 🖥️ Frontend
- **React** – ^19.1.0
- **NodeJS** – v20.17.0  
- **TypeScript** – ~5.8.3  
- **Vite** – ^7.0.4  
- **Tailwind CSS** – ^4.1.11  

### ⚙️ Backend
- **Java** – JDK 21.0.6  
- **Spring Boot** – 3.5.6  

### 🗄️ Banco de Dados
- **MySQL** – 8.4

## 5. 🗂 Estrutura de Pastas

```text
/projeto/
|  /ControleEstoqueVendas
|  ├── backend                           # API Java + Spring Boot (Servidor)
|  │   ├── src/
|  │   │   ├── main/
|  │   │   │   ├── java/                 # Código-fonte principal da aplicação
|  │   │   │   └── resources/            # Arquivos de configuração e estáticos
|  │   │   └── test/                     # Classes e recursos para testes unitários
|  │   ├── pom.xml                       # Gerenciamento de dependências Maven
|  │   └── README.md
|  │
|  ├── frontend/                         # Aplicação React (Cliente/Interface do Usuário)
|  │   ├── src/
|  │   │   ├── components/               # Módulos de UI reutilizáveis
|  │   │   ├── pages/                    # Telas principais da aplicação
|  │   │   ├── types/                    # Entidades principais dos CRUDs (Cliente, Produto e Venda)
|  │   │   ├── api/ 
|  │   ├── vite.config.ts                # Configuração do bundler Vite
|  │   └── package.json                  # Metadados e dependências do Node.js
|  │
|  /Documentação                         # Documentação externa do projeto (diagramas, etc.)
|  |   ├── documentos de requisitos/     # Documentos de Requisitos
|  |   ├── outros diagramas/             # Diagramas (classe, sequência, implantação, etc)
|  |   ├── padrões adotados/             # Padrões adotados no projeto
|  |   ├── relatórios de sprint/         # Relatórios das Sprints
|  │
|  └── README.md                         # Visão geral e instruções do projeto
```

