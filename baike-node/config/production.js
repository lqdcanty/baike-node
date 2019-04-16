/**
 * Created by EFIDA on 2017/6/6.
 */
module.exports = {//生产环境
    url:'http://10.10.10.38:18080',
    redis:{
        host:'10.10.10.37',
        port:'7100',
        ttl: 60 * 60 * 24 * 30,
    }
};