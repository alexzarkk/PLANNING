
import zz from './zz'

console.log("引入了zz",zz.getAcc())

// 埋点对象
var zwlog;

// 页面埋点数据
var zwlogPageMap = {};

// 使用path当成key，装埋点数据

// 最小页面停留时间
const Min_Page_Stay_Duration = 0.5

// 不参加埋点的白名单
const White_List = [
    // 埋点跳过
    'pages/index/index'
]

// 进行初始化zwLog
function initZwLog() {
    let user = zz.getAcc()
    if (zwlog == null && user != null) {
        zwlog = new ZwLog({
            _user_id: user.zlb_id,
            _user_nick: user.zlb_name
        });
    }
    return zwlog
}

/**
 * 在页面中添加埋点日志
 * 注意点: zwlogPageMap 所有的数据通过关键字pagePath（页面路径进行匹配）
 * _this            【页面必填，App监听不填】  当前页面this      用于获取当前页面的pagePath，navigationBarTitle
 * pagePath         【页面不填，App监听必填】  当前页面的路径     通过路径来设置页面进入和离开时间，app.vue中监听路由只能拿到路径
 * enterPageTime    【页面不填，App监听必填】  进入页面的时间     app.vue中监听路由得到  路由守卫
 * leavePageTime    【页面不填，App监听必填】  离开页面的时间     app.vue中监听路由得到  路由后置守卫
 * loadTime         【页面必填，App监听不填】  页面开始加载的时间  页面中获取          
 * responseTime     【页面必填，App监听不填】  页面开始响应的时间  页面中获取  页面加载完成的时间
 */
function addZwLogPage({
    _this = null,
    pagePath = null,
    enterPageTime = null,
    leavePageTime = null,
    loadTime = null,
    responseTime = null
} = {}) {
    if (initZwLog() && (_this || pagePath)) {
        // 获取匹配的页面
        let path = _this ? _this.$mp.page.route : pagePath
        console.info("获取页面路径",path)
        // 移除测试页面带来的埋点干扰项
        if (White_List.indexOf(path) != -1) return
        let title = _this ? _this.$holder.navigationBarTitleText : null
        console.info('获取到的页面的titile',title)
        // 如果不存在当前页面的数据，那么就开始初始化
        if (!zwlogPageMap.hasOwnProperty(path)) {
            zwlogPageMap[path] = {
                pagePath: null,
                title: null,
                enterPageTime: null,
                leavePageTime: null,
                loadTime: null,
                responseTime: null
            }
        }

        // 写入当前数据
        if (path) {zwlogPageMap[path].path = path}
        if (title) {zwlogPageMap[path].title = title}
        if (enterPageTime) {zwlogPageMap[path].enterPageTime = enterPageTime}
        if (leavePageTime) {zwlogPageMap[path].leavePageTime = leavePageTime}
        if (loadTime) {zwlogPageMap[path].loadTime = loadTime}
        if (responseTime) { zwlogPageMap[path].responseTime = responseTime }

        // 如果当前页面的数据全部收集完毕
        if (zwlogPageMap[path].path &&
            zwlogPageMap[path].title &&
            zwlogPageMap[path].enterPageTime &&
            zwlogPageMap[path].leavePageTime &&
            zwlogPageMap[path].loadTime &&
            zwlogPageMap[path].responseTime) {

            // 页面浏览时长
            let Page_duration = (zwlogPageMap[path].leavePageTime.getTime() - zwlogPageMap[path].enterPageTime
                .getTime()) / 1000
            // 页面加载时间
            let t2 = (zwlogPageMap[path].loadTime.getTime() - zwlogPageMap[path].enterPageTime.getTime()) / 1000
            // 页面相应时间
            let t0 = (zwlogPageMap[path].responseTime.getTime() - zwlogPageMap[path].enterPageTime.getTime()) / 1000

            let pvParams = {
                miniAppId: getApp().globalData.miniAppId,
                miniAppName: getApp().globalData.miniAppName,
                log_status: '02',
                Page_duration: Page_duration,
                t2: t2,
                t0: t0,
                pageId: zwlogPageMap[path].path,
                pageName: zwlogPageMap[path].title
            }
            if (Page_duration < Min_Page_Stay_Duration) {
                console.log('\n\n提交埋点数据-删除数据',
                    `${path}浏览时长小于${Min_Page_Stay_Duration}秒`,
                    `我们认为当前页面的停留时间过短，可能是快速返回造成，不需要`)
                delete zwlogPageMap[path]
                return
            }
            zwlog.onReady(function () {
                console.log("\n提交埋点数据 zwlog.sendPV(pvParams)\n",
                    "\n查看NetWork - All(不进行筛选)-m.gif?xxxxxx\n",
                    `\n miniAppId（IRS服务侧应用appId） = ${pvParams.miniAppId}
                    \n miniAppName（IRS服务侧应用名称） = ${pvParams.miniAppName}
                    \n pageId（页面Id，自定义，这里使用路径） = ${pvParams.pageId}
                    \n pageName（页面名称） = ${pvParams.pageName}
                    \n log_status（登录状态‘01’未登录 ‘02’已登陆） = ${pvParams.log_status}
                    \n Page_duration（页面浏览时长） = ${pvParams.Page_duration}
                    \n t2（页面加载时间，启动到开始加载） = ${pvParams.t2}
                    \n t0（页面响应时间，启动到加载完毕） = ${pvParams.t0} \n\n `);
                if (getApp().globalData.ZlBRelease) zwlog.sendPV(pvParams)
                delete zwlogPageMap[path]
            })
        }
    }
}

/**
 * 对事件进行埋点
 * @param {Object} _this    当前页面this
 * @param {String} code     当前事件的code
 * code 对应点击事件的code 自行定义 给每一个模块区分编号，然后编号集合即可，建议使用两位数来表示编号
 * 如轮播区编号01，轮播图点击code = '01'
 * 如金刚区编号02，模块编号01，模块点击code = '0201'
 * 如资讯区编号03，新闻列表编号01，列表中点赞按钮编号01，收藏按钮编号02，
 * 点赞按钮点击code = '030101'，收藏按钮点击code = '030102'
 */
function addZwLogEvent(_this, code) {
    if (initZwLog() && _this && code) {
        let path = _this.$mp.page.route
        let title = _this.$holder.navigationBarTitleText
        zwlog.onReady(function () {
            console.log("\n提交埋点数据 zwlog.record",
                "\n 目前自定义参数pagePath和pageTitle,查看代码中最后一个Ojbect是可以任意赋值的，提交什么就会后台收到什么",
                `\n code = ${code}
                \n pagePath = ${path}
                \n pageTitle = ${title} \n\n `);
            zwlog.record(code, 'CLK', {
                pagePath: path,
                pageTitle: title
            })
        })
    }
}


module.exports = {
    initZwLog,
    addZwLogPage,
    addZwLogEvent
}