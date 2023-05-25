import {DocumentTemplate} from "app/domain/model-classes";


/**
 * Класс-помощник для редакторов шаблонов документов.
 */
namespace ContractDocumentTemplateHelper {

    /**
     * Определяет и возвращает составное название проперти документа. (т.к. документ редактируется через шаблона).
     * <p/>
     * Пользователь редактирует сущность Шаблон.<br/>
     * Одно из полей Шаблона - это шаблонный Договор.<br/>
     * Для редактирования этого шаблонного Договора нужно для каждой проперти указывать путь относительно Шаблона,
     * т.е. первым уровнем идёт document, а вторым уровнем - название проперти Договора.
     *
     * @param docPropName название проперти документа
     */
    export function obtainDocPropName(docPropName: string): string {
        return DocumentTemplate.meta.props.document.name + "." + docPropName;
    }

}

export = ContractDocumentTemplateHelper;