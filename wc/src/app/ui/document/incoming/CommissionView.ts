import ObjectViewer = require( "lib/ui/editor/ObjectViewer" );
import Part = require( "lib/ui/Part" );
import View = require( "lib/ui/handlebars/View" );
import Tree = require( "lib/ui/tree/Tree" );
import ObjectTree = require( "lib/ui/tree/ObjectTree" );
import PartCommandMixin = require( "lib/ui/PartCommandMixin" );

import core = require( "core" );
import commissionViewTemplate = require( "xhtmpl!app/ui/document/incoming/templates/CommissionView.hbs" );
import Icons = require( "dms/modules/icons/Icons" );
import domainResources = require( "i18n!app/domain/nls/resources" );
import resources = require( "i18n!app/nls/resources" );
import wcResources = require( "i18n!lib/nls/resources" );
import * as AsyncOperationSupportedObjectTreeMixin from "cmf/modules/tree/ui/AsyncOperationSupportedObjectTreeMixin";
import lang = core.lang;
import Promise = lang.Promise;
import { Application } from "lib/core";
import { Node } from "lib/ui/tree/Tree";
import { TreeNodeData } from "core.interop";
import { CommonSecurityOperationIds } from "dms/modules/security/CommonSecurityOperationIds";
import { operationSecurityService, OperationId } from "cmf/modules/security/service/OperationSecurityService";
import { AbstractDocument, Commission, CommissionPerformer, DomainObject } from "app/domain/model-classes";

import EditorCommandResult = PartCommandMixin.EditorCommandResult;

class CommissionView extends View {

    domainObjectsProperties: any;
    detailViewer: ObjectViewer;
    masterTree: ObjectTree;
    app: Application;
    document: AbstractDocument;

    constructor( app: Application, options?: View.Options, document?: AbstractDocument ) {
        const _options = View.mixOptions( lang.extend( {
            template: commissionViewTemplate
        }, options ), View.defaultOptions );
        super( _options );
        this.domainObjectsProperties = {
            Commission: {
                viewProperties: [
                    {
                        name: "main",
                        properties: [
                            { name: "regNumber", nullable: true, vt: "string" },
                            { name: "sent", nullable: true, vt: "date" },
                            { name: "status", nullable: true, vt: "complex" },
                            { name: "description", nullable: true, vt: "string" },
                            { name: "description", nullable: true, vt: "string" },
                            { name: "author", nullable: true, vt: "complex" },
                            { name: "overseer", nullable: true, vt: "complex" },
                            { name: "deadline", nullable: true, vt: "date" }
                            //TODO: дата перехода
                        ]
                    }
                ]
            },
            CommissionPerformer: {
                viewProperties: [
                    {
                        name: "main",
                        properties: [
                            { name: "performer", nullable: true, vt: "complex" },
                            { name: "mainPerformer", nullable: true, vt: "complex" },
                            { name: "deadline", nullable: true, vt: "date" },
                            "commission.status",
                            { name: "status", nullable: true, vt: "complex" },
                            { name: "lastReportSent", nullable: true, vt: "date" }
                        ]
                    }
                ]
            }
        };
        this.app = app;
        this.document = document;
        this.masterTree = new CommissionView.CommissionTree( app, { documentId: document.id } );
        this.masterTree.bind( "change:renderStatus", ( obj, newValue, oldValue ) => {
            if ( newValue == "ready" ) {
                if ( this.masterTree.activeNode() ) {
                    this.openViewer( this.masterTree, this.masterTree.activeNode() );
                }
            }
        } );

        this.masterTree.bind( "change:activeNode", () => {
            this.openViewer( this.masterTree, this.masterTree.activeNode() );
        } );

        ( <Part>this ).registerChild( this.masterTree, { keepOnUnload: true, trackStatus: true } );
    }

