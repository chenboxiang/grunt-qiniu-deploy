/*
 * grunt-qiniu-deploy
 * https://github.com/chenboxiang/grunt-qiniu-deploy
 *
 * Copyright (c) 2014 chenboxiang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    var qn = require('qn');
    var glob = require('glob');
    var async = require('async');
    var path = require('path');

    grunt.registerMultiTask('qiniu', 'qiniu upload grunt task', function() {
        var done = this.async();

        // ----------- normalize config
        var options = this.options({
            domain: 'http://{bucket}.qiniudn.com',
            // 1分钟
            timeout: 60 * 1000,
            /**
             * 生成qiniu上的存储路径(key)
             *
             * @param cwd
             * @param file
             */
            keyGen: function(cwd, file) {
                return file;
            },
            // 是否忽略重复文件
            ignoreDup: true
        });

        if (!options.accessKey || !options.secretKey || !options.bucket || !options.resources) {
            grunt.fail.fatal('accessKey, secretKey, bucket and resources are all required!');
        }
        // 替换掉domain中的bucket
        options.domain = options.domain.replace('{bucket}', options.bucket);

        var resources = options.resources;
        if (!Array.isArray(resources)) {
            resources = [resources];
        }
        resources.forEach(function(res) {
            res.cwd = res.cwd || process.cwd();
            // 转换成绝对路径
            if (!(path.resolve(res.cwd) === res.cwd)) {
                res.cwd = path.join(process.cwd(), res.cwd);
            }
        })

        // ----------- config qiniu
        var client = qn.create({
            accessKey: options.accessKey,
            secretKey: options.secretKey,
            bucket: options.bucket,
            domain: options.domain,
            timeout: options.timeout
        })

        // ----------- find files
        var resFiles = [];
        resources.forEach(function(o) {
            var files = [];
            if (!Array.isArray(o.pattern)) {
                o.pattern = [o.pattern];
            }
            o.pattern.forEach(function(p) {
                files = files.concat(glob.sync(p, {
                    cwd: o.cwd
                }))
            })

            resFiles.push({
                cwd: o.cwd,
                files: files
            })
        })
        grunt.verbose.ok('resources: ' + JSON.stringify(resFiles, null, 4));

        // ----------- do upload
        var uploadTasks = [];
        resFiles.forEach(function(o) {
            var cwd = o.cwd;
            o.files.forEach(function(file) {
                uploadTasks.push(makeUploadTask(cwd, file));
            })
        })
        grunt.log.ok('Start uploading resources.')
        async.series(uploadTasks, function(err, results) {
            if (err) {
                grunt.fail.fatal(err);

            } else {
                grunt.log.ok('All resources has uploaded yet!');
            }
            done(err, results);
        })

        /**
         * 构造async接收的task
         * @param cwd
         * @param file
         */
        function makeUploadTask(cwd, file) {
            function doUpload(callback) {
                var absolutePath = path.join(cwd, file);
                var key = options.keyGen(cwd, file);
                grunt.log.ok('Start uploading the file [' + file + '], qiniu key is: [' + key + ']');
                client.uploadFile(absolutePath, {key: key}, function(err, result) {
                    if (!err) {
                        grunt.log.ok('The file [' + file + '] has been uploaded yet.');
                    }
                    callback(err, result);
                });
            }

            return function(callback) {
                    // 验证是否已经存在此文件，存在则不重复上传
                    client.stat(file, function(err, stat) {
                        if (err || stat.error) {
                            doUpload(callback);

                        } else {
                            grunt.log.ok('The file [' + file + '] exists, so ignore it');
                            callback(null);
                        }
                    })
            }
        }
    })
};
