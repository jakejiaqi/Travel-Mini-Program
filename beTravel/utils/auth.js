/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */

const Auth = {}

/**
 * 获取当前登陆用户信息
 * @return {object}
 */
Auth.user = function() {
    return swan.getStorageSync('user');
}

/**
 * 获取token
 * @return {string}
 */
Auth.token = function() {
    return swan.getStorageSync('token');
}

/**
 * 判断是否有效期
 * @return {boolean}
 */
Auth.check = function() {
    let user = Auth.user()
    let token = Auth.token()
    if (user && Date.now() < swan.getStorageSync('expired_in') && token) {
        console.log('access_token过期时间：', (swan.getStorageSync('expired_in') - Date.now()) / 1000, '秒');
        return true;
    } else {
        return false;
    }
}

/**
 * 登录
 * @return {Promise} 登录信息
 */
Auth.login = function() {
    return new Promise(function(resolve, reject) {
        swan.login({
            success: function(res) {
                resolve(res);
            },
            fail: function(err) {
                reject(err);
            }
        });
    });
}

/**
 * 注销
 * @return {boolean}
 */
Auth.logout = function() {
    swan.removeStorageSync('user')
    swan.removeStorageSync('token')
    swan.removeStorageSync('expired_in')
    return true
}

/**
 * 获取授权登录加密数据
 */
Auth.getUserInfo = function(){
    return new Promise(function(resolve, reject) {
		Auth.login().then(data => {
			let args = {}
			args.code = data.code;
			swan.getUserInfo({
				success: function (res) {
                    //console.log(res);
                    args.iv = encodeURIComponent(res.iv);
					args.encryptedData = encodeURIComponent(res.data);
					resolve(args);
				},
				fail: function (err) {
					reject(err);
				}
			});
		})
    });
}

module.exports = Auth