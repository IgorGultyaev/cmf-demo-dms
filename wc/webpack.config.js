const path = require("path");
const merge = require('webpack-merge');

const cmfAppConfig = require(path.resolve(__dirname,
        "node_modules/@ctp.cmf/cmf-ui/dist/appconfig/webpack.cmfapp.parent.config.js"));

const globalLessVars = require(path.resolve(__dirname,
        'node_modules/@ctp.cmf/cmf-dms-theme-ui/src/dms/styles/theme/globalvars.json'));
const modifyLessVars = require(path.resolve(__dirname,
        'node_modules/@ctp.cmf/cmf-dms-theme-ui/src/dms/styles/theme/modifyvars.json'));

var configFactory = function(env, args) {
    const devMode = cmfAppConfig.checkIfDevMode(env, args);
    const srcDistPath = devMode ? "src" : "dist";
    
    return merge(
            {
                optimization : {
                    splitChunks : {
                        cacheGroups : {
                            dms : {
                                test : /[\/\\]@ctp.cmf[\/\\].*[\/\\]dms[\/\\]/,
                                name : 'dms',
                                priority : 15,
                                enforce: true
                            }
                        }
                    }
                },
                resolve : {
                    alias : {
                        "cmf/modules/dashboard" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dashboard-ui", srcDistPath,
                                "cmf/modules/dashboard"),
                        "cmf/modules/calendar" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-calendar-ui", srcDistPath,
                            "cmf/modules/calendar"),
                        "dms/styles/theme" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-theme-ui/dist/dms/styles/theme"),
                        "dms/modules/bookmarks" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-bookmarks-ui", srcDistPath,
                                "dms/modules/bookmarks"),
                        "dms/modules/comment" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-comment-ui", srcDistPath,
                                "dms/modules/comment"),
                        "dms/modules/commission" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-commission-ui", srcDistPath,
                                "dms/modules/commission"),
                        "dms/modules/common" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-common-ui", srcDistPath,
                                "dms/modules/common"),
                        "dms/modules/dictionary/common" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-dictionary-common-ui",
                                srcDistPath, "dms/modules/dictionary/common"),
                        "dms/modules/dictionary/employee" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-dictionary-employee-ui",
                                srcDistPath, "dms/modules/dictionary/employee"),
                        "dms/modules/dictionary/extension" : path.resolve(__dirname,
                                "node_modules/@ctp.cmf/cmf-dms-dictionary-model-extension-ui", srcDistPath,
                                "dms/modules/dictionary/extension"),
                        "dms/modules/dictionary/orgstructure" : path.resolve(__dirname,
                                "node_modules/@ctp.cmf/cmf-dms-dictionary-orgstructure-ui", srcDistPath,
                                "dms/modules/dictionary/orgstructure"),
                        "dms/modules/dictionary/positionDescription" : path.resolve(__dirname,
                                "node_modules/@ctp.cmf/cmf-dms-dictionary-position-description-ui", srcDistPath,
                                "dms/modules/dictionary/positionDescription"),
                        "dms/modules/dictionary/role" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-dictionary-role-ui",
                                srcDistPath, "dms/modules/dictionary/role"),
                        "dms/modules/dictionary/security" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-dictionary-security-ui",
                                srcDistPath, "dms/modules/dictionary/security"),
                        "dms/modules/dictionary/user" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-dictionary-user-ui",
                                srcDistPath, "dms/modules/dictionary/user"),
                        "dms/modules/document/approval" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-document-approval-ui",
                                srcDistPath, "dms/modules/document/approval"),
                        "dms/modules/document/process" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-document-process-ui",
                                srcDistPath, "dms/modules/document/process"),
                        "dms/modules/document/regnumber" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-document-regnumber-ui",
                                srcDistPath, "dms/modules/document/regnumber"),
                        "dms/modules/document" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-document-ui", srcDistPath,
                                "dms/modules/document"),
                        "dms/modules/icons" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-appicon-ui", srcDistPath,
                                "dms/modules/icons"),
                        "dms/modules/info" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-info-ui", srcDistPath,
                                "dms/modules/info"),
                        "dms/modules/mainPage" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-mainpage-ui", srcDistPath,
                                "dms/modules/mainPage"),
                        "dms/modules/relation" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-relation-ui", srcDistPath,
                                "dms/modules/relation"),
                        "dms/modules/report" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-report-ui", srcDistPath,
                                "dms/modules/report"),
                        "dms/modules/search" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-search-ui", srcDistPath,
                                "dms/modules/search"),
                        "dms/modules/security" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-security-ui", srcDistPath,
                                "dms/modules/security"),
                        "dms/modules/task" : path.resolve(__dirname, "node_modules/@ctp.cmf/cmf-dms-task-ui", srcDistPath,
                                "dms/modules/task"),
                        "quill" : path.resolve(__dirname, "node_modules/quill/dist"),
                        "Draggable" : path.resolve(__dirname, "node_modules/@shopify/draggable/lib/es5/draggable.bundle.legacy.js"),
                        "chartjs" : path.resolve(__dirname, "node_modules/chart.js/dist/Chart.js"),
                        "bootstrap-year-calendar" : path.resolve(__dirname, "node_modules/@ctp.cmf/bootstrap-year-calendar"),
                    }
                },
            }, cmfAppConfig.cmfAppConfigFactory({
                cwd : __dirname,
                devMode : devMode,
                lessOptions : {
                    globalVars: globalLessVars,
                    modifyVars: modifyLessVars,
                    paths: [ '.',
                        path.resolve(__dirname, 'node_modules/@ctp.cmf/cmf-dms-theme-ui/dist/dms/styles/theme'),
                        path.resolve(__dirname, 'node_modules/@croc/webclient/dist/lib/ui/styles'),
                        path.resolve(__dirname, 'node_modules') ]
                },
                extendOnStartCopyRules: (rules, outPath) =>{
                    return [...rules, {
                        source : path.resolve(__dirname, 'src', 'content'),
                        destination : path.resolve(outPath, 'content')
                    }]
                }
            }))
};

module.exports = function(env, args) {
    return  configFactory(env, args);
};
