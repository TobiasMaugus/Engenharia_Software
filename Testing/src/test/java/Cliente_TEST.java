import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.encoder.PatternLayoutEncoder;
import ch.qos.logback.core.FileAppender;
import core.JJUtils;

public class Cliente_TEST extends BaseTest {
	private static Logger LOGGER = LoggerFactory.getLogger(Cliente_TEST.class);

	public static class Cliente {
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
		LOGGER.trace("Abrindo aba de Cliente");
		view.click("navbar-clientes");
		LOGGER.trace("Clicando no botão de adicionar");
		view.click("add-btn");
		LOGGER.trace("Preenchendo formulário de cadastro com os dados do cliemte");
		this.fillForm(c);
		LOGGER.trace("Clicando no botão de salvar");
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
	public void FluxoDeCadastroDeCliente() {
		String username = "teste";
		String password = "teste";

		LOGGER.trace("Iniciando de Login no sistema");
		driver.get("http://localhost:5173/");
		LOGGER.trace("Performando Login com as credenciais:" +
				"\nUsename: " + username +
				"\nPassword: " + password);
		view.performLogin(username, password);

		Cliente c = new Cliente("Thomas", "35912344321", "165.650.816-89");
		LOGGER.trace("Performando Cadastrar de Cliente de dados:" +
				"\nNome: " + c.nome +
				"\nTelefone: " + c.telefone +
				"\nCPF: " + c.cpf);
		create(c);
		LOGGER.trace("Confirmando warning de sucesso!");
		view.handleAllert();

		if (!view.assertElementExists("navbar-clientes")) {
			LOGGER.trace("Cadastro de cliente Falhou");
			return;
		}
		LOGGER.trace("fluxo 'Cadastro de Cliente' bem sucedido!");
		LOGGER.trace("Encerrando rotina de teste");
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