    private openViewer( tree: ObjectTree, item: Node ) {
        var newType = tree.getNodeIdentity( item ).type;
        if ( item ) {
            if ( this.detailViewer ) {
                this.detailViewer.dispose();
            }
            if ( newType != tree.ROOT_NODE_NAME ) {
                const commission = ( item.data() instanceof CommissionPerformer ? item.data().commission() : item.data() ) as Commission;
                var title = commission.toFamiliarize() ? resources["view.commission.nonperiod"] :
                    resources["view.commission.period"];
                var pages = this.domainObjectsProperties[item.data().meta.name].viewProperties;
                this.detailViewer = new ObjectViewer( {
                    title: title,
                    pages: pages,
                } );
                this.registerChild( this.detailViewer, { keepOnUnload: true, trackStatus: true } );
                this.detailViewer.setViewModel( item.data() );
                this.detailViewer.render( $( ".detailViewerPart" ) );
            }
        }
    }

    protected titleFormatter( o: DomainObject ): String {
        if ( o instanceof Commission ) {
            return o.author().toString();
        } else if ( o instanceof CommissionPerformer ) {
            return o.performer().toString();
        }
    }
}

namespace CommissionView {

    /**
     * Класс загрузчика данных для дерева поручений.
     */
    class CommissionTreeLoader implements Tree.ITreeLoader {
        private _documentId: string;

        /**
         * Конструктор.
         * 
         * @param documentId идентификатор документа, для которого будут грузиться поручения.
         */
        constructor( documentId: string ) {
            this._documentId = documentId;
        }

        /**
         * @inheritDoc 
         */
        loadChildren( tree: ObjectTree, node: Node, params?: any, options?: any ): Promise<TreeNodeData[]> {
            var identity = tree.getNodeIdentity( node );
            switch ( identity.type ) {
                case tree.ROOT_NODE_NAME:
                    return tree.uow.loadAll( Commission.meta.name, {
                        params: {
                            $filter: {
                                container: {
                                    eq: this._documentId
                                },
                                parent: null
                            },
                            $expand: Commission.meta.props.status.name
                        }
                    } ).then( function( loaded ) {
                        return loaded.map( function( o ) {
                            return { data: o };
                        } );
                    } );
                case Commission.meta.name:
                    return node.data().performers().load().then( function( loaded ) {
                        return loaded.all().map( function( o ) {
                            return { data: o };
                        } );
                    } );
                case CommissionPerformer.meta.name:
                    return node.data().childCommissions().load().then( function( loaded ) {
                        return loaded.all().map( function( o ) {
                            return { data: o };
                        } );
                    } );
            }
        }
    }

    /**
     * Дерево поручений.
     */
    export class CommissionTree extends ObjectTree implements AsyncOperationSupportedObjectTreeMixin {

        /**
         * Настройки дерева поручений по умолчанию.  
         */
        static defaultOptions: CommissionTreeOptions = {
            hasNumbering: false,
            formatter: function( tree, node ): string {
                var color = "none";
                var o = node.data();
                var person = o instanceof Commission ? o.author().employee() : o.performer().employee();
                var name = "<b>"
                    + person.lastName() + " " + person.firstName()[0] + ". " + person.patronymic()[0] +
                    ". </b>";
                if ( o instanceof Commission ) {
                    var commissionStatus = o.status().systemName();
                    if ( commissionStatus == "CommissionStatus_Executed"
                        || commissionStatus == "CommissionStatus_Revoked"
                        || commissionStatus == "CommissionStatus_Acquainted" ) {
                        color = "green";
                    } else if ( commissionStatus == "CommissionStatus_Execution" && o.deadline() < new Date() ) {
                        color = "red;"
                    }
                    return "<font color='none'>" + core.ui.iconProvider.getIcon( Icons.CommissionIcon.COMMISSION ) + "</font>"
                        + " " + name + ": " + o.description();
                } else if ( o instanceof CommissionPerformer ) {
                    var commissionPerformerStatus = o.status().systemName();
                    if ( commissionPerformerStatus == "CommissionPerformerStatus_Acquainted"
                        || commissionPerformerStatus == "CommissionPerformerStatus_Executed" ) {
                        color = "green";
                    } else if ( o.deadline() < new Date() ) {
                        color = "red;"
                    }
                    return core.ui.iconProvider.getIcon( Icons.CommissionIcon.PERFORMER ) +
                        ( o.mainPerformer() ?
                            domainResources["model.CommissionPerformer.mainPerformer"] :
                            ( o.commission().hasMainPerformer() ? resources["view.commission.coexecutive"] :
                                domainResources["model.CommissionPerformer.performer"] ) )
                        + " " + name;
                }
            },
            editable: false,
            menuNode: {
                items: [
                    {
                        name: "Create",
                        title: wcResources["create"],
                    },
                    {
                        name: "Delete",
                        title: wcResources["delete"]
                    },
                    {
                        name: "View",
                        title: wcResources["view"],
                        //TODO: перенести в createCommands при имплементации
                        command: function( tree ) {
                            return new core.commands.BoundCommand( function( args ) {
                                //TODO
                            }, function() {
                                //TODO
                                return true;
                            }, tree );
                        }
                    }
                ]
            }
        }

