import {BoundCommand} from "lib/core.commands";
import * as core from "core";
import {
    AbstractCorrespondentContact,
    CorrespondentAddress,
    CorrespondentContactDefault
} from "app/domain/model-classes";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import PropertyEditor = require("lib/ui/pe/PropertyEditor");
import Icons = require("dms/modules/icons/Icons");
import DictionaryCommands = require("dms/modules/dictionary/common/DictionaryCommands");
import peObjectList = require("lib/ui/pe/peObjectList");
import resources = require("i18n!app/nls/resources");
import modelResources = require("i18n!app/domain/nls/resources");
import dmsResources = require("i18n!dms/modules/dictionary/common/nls/resources");

/**
 * Набор вспомогательных функций и параметров, общих для партов корреспондентов.
 */
namespace CorrespondentHelpers {

    function contactTypeCmd(ctx): BoundCommand {
        return new core.commands.BoundCommand(function (args) {
            const that = this;
            this.viewModel.uow.loadAll("CorrespondentContactType", {
                params: {$filter: {systemName: args.name}}
            }).then(function (loaded) {
                let type: string;
                switch (args.name) {
                    case "CONTACT_TYPE_ADDRESS":
                        type = CorrespondentAddress.meta.name;
                        break;
                    default:
                        type = CorrespondentContactDefault.meta.name;
                }
                return that.doCreate(core.lang.extend({
                    part: "ObjectEditor:" + type,
                    partOptions: {
                        type: type,
                        contactTypeId: loaded[0].id
                    }
                }))
            })
        }, ctx.canCreate, ctx)
    }

    export function contactTypeIconizer(): string {
        switch (this.contactType().systemName()) {
            case "CONTACT_TYPE_ADDRESS":
                return Icons.ContactIcon.ADDRESS;
            case "CONTACT_TYPE_PHONE":
                return Icons.ContactIcon.PHONE;
            case "CONTACT_TYPE_EMAIL":
                return Icons.ContactIcon.EMAIL;
            case "CONTACT_TYPE_FAX":
                return Icons.ContactIcon.FAX;
            case "CONTACT_TYPE_URL":
                return Icons.ContactIcon.URL;
            default:
                return null;
        }
    }

    export const contactsPeOptions: PropertyEditor.Options & core.lang.Map<any> = {
        name: "contacts",
        columns: [
            {
                name: "deletedIcon",
                role: "icon",
                toolTip: dmsResources["tooltip.deleted"],
                title: core.ui.iconProvider.getIcon(Icons.ActionIcon.DELETE),
                getter: function () {
                    return this.deleted() ? Icons.ActionIcon.DELETE : null;
                }
            },
            {
                name: "contactType",
                role: "icon",
                toolTip: modelResources["model.AbstractCorrespondentContact.contactType"],
                getter: contactTypeIconizer
            },
            "contactKind",
            {
                name: "name"
            },
            "primary",
            "comment"
        ],
        menuRow: {
            remove: ["Delete", "Create", "Select", "Unlink"],
            update: [
                {
                    name: "CreateMenu",
                    title: dmsResources["dictionary.create"],
                    icon: Icons.ActionIcon.CREATE,
                    items: [
                        {
                            name: "CONTACT_TYPE_ADDRESS",
                            title: resources["part.dictionary.correspondent.pages.contacts.address"],
                            command: contactTypeCmd
                        }, {
                            name: "CONTACT_TYPE_EMAIL",
                            title: resources["part.dictionary.correspondent.pages.contacts.email"],
                            command: contactTypeCmd
                        }, {
                            name: "CONTACT_TYPE_PHONE",
                            title: resources["part.dictionary.correspondent.pages.contacts.phone"],
                            command: contactTypeCmd
                        }, {
                            name: "CONTACT_TYPE_FAX",
                            title: resources["part.dictionary.correspondent.pages.contacts.fax"],
                            command: contactTypeCmd
                        }, {
                            name: "CONTACT_TYPE_URL",
                            title: resources["part.dictionary.correspondent.pages.contacts.url"],
                            command: contactTypeCmd
                        }]
                },
                {
                    name: "MakePrimary",
                    title: resources["part.dictionary.correspondent.pages.contacts.makePrimary"],
                    command: function (ctx) {
                        return new core.commands.BoundCommand(function () {
                            ctx.items.all().filter(function (item) {
                                return item.contactType().systemName() == ctx.activeItem().contactType().systemName() &&
                                    item.primary() == true;
                            }).forEach(function (item) {
                                item.primary(false);
                            });
                            ctx.activeItem().primary(true)
                        }, ctx.canEdit, ctx)
                    }
                },
                DictionaryCommands.createNoConfirmMenuItem(false),
                DictionaryCommands.createNoConfirmMenuItem(true)]
        }
    };

    export const contactsViewerPeOptions = {
        name: "contacts",
        columns: [
            {
                name: "deletedIcon",
                role: "icon",
                toolTip: dmsResources["tooltip.deleted"],
                title: core.ui.iconProvider.getIcon(Icons.ActionIcon.DELETE),
                getter: function () {
                    return this.deleted() ? Icons.ActionIcon.DELETE : null;
                }
            },
            {
                name: "contactType",
                role: "icon",
                toolTip: modelResources["model.AbstractCorrespondentContact.contactType"],
                getter: contactTypeIconizer
            },
            "contactKind",
            {
                name: "name"
            },
            "primary",
            "comment"
        ],
        PropertyEditor: peObjectList,
        menuRow: {items: []},
        menuSelection: {items: []}
    };

    export const contactEditorOptions: ObjectEditor.Options = {
        onSetViewModel: function (viewModel: AbstractCorrespondentContact): core.lang.Promisable<AbstractCorrespondentContact> {
            viewModel.contactType() == null && viewModel.set("contactType", this.options.contactTypeId);
            const that = this;
            return viewModel.contactType().load().then(function (res) {
                that.title = res.name();

                return viewModel;
            });

        },
        onFinishing: function (sender: any, args: ObjectEditor.FinishingEventArgs): void {
            if (sender.viewModel.primary()) {
                this.editorContext.parentObject.contacts().all().filter(function (item) {
                    return item.contactType().systemName() == sender.viewModel.contactType().systemName() &&
                        item.primary() == true &&
                        item.id != sender.viewModel.id;
                }).forEach(function (item) {
                    item.primary(false);
                });
            }
        }
    };
}

export = CorrespondentHelpers;