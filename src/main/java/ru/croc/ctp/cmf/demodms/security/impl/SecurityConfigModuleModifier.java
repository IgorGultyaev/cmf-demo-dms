package ru.croc.ctp.cmf.demodms.security.impl;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import ru.croc.ctp.jxfw.wc.web.config.ConfigModuleModifier;
import ru.croc.ctp.jxfw.wc.web.config.XConfig;
import ru.croc.ctp.jxfw.wc.web.config.XSecurityConfig;

import java.util.HashMap;
import java.util.Map;

/**
 * Модификатор конфигурации XConfig, необходимый для имплементации подсистемы безопасности.
 * <p/>
 * TODO: понять, чем это лучше того, чтобы просто внести изменения в main.js.
 *
 * @author Dmitry Malenok
 */
@Component
@Order(1)
public class SecurityConfigModuleModifier implements ConfigModuleModifier {

    @SuppressFBWarnings("CFS_CONFUSING_FUNCTION_SEMANTICS") // Таков API jXFW.
    @Override
    public XConfig createClientConfig(final XConfig config) {

        final XSecurityConfig security = new XSecurityConfig();

        final Map<Object, Object> formsAuth = new HashMap<>();
        formsAuth.put("loginUrl", "/login");
        formsAuth.put("isDefault", Boolean.TRUE);

        security.put("formsAuth", formsAuth);

        security.put("logoutUrl", "/logout");
        config.setSecurity(security);

        return config;
    }
}