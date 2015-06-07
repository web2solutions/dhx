'use strict';
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                force: true,
                laxcomma: true,
                globals: {
                    jQuery: true,
                    $dhx: true,
                    dhtmlx: true,
                    dhtmlXLayoutObject: true
                },
                reporter: require('jshint-stylish'),
            },
            uses_defaults: [
               'dhx.js', 'dhx.dataDriver.js', 'dhx.REST.js', 'dhx.ui.js', 'dhx.ui.data.js', 'dhx.ui.crud.js', 'dhx.ui.crud.simple.View.js', 'dhx.ui.crud.simple.View.Record.js', 'dhx.ui.crud.simple.View.FormWindow.js', 'dhx.ui.crud.simple.View.settings.js', 'latinize.js', 'dhx.MQ.js', 'dhx.ui.crud.simple.View.Search.js', 'dhx.jDBd.js', 'dhx.dataStore.js', 'dhx.socket.js', 'dhx.xml.js', 'dhx.ui.crud.simple.js', 'dhx.ui.i18n.js', 'dhx.ui.i18n.pt-br.js', 'dhx.ui.i18n.en-us.js', 'dhx.jDBd.js', 'dhx.dataStore.js','dhx.ui.Application.js','dhx.ui.Session.js', 'dhx.ui.desktop.js', 'dhx.ui.desktop.settings.js', 'dhx.ui.desktop.view.js', 'dhx.ui.desktop.view.ActiveDesktop.js', 'dhx.ui.desktop.view.TopBar.js', 'dhx.ui.desktop.view.SideBar.js', 'shim.js', 'dhx.crypt.js', 'dhx.Encoder.js', 'dhx.shortcut.js', 'dhx.Request.js', 'dhx.cookie.js', 'dhx.dhtmlx.js'
            ],
            with_overrides: {
                options: {
                    curly: false,
                    undef: true,
                },
                files: {
                    src: []
                },
            }
        }

        ,
        jsbeautifier: {
            files: ["dhtmlx.js"],
            options: {
                //config: "path/to/configFile",
                js: {
                    braceStyle: "collapse",
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: " ",
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0,
                    endWithNewline: true
                }
            }
        }

		,cssbeautifier : {
		  files : ["dhtmlx.css"]
		}
        ,
        watch: {
            scripts: {
                files: [
                   'dhx.js', 'dhx.dataDriver.js', 'dhx.REST.js', 'dhx.ui.js', 'dhx.ui.data.js', 'dhx.ui.crud.js', 'dhx.ui.crud.simple.View.js', 'dhx.ui.crud.simple.View.Record.js', 'dhx.ui.crud.simple.View.FormWindow.js', 'dhx.ui.crud.simple.View.settings.js', 'latinize.js', 'dhx.MQ.js', 'dhx.ui.crud.simple.View.Search.js', 'dhx.jDBd.js', 'dhx.dataStore.js', 'dhx.socket.js', 'dhx.xml.js', 'dhx.ui.crud.simple.js', 'dhx.ui.i18n.js', 'dhx.ui.i18n.pt-br.js', 'dhx.ui.i18n.en-us.js', 'dhx.jDBd.js', 'dhx.dataStore.js','dhx.ui.Application.js','dhx.ui.Session.js', 'dhx.ui.desktop.js', 'dhx.ui.desktop.settings.js', 'dhx.ui.desktop.view.js', 'dhx.ui.desktop.view.ActiveDesktop.js', 'dhx.ui.desktop.view.TopBar.js', 'dhx.ui.desktop.view.SideBar.js', 'shim.js', 'dhx.crypt.js', 'dhx.Encoder.js', 'dhx.shortcut.js', 'dhx.Request.js', 'dhx.cookie.js', 'dhx.dhtmlx.js'
                ],
                tasks: [
                    'uglify'
                    //,'jshint'
                ],
                options: {
                    interrupt: true,
                }
            }
        }

		,version: {
			dhx: {
			  options: {
				prefix: 'version\\s+:\\s+[\'"]'
			  },
			  src: ['dhx.js', 'dhx.dataDriver.js', 'dhx.REST.js', 'dhx.ui.js', 'dhx.ui.data.js', 'dhx.ui.crud.js', 'dhx.ui.crud.simple.View.js', 'dhx.ui.crud.simple.View.Record.js', 'dhx.ui.crud.simple.View.FormWindow.js', 'dhx.ui.crud.simple.View.settings.js', 'latinize.js', 'dhx.MQ.js', 'dhx.ui.crud.simple.View.Search.js', 'dhx.jDBd.js', 'dhx.dataStore.js', 'dhx.socket.js', 'dhx.xml.js', 'dhx.ui.crud.simple.js', 'dhx.ui.i18n.js', 'dhx.ui.i18n.pt-br.js', 'dhx.ui.i18n.en-us.js', 'dhx.jDBd.js', 'dhx.dataStore.js','dhx.ui.Application.js','dhx.ui.Session.js', 'dhx.ui.desktop.js', 'dhx.ui.desktop.settings.js', 'dhx.ui.desktop.view.js', 'dhx.ui.desktop.view.ActiveDesktop.js', 'dhx.ui.desktop.view.TopBar.js', 'dhx.ui.desktop.view.SideBar.js', 'shim.js', 'dhx.crypt.js', 'dhx.Encoder.js', 'dhx.shortcut.js', 'dhx.Request.js', 'dhx.cookie.js', 'dhx.dhtmlx.js']
			},
			dhx_patch: {
			  options: {
				release: 'patch'
			  },
			  src: ['dhx.js', 'dhx.dataDriver.js', 'dhx.REST.js', 'dhx.ui.js', 'dhx.ui.data.js', 'dhx.ui.crud.js', 'dhx.ui.crud.simple.View.js', 'dhx.ui.crud.simple.View.Record.js', 'dhx.ui.crud.simple.View.FormWindow.js', 'dhx.ui.crud.simple.View.settings.js', 'latinize.js', 'dhx.MQ.js', 'dhx.ui.crud.simple.View.Search.js', 'dhx.jDBd.js', 'dhx.dataStore.js', 'dhx.socket.js', 'dhx.xml.js', 'dhx.ui.crud.simple.js', 'dhx.ui.i18n.js', 'dhx.ui.i18n.pt-br.js', 'dhx.ui.i18n.en-us.js', 'dhx.jDBd.js', 'dhx.dataStore.js','dhx.ui.Application.js','dhx.ui.Session.js', 'dhx.ui.desktop.js', 'dhx.ui.desktop.settings.js', 'dhx.ui.desktop.view.js', 'dhx.ui.desktop.view.ActiveDesktop.js', 'dhx.ui.desktop.view.TopBar.js', 'dhx.ui.desktop.view.SideBar.js', 'shim.js', 'dhx.crypt.js', 'dhx.Encoder.js', 'dhx.shortcut.js', 'dhx.Request.js', 'dhx.cookie.js', 'dhx.dhtmlx.js'],
			}
		  }
        ,
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: [{
                        expand: true,
                        src: [
                           'dhx.js', 'dhx.dataDriver.js', 'dhx.REST.js', 'dhx.ui.js', 'dhx.ui.data.js', 'dhx.ui.crud.js', 'dhx.ui.crud.simple.View.js', 'dhx.ui.crud.simple.View.Record.js', 'dhx.ui.crud.simple.View.FormWindow.js', 'dhx.ui.crud.simple.View.settings.js', 'latinize.js', 'dhx.MQ.js', 'dhx.ui.crud.simple.View.Search.js', 'dhx.jDBd.js', 'dhx.dataStore.js', 'dhx.socket.js', 'dhx.xml.js', 'dhx.ui.crud.simple.js', 'dhx.ui.i18n.js', 'dhx.ui.i18n.pt-br.js', 'dhx.ui.i18n.en-us.js', 'dhx.jDBd.js', 'dhx.dataStore.js','dhx.ui.Application.js','dhx.ui.Session.js', 'dhx.ui.desktop.js', 'dhx.ui.desktop.settings.js', 'dhx.ui.desktop.view.js', 'dhx.ui.desktop.view.ActiveDesktop.js', 'dhx.ui.desktop.view.TopBar.js', 'dhx.ui.desktop.view.SideBar.js', 'shim.js', 'dhx.crypt.js', 'dhx.Encoder.js', 'dhx.shortcut.js', 'dhx.Request.js', 'dhx.cookie.js', 'dhx.dhtmlx.js'//, 'dhtmlx.js'
						   
                        ],
                        dest: 'codebase/', //cwd: 'app/scripts' // <%= pkg.version %>
                    }]
                    /*src: [
                            'dhx.js', 'dhx.dataDriver.js', 'dhx.REST.js', 'dhx.ui.js', 'dhx.ui.data.js', 'dhx.ui.crud.js', 'dhx.ui.crud.simple.View.js', 'dhx.ui.crud.simple.View.Record.js', 'dhx.ui.crud.simple.View.FormWindow.js', 'dhx.ui.crud.simple.View.settings.js', 'latinize.js', 'dhx.MQ.js', 'dhx.ui.crud.simple.View.Search.js', 'dhx.jDBd.js', 'dhx.dataStore.js', 'dhx.socket.js', 'dhx.xml.js'
                        ],
		  dest: 'build/<%= pkg.name %>.min.js'*/
            }
        }
        //my_src_files: ['foo/*.js', 'bar/*.js'],
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-jsbeautifier");
	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-cssbeautifier');
    //grunt.loadNpmTasks('grunt-readme');

    grunt.registerTask('default', [ /*'readme'*/ , 'uglify']);
};
