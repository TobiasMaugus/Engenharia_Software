package com.tobias.controleestoquevendas.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tobias.controleestoquevendas.model.Cliente;
import com.tobias.controleestoquevendas.repository.ClienteRepository;
import com.tobias.controleestoquevendas.security.JwtAuthenticationFilter;
import com.tobias.controleestoquevendas.service.ClienteService;
import com.tobias.controleestoquevendas.service.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringBootVersion;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class ClienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ClienteService service;

    @MockBean
    private ClienteRepository clienteRepository;

    @MockBean
    private TokenService tokenService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private Cliente cliente;

    @BeforeEach
    void setup() {
        cliente = new Cliente(
                1L,
                "João Silva",
                "12345678909",
                "999999999",
                null
        );
    }

    // -----------------------------
    // TESTE 1: Criar cliente
    // -----------------------------
    @Test
    void deveCriarClienteComSucesso() throws Exception {

        when(clienteRepository.existsByCpf(cliente.getCpf()))
                .thenReturn(false);

        when(clienteRepository.save(any(Cliente.class)))
                .thenReturn(cliente);

        mockMvc.perform(post("/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cliente)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("João Silva"))
                .andExpect(jsonPath("$.cpf").value("12345678909"));
    }

    // -----------------------------
    // TESTE 2: Buscar todos
    // -----------------------------
    @Test
    void deveListarClientes() throws Exception {

        when(service.listarClientes())
                .thenReturn(Collections.singletonList(cliente));

        mockMvc.perform(get("/clientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("João Silva"));
    }

    // -----------------------------
    // TESTE 3: Atualizar cliente
    // -----------------------------
    @Test
    void deveAtualizarCliente() throws Exception {

        Cliente atualizado = new Cliente(
                1L,
                "Maria Souza",
                "98765432100",
                "888888888",
                null
        );

        when(service.buscarPorId(1L))
                .thenReturn(Optional.of(cliente));

        when(service.atualizarCliente(any(Cliente.class)))
                .thenReturn(atualizado);

        mockMvc.perform(put("/clientes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(atualizado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Maria Souza"))
                .andExpect(jsonPath("$.cpf").value("98765432100"));
    }

    @Test
    void deveRecusarCriacaoClienteComCpfRepetido() throws Exception {
        Cliente cliente = new Cliente(
                null,
                "João da Silva",
                "12345678909",
                "99999-9999",
                null
        );

        when(clienteRepository.existsByCpf(cliente.getCpf())).thenReturn(true);

        mockMvc.perform(post("/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cliente)))
                .andExpect(status().isConflict())
                .andExpect(content().string("Erro: já existe um cliente com esse CPF"));
    }

    @Test
    void deveRecusarCriacaoClienteSemNome() throws Exception {
        Cliente cliente = new Cliente(
                null,
                "",                      // nome inválido -> dispara @NotBlank
                "12345678909",
                "99999-9999",
                null
        );

        mockMvc.perform(post("/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cliente)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.nome").value("O nome é obrigatório"));
    }

    @Test
    void deveBuscarClientesPorNome() throws Exception {
        List<Cliente> lista = List.of(
                new Cliente(1L, "Maria Silva", "12345678909", "99999-1111", null),
                new Cliente(2L, "Maria Souza", "98765432100", "99999-2222", null)
        );

        when(service.buscarPorNome("Maria")).thenReturn(lista);

        mockMvc.perform(get("/clientes/search")
                        .param("nome", "Maria")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Maria Silva"))
                .andExpect(jsonPath("$[1].nome").value("Maria Souza"));
    }

    @Test
    void deveRetornarListaVaziaAoBuscarNomeInexistente() throws Exception {
        when(service.buscarPorNome("Inexistente")).thenReturn(List.of());

        mockMvc.perform(get("/clientes/search")
                        .param("nome", "Inexistente")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void deveDeletarClienteComSucesso() throws Exception {
        // Simula cliente existente no banco
        Cliente cliente = new Cliente(
                1L,
                "João Silva",
                "12345678909",
                "999999999",
                null
        );
        when(service.buscarPorId(1L)).thenReturn(Optional.of(cliente));

        // Mock do delete (void)
        doNothing().when(service).deletarCliente(1L);

        mockMvc.perform(delete("/clientes/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deveRetornarNotFoundAoDeletarClienteInexistente() throws Exception {
        when(service.buscarPorId(99L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/clientes/99"))
                .andExpect(status().isNotFound());
    }

}
