import core = require( "core" );
import IncomingDocumentTaskEditor = require( "app/ui/document/incoming/IncomingDocumentTaskEditor" );
import domainResources = require( "i18n!app/domain/nls/resources" );
import mainTabTemplate = require( "xhtmpl!app/ui/document/incoming/templates/RegisterDocumentTask.hbs" );
import resources = require( "i18n!app/nls/resources" );
import CommissionView = require( "app/ui/document/incoming/CommissionView" );
import commentsTabTemplate = require( "xhtmpl!app/ui/document/incoming/templates/CommentsTab.hbs" );
import peDocumentAttachment = require( "app/ui/peDocumentAttachment" );
import DocumentCommentsComponent = require( "dms/modules/document/comment/DocumentCommentsComponent" );
import DocumentRelationList = require( "dms/modules/document/relation/DocumentRelationList" );
import documentRelationsTab = require( "xhtmpl!app/ui/templates/documentRelationsTab.hbs" );
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import DocumentActionNotifier = require("dms/modules/document/process/notification/DocumentActionNotifier");
import dmsResources = require("i18n!dms/modules/dictionary/orgstructure/nls/resources");
import {ICommand} from "lib/core.commands";

/**
 * Карточка задачи на регистрацию входящего.
 */
class IncomingDocumentTaskRegisterPart extends IncomingDocumentTaskEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_Register:IncomingDocument";

    /**
     * Параметры компонента по умолчанию.
     */
    static defaultOptions: IncomingDocumentTaskRegisterPart.Options = {
        subtitle: resources["part.task.registerDocument"],
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
                        useTitledListLayout: true,
                        selectorComponentOptions: {
                            showInfoButton: false,
                            descr: resources["part.incomingDocument.addAddressee"]
                        },
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
                    },
                    {name: "organization", readOnly: true, nullable: false},
                    {name: "documentKind"},
                    {name: "summary", nullable: true, useNotNullStyle: true},
                    {
                        name: "attachment",
                        PropertyEditor: peDocumentAttachment,
                        checkout: true,
                        useTitledListLayout: true,
                    },
                    {
                        name: "nomenclatureCase",
                    }
                ],
            }, {
                name: "comments",
                title: resources["part.document.pages.comments"],
                template: commentsTabTemplate,
            }, {
                name: "relations",
                title: resources["part.document.pages.relatedDocuments"],
                template: documentRelationsTab,
                resources: {
                    title: resources["part.document.pages.relatedDocuments"],
                },
                hideTopMenu: true
            }
        ],
        leftMenu: {
            update: [{
                name: "CompleteTask",
                title: resources["part.task.completeRegistration"],
                icon: "redo"
            }, {
                name: "Revoke",
                title: resources["part.task.voidTask"],
                icon: "stop"
            }]
        },
        preloads: ["documentType"],
    };

    /**
     * Событие, публикуемое в app.eventPublisher при успешной регистрации документа.
     */
    static readonly INCOMING_DOCUMENT_REGISTRATION_SUCCESS: string = "document.incoming.registration.success";

    /**
     * Параметры компонента.
     *
     * Переопределено для расширения.
     */
    options: IncomingDocumentTaskRegisterPart.Options;

    /**
     * Конструктор.
     *
     * @param options параметры компонента
     */
    constructor(options?: IncomingDocumentTaskRegisterPart.Options) {
        super(IncomingDocumentTaskRegisterPart.mixOptions(options, IncomingDocumentTaskRegisterPart.defaultOptions));
    }

    /**
     * @inheritDoc
     */
    protected createCommands(): core.lang.Map<ICommand> {
        const commands: core.lang.Map<ICommand> = super.createCommands();

        commands.Revoke = new core.commands.BoundCommand(this.doRevoke, this.canRevoke, this);

        return commands;
    }

    /**
     * Логика выполнения команды аннулирования документа.
     *
     * @return {core.lang.Promise<void>} промис выполнения аннулирования документа на сервере.
     */
    protected doRevoke(): core.lang.Promise<void> {
        return core.Application.current.dataFacade.ajax({
            url: "/api/document/incoming/revoke",
            type: "GET",
            processData: true,
            async: true,
            data: {
                documentId: this.viewModel.id
            }
        }).done(() => {
            return this.navigationService.close({success: true});
        });
    }

    /**
     * Метод для определения возможности выполнения команды аннулирования документа.
     *
     * @return {boolean} <code>true</code> - пользователь может аннулировать документ, иначе - <code>false</code>.
     */
    protected canRevoke(): boolean {
        return this.canCompleteTaskInternal();
    }

    /**
     * @inheritDoc
     */
    protected onPageCreated(args: ObjectEditor.PageCreatedEventArgs): void {
        switch (args.page.name) {
            case "commission":
                (args.page as any).commissionComponent = new CommissionView(this.app, {}, this.viewModel);
                break;

            case "comments":
                (args.page as any).documentCommentsComponent = new DocumentCommentsComponent({
                    viewModel: this.viewModel
                });

                args.page.registerChild((args.page as any).documentCommentsComponent, {
                    keepOnUnload: true,
                    trackStatus: true
                });
                break;

            case "relations":
                (args.page as any).documentRelationsPart = new DocumentRelationList(this.app, {
                    uow: this.viewModel.uow,
                    source: this.viewModel,
                    presenterOptions: {
                        menuRowCssClass: "x-menu-bar",
                    },
                });

                args.page.registerChild((args.page as any).documentRelationsPart, {
                    keepOnUnload: true,
                    trackStatus: true
                });
                break;
        }

        super.onPageCreated(args);
    }

    /**
     * @inheritDoc
     */
    protected doCompleteTask(args: any): core.lang.Promise<void> {
        return super.doCompleteTask(args).done(() => {
            DocumentActionNotifier.documentActionNotifier.publishDocumentRegistrationEvent(IncomingDocumentTaskRegisterPart.INCOMING_DOCUMENT_REGISTRATION_SUCCESS, {
                action: resources["part.document.registration.documentHasBeenRegistered"],
                document: this.viewModel,
                showCloseButton: true,
            });
        });
    }
}

namespace IncomingDocumentTaskRegisterPart {

    /**
     * Интерфейс параметров компонента.
     */
    export interface Options extends IncomingDocumentTaskEditor.Options {

    }
}

export = IncomingDocumentTaskRegisterPart;

core.createModule((app: core.Application) => {
    app.registerPart("TaskPart:TaskType_Document_Register:IncomingDocument", (options) => {
        return new IncomingDocumentTaskRegisterPart(options);
    });
});