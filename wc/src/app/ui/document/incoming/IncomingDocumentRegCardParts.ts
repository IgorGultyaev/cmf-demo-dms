/**
 * Карточка  входящего.
 * //TODO: когда редактор задач и карточек будут разделены, переделать.
 */
import core = require( "core" );
import binding = require("lib/binding");
import Icons = require("dms/modules/icons/Icons");
import ObjectEditor = require( "lib/ui/editor/ObjectEditor" );
import mainTabTemplate = require("xhtmpl!app/ui/document/incoming/templates/IncomingDocumentRegCard.hbs");
import resources = require( "i18n!app/nls/resources" );
import commissionTemplate = require("xhtmpl!app/ui/document/incoming/templates/CommissionTab.hbs");
import CommissionView = require("app/ui/document/incoming/CommissionView");
import domainResources = require("i18n!app/domain/nls/resources");
import peDocumentAttachment = require("app/ui/peDocumentAttachment");
import * as peObjectListWithDropDownSelector from "dms/modules/info/pe/peObjectListWithDropDownSelector";
import DocumentObjectEditor = require("app/ui/editor/DocumentObjectEditor");
import DocumentCommentsComponent = require("dms/modules/document/comment/DocumentCommentsComponent");
import commentsTabTemplate = require("xhtmpl!app/ui/document/incoming/templates/CommentsTab.hbs");
import RegCardObjectViewer = require("dms/modules/document/regCard/RegCardObjectViewer");
import DocumentRelationList = require("dms/modules/document/relation/DocumentRelationList");
import documentRelationsTab = require("xhtmpl!app/ui/templates/documentRelationsTab.hbs");
import IncomingDocumentObjectEditor = require("app/ui/document/incoming/IncomingDocumentObjectEditor");
import * as documentApprovalResources from "i18n!dms/modules/document/approval/nls/resources";
import dmsResources = require("i18n!dms/modules/dictionary/orgstructure/nls/resources");
import {EmployeePosition, IncomingDocumentAddressee} from "app/domain/model-classes";

