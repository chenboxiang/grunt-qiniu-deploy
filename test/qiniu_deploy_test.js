'use strict';

var should = require('should');
var fs     = require('fs');
var qn     = require('qn');
var config = require('./config.js');

var pending = function (n, fn) {
    return function (err) {
        if (err) return fn(err);
        --n || fn();
    }
};

describe('Deploy resources to qiniu', function () {
    before(function () {
        this.client = qn.create({
            accessKey: config.accessKey,
            secretKey: config.secretKey,
            bucket: config.bucket,
            domain: config.domain,
            timeout: 60 * 1000
        });
    });

    it('should upload all resources to qiniu', function (done) {

        var done = pending(2, done);

        this.client.download('js/grunt_qiniu_deploy_test.js', function (err, data) {
            if (err) throw err;
            var expected = fs.readFileSync('test/fixtures/js/grunt_qiniu_deploy_test.js', 'utf8');
            expected.should.equal(data.toString());
            done();
        });

        this.client.download('css/grunt_qiniu_deploy_test.css', function (err, data) {
            if (err) throw err;
            var expected = fs.readFileSync('test/fixtures/css/grunt_qiniu_deploy_test.css', 'utf8');
            expected.should.equal(data.toString());
            done();
        });
    });

    after(function (done) {
        var done = pending(2, done);
        this.client.delete('js/grunt_qiniu_deploy_test.js', done);
        this.client.delete('css/grunt_qiniu_deploy_test.css', done);
    });
});
