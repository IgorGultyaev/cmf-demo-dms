package ru.croc.ctp.cmf.demodms.security;

import com.google.common.collect.ImmutableMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configurers.ExceptionHandlingConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.security.role.RoleConfig;
import ru.croc.ctp.cmf.dms.security.DmsCoreSecurityConfig;
import ru.croc.ctp.cmf.dms.security.base.impl.AjaxLoginSuccessHandler;
import ru.croc.ctp.jxfw.security.facade.AjaxAuthenticationFailureHandler;
import ru.croc.ctp.jxfw.security.facade.AjaxLogoutSuccessHandler;
import ru.croc.ctp.jxfw.security.facade.Http401UnauthorizedEntryPoint;

import java.util.Map;

import javax.servlet.http.HttpServletResponse;

/**
 * Конфигурация безопасности сервисов приложения.
 *
 * @author Dmitry Malenok
 */
@Configuration
@Import({ DmsCoreSecurityConfig.class, RoleConfig.class })
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@ComponentScan(basePackages = { "ru.croc.ctp.jxfw.security", "ru.croc.ctp.cmf.demodms.security" })
public class CmfDemoSedSecurityConfiguration extends WebSecurityConfigurerAdapter {

    /**
     * Свойства конфигурации безопасности приложения.
     */
    @Component
    @ConfigurationProperties("app.security")
    static class SecurityProperties {

        /**
         * Флаг, указывающий, что требуется запретить basic authentication.
         */
        private boolean disableBasicAuth = false;

        /**
         * Возвращает флаг, указывающий, что требуется запретить basic authentication.
         *
         * @return флаг, указывающий, что требуется запретить basic authentication
         */
        public boolean isDisableBasicAuth() {
            return disableBasicAuth;
        }

        /**
         * Устанавливает флаг, указывающий, что требуется запретить basic authentication.
         *
         * @param disableBasicAuth
         *            устанавливаемый флаг, указывающий, что требуется запретить basic authentication
         */
        public void setDisableBasicAuth(boolean disableBasicAuth) {
            this.disableBasicAuth = disableBasicAuth;
        }
    }

    /**
     * The "realm" authentication parameter.
     */
    private static final String REALM_NAME = "DEMO DMS Application";

    /**
     * Идентификатор текущего используемого алгоритма шифрования паролей.
     */
    private static final String CURRENT_PASSWORD_ENCODER_KEY = "bcrypt10";

    /**
     * Таблица соответствия идентификаторов и алгоритмов шифрования пароля, используемых в системе.
     * <p/>
     * При необходимости можно добавлять и использовать новый алгоритм для новых значений без необходимости
     * перекодирования старых.
     */
    @SuppressWarnings("null")
    private static final Map<String,
            PasswordEncoder> SUPPORTED_PASSWORD_ENCODERS = ImmutableMap.<String, PasswordEncoder>builder()
                    .put(CURRENT_PASSWORD_ENCODER_KEY, new BCryptPasswordEncoder(10))
                    .build();

    /**
     * Обработчик неудачной AJAX-аутентификации.
     */
    @Autowired
    private AjaxAuthenticationFailureHandler ajaxAuthenticationFailureHandler;

    /**
     * Обработчик AJAX-logout'а.
     */
    @Autowired
    private AjaxLogoutSuccessHandler ajaxLogoutSuccessHandler;

    /**
     * Свойства конфигурации безопасности приложения.
     */
    @Autowired
    private SecurityProperties properties;

    /**
     * Инициализация менеджера аутентификации.
     *
     * @param auth
     *            построитель менеджера аутентификации
     * @param userDetailsService
     *            сервис получения информации о пользователях для аутентификации
     * @throws Exception
     *             при возникновении ошибки инициализации
     */
    @Autowired
    public void registerGlobalAuthentication(final AuthenticationManagerBuilder auth,
            final UserDetailsService userDetailsService) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    /**
     * Сервис шифрования паролей.
     * 
     * @return сервис шифрования паролей
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new DelegatingPasswordEncoder(CURRENT_PASSWORD_ENCODER_KEY, SUPPORTED_PASSWORD_ENCODERS);
    }

    @Override
    public void configure(@SuppressWarnings("null") final WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/h2-console/**").antMatchers("/bootloader/**").antMatchers("/client/**");
    }

    @Override
    protected void configure(@SuppressWarnings("null") final HttpSecurity http) throws Exception {
        http.csrf().disable();

        final ExceptionHandlingConfigurer<HttpSecurity> authenticationEntryPoint = http.exceptionHandling()
                .accessDeniedHandler((request, response, accessDeniedException) -> response
                        .sendError(HttpServletResponse.SC_UNAUTHORIZED, "Access Denied"))
                .authenticationEntryPoint(createAuthenticationEntryPoint());
        authenticationEntryPoint.and()
                .formLogin()
                .usernameParameter("userName")
                .passwordParameter("password")
                .loginPage("/")
                .loginProcessingUrl("/login")
                .successHandler(customAuthenticationSuccessHandler("/"))
                .failureHandler(ajaxAuthenticationFailureHandler)
                .permitAll()
                .and()
                .logout()
                .logoutUrl("/logout")
                .logoutSuccessHandler(ajaxLogoutSuccessHandler)
                .deleteCookies("JSESSIONID")
                .permitAll()
                .and()
                .authorizeRequests()
                .antMatchers("/display/**")
                .permitAll()
                .antMatchers("/bootloader")
                .permitAll()
                .antMatchers("/api/_security/currentUser")
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .headers()
                .frameOptions()
                .disable();
        if (!properties.isDisableBasicAuth()) {
            authenticationEntryPoint.and().httpBasic().realmName(REALM_NAME);
        }
    }

    /**
     * Создаёт и возвращает обработчик события "удачный логин", используемый для отправки JSON обратно в клиент при AJAX
     * запросе.
     *
     * @param defaultUrl
     *            URL для успешной AJAX логина
     * @return обработчик события "удачный логин", используемый для отправки JSON обратно в клиент при AJAX запросе
     */
    @Bean
    protected AjaxLoginSuccessHandler customAuthenticationSuccessHandler(final String defaultUrl) {
        return new AjaxLoginSuccessHandler(defaultUrl);
    }

    /**
     * Создаёт и возвращает точку входа для аутентификации пользователя.
     * 
     * @return точку входа для аутентификации пользователя
     */
    @Bean
    protected Http401UnauthorizedEntryPoint createAuthenticationEntryPoint() {
        return new CmfHttp401UnauthorizedEntryPoint("/");
    }
}
