import * as core from "core";
import {ObjectListColumn} from "lib/ui/list/.list";
import * as Icons from "dms/modules/icons/Icons";
import {AbstractDocument} from "app/domain/model-classes";
import * as resources from "i18n!app/nls/resources";

/**
 * Настройки колонок журнала входящих документов.
 */
export const columns: ObjectListColumn[] = [
    {
        name: "hasAttachment",
        role: "icon",
        width: 30,
        title: core.ui.iconProvider.getIcon(Icons.JournalIcon.ATTACHMENT),
        toolTip: AbstractDocument.meta.props.attachment.descr,
        getter: function () {
            return this.attachment().all().length > 0 ? Icons.JournalIcon.ATTACHMENT : null;
        },
        formatterHtml: function (v: any) {
            var result = "";
            var icon = core.ui.iconProvider.getIcon(
                this.attachment().all().length > 0 ? Icons.JournalIcon.ATTACHMENT : "", {});
            if (icon) {
                result += "<a href='#' class='x-cmd-link'"
                    + " data-cmd-name='ShowAttachment' tabIndex='-1'>" + icon + "</a>";
            }
            return result;
        }
    }, {
        name: "regNumber",
        width: 90,
        resizable: false
    }, {
        name: "incomingDate",
        width: 117,
        resizable: false
    }, {
        name: "identifier",
        width: 105,
        resizable: false
    }, {
        name: "correspondentExternal",
        width: 90,
    }, {
        name: "summary",
        width: 120
    }, {
        name: "addressees",
        width: 90,
        getter: function () {
            return this.addressees().all().map(function (addressee) {
                return addressee.addressee();
            }).join(", ");
        }
    }, {
        name: "referenceDate",
        width: 117,
        resizable: false
    }, {
        name: "referenceNumber",
        width: 117,
        resizable: false
    }, {
        name: "status",
        width: 200,
        resizable: false
    }, {
        name: "reviewDeadlineDate",
        width: 200,
        resizable: false
    }
];