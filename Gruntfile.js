/*
 * Copyright (c) 2014 boxiang chen
 * Licensed under the MIT license.
 */

'use strict';

var path   = require('path');
var config = require('./test/config');

module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'tasks/*.js', '<%= mochaTest.test.src %>' ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        clean: {
            tests: ['.tmp']
        },

        qiniu: {
            options: {
                accessKey: config.accessKey,
                secretKey: config.secretKey,
                bucket: config.bucket,
                domain: config.domain,
                ignoreDup: true
            },

            resources: [
                {
                    cwd: 'test/fixtures',
                    pattern: '**/*.*'
                }
            ]
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    timeout: 60000
                },
                src: ['test/qiniu_deploy_test.js']
            }
        }
    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', ['clean', 'qiniu', 'mochaTest', 'clean']);
    grunt.registerTask('default', ['jshint', 'test']);
};