core.createModule(function (app) {

    let editorOptions = {
        titleFormatter: IncomingDocumentObjectEditor.DEFAULT_OPTIONS.titleFormatter,
        presenterOptions: {
            resources: {
                titleShowDocument: resources['part.document.title.showDocument'],
            }
        },
        onPageCreated: function (editor: ObjectEditor, args: ObjectEditor.PageCreatedEventArgs) {
            const untypedPage = args.page as any;
            if (args.page.name == "commission") {
                untypedPage.commissionComponent = new CommissionView(app, {}, this.viewModel);
            }

            if (args.page.name == "comments") {
                untypedPage.documentCommentsComponent = new DocumentCommentsComponent({
                    viewModel: this.viewModel
                });
            }

            if (args.page.name == "relations") {
                untypedPage.documentRelationsPart = new DocumentRelationList(this.app, {
                    uow: this.viewModel.uow,
                    source: this.viewModel,
                    presenterOptions: {
                        menuRowCssClass: "x-menu-bar",
                    },
                    readOnly: untypedPage.options.readOnly
                });
                
                args.page.registerChild(untypedPage.documentRelationsPart, {
                    keepOnUnload: true,
                    trackStatus: true
                });
            }


            for (var key in args.page.editors) {
                if (Object.prototype.hasOwnProperty.call(args.page.editors, key)) {
                    if (editor.viewModel.meta.props[key].nullable == true) {
                        (args.page.editors[key] as any)._autoValidate = false;
                        args.page.editors[key].options.autoValidate = false;
                    }
                }
            }
        },
        onPageStarted: function (part, page) {
            $(".top-menu").first().css("display", "table");
            $(".show-info").each(function () {
                var peElement = $(this).find(".x-pe");
                var fieldName = $(this).attr("field");

                var icon = $("<a></a>").html(core.ui.iconProvider.getIcon(Icons.CommonIcon.INFO, {
                    title: documentApprovalResources["part.document.pages.approval.infoIconTitle"]
                }));

                if ($(peElement).find(".x-pe-viewonly").length > 0) {
                    if (page.page.editors[fieldName].value()) {
                        icon.css("margin-left", "5px");
                        $(peElement.children(":first")).css("float", "left");
                        icon.appendTo(peElement);
                        binding.commandBind(icon, part.commands.ShowInfo, {
                            context: page.page,
                            field: fieldName
                        });
                    }
                } else {
                    icon.css("position", "absolute");
                    icon.css("top", "10px");
                    icon.css("right", "-15px");
                    icon.appendTo(peElement);

                    binding.commandBind(icon, part.commands.ShowInfo, {
                        context: page.page,
                        field: fieldName
                    });
                }
            });
        }
    };


    app.registerPart("ObjectViewer:IncomingDocument", function (options) {
        const result = new RegCardObjectViewer(core.lang.extend({
            noTitleRef: true,
            editable: false,
            onPageSwitching: function (editor, args) {
                $(".top-menu").first().css("display", "table");
            },
            pages: [
                {
                    name: "main",
                    title: resources["part.document.pages.main"],
                    cssColumnPrefix: "col-sm-",
                    template: mainTabTemplate,
                    properties: [
                        {name: "envelopeNumber"},
                        {name: "incomingDate"},
                        {name: "deliveryOption"},
                        {name: "referenceNumber"},
                        {name: "referenceDate"},
                        {name: "correspondentExternal"},
                        {name: "signedByExternal"},
                        {name: "sheetsAmount"},
                        {name: "annexSheetsAmount"},
                        {name: "permission"},
                        {name: "reviewDeadlineDate"},
                        {
                            name: "addressees",
                            PropertyEditor: peObjectListWithDropDownSelector,
                            columns: [
                                {
                                    name: "Info"
                                },
                                {
                                    name: "addressee.employee.name",
                                    title: dmsResources["infoviewprovider.employeePosition.name"],
                                    getter: function () {
                                        return this.addressee().employee();
                                    }
                                },
                                {
                                    name: "addressee.parent",
                                    title: domainResources["model.EmployeePosition.parent"],
                                    getter: function () {
                                        return this.addressee().parent();
                                    }
                                },
                                {
                                    name: "addressee.parent.parent",
                                    title: domainResources["model.Department"],
                                    getter: function () {
                                        return this.addressee().parent().parent();
                                    }
                                },
                                {
                                    name: "addressee.employee.phone",
                                    title: domainResources["model.Employee.phone"],
                                    getter: function () {
                                        return this.addressee().employee().phone();
                                    }
                                },
                                {
                                    name: "addressee.employee.email",
                                    title: domainResources["model.Employee.email"],
                                    getter: function () {
                                        return this.addressee().employee().email();
                                    }
                                }
                            ],
                            valueSetter: function (container: IncomingDocumentAddressee, value: EmployeePosition) {
                                if (!this.items.all().some((addressee) => addressee.addressee().id == value.id)) {
                                    container.addressee(value);
                                    return true
                                }
                                return false;
                            },
                            infoValueConverter: function (value: IncomingDocumentAddressee): any {
                                return value.addressee();
                            },
                            selectorComponentOptions: {
                                entityType: EmployeePosition.meta.name,
                                ref: EmployeePosition.meta.name,
                                showInfoButton: false,
                                descr: resources["part.incomingDocument.addAddressee"]
                            }
                        },
                        {
                            name: "organization",
                            readOnly: true,
                            nullable: false
                        },
                        {name: "documentKind"},
                        {name: "regNumber"},
                        {name: "regDate"},
                        {
                            name: "summary",
                            nullable: true,
                            useNotNullStyle: true,
                        },
                        {
                            name: "nomenclatureCase",
                        },
                        {
                            name: "attachment",
                            PropertyEditor: peDocumentAttachment,
                            readOnly: true
                        }
                    ]
                },
                {
                    name: "commission",
                    title: resources["part.document.pages.commission"],
                    template: commissionTemplate,
                    hideTopMenu: true
                } as any,
                {
                    name: "comments",
                    title: resources["part.document.pages.comments"],
                    template: commentsTabTemplate
                },
                {
                    name: "relations",
                    title: resources["part.document.pages.relatedDocuments"],
                    template: documentRelationsTab,
                    resources: {
                        title: resources["part.document.pages.relatedDocuments"],
                    },
                    readOnly: true
                } as any
            ]
        }, options, editorOptions));

        return result;
    });

    app.registerPart("ObjectEditor:IncomingDocument", function (options) {
        return new DocumentObjectEditor(core.lang.extend({
            noTitleRef: true,
            editable: true,
            isIsolated: true,
            pages: [
                {
                    name: "main",
                    title: resources["part.document.pages.main"],
                    cssColumnPrefix: "col-sm-",
                    template: mainTabTemplate,
                    properties: [
                        {name: "envelopeNumber"},
                        {name: "incomingDate"},
                        {name: "deliveryOption"},
                        {name: "referenceNumber"},
                        {name: "referenceDate"},
                        {name: "correspondentExternal"},
                        {name: "signedByExternal"},
                        {name: "sheetsAmount"},
                        {name: "annexSheetsAmount"},
                        {name: "permission"},
                        {name: "reviewDeadlineDate"},
                        {
                            name: "addressees",
                            PropertyEditor: peObjectListWithDropDownSelector,
                            columns: [
                                {
                                    name: "Info"
                                },
                                {
                                    name: "addressee.employee.name",
                                    title: dmsResources["infoviewprovider.employeePosition.name"],
                                    getter: function () {
                                        return this.addressee().employee();
                                    }
                                },
                                {
                                    name: "addressee.parent",
                                    title: domainResources["model.EmployeePosition.parent"],
                                    getter: function () {
                                        return this.addressee().parent();
                                    }
                                },
                                {
                                    name: "addressee.parent.parent",
                                    title: domainResources["model.Department"],
                                    getter: function () {
                                        return this.addressee().parent().parent();
                                    }
                                },
                                {
                                    name: "addressee.employee.phone",
                                    title: domainResources["model.Employee.phone"],
                                    getter: function () {
                                        return this.addressee().employee().phone();
                                    }
                                },
                                {
                                    name: "addressee.employee.email",
                                    title: domainResources["model.Employee.email"],
                                    getter: function () {
                                        return this.addressee().employee().email();
                                    }
                                }
                            ],
                            valueSetter: function (container: IncomingDocumentAddressee, value: EmployeePosition) {
                                if (!this.items.all().some((addressee) => addressee.addressee().id == value.id)) {
                                    container.addressee(value);
                                    return true
                                }
                                return false;
                            },
                            infoValueConverter: function (value: IncomingDocumentAddressee): any {
                                return value.addressee();
                            },
                            selectorComponentOptions: {
                                entityType: EmployeePosition.meta.name,
                                ref: EmployeePosition.meta.name,
                                showInfoButton: false,
                                descr: resources["part.incomingDocument.addAddressee"]
                            }
                        },
                        {
                            name: "organization",
                            readOnly: true,
                            nullable: false
                        },
                        {name: "documentKind"},
                        {
                            name: "registrator",
                            nullable: false
                        },
                        {name: "regNumber"},
                        {
                            name: "summary",
                            nullable: true,
                            useNotNullStyle: true,
                        },
                        {
                            name: "nomenclatureCase",
                        },
                        {
                            name: "attachment",
                            PropertyEditor: peDocumentAttachment,
                            checkout: true
                        },
                        {
                            name: "regDate",
                            readOnly: true,
                        },
                    ],
                },
                {
                    name: "commission",
                    title: resources["part.document.pages.commission"],
                    template: commissionTemplate,
                    hideTopMenu: true
                },
                {
                    name: "relations",
                    title: resources["part.document.pages.relatedDocuments"],
                    template: documentRelationsTab,
                    resources: {
                        title: resources["part.document.pages.relatedDocuments"],
                    },
                    hideTopMenu: true
                }
            ]
        }, editorOptions, options));
    });

});