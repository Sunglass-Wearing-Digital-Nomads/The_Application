package com.itvitae.swdn.configuration;

import com.itvitae.swdn.service.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    MyUserDetailsService myUserDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .csrf()
                .disable()

                .authorizeHttpRequests()
                .requestMatchers(
                        "/api/user/new/**",
                        "/api/person/all",
                        "/api/person/update/**",
                        "api/person/setpeople/**",
                        "/api/changerequest/byperson/**",
                        "/api/changerequest/delete/**",
                        "/api/changerequest/deny/**",
                        "/api/role/coach/all",
                        "/api/role/manager/all",
                        "api/user/delete/**"
                )
                .hasRole("HR")

                .requestMatchers("/api/invitation/new/**",
                        "/api/invitation/requesters/**",
                        "/api/role/trainee/all")
                .hasRole("TRAINEE")

                .requestMatchers("/api/person/gettrainees/**",
                        "/api/template/new",
                        "/api/template/update/**")
                .hasRole("COACH")

                .requestMatchers("/api/person/getsubordinates/**")
                .hasRole("MANAGER")

                .requestMatchers("/api/skill/new/**",
                        "/api/skill/update/**",
                        "/api/skill/add/certificate/**",
                        "/api/skill/delete/**",
                        "/api/template/assign/**",
                        "/api/template/all",
                        "/api/invitation/givers/**")
                .hasAnyRole("TRAINEE", "COACH")

                .requestMatchers("/api/evaluation/new/**",
                        "/api/evaluation/evaluator/**",
                        "/api/role/trainee/all")
                .hasAnyRole("COACH", "MANAGER")

                //De coach en manager hebben de meetings van de trainee nodig om ervoor te zorgen dat er geen dubbele boekingen zijn.
                .requestMatchers("/api/evaluation/get/**", "/api/evaluation/trainee/**")
                .hasAnyRole("TRAINEE", "COACH", "MANAGER")

                .requestMatchers("/api/user/login", "/swagger-ui/**", "/v3/api-docs/**", "basruijs/The_Application.git")
                .permitAll()

                .requestMatchers("/**")
                .authenticated()

                .and()
                .userDetailsService(myUserDetailsService)
                .httpBasic();
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
