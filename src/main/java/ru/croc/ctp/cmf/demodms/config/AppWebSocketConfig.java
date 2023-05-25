package ru.croc.ctp.cmf.demodms.config;

import static ru.croc.ctp.cmf.asyncoperation.AsyncOperationApiPath.PREFIX_APP_DESTINATION;
import static ru.croc.ctp.cmf.asyncoperation.AsyncOperationApiPath.PREFIX_QUEUE;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Конфигурация приложения для работы с WebSocket'ами.
 * 
 * @author Dmitry Malenok
 */
@Configuration
@EnableWebSocketMessageBroker
public class AppWebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Endpoint для хэндшейка.
     */
    public static final String HANDSHAKE_ENDPOINT = "/jxfw-ws";

    @Override
    public void registerStompEndpoints(final StompEndpointRegistry registry) {
        registry.addEndpoint(HANDSHAKE_ENDPOINT)
                .withSockJS();
    }

    /**
     * Конфигурация брокеров.
     *
     * @param registry
     *            реестр брокеров
     */
    @Override
    public void configureMessageBroker(final MessageBrokerRegistry registry) {
        // простой брокер для рассылки сообщений клиентам
        registry.enableSimpleBroker(PREFIX_QUEUE);
        // префикс для маршрутизация сообщений к аннотированным методам приложения
        registry.setApplicationDestinationPrefixes(PREFIX_APP_DESTINATION);
    }
}
