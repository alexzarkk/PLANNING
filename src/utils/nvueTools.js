const cloud = 'https://699d1eb1-ee53-4c66-bddd-06cda80d1231.bspapp.com/'
const api = {
	app: cloud + 'app',
	zz: cloud + 'http/zz',
	976: 'https://976m.org/GoAction_track.do'
}

function getToken() {
	return uni.getStorageSync("token")
}


function req(args = {}, loadding = false, method = "POST") {
	const token = getToken()
	const fn =  args.$fn||'app'
	const veri = args.$veri||false
	let requestData = {}
	const except = ['$fn', '$veri']
	let argKeys = Object.keys(args)
	argKeys.forEach(arg => {
		if (!except.includes(arg)) {
			requestData[arg] = args[arg]
		}
	})
	return new Promise((resolve, reject) => {
		try {
			uni.request({
				url: api[fn],
				header: {
					'content-type': 'application/json',
					authorization: token,
					platform: uni.getSystemInfoSync().platform.toLocaleLowerCase()
				},
				data: requestData,
				method,
				// timeout: mod == 'dev' ? 300000 : 60000,
				success: function(res) {
					const {
						code,
						data,
						message
					} = res.data;
					switch (code) {
						// 成功
						case 1000:
							resolve(data)
							break
							// 登录失效
						case 1002:
							uni.removeStorageSync('token')
							// zz.toast('登录已失效')
							// return toLogin()
							// break
							// 失败
						default:
							zz.toast("错误：" + message)
					}
				},
				fail: function(res) {
					console.log('uni.request.fail！', res)
					// zz.toast(res.message);
					reject(res)
				},
				complete() {
					if (loadding) uni.hideLoading()
				}
			})
		} catch (e) {
			//TODO handle the exception
		}
	})


}




export default {
	req
}
