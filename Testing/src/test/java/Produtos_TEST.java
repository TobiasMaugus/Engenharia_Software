import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.encoder.PatternLayoutEncoder;
import ch.qos.logback.core.FileAppender;
import core.JJUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.Date;

public class Produtos_TEST extends BaseTest {
	private static Logger LOGGER = LoggerFactory.getLogger(Produtos_TEST.class);

	public class Produto {
		private String nome;
		private String categoria;
		private Double preco;
		private int estoque;

		public Produto(String nome, String categoria, Double preco, int estoque) {
			this.nome = nome;
			this.categoria = categoria;
			this.preco = preco;
			this.estoque = estoque;
		}
	}

	public void fillForm(Produto p) {
		view.fill("nome-input", p.nome);
		view.fill("categoria-input", p.categoria);
		view.fill("preco-input", String.valueOf(p.preco));
		view.fill("estoque-input", String.valueOf(p.estoque));
		view.fill("estoque-input", String.valueOf(p.estoque));
	}

	public boolean seacrh(String targetKey) {
		view.click("navbar-produtos");
		view.fill("searchbar", targetKey);
		return view.getElementString("tabe-body").contains(targetKey);
	}

	public void create(Produto p) {
		view.click("navbar-produtos");
		view.click("add-btn");
		this.fillForm(p);
		view.click("salvar-btn");
	}

	public void edit(Produto p, String editbtn) {
		view.click("navbar-produtos");
		this.seacrh(p.nome);
		view.click(editbtn);
		this.fillForm(p);
		view.click("salvar-btn");
	}

	public void delete(String targetKey, String deleteBtnId) {
		if (this.seacrh(targetKey)) {
			view.click(deleteBtnId);
			view.click("confirm-btn");
		} else {
			LOGGER.trace("Elemento não encontrado");
		}

	}

	@Test
	public void FluxoDeCadastro() {
		LOGGER.trace("Iniciando fluxo de Login");
		driver.get("http://localhost:5173/");

		LOGGER.trace("Performando Login");
		view.performLogin("teste", "teste");

		if (!view.assertElementExists("log-out-btn")) {
			LOGGER.trace("Login Falhou");
			return;
		}

		LOGGER.trace("Performando Cadastro de Produto");
		Produto p = new Produto("Mesa","Itens",75.50, 50);
		create(p);
		view.handleAllert();
		if(!view.assertElementExists("navbar-produtos")) {
			LOGGER.trace("Cadastro de produto Falhou");
			return;
		}

		LOGGER.trace("fluxo de Cadastro bem sucedido!");
	}

	@Test
	public void fluxoDeBusca() {
		LOGGER.trace("Iniciando fluxo de Login");
		driver.get("http://localhost:5173/");

		LOGGER.trace("Performando Login");
		view.performLogin("teste", "teste");

		if (!view.assertElementExists("log-out-btn")) {
			LOGGER.trace("Login Falhou");
			return;
		}

		LOGGER.trace("Performando Busca de Produto");
		seacrh("Mouse Game");
		if(!view.assertElementExists("2-edit")) {
			LOGGER.trace("Busca de produto Falhou");
			return;
		}

		LOGGER.trace("fluxo de Busca bem sucedido!");
	}

	@Test
	public void fluxoDeDeletar() {
		LOGGER.trace("Iniciando fluxo de Login");
		driver.get("http://localhost:5173/");

		LOGGER.trace("Performando Login");
		view.performLogin("teste", "teste");

		if (!view.assertElementExists("log-out-btn")) {
			LOGGER.trace("Login Falhou");
			return;
		}

		LOGGER.trace("Performando Deletar Produto");
		delete("Mesa", "20-delete");
		if(!view.assertElementExists("navbar-produtos")) {
			LOGGER.trace("Busca de produto Falhou");
			return;
		}

		LOGGER.trace("fluxo de Deletar bem sucedido!");
	}

	@Test
	public void fluxoDeEdicao() {
		LOGGER.trace("Iniciando fluxo de Login");
		driver.get("http://localhost:5173/");

		LOGGER.trace("Performando Login");
		view.performLogin("thais", "secret");

		if (!view.assertElementExists("log-out-btn")) {
			LOGGER.trace("Login Falhou");
			return;
		}

		LOGGER.trace("Performando Edição de Produto");
		Produto p = new Produto("Mesa","Itens",75.50, 52);
		edit(p, "21-edit");
		view.handleAllert();
		if(!view.assertElementExists("navbar-produtos")) {
			LOGGER.trace("Edição de produto Falhou");
			return;
		}

		LOGGER.trace("fluxo de Editar bem sucedido!");
	}
}
