# grunt-qiniu-deploy [![Build Status](https://travis-ci.org/chenboxiang/grunt-qiniu-deploy.svg?branch=master)](https://travis-ci.org/chenboxiang/grunt-qiniu-deploy) [![NPM version](https://badge.fury.io/js/grunt-qiniu-deploy.png)](http://badge.fury.io/js/grunt-qiniu-deploy)

> 这个插件是用来将指定的静态资源部署到[qiniu](http://www.qiniu.com/)上

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-qiniu-deploy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-qiniu-deploy');
```

## The "qiniu" task

### Overview
In your project's Gruntfile, add a section named `qiniu` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  qiniu: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.accessKey
Type: `String`
Default: `none`

qiniu密钥里的AccessKey

#### options.secretKey
Type: `String`
Default: `none`

qiniu密钥里的SecretKey

#### options.bucket
Type: `String`
Default: `none`

qiniu空间名

#### options.domain
Type: `String`
Default: `http://{bucket}.qiniudn.com`

qiniu域名

#### options.resources
Type: `Object` `Array`
Default: `none`

resources中每个对象的数据结构为
```js
{
 		cwd: 'test/fixtures',
		pattern: '**/*.*'
}
```
通过[glob](https://github.com/isaacs/node-glob)模块匹配文件路径

#### options.keyGen
Type: `Function`
Default: 
```js
	function(cwd, file) {
                return file;
            }
```

文件上传到qiniu上的存储路径(key)生成器，默认是匹配出来的文件路径（相对cwd的路径）

#### options.ignoreDup
Type: `Boolean`
Default: `true`

是否忽略重复的文件，默认会判断cdn上是否存在此文件，有则不上传

### Usage Examples
可参见test, 目录结构：
```
	├── Gruntfile.js
	└── test
    ├── config.js
    ├── expected
    ├── fixtures
    │   ├── css
    │   │   └── grunt_qiniu_deploy_test.css
    │   └── js
    │       └── grunt_qiniu_deploy_test.js
    └── qiniu_deploy_test.js
```
Gruntfile.js中的配置：
```
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
        }
```
这个例子中会将test/fixtures下的所有文件上传的qiniu，css上传后的qiniu key：css/grunt_qiniu_deploy_test.css，其他文件类似。

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 0.1.0 

