__webpack_public_path__ = ( window as any ).__webpack_public_path__;
function parseCookies() {
    var cookieObject = {},
        cookiesArray = document.cookie ? document.cookie.split( '; ' ) : [],
        i, group, idx, key;

    for ( i = 0; i < cookiesArray.length; i = i + 1 ) {
        group = cookiesArray[i];
        idx = group.indexOf( '=' );
        key = decodeURIComponent( group.substr( 0, idx ) );
        cookieObject[key] || ( cookieObject[key] = decodeURIComponent( group.substr( idx + 1 ) ) );
    }
    return cookieObject;
}

( function() {
    var lang = parseCookies()["X-Lang"];
    if ( !lang ) {
        const re = /(\w+)-\w+/i;
        const languages = navigator.languages
            || navigator.language && [navigator.language]
            || ( navigator as any ).userLanguage && [( navigator as any ).userLanguage as string];
        // find не поддерживает IE, потому используем filter.
        const foundLangs = languages.map( language => re.test( language ) ? re.exec( language )[1] : language )
            .filter( language => !!xconfig.supportedLanguages[language] );
        lang = foundLangs.length > 0 ? foundLangs[0] : ( xconfig as any ).defaultLanguage;
    }
    if ( lang ) {
        ( window["_i18n"] = window["_i18n"] || {} ).locale = lang;
        // Для того, чтобы это съел WebClient.
        xconfig.require = xconfig.require || {};
        xconfig.require.locale = lang;
    }
} )();


require([
    "jquery",
    "core",
    // Должен стоять до App из-за https://track.rnd.croc.ru/issue/WC-1944
    // Замена модуля из WC на переопределенный, который решает CMF-1892
    "modules/sockets/module-stompjs",
    // Должен стоять до App из-за https://track.rnd.croc.ru/issue/WC-1962
    "modules/affix/module-affix",
    "app/app",
    "lib/domain/UnitOfWork",
    "app/domain/model-ext",
    "lib/interop/BackendInterop",
    "lib/data/DataStoreFactory",
    "lib/interop/DataFacade",
    "bootstrap",
    // presenters:
    "lib/ui/slick/SlickObjectListPresenter",
    "lib/ui/slick/SlickInlineEditAddon",
    "lib/ui/menu/MenuPresenter",
    "lib/ui/editor/ObjectEditorPresenter",
    "lib/ui/editor/ObjectWizardPresenter",
    "lib/ui/editor/EditorPagePresenter",
    "lib/ui/tree/FancytreePresenter",
    // PEs
    "lib/ui/pe/peString",
    "lib/ui/pe/peNumber",
    "lib/ui/pe/peBoolean",
    "lib/ui/pe/peBooleanSwitch",
    "lib/ui/pe/peObjectList",
    "lib/ui/pe/peDateTime",
    "lib/ui/pe/peEnumRadio",
    "lib/ui/pe/peEnumCheckbox",
    "lib/ui/pe/peEnumDropDownSelect",
    "lib/ui/pe/peEnumDropDownChosen",
    "lib/ui/pe/peEnumDropDownSelect2",
    "lib/ui/pe/peObject",
    "lib/ui/pe/peObjectDropDownLookup",
    "lib/ui/pe/peReadOnly",
    "lib/ui/pe/peViewOnly",
    "lib/ui/pe/peBinary",
    "lib/ui/pe/peObjectRadio",
    "lib/ui/pe/peTimeSpan",
    "vendor/jquery.animate-enhanced",
    // modules:
    "modules/notifications/module-notifications",
    "modules/debug/module-debug",
    "modules/breadcrumbs/module-breadcrumbs",
    "modules/compatibility/module-ie-compatibility",
    "modules/files/module-files",
    "modules/reporting/module-reporting",
    "modules/scroll-accelerators/module-scroll-accelerators",
    "modules/security/module-security",
    "modules/automation/automation",
    "cmf/modules/clientext/module-clientext",
    "dms/modules/info/module-dms-info",
    "dms/modules/dictionary/user/module-dms-dictionary-user",
    "dms/modules/dictionary/employee/module-dms-dictionary-employee",
    "dms/modules/dictionary/role/module-dms-dictionary-role",
    "dms/modules/dictionary/positionDescription/module-dms-dictionary-position-description",    
    "dms/modules/dictionary/orgstructure/module-dms-dictionary-orgstructure",
    "dms/modules/task/module-dms-task",
    "dms/modules/document/regnumber/module-dms-document-regnumber",
    "dms/modules/report/module-dms-report",
    "dms/modules/common/module-dms-common",
    "dms/modules/document/approval/module-dms-document-approval",
    "dms/modules/document/module-dms-document",
    "dms/modules/commission/module-dms-commission",
    "dms/modules/search/module-dms-search"
], function( $, core, stomp, affix, Application ) {
    "use strict";

    const app = new Application();

    $( function() {
        setTimeout( function() {
            app.run();
        }, 0 );
    } );
} );
