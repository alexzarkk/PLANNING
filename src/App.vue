<script>
import Vue from 'vue'
import comm from '@/comm/comm'
import sync from '@/comm/sync'

// #ifdef APP-PLUS
import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update'
const locationModule = uni.requireNativePlugin('XM_Alive_Location')
// #endif

export default {
    onLaunch() {

        uni.getSystemInfo({
            success: function (e) {
                Vue.prototype.WinHeight = e.windowHeight
                Vue.prototype.WinWidth = e.windowWidth
                Vue.prototype.StatusBar = e.statusBarHeight
                Vue.prototype.platform = e.platform
                // #ifdef APP-PLUS
                Vue.prototype.CustomBar = e.statusBarHeight + 44
                console.info('App Launch at APP-PLUS' + ' | WinHeight: ' + e.windowHeight + ' | CustomBar: ' + Vue.prototype.CustomBar + ' | StatusBar: ' + Vue.prototype.StatusBar);
                // #endif

                // #ifdef H5
                window.model = e.model
                e.platform = 'H5';
                Vue.prototype.platform = 'H5'
                Vue.prototype.CustomBar = e.statusBarHeight //+ 44  // H5 端使用 

                const u = navigator.userAgent.toLowerCase()
                //内置浏览器
                if (u.match(/MicroMessenger/i) == "micromessenger"
                    || u.match(/WeiBo/i) == "weibo"
                    || (u.indexOf('qq') != -1 && u.indexOf('mqqbrowser') == -1)
                    || /alipay/ig.test(u)
                    || u.indexOf('dingtalk') != -1
                    || u.indexOf('zlb') != -1) {

                    e.platform = 'H5-APP'
                    Vue.prototype.platform = 'H5-APP'
                }
                // #endif
				
                // #ifdef H5-ZLB
                e.platform = 'H5-ZLB';
                Vue.prototype.platform = 'H5-ZLB'
                Vue.prototype.CustomBar = e.statusBarHeight
                ZWJSBridge.onReady(() => {
                    console.log('浙里办初始化完成，执行bridge方法')
                    ZWJSBridge.getUiStyle().then(res=>{  // 获取style,适老化配置

                    })
                })
                console.log('浙里办启动 H5-ZLB ---------------------->')
                // #endif

                // #ifdef MP-WEIXIN
                Vue.prototype.platform = 'MP-WEIXIN';
                let custom = wx.getMenuButtonBoundingClientRect()
                Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
                console.log('App Launch at MP-WEIXIN' + ' | WinHeight: ' + e.windowHeight + ' | CustomBar: ' + Vue.prototype.CustomBar + ' | StatusBar: ' + e.statusBarHeight);
                // #endif

                // #ifdef MP-ALIPAY
                Vue.prototype.platform = 'MP-ALIPAY'
                Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight
                console.log('App Launch at MP-ALIPAY' + ' | WinHeight: ' + e.windowHeight + ' | CustomBar: ' + (e.statusBarHeight + e.titleBarHeight) + ' | statusBarHeight: ' + e.statusBarHeight);
                // #endif

                // console.log('sysInfo ------->', e)
                uni.setStorageSync('sysInfo', e)
                comm.setStorage('clientInfo', JSON.stringify({
                    PLATFORM: e.uniPlatform || e.platform,
                    OS: e.osName,
                    APPID: e.appId || '__UNI__210B33A',
                    deviceId: e.deviceId,
                    deviceModel: e.model
                }))

                // #ifdef APP-PLUS
                if (e.platform == 'ios') locationModule.requestAlwaysAuthorization()
                // #endif
            }
        })

        // #ifdef APP-PLUS
        setTimeout(() => { checkUpdate() }, 3000)
        // #endif

        // #ifndef APP-PLUS
        uni.getNetworkType({ success(e) { comm.setNet(e.networkType != 'none') } })
        // #endif

        // uni.clearStorageSync()
        this.zz.init()
    },
    onShow() {
        sync.go()
        uni.onNetworkStatusChange(e => {
            // console.log(e,'onShow //////');
            // #ifndef APP-PLUS
            comm.setNet(e.networkType != 'none')
            // #endif

            if (e.isConnected) {
                sync.go()
            }
        })
    },
    onHide() { },
    methods: {}
}
</script>

