import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import * as peObjectListWithDropDownSelector from "dms/modules/info/pe/peObjectListWithDropDownSelector";
import resources = require("i18n!app/nls/resources");
import tmplMenuRow = require("xhtmpl!app/ui/document/outgoing/templates/peOutgoingAddressee.menuRow.hbs");
import libResources = require("i18n!lib/nls/resources");
import {
    AbstractCorrespondent,
    AbstractCorrespondentContact,
    CorrespondentAddress,
    OutgoingDocumentAddressee,
    OutgoingDocumentDeliveryStatus
} from "app/domain/model-classes";
import * as core from "core";
import AbstractCorrespondentSelector = require("app/ui/dictionary/correspondent/AbstractCorrespondentSelector");
import * as peDropDownWithInfo from "dms/modules/info/pe/peDropDownWithInfo";

/**
 * Редактор списка адресатов.
 */
class peOutgoingAddressee extends peObjectListWithDropDownSelector {

    /**
     * Опции по умолчанию.
     *
     * TODO: убрать inlineEdit после фикса https://track.rnd.croc.ru/issue/WC-1885
     */
    static DEFAULT_OPTIONS: peOutgoingAddressee.Options & { inlineEdit?: boolean } = {
        inlineEdit: true,
        selectorComponentOptions: {
            name: "correspondentChoice",
            vt: "object",
            entityType: AbstractCorrespondent.meta.name,
            ref: AbstractCorrespondent.meta.name,
            nullable: true,
            PropertyEditor: peDropDownWithInfo.factory(AbstractCorrespondentSelector.PART_NAME, {
                commandsOptions: {
                    Select: {
                        partOptions: {
                            entityType: AbstractCorrespondent.meta.name
                        }
                    }
                },
                showInfoButton: false
            }),
            onDataLoading: function (pe, args) {
                // TODO: проблема описана здесь https://qa.rnd.croc.ru/questions/9244025
                if (args.query) {
                    args.query.params = {
                        deleted: false
                    };
                } else if (args.params) {
                    args.params = {
                        deleted: false
                    };
                }
            },
            descr: resources["peOutgoingAddressee.addAddressee"]
        },
        commands: {
            Delete: function (editor) {
                return core.commands.createBoundCommand(function () {
                    this._deleteObjects();
                }, function () {
                    return !this.disabled() && !!this.activeItem() && !this.activeItem().deliveryStatus()
                        && !this.selection.some(function (obj) {
                            return obj.deliveryStatus() == OutgoingDocumentDeliveryStatus.SENT;
                        }) && this.activeItem().deliveryStatus() != this.activeItem().uow.model.OutgoingDocumentDeliveryStatus.SENT;
                }, editor);
            },
            Send: function (editor) {
                return core.commands.createBoundCommand(function () {
                    this.activeItem().deliveryStatus(OutgoingDocumentDeliveryStatus.SENT);
                }, function () {
                    return !!this.activeItem() && !!this.activeItem().deliveryOption() && this.activeItem().deliveryStatus() != this.activeItem().uow.model.OutgoingDocumentDeliveryStatus.SENT;
                }, editor);
            }
        },
        presenterOptions: {
            partialTemplates: {
                menuRow: tmplMenuRow
            }
        },
        menuSelection: {
            items: []
        },
        menuRow: {
            items: []
        },
        columns: [{
            name: OutgoingDocumentAddressee.meta.props.deliveryOption.name
        }, {
            name: OutgoingDocumentAddressee.meta.props.correspondent.name,
            editor: null
        }, {
            name: OutgoingDocumentAddressee.meta.props.address.name,
            editor: function( obj, propMeta, column ) {
                return {
                    correspondentId: obj.correspondent().id
                }
            }
        }, {
            name: OutgoingDocumentAddressee.meta.props.fax.name,
            editor: function( obj, propMeta, column ) {
                return {
                    correspondentId: obj.correspondent().id,
                    contactTypeSystemName: "CONTACT_TYPE_FAX"
                }
            }
        }, {
            name: OutgoingDocumentAddressee.meta.props.email.name,
            editor: function( obj, propMeta, column ) {
                return {
                    correspondentId: obj.correspondent().id,
                    contactTypeSystemName: "CONTACT_TYPE_EMAIL"
                }
            }
        }, {
            name: OutgoingDocumentAddressee.meta.props.deliveryStatus.name,
            editor: null
        }],
        infoValueConverter: function (value: OutgoingDocumentAddressee): any {
            return value.correspondent();
        }
    };

    /**
     * Опции компонента.
     */
    options: peOutgoingAddressee.Options;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: peOutgoingAddressee.Options) {
        options = peOutgoingAddressee.mixOptions(options, peOutgoingAddressee.DEFAULT_OPTIONS);

        if (!options.readOnly) {
            options.menuRow.items.push({
                name: "Delete",
                title: libResources["delete"],
                hotKey: "del"
            });
        }

        if (options.send) {
            options.menuSelection.items.push({
                name: "Send",
                icon: "ok",
                title: resources["pe.OutgoingAddressee.confirm.send"]
            });
        }

        super(options);
    }


    protected beforeRender(domElement?: JQuery | HTMLElement): void {
        if ((this.presenter as any).dataPresenter) {
            core.lang.override((this.presenter as any).dataPresenter, {
                getColumnPropMeta: function (base, obj, column) {
                    if (obj.deliveryStatus() == OutgoingDocumentDeliveryStatus.SENT) {
                        return null;
                    }

                    return base(obj, column);
                }
            });
        }

        super.beforeRender(domElement);
    }


    protected onSelectorComponentChange(sender, value: AbstractCorrespondent): any {
        const that = this;
        if (value !== null) {
            const a: OutgoingDocumentAddressee = this.viewModel.uow.create("OutgoingDocumentAddressee");
            a.correspondent(value);
            if (!that.options.send) {
                a.deliveryStatus(OutgoingDocumentDeliveryStatus.EMPTY);
            } else {
                a.deliveryStatus(OutgoingDocumentDeliveryStatus.SENDING);
            }
            value.load({
                preloads: [
                    "contacts",
                    "contacts.contactType"
                ]
            }).done(function (result: AbstractCorrespondent) {
                const addresses: Array<CorrespondentAddress> = result.contacts().all().filter(function (item) {
                    return item.contactType().systemName() == "CONTACT_TYPE_ADDRESS";
                }).map(contact => contact as CorrespondentAddress);
                a.address( core.lang.arrayFindFirst( addresses, item => item.primary() && !item.deleted() )
                    || core.lang.arrayFindFirst( addresses, item => !item.deleted() ) );

                const faxes: Array<AbstractCorrespondentContact> = result.contacts().all().filter(function (item) {
                    return item.contactType().systemName() == "CONTACT_TYPE_FAX";
                });
                a.fax(core.lang.arrayFindFirst( faxes, item => item.primary() && !item.deleted() )
                        || core.lang.arrayFindFirst( faxes, item => !item.deleted() ) );

                const emails: Array<AbstractCorrespondentContact> = result.contacts().all().filter(function (item) {
                    return item.contactType().systemName() == "CONTACT_TYPE_EMAIL";
                });
                a.email(core.lang.arrayFindFirst( emails, item => item.primary() && !item.deleted() )
                        || core.lang.arrayFindFirst( emails, item => !item.deleted() ) );

                that.items.add(a);
                that.selectorComponent.commands.Unlink.execute();
            });

        }

    }
}

namespace peOutgoingAddressee {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends peObjectListWithDropDownSelector.Options {
        send?: boolean;
    }
}

export = peOutgoingAddressee;
