/*
 * grunt-seajs-config
 * https://github.com/chenboxiang/grunt-seajs-config
 *
 * Copyright (c) 2014 boxiang chen
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var config = require('./test/config');

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
            tests: ['.tmp']
        },

        // Configuration to be run (and then tested).
        qiniu: {
            config: {
                options: {
                    accessKey: config.accessKey,
                    secretKey: config.secretKey,
                    bucket: config.bucket,
                    domain: config.domain,
                    resources: [{
                        cwd: 'test/fixtures',
                        pattern: '**/*.*'
                    }]
                }
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
    grunt.registerTask('test', ['clean', 'qiniu', 'mochaTest', 'clean']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
