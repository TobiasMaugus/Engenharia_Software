
import org.apache.commons.lang3.tuple.Pair;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Objects;
import java.util.logging.LogManager;

import static ch.qos.logback.core.joran.sanity.Pair.*;

public class Vendas_TEST extends BaseTest {
	private static Logger LOGGER = LoggerFactory.getLogger(Vendas_TEST.class);

	public class Venda {
		private String vendedor;
		private String cliente;
		private List<Pair<String, Integer>> produtosVenda;

		public Venda(String vendedor, String cliente, List<Pair<String, Integer>> produtosVenda) {
			this.vendedor = vendedor;
			this.cliente = cliente;
			this.produtosVenda = produtosVenda;
		}
	}

	public void fillForm(Venda v) {
		view.click("clienteId-select");
//		view.click("")
		int i = 0;
		for (Pair<String, Integer> p : v.produtosVenda) {
			String produto = p.getLeft();
			int quantidade = p.getRight();
			view.selectDropdown("produtoId-select", produto);
			view.fill("item-quantidade-" + i, String.valueOf(quantidade));
		}
	}

	public boolean seacrh(String targetKey) {
		view.click("navbar-vendas");
		view.fill("searchbar", targetKey);
		return view.getElementString("tabe-body").contains(targetKey);
	}

	public void create(Venda v) {
		view.click("navbar-vendas");
		view.click("add-btn");
		this.fillForm(v);
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
	public void FluxoDecadastro() {
		LOGGER.trace("Iniciando fluxo de Login");
		driver.get("http://localhost:5173/");

		LOGGER.trace("Performando Login");
		view.performLogin("teste", "teste");

		if (!view.assertElementExists("log-out-btn")) {
			LOGGER.trace("Login Falhou");
			return;
		}

		LOGGER.trace("Performando Cadastro de Venda");
		Venda v = new Venda("Teste", "Ana Souza", List.of(Pair.of("Headset", 3), Pair.of("Fonte", 1)));
		create(v);
		view.handleAllert();
		if (!view.assertElementExists("navbar-venda")) {
			LOGGER.trace("Cadastro de venda Falhou");
			return;
		}

		LOGGER.trace("fluxo de Cadastro bem sucedido!");
	}
}
