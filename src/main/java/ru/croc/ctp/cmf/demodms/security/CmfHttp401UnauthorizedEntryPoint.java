package ru.croc.ctp.cmf.demodms.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import ru.croc.ctp.cmf.demodms.config.AppWebSocketConfig;
import ru.croc.ctp.jxfw.security.facade.Http401UnauthorizedEntryPoint;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Обработчик, который, кроме логики {@link Http401UnauthorizedEntryPoint} так же возвращает 401 для эндпоинта
 * '/jxfw-ws'.
 *
 * @author Mikhail Kondratev
 */
public class CmfHttp401UnauthorizedEntryPoint extends Http401UnauthorizedEntryPoint {

    /**
     * Ant-шаблон для определния запросов к {@link AppWebSocketConfig#HANDSHAKE_ENDPOINT}.
     */
    private static final RequestMatcher JXFW_WS_ANT_MATCHER =
            new AntPathRequestMatcher(AppWebSocketConfig.HANDSHAKE_ENDPOINT + "/**");

    /**
     * Логгер.
     */
    private final Logger log = LoggerFactory.getLogger(CmfHttp401UnauthorizedEntryPoint.class);

    /**
     * Конструктор.
     *
     * @param loginFormUrl
     *            URL where the login page can be found. Should either be relative to the web-app context path (include
     *            a leading {@code /}) or an absolute URL.
     */
    public CmfHttp401UnauthorizedEntryPoint(final String loginFormUrl) {
        super(loginFormUrl);
    }

    @Override
    public void commence(@SuppressWarnings("null") final HttpServletRequest request,
            @SuppressWarnings("null") final HttpServletResponse response,
            @SuppressWarnings("null") final AuthenticationException exception) throws IOException, ServletException {
        if (JXFW_WS_ANT_MATCHER.matches(request)) {
            log.debug("Unauthorized access to jxfw-ws. Rejecting access by URI: {}", request.getRequestURI());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized access");
        } else {
            super.commence(request, response, exception);
        }
    }
}
