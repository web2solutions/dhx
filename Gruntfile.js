'use strict';
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
		, jshint: {
			options: {
				curly: true
				, eqeqeq: true
				, eqnull: true
				, browser: true
				, force : true
				, laxcomma : true
				, globals: {
					jQuery: true
					, $dhx: true
					, dhtmlx: true
					, dhtmlXLayoutObject: true
				}
				, reporter: require('jshint-stylish')
			, }
			, uses_defaults: [
					'dhx.js'
					, 'dhx.dataDriver.js'
					, 'dhx.REST.js'
					, 'dhx.ui.js'
					, 'dhx.ui.data.js'
					, 'dhx.ui.crud.js'
					, 'dhx.ui.crud.simple.View.js'
					, 'dhx.ui.crud.simple.View.Record.js'
					, 'dhx.ui.crud.simple.View.FormWindow.js'
					, 'dhx.ui.crud.simple.View.settings.js'
					, 'latinize.js'
				]
			, with_overrides: {
				options: {
					curly: false
					, undef: true
				, }
				, files: {
					src: []
				}
			, }
		}
		, watch: {
			scripts: {
				files: [
					'dhx.js'
					, 'dhx.dataDriver.js'
					, 'dhx.REST.js'
					, 'dhx.ui.js'
					, 'dhx.ui.data.js'
					, 'dhx.ui.crud.js'
					, 'dhx.ui.crud.simple.View.js'
					, 'dhx.ui.crud.simple.View.Record.js'
					, 'dhx.ui.crud.simple.View.FormWindow.js'
					, 'dhx.ui.crud.simple.View.settings.js'
					, 'latinize.js'
				]
				, tasks: [
					'uglify'
					//,'jshint'
				]
				, options: {
					interrupt: true
				, }
			, }
		, }
		, uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			}
			, build: {
				files: [{
						expand: true
						, src: [
							'dhx.js'
							, 'dhx.dataDriver.js'
							, 'dhx.REST.js'
							, 'dhx.ui.js'
							, 'dhx.ui.data.js'
							, 'dhx.ui.crud.js'
							, 'dhx.ui.crud.simple.View.js'
							, 'dhx.ui.crud.simple.View.Record.js'
							, 'dhx.ui.crud.simple.View.FormWindow.js'
							, 'dhx.ui.crud.simple.View.settings.js'
							, 'latinize.js'
						]
						, dest: 'build'
						, //cwd: 'app/scripts'
					}]
					/*src: [
		  		'dhx.js'
				, 'dhx.dataDriver.js'
				, 'dhx.REST.js'
				, 'dhx.ui.js'
				, 'dhx.ui.data.js'
				, 'dhx.ui.crud.js'
				, 'dhx.ui.crud.simple.View.js'
				, 'dhx.ui.crud.simple.View.Record.js'
				, 'dhx.ui.crud.simple.View.FormWindow.js'
				, 'dhx.ui.crud.simple.View.settings.js'
				, 'latinize.js'
			],
		  dest: 'build/<%= pkg.name %>.min.js'*/
			}
		}
		//my_src_files: ['foo/*.js', 'bar/*.js'],
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
};