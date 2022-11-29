import { RouterMount, createRouter } from 'uni-simple-router';

import zwLogUtils from '@/comm/zwLogUtils'
// console.log("路由守卫加载数据", zwLogUtils)
const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routes: [...ROUTES]
});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	console.log("路由前置_-------", to, from)
	//添加页面进入和页面离开的埋点
	// 进入时间
	// #ifdef H5-ZLB
	// if (to.path !== from.path) {  // 非首次进入程序，记录埋点

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
			// console.error("采集进入页面的===============时间和离开的时间=======================", inPage, outPage)
		}
	} catch (error) {
		console.error("加载title以及进入离开时间失败-----", error)
	}

	// }
	// #endif
	next();
});
// 全局路由后置守卫
router.afterEach((to, from) => {
	// console.log("路由后置！！！_-------", to, from)
	// 这里加入埋点
	// #ifdef H5-ZLB
	if (to.pageMeta.title && ZWJSBridge) {
		// console.log('settitle---------');
		ZWJSBridge.onReady(() => {
			ZWJSBridge.setTitle({
				"title": to.pageMeta.title
			}).then(res => {
				// console.log("修改当前页面的标题成功---", res)
			}).catch(err => {
				// console.error("修改当前页面的标题失败---", err)
			})
		})

	}
	// #endif
})

export {
	router,
	RouterMount
}