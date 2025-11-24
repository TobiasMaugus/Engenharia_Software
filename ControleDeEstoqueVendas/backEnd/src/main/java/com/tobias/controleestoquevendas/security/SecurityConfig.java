package com.tobias.controleestoquevendas.security;

import com.tobias.controleestoquevendas.service.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService,
                          CustomAccessDeniedHandler customAccessDeniedHandler,
                          CustomAuthenticationEntryPoint customAuthenticationEntryPoint) {
        this.userDetailsService = userDetailsService;
        this.customAccessDeniedHandler = customAccessDeniedHandler;
        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
    }

    // Password encoder
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // AuthenticationProvider
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Configuração CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // SecurityFilterChain atualizado
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
        http
                .csrf().disable()
                .cors() // ativa CORS
                .and()
                .exceptionHandling(exceptions -> exceptions
                        .accessDeniedHandler(customAccessDeniedHandler)
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/auth/role").authenticated()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/clientes/**").hasAnyAuthority("GERENTE", "VENDEDOR")
                        .requestMatchers(HttpMethod.GET, "/produtos/**").hasAnyAuthority("GERENTE", "VENDEDOR")
                        .requestMatchers("/produtos/**").hasAnyAuthority("GERENTE")
                        .requestMatchers(HttpMethod.GET, "/vendas/meus").hasAnyAuthority("GERENTE", "VENDEDOR")
                        .requestMatchers(HttpMethod.GET, "/vendas/periodo").hasAnyAuthority("GERENTE")
                        .requestMatchers(HttpMethod.GET, "/vendas/{id}").hasAnyAuthority("GERENTE")
                        .requestMatchers(HttpMethod.GET, "/vendas/total/meu").hasAnyAuthority("GERENTE", "VENDEDOR")
                        .requestMatchers(HttpMethod.GET, "/vendas/cliente/{clienteId}").hasAnyAuthority("GERENTE", "VENDEDOR")
                        .requestMatchers(HttpMethod.GET, "/vendas").hasAnyAuthority("GERENTE")
                        .requestMatchers(HttpMethod.POST, "/vendas").hasAnyAuthority("GERENTE", "VENDEDOR")
                        .requestMatchers(HttpMethod.PUT, "/vendas/**").hasAnyAuthority("GERENTE")
                        .requestMatchers(HttpMethod.DELETE, "/vendas/**").hasAnyAuthority("GERENTE")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
