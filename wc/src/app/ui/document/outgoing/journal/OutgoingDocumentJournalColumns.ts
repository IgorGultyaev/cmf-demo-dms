import {ObjectListColumn} from "lib/ui/list/.list";
import Icons = require("dms/modules/icons/Icons");
import modelResources = require("i18n!app/domain/nls/resources");
import core = require("core");
import "app/iconProvider";

/**
 * Настройки колонок журнала исходящих документов.
 */
export const columns: ObjectListColumn[] = [
    {
        name: "hasAttachment",
        role: "icon",
        width: 30,
        title: core.ui.iconProvider.getIcon(Icons.JournalIcon.ATTACHMENT),
        toolTip: modelResources["model.AbstractDocument.attachment"],
        getter: function () {
            return this.attachment().all().length > 0 ? Icons.JournalIcon.ATTACHMENT : null;
        },
        formatterHtml: function () {
            let result = "";
            const icon = core.ui.iconProvider.getIcon(
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
        name: "identifier",
        width: 105,
        resizable: false
    }, {
        name: "regDate",
        width: 117,
        resizable: false
    }, {
        name: "addressees",
        width: 90,
        getter: function () {
            //TODO решить проблему с any
            return (jQuery as any).uniqueSort(this.addressees().all().map(function (addressee) {
                return addressee.correspondent().name();
            })).join("; ");
        }
    }, {
        name: "summary",
        width: 120
    }, {
        name: "performer",
        width: 90
    }, {
        name: "signatory",
        width: 90
    }, {
        name: "status",
        width: 90
    }
];