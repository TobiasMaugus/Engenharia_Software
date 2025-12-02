import "./App.css";
import Header from "./Components/Header.tsx";
import Footer from "./Components/Footer.tsx";
import Navbar from "./Components/Navbar.tsx";
import Bg from "./Components/Bg";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "./Pages/Login/LoginForm";
import VendaBody from "./Pages/Venda/VendaBody";
import ProdutoBody from "./Pages/Produto/ProdutoBody";
import ClienteBody from "./Pages/Cliente/ClienteBody";
import ExcluirVenda from "./Pages/Venda/ExcluirVenda";
import EditarVenda from "./Pages/Venda/EditarVenda";
import CadastrarVenda from "./Pages/Venda/CadastrarVenda";
import VisualizarVenda from "./Pages/Venda/VisualizarVenda";
import ExcluirProduto from "./Pages/Produto/ExcluirProduto";
import EditarProduto from "./Pages/Produto/EditarProduto";
import CadastrarProduto from "./Pages/Produto/CadastrarProduto";
import ExcluirCliente from "./Pages/Cliente/ExcluirCliente";
import EditarCliente from "./Pages/Cliente/EditarCliente";
import CadastrarCliente from "./Pages/Cliente/CadastrarCliente";

function App() {
  return (
    <Router>
      <Bg>
        <div className="main-container">
            <Header />
            <Routes>
                <Route path="/" element={<LoginForm />} />

                {/* VENDAS */}
                <Route path="Vendas" element={<VendaBody />} />
                <Route path="Vendas/ExcluirVenda/:id" element={<ExcluirVenda />} />
                <Route path="Vendas/EditarVenda/:id" element={<EditarVenda />} />
                <Route path="Vendas/CadastrarVenda" element={<CadastrarVenda />} />
                <Route path="Vendas/VisualizarVenda/:id" element={<VisualizarVenda />} />

                {/* PRODUTOS */}
                <Route path="Produtos" element={<ProdutoBody />} />
                <Route path="Produtos/ExcluirProduto/:id" element={<ExcluirProduto />} />
                <Route path="Produtos/EditarProduto/:id" element={<EditarProduto />} />
                <Route path="Produtos/CadastrarProduto" element={<CadastrarProduto />} />

                {/* CLIENTES */}
                <Route path="Clientes" element={<ClienteBody />} />
                <Route path="Clientes/ExcluirCliente/:id" element={<ExcluirCliente />} />
                <Route path="Clientes/EditarCliente/:id" element={<EditarCliente />} />
                <Route path="Clientes/CadastrarCliente" element={<CadastrarCliente />} />
            </Routes>

            <Footer />
        </div>
      </Bg>
    </Router>
  );
}

export default App;
