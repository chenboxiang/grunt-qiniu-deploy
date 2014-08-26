/*
 * grunt-qiniu-deploy
 * https://github.com/chenboxiang/grunt-qiniu-deploy
 *
 * Copyright (c) 2014 chenboxiang
 * Licensed under the MIT license.
 */

'use strict';

var qn     = require('qn');
var glob   = require('glob');
var async  = require('async');
var path   = require('path');

module.exports = function (grunt) {

    grunt.registerMultiTask('qiniu', 'qiniu upload grunt task', function () {

        var done = this.async();

        var options = this.options({
            domain: 'http://{bucket}.qiniudn.com',

            // timeout 1 minute
            timeout: 60 * 1000,

            // 生成qiniu上的存储路径(key)
            keyGen: function (cwd, file) {
                return file;
            },

            // 是否忽略重复文件
            ignoreDup: true
        });

        if (!options.accessKey || !options.secretKey || !options.bucket) {
            grunt.fail.fatal('accessKey, secretKey and bucket are required!');
        }

        // 替换掉domain中的bucket
        options.domain = options.domain.replace('{bucket}', options.bucket);

        var resources = this.data;
        if (!Array.isArray(resources)) {
            resources = [resources];
        }

        // 转换成绝对路径
        resources.forEach(function (res) {
            res.cwd = res.cwd || process.cwd();
            if (!(path.resolve(res.cwd) === res.cwd)) {
                res.cwd = path.join(process.cwd(), res.cwd);
            }
        });

        // config client
        var client = qn.create({
            accessKey: options.accessKey,
            secretKey: options.secretKey,
            bucket: options.bucket,
            domain: options.domain,
            timeout: options.timeout
        });

        // resource files
        var resourceFiles = [];
        resources.forEach(function (o) {
            var files = [];

            if (!Array.isArray(o.pattern)) {
                o.pattern = [o.pattern];
            }

            o.pattern.forEach(function (p) {
                files = files.concat(glob.sync(p, {
                    cwd: o.cwd
                }))
            });

            resourceFiles.push({
                cwd: o.cwd,
                files: files
            })
        });

        grunt.verbose.ok('resources: ' + JSON.stringify(resourceFiles, null, 4));

        // construct upload tasks
        var uploadTasks = [];
        resourceFiles.forEach(function (o) {
            var cwd = o.cwd;
            o.files.forEach(function (file) {
                uploadTasks.push(makeUploadTask(cwd, file));
            })
        });

        grunt.log.ok('Start uploading resources ...');

        // upload
        async.series(uploadTasks, function (err, results) {
            if (err) {
                grunt.fail.fatal(err);
            } else {
                grunt.log.ok('All resources has been uploaded !');
            }
            done(err, results);
        });

        // construct upload task
        function makeUploadTask(cwd, file) {
            function doUpload(callback) {
                var absolutePath = path.join(cwd, file);
                var key = options.keyGen(cwd, file);

                grunt.log.ok('Start uploading file: ' + file);

                client.uploadFile(absolutePath, {key: key}, function (err, result) {
                    if (!err) {
                        grunt.log.ok('Upload success !');
                    }
                    callback(err, result);
                });
            }

            return function (callback) {
                // 验证是否已经存在此文件，存在则不重复上传
                if (options.ignoreDup) {
                    client.stat(file, function (err, stat) {
                        if (err || stat.error) {
                            doUpload(callback);
                        } else {
                            grunt.log.ok('Skip duplicated file: ' + file);
                            callback(null);
                        }
                    })
                } else {
                    doUpload(callback)
                }
            }
        }
    })
};
