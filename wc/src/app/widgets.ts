import WidgetRegistry = require("cmf/modules/dashboard/WidgetRegistry");
import resources = require( "i18n!cmf/modules/dashboard/nls/resources" );
import GroupedVerticalBarWidgetWizard = require("cmf/modules/dashboard/groupedverticalbar/GroupedVerticalBarWidgetWizard");
import CounterWidgetWizard = require("cmf/modules/dashboard/counter/CounterWidgetWizard");
import CounterWidget = require("cmf/modules/dashboard/counter/CounterWidget");
import GroupedVerticalBarWidget = require("cmf/modules/dashboard/groupedverticalbar/GroupedVerticalBarWidget");
import core = require("core");
import WidgetTypeSelector = require("cmf/modules/dashboard/WidgetTypeSelector");
import DashboardView = require("cmf/modules/dashboard/DashboardView");
import Icons = require( "dms/modules/icons/Icons" );

core.createModule("cmf-dashboard",(app: core.Application) => {

    /**
     * Реестр типов виджетов.
     */
    const widgetRegistry: WidgetRegistry = new WidgetRegistry();

    /**
     * Регистрация виджета, отображающего число, в реестре виджетов.
     */
    widgetRegistry.register({
        typeId: CounterWidget.TYPE,
        name: CounterWidget,
        editor: CounterWidgetWizard,
        formattedName: () => resources["CounterWidget.name"],
        icon: Icons.WidgetIcon.FILTER,
    });

    /**
     * Регистрация виджета с диаграммой, в реестре виджетов.
     */
    widgetRegistry.register({
        typeId: GroupedVerticalBarWidget.TYPE,
        name: GroupedVerticalBarWidget,
        editor: GroupedVerticalBarWidgetWizard,
        formattedName: () => resources["GroupedVerticalBarWidget.name"],
        icon: Icons.WidgetIcon.BAR_CHART,
    });

    /**
     * Регистрация парта-панели управления.
     */
    app.registerPart("DashboardView", (options) => {
        return new DashboardView(core.lang.append(options || {}, {
            widgetRegistry,
        }));
    });

    /**
     * Регистрация парта для выбора типа виджета, при добавлении нового виджета на панель управления.
     */
    app.registerPart("WidgetTypeSelector", options => {
        return new WidgetTypeSelector(core.lang.append(options || {}, {
            widgetRegistry,
        }));
    });
});

