import core.WebUtils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import org.openqa.selenium.By;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GeoProcess_TEST extends BaseTest {
	private static final Logger LOGGER = LoggerFactory.getLogger(GeoProcess_TEST.class);

	//--------------------------------------------------CLASSES---------------------------------------------------------
	public class LoginForm {
		private String usuario;
		private String senha;

		public LoginForm(String usuario, String senha) {
			this.usuario = usuario;
			this.senha = senha;
		}
	}

	//--------------------------------------------------FUNCTIONS-------------------------------------------------------
	public void performLogin(LoginForm form) {
		WebUtils.fill(wait, "username", form.usuario);
		WebUtils.fill(wait, "password", form.senha);

		WebUtils.click(wait, By.className("btn-success"));
	}

	public void navigateToByLinkText(String linkText) {
		WebUtils.click(wait, By.linkText(linkText));
	}


	//-----------------------------------------------------TEST---------------------------------------------------------
	@Test
	public void testGeoProcess() {
		boolean validator = false;
		driver.get("https://geoprocess.ima.dac.ufla.br/");
		LoginForm loginForm = new LoginForm("luizsouza", "@@Rutch3@@");

		LOGGER.trace("Realizando Login por nome de usuário");
		performLogin(loginForm);

		LOGGER.trace("Navegando para página do Projeto IMA");
		navigateToByLinkText("Projeto IMA");

		LOGGER.trace("Navegando para a página de Dados de Situações de Emergência");
		navigateToByLinkText("Dados para Situações de Emergência");

		Assertions.assertTrue(validator, "Teste de Busca de Dados de Emergência falhou");
	}
}
