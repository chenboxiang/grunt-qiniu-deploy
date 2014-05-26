/*
 * grunt-seajs-config
 * https://github.com/chenboxiang/grunt-seajs-config
 *
 * Copyright (c) 2014 boxiang chen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'tasks/*.js', '<%= mochaTest.test.src %>' ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        seajsConfig: {
            config: {
                options: {
                    dest: 'tmp/seajs_config.js'
                },
                src: ['test/fixtures/seajs_module.js']
            }
        },

        // Unit tests.
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/qiniu_deploy_test.js']
            }
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Whenever the 'test' task is run, first clean the 'tmp' dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'seajsConfig', 'mochaTest', 'clean']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
