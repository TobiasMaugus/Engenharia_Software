import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Cliente_TEST extends BaseTest {
	private static Logger LOGGER = LoggerFactory.getLogger(Cliente_TEST.class);

	public class Cliente {
		private String nome;
		private String telefone;
		private String cpf;

		public Cliente(String nome, String telefone, String cpf) {
			this.nome = nome;
			this.telefone = telefone;
			this.cpf = cpf;
		}
	}

	public void fillForm(Cliente c) {
		view.fill("nome-input", c.nome);
		view.fill("telefone-input", c.telefone);
		view.fill("cpf-input", c.cpf);
	}

	public void fillEditForm(Cliente c) {
		view.fill("nome-input", c.nome);
		view.fill("telefone-input", c.telefone);
	}

	public boolean seacrh(String targetKey) {
		view.click("navbar-clientes");
		view.fill("searchbar", targetKey);
		return view.getElementString("tabe-body").contains(targetKey);
	}

	public void edit(Cliente c, String editbtn) {
		view.click("navbar-produtos");
		this.seacrh(c.nome);
		view.click(editbtn);
		this.fillEditForm(c);
		view.click("salvar-btn");
	}

	public void create(Cliente c) {
		view.click("navbar-clientes");
		view.click("add-btn");
		this.fillForm(c);
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

		LOGGER.trace("Performando Cadastro de Cliente");
		Cliente c = new Cliente("Thomas", "35912344321", "165.650.816-89");
		create(c);
		view.handleAllert();
		if (!view.assertElementExists("navbar-clientes")) {
			LOGGER.trace("Cadastro de cliente Falhou");
			return;
		}

		LOGGER.trace("fluxo de Cadastro bem sucedido!");
	}

	@Test
	public void FluxoDeBusca() {
		LOGGER.trace("Iniciando fluxo de Login");
		driver.get("http://localhost:5173/");

		LOGGER.trace("Performando Login");
		view.performLogin("teste", "teste");

		if (!view.assertElementExists("log-out-btn")) {
			LOGGER.trace("Login Falhou");
			return;
		}

		LOGGER.trace("Performando Busca de Produto");
		seacrh("Thaís");
		if (!view.assertElementExists("16-edit")) {
			LOGGER.trace("Busca de produto Falhou");
			return;
		}

		LOGGER.trace("fluxo de Busca bem sucedido!");
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
		Cliente c = new Cliente("Thaís", "35912345678", "165.650.816-89");
		edit(c, "16-edit");
		view.handleAllert();
		if (!view.assertElementExists("navbar-clientes")) {
			LOGGER.trace("Edição de cliente Falhou");
			return;
		}

		LOGGER.trace("fluxo de Edição bem sucedido!");
	}

	@Test
	public void fluxoDeRemover() {
		LOGGER.trace("Iniciando fluxo de Login");
		driver.get("http://localhost:5173/");

		LOGGER.trace("Performando Login");
		view.performLogin("thais", "secret");

		if (!view.assertElementExists("log-out-btn")) {
			LOGGER.trace("Login Falhou");
			return;
		}

		LOGGER.trace("Performando Removwr Produto");
		Cliente c = new Cliente("Thaís", "35912345678", "165.650.816-89");
		delete("Thomas", "18-delete");
		view.handleAllert();
		if (!view.assertElementExists("navbar-clientes")) {
			LOGGER.trace("Excluir de cliente Falhou");
			return;
		}

		LOGGER.trace("fluxo de Exclusão bem sucedido!");
	}
}
