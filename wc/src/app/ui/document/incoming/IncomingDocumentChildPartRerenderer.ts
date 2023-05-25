/**
 * Интерфейс для перерисовки парта по запросу родителя
 *
 * @author Ekaterina Cherepanova
 */
export interface IncomingDocumentChildPartRerenderer {
    /**
     * Перерисовать парт по запросу родителя.
     */
    rerenderChild():void;
}