        /**
         * Параметры компонента. 
         */
        options: CommissionTreeOptions;

        /**
         * Конструктор.
         * 
         * @param app приложение, в котором создаётся дерево
         * @param options параметры дерева
         */
        constructor( app: core.Application, options?: CommissionTreeOptions ) {
            super( app, CommissionTree.mixOptions( options, CommissionTree.defaultOptions ) );
        }

        /**
         * @inheritDoc 
         */
        protected tweakOptions( options: CommissionTreeOptions ): void {
            core.lang.append( options, {
                loader: new CommissionTreeLoader( options.documentId )
            } as CommissionTreeOptions );
            super.tweakOptions( options );
        }

        /**
         * @inheritDoc 
         */
        protected doCreate( args: ObjectTree.CreateOptions ): Promise<EditorCommandResult> {
            return this.executePartCommand( {
                part: "UnsentCommissionEditor",
                partOptions:
                    { containerId: this.options.documentId },
                onReturn: result => this.doReloadRoot()
            }, args, "Create" ).closed;
        }

        /**
         * @inheritDoc 
         */
        protected resolveNodeOperations( node: Tree.Node ): core.lang.Map<Promise<boolean>> {
            const result: core.lang.Map<Promise<boolean>> = {};

            result[AsyncOperationSupportedObjectTreeMixin.knownCommands.Delete.name] = node
                && node.data() instanceof Commission
                && node.data().parent() == null
                && node.data().status().systemName() == "CommissionStatus_Draft" ?
                operationSecurityService.canExecuteOperation(
                    CommonSecurityOperationIds.Delete, {
                        cmfSecurityOperationParam_MainObject_ID: node.data().id,
                        cmfSecurityOperationParam_MainObject_TYPE: node.data().meta.name,
                    } ) : core.lang.resolved( false );

            return result;
        }

        /**
         * @inheritDoc 
         */
        protected resolveTreeOperations(): core.lang.Map<Promise<boolean>> {
            const result: core.lang.Map<Promise<boolean>> = {};
            result[AsyncOperationSupportedObjectTreeMixin.knownCommands.Create.name] =
                operationSecurityService.canExecuteOperation(
                    CommonSecurityOperationIds.Create, {
                        cmfSecurityOperationParam_MainObject_TYPE: Commission.meta.name
                    } );
            return result;
        }
    }

    export interface CommissionTree extends AsyncOperationSupportedObjectTreeMixin { };

    /**
     * Параметры дерева поручений.
     */
    export interface CommissionTreeOptions extends ObjectTree.Options {

        /**
         * Идентификатор документа, для которого строится дерево. 
         */
        documentId?: string;
    }

    AsyncOperationSupportedObjectTreeMixin.mixinTo( CommissionTree, "inherited" );
}

export = CommissionView