<style lang="scss">
/*每个页面公共css */
/* #ifndef APP-PLUS-NVUE */

@import './comm/colorui/main.css';
@import './comm/colorui/icon.css';
@import './comm/colorui/animation.css';
@import './comm/css/app.css';
// @import './comm/css/zzIcon.css';  // 远程
@import './comm/css/local/zzIcon.css'; // 本地
@import './components/uParse/src/wxParse.css';
/* 我增加的样式 */
body.pages-index-index uni-page-body {
    padding-top: 0 !important;
}
input[type='number'] {
    color: #1b5ed9;
}
input[type='text'] {
    color: #1b5ed9;
}
/* 隐藏mapbox */
a.mapboxgl-ctrl-logo {
    display: none !important;
}
.mapboxgl-ctrl-attrib {
    display: none !important;
}
.mybadge {
    /* border-radius: 200upx; */
    position: absolute;
    top: 0upx;
    right: -0upx;
    font-size: 26upx;
    padding: 0upx 10upx;
    height: 38upx;
    color: #ffffff;
}
.text-through {
    text-decoration: line-through;
}
.text-underline {
    text-decoration: line-underline;
}
// 没有更多了的文字
.tui-nomore-text {
    color: #999;
    font-size: 24rpx;
    text-align: center;
    padding: 0 2px;
    height: 36rpx;
    line-height: 36rpx;
    position: relative;
    z-index: 1;
}
.sticky-box {
    /* #ifndef APP-PLUS-NVUE */
    position: -webkit-sticky;
    /* #endif */
    position: sticky;
    top: var(--window-top);
    z-index: 888;
    margin: 0px;
    padding: 0px;
}
.pre-line {
    white-space: pre-line;
    text-indent: 1em;
    word-break: break-all;
    text-indent: 2em;
}
.safe-area {
    height: 1rpx;
    padding-bottom: env(safe-area-inset-bottom);
}
.bg-theme {
    // 主题色背景
    background-color: #0477b3;
}
/* #endif */
/* #ifndef APP-NVUE */
.nav-list {
    display: flex;
    flex-wrap: wrap;
    padding: 0px 40upx 0px;
    justify-content: space-between;
}
.nav-li {
    padding: 30upx;
    border-radius: 12upx;
    width: 45%;
    margin: 0 2.5% 40upx;
    /* background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png); */
    background-size: cover;
    background-position: center;
    position: relative;
    z-index: 1;
}
.nav-li::after {
    content: '';
    position: absolute;
    z-index: -1;
    background-color: inherit;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: -10%;
    border-radius: 10upx;
    opacity: 0.2;
    transform: scale(0.9, 0.9);
}
.nav-li.cur {
    color: #fff;
    background: rgb(94, 185, 94);
    box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
}
.nav-title {
    font-size: 32upx;
    font-weight: 300;
}
.nav-title::first-letter {
    font-size: 40upx;
    margin-right: 4upx;
}
.nav-name {
    font-size: 28upx;
    text-transform: Capitalize;
    margin-top: 20upx;
    position: relative;
}
.nav-name::before {
    content: '';
    position: absolute;
    display: block;
    width: 40upx;
    height: 6upx;
    background: #fff;
    bottom: 0;
    right: 0;
    opacity: 0.5;
}
.nav-name::after {
    content: '';
    position: absolute;
    display: block;
    width: 100upx;
    height: 1px;
    background: #fff;
    bottom: 0;
    right: 40upx;
    opacity: 0.3;
}
.nav-name::first-letter {
    font-weight: bold;
    font-size: 36upx;
    margin-right: 1px;
}
.nav-li text {
    position: absolute;
    right: 30upx;
    top: 30upx;
    font-size: 52upx;
    width: 60upx;
    height: 60upx;
    text-align: center;
    line-height: 60upx;
}
.text-light {
    font-weight: 300;
}
@keyframes show {
    0% {
        transform: translateY(-50px);
    }
    60% {
        transform: translateY(40upx);
    }
    100% {
        transform: translateY(0px);
    }
}
@-webkit-keyframes show {
    0% {
        transform: translateY(-50px);
    }
    60% {
        transform: translateY(40upx);
    }
    100% {
        transform: translateY(0px);
    }
}
/* #endif */
</style>