import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Produtos_TEST extends BaseTest {
	private static final Logger LOGGER = LoggerFactory.getLogger(Produtos_TEST.class);

	public class Produto {
		private long id;
		private String nome;
		private String categoria;
		private String preco;
	}

	public void fillForm(Produto p) {
		view.fill("nome-input", p.nome);
		view.fill("categoria-input", p.categoria);
		view.fill("preco-input", p.preco);
	}

	public void create(Produto p) {
		view.click("navbar-produtos");
		view.click("add-btn");
		this.fillForm(p);
		view.click("salvar-btn");
	}

	public boolean seacrh(String targetKey) {
		view.click("navbar-produtos");
		view.fill("searchbar", targetKey);
		return view.getElementString("table-body").contains(targetKey);
	}

	public void delete(String targetKey) {
		if(this.seacrh(targetKey)) {
			view.click("delete-btn");
		}

	}

	public void FluxoCompletoProdutos() {

	}
}
