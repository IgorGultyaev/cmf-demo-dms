/**
 * Флаг, указывающий, что запуск производится на teamcity.
 */
const teamcityFlag = 'TEAMCITY' === process.env.ENV_NAME;

module.exports = function(grunt) {
    /**
     * Порт webdriver'а.
     */
    const webDriverPortParam = grunt.option('webDriverPort') || '4444';
    
    /**
     * Http порт сервера, поднимаемого для тестов. 
     */
    const uiTestServerPort = grunt.option('uiTestServerPort') || '9010';

    /**
     * Socket порт сервера, поднимаемого для тестов. 
     */
    const uiTestSocketPort = grunt.option('uiTestSocketPort') || '9011';

    const internReporters = ['runner'];
    if(teamcityFlag) {
        internReporters.push('teamcity');
    }
    
    grunt.initConfig({
        run : {
            buildtests : {
                exec : 'npm run wutest'
            }
        },
        intern : {
            headless : {
                options : {
                    tunnel : 'null',
                    runType : 'runner',
                    suites : 'dist/tests/unit.js',
                    serverPort : uiTestServerPort,
                    socketPort : uiTestSocketPort,
                    tunnelOptions : {
                        port : webDriverPortParam
                    },
                    environments : {
                        browserName : 'chrome',
                        chromeOptions : {
                            args : [ '--headless', '--disable-gpu', '--no-sandbox', '--lang=ru-RU' ],
                            binary : require('puppeteer').executablePath()
                        }
                    },
                    reporters : internReporters
                }
            }
        }
    });
    
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);    
    grunt.loadNpmTasks('intern');

    grunt.registerTask('test-runner-only',  (target) => {
        // Launch Chrome.
        const chromedriver = require('chromedriver');
        const args = ['--port=' + webDriverPortParam, '--url-base=wd/hub'];
        chromedriver.start(args);

        target = target || 'headless';
        grunt.task.run('intern:' + target);
    });

    // Building
    // "test" - build and run tests
    grunt.registerTask('test', () => {
        var tasks = [];
        tasks.push('run:buildtests');
        tasks.push('test-runner-only');
        grunt.task.run(tasks);
    });

    // Default task
    grunt.registerTask('default', ['test']);
};
