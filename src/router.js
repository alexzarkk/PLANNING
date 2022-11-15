import { RouterMount, createRouter } from 'uni-simple-router';

const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routes: [...ROUTES]
});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	console.log("路由前置_-------", to, from)
	next();
});
// 全局路由后置守卫
router.afterEach((to, from) => {
	console.log("路由后置！！！_-------", to, from)
	// 这里加入埋点
	if (to.meta.title) {
		console.log('settitle---------');
		// #ifdef H5-ZLB
		ZWJSBridge.setTitle({
			"title": to.meta.title
		}).then(res => {
			console.log("修改当前页面的标题成功---", res)
		}).catch(err => {
			console.error("修改当前页面的标题失败---", err)
		})
		// #endif

	}

})

export {
	router,
	RouterMount
}