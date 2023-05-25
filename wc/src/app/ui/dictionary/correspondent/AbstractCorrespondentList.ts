import Icons = require("dms/modules/icons/Icons");
import core = require("core");
import {Application} from "core";
import resources = require("i18n!app/nls/resources");
import {DictionarySecurityOperationsMixin} from "dms/modules/dictionary/security/DictionarySecurityOperationsMixin";
import * as DictionaryObjectList from "dms/modules/dictionary/common/DictionaryObjectList";
import {
    AbstractCorrespondent,
    CompanyCorrespondent,
    CompanyPersonCorrespondent,
    PersonCorrespondent
} from "app/domain/model-classes";
import CompanyCorrespondentEditor = require("app/ui/dictionary/correspondent/CompanyCorrespondentEditor");
import CompanyPersonCorrespondentEditor = require("app/ui/dictionary/correspondent/CompanyPersonCorrespondentEditor");
import PersonCorrespondentEditor = require("app/ui/dictionary/correspondent/PersonCorrespondentEditor");
import AbstractCorrespondentFilter = require("app/ui/dictionary/correspondent/AbstractCorrespondentFilter");
import dmsResources = require("i18n!dms/modules/dictionary/common/nls/resources");
/**
 * Список корреспондентов.
 */
class AbstractCorrespondentList extends DictionaryObjectList /* implements DictionarySecurityOperationsMixin */ {

    /**
     * Имя парта.
     * @type {string}
     */
    static PART_NAME: string = "ObjectList:AbstractCorrespondent";

    /**
     * Опции по умолчанию.
     * @type {AbstractCorrespondentList.Options}
     */
    static DEFAULT_OPTIONS: AbstractCorrespondentList.Options = {
        entityType: AbstractCorrespondent.meta.name,
        filter: AbstractCorrespondentFilter.PART_NAME,
        menuRow: {
            remove: ["Create"],
            update: [
                {
                    name: "View",
                    title: dmsResources["dictionary.view"],
                    icon: Icons.ActionIcon.VIEW
                },
                {
                    name: "CreateMenu",
                    title: dmsResources["dictionary.create"],
                    icon: Icons.ActionIcon.CREATE,
                    items: [
                        {
                            name: "CreateCompanyCorrespondent",
                            title: resources["part.dictionary.correspondent.pages.companyCorrespondent"]
                        }, {
                            name: "CreateCompanyPersonCorrespondent",
                            title: resources["part.dictionary.correspondent.pages.companyPersonCorrespondent"]
                        }, {
                            name: "CreatePersonCorrespondent",
                            title: resources["part.dictionary.correspondent.pages.personCorrespondent"]
                        }
                    ]
                }
            ]
        },
        commands: {
            CreateCompanyCorrespondent: function (ctx) {
                return new core.commands.BoundCommand(function () {
                    const that = this;
                    this.doCreate(core.lang.extend({
                        part: CompanyCorrespondentEditor.PART_NAME,
                        partOptions: {
                            type: "CompanyCorrespondent"
                        }
                    })).then(function () {
                        that.doSave();
                        that.doReload()
                    });
                }, ctx.canCreate, ctx);
            },
            CreateCompanyPersonCorrespondent: function (ctx) {
                return new core.commands.BoundCommand(function () {
                    const that = this;
                    this.doCreate(core.lang.extend({
                        part: CompanyPersonCorrespondentEditor.PART_NAME,
                        partOptions: {
                            type: CompanyPersonCorrespondent.meta.name,
                            onSetViewModel: function (viewModel) {
                                viewModel.parent(that.activeItem())
                            }
                        }
                    })).then(function () {
                        that.doSave();
                        that.doReload()
                    });
                }, function () {
                    return this.canCreate()
                        && this.activeItem() != null
                        && this.activeItem().meta.name == CompanyCorrespondent.meta.name;
                }, ctx);
            },
            CreatePersonCorrespondent: function (ctx) {
                return new core.commands.BoundCommand(function () {
                    const that = this;
                    this.doCreate(core.lang.extend({
                        part: PersonCorrespondentEditor.PART_NAME,
                        partOptions: {
                            type: PersonCorrespondent.meta.name
                        }
                    })).then(function () {
                        that.doSave();
                        that.doReload()
                    });
                }, ctx.canCreate, ctx);
            }
        }
    };


    /**
     * @constructor
     * @param app текущий экземпляр приложения.
     * @param options опции компонента.
     */
    constructor(app: Application, options?: AbstractCorrespondentList.Options) {
        options = AbstractCorrespondentList.mixOptions(options, AbstractCorrespondentList.DEFAULT_OPTIONS); 
        options.dataSource = options.dataSource || new core.data.DataSource(app, {
            name: "dictionary/correspondent",
            supportQuery: false
        });

        super(app, options);
    }
}

DictionarySecurityOperationsMixin.mixinTo(AbstractCorrespondentList);

namespace AbstractCorrespondentList {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends DictionaryObjectList.Options {

    }
}

export = AbstractCorrespondentList

core.createModule((app: Application) => {
    app.registerPart(AbstractCorrespondentList.PART_NAME, (options?: AbstractCorrespondentList.Options) => {
        return new AbstractCorrespondentList(app, options);
    });
});
