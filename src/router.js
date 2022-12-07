import { RouterMount, createRouter } from 'uni-simple-router';

import zwLogUtils from '@/comm/zwLogUtils'
// console.log("路由守卫加载数据", zwLogUtils)
const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routes: [...ROUTES]
});
//全局路由前置守卫
router.beforeEach(async (to, from, next) => {
	console.log("路由前置_-------", to, from)

	let backList = [
		'/pages/index/planning',
		'/pages/index/index',
		'/pages/index/event',
		'/pages/index/me'
	]

	// 二次回退，回退到登录页面的话，则退出应用
	if (to.path === '/pages/index/zlbLogin' && backList.includes(from.path)) {
		console.error("关闭应用======================")
		ZWJSBridge.close()
	}
	//添加页面进入和页面离开的埋点
	// 进入时间
	// #ifdef H5-ZLB
	try {
		if (to.pageMeta && to.pageMeta.title) {
			let inPage = {
				title: to.pageMeta.title,
				pagePath: to.path,  // 进入的页面
				enterPageTime: new Date()  // 页面进入的时间
			}
			zwLogUtils.addZwLogPage(inPage)
			// 离开时间
			let outPage = {
				title: from.pageMeta.title || '',
				pagePath: from.path,  // 离开的页面
				leavePageTime: new Date()  // 页面离开的时间
			}
			zwLogUtils.addZwLogPage(outPage)


		}
	} catch (error) {
		console.error("加载title以及进入离开时间失败-----", error)
	}
	// #endif
	next();
});
// 全局路由后置守卫
router.afterEach((to, from) => {
	console.log("路由后置！！！_-------", to, from)
	// 这里加入埋点
	if (to.pageMeta.title && ZWJSBridge) {
		ZWJSBridge.onReady(() => {
			ZWJSBridge.setTitle({
				"title": to.pageMeta.title || '详情'
			}).then(res => {
				console.log("修改的标题=============", to.pageMeta.title)
				console.log("修改当前页面的标题成功---", res)
			}).catch(err => {
				console.error("修改当前页面的标题失败---", err)
			})
		})
	}

	setTimeout(() => {
		ZWJSBridge.setTitle({
			"title": to.pageMeta.title || '详情'
		}).then(res => {
			console.log("setTitle=============", to.pageMeta.title)
			console.log("setTitle---", res)
		}).catch(err => {
			console.error("setTitle---", err)
		})
	}, 100)

})

export {
	router,
	RouterMount
}