/**
 * Created by EFIDA on 2017/6/6.
 */

process.env.NODE_ENV = 'development'; //设置环境配置为开发环境.发布到线上生产环境时注释掉此行

var path = require('path');
// 通过NODE_ENV来设置环境变量，如果没有指定则默认为生产环境
var env = process.env.NODE_ENV || 'production';
env = env.toLowerCase();
// 载入配置文件
var file = path.resolve(__dirname, env);
try {
    module.exports = require(file);
} catch (err) {
    throw err;
}