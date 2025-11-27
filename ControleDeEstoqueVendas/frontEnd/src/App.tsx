import "./App.css";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import Bg from "./Components/Bg";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "./Components/Pages/Login/LoginForm";
import VendaBody from "./Components/Pages/Venda/VendaBody";
import ProdutoBody from "./Components/Pages/Produto/ProdutoBody";
import ClienteBody from "./Components/Pages/Cliente/ClienteBody";
import ExcluirVenda from "./Components/Pages/Venda/ExcluirVenda";
import EditarVenda from "./Components/Pages/Venda/EditarVenda";
import CadastrarVenda from "./Components/Pages/Venda/CadastrarVenda";
import VisualizarVenda from "./Components/Pages/Venda/VisualizarVenda";
import ExcluirProduto from "./Components/Pages/Produto/ExcluirProduto";
import EditarProduto from "./Components/Pages/Produto/EditarProduto";
import CadastrarProduto from "./Components/Pages/Produto/CadastrarProduto";
import ExcluirCliente from "./Components/Pages/Cliente/ExcluirCliente";
import EditarCliente from "./Components/Pages/Cliente/EditarCliente";
import CadastrarCliente from "./Components/Pages/Cliente/CadastrarCliente";

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
