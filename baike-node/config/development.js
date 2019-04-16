/**
 * Created by EFIDA on 2017/6/6.
 */
module.exports = {//开发环境
    url:'http://192.168.0.15:18080',
    redis:{
        host:'192.168.0.15',
        port:'6379',
        ttl: 60 * 60 * 24 * 30,
    }
};