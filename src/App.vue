<script>
import Vue from 'vue'
import comm from '@/comm/comm'
import sync from '@/comm/sync'

// #ifdef H5
import AMapLoader from '@amap/amap-jsapi-loader'
// #endif

// #ifdef APP-PLUS
import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update'
// #endif

export default {
    async onLaunch() {

        // #ifdef H5
        // console.warn("local=======*****&&&&&&&&&$!^&(*#&!($&!(#@")
        // #ifdef H5-ZLB
        // 修改字体
        let _this = this;
        // console.log("ZWJSBridge------", ZWJSBridge)
        ZWJSBridge.onReady(() => {
            ZWJSBridge.setTitle({
                "title": "环浙步道"
            }).then(res => {
                // console.log("修改当前页面的标题成功---", res)
            }).catch(err => {
                // console.error("修改当前页面的标题失败---", err)
            })
            // console.info('浙里办初始化完成，执行bridge方法')
            ZWJSBridge.getUiStyle().then(({ uiStyle }) => {  // 获取style,适老化配置
                uni.setStorageSync("uiStyle",uiStyle)
                // console.log("获取到的当前的style======", uiStyle)
                // uiStyle = 'elder'
                let fontSize = '10px'
                // console.warn("uiStyle === 'elder'---------------------", uiStyle === 'elder')
                if (uiStyle === 'elder') {
                    fontSize = '16px'
                } else {
                    fontSize = '10px'
                }
                _this.$nextTick(() => {
                    document.documentElement.style.fontSize = fontSize
                    // 方案2修改字体
                    let htmlFont = document.getElementsByTagName('html')[0]
                    htmlFont.style.fontSize = fontSize  // 测试16px
                    // console.warn("changeFontSize----------------------", fontSize)
                })
            })
        })





        // #endif








        // #ifndef H5-ZLB
        this.$nextTick(() => {
            let fontSize = '10px'
            document.documentElement.style.fontSize = fontSize
            let htmlFont = document.getElementsByTagName('html')[0]
            htmlFont.style.fontSize = fontSize  // 测试16px
            // console.warn("changeFontSize----------------------", fontSize)
        })
        // #endif





        // #endif

        await uni.getSystemInfo({
            success(e) {
                Vue.prototype.WinHeight = e.windowHeight
                Vue.prototype.WinWidth = e.windowWidth
                Vue.prototype.StatusBar = e.statusBarHeight
                Vue.prototype.platform = e.platform
                // #ifdef APP-PLUS
                Vue.prototype.CustomBar = e.statusBarHeight + 44
                // console.info('App Launch at APP-PLUS' + ' | WinHeight: ' + e.windowHeight + ' | CustomBar: ' + Vue.prototype.CustomBar + ' | StatusBar: ' + Vue.prototype.StatusBar);
                // #endif

                // #ifdef H5
                window.model = e.model
                e.platform = 'H5'
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
                e.platform = 'H5-ZLB'
                e.uniPlatform = 'H5-ZLB'
                Vue.prototype.platform = 'H5-ZLB'
                Vue.prototype.CustomBar = e.statusBarHeight
                // #endif


                // #ifdef MP-WEIXIN
                Vue.prototype.platform = 'MP-WEIXIN';
                let custom = wx.getMenuButtonBoundingClientRect()
                Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
                // console.log('App Launch at MP-WEIXIN' + ' | WinHeight: ' + e.windowHeight + ' | CustomBar: ' + Vue.prototype.CustomBar + ' | StatusBar: ' + e.statusBarHeight);
                // #endif

                // #ifdef MP-ALIPAY
                Vue.prototype.platform = 'MP-ALIPAY'
                Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight
                // console.log('App Launch at MP-ALIPAY' + ' | WinHeight: ' + e.windowHeight + ' | CustomBar: ' + (e.statusBarHeight + e.titleBarHeight) + ' | statusBarHeight: ' + e.statusBarHeight);
                // #endif

                uni.setStorageSync('sysInfo', e)
                comm.setStorage('clientInfo', {
                    OS: e.osName,
                    // PLATFORM: e.uniPlatform || e.platform,
                    PLATFORM: 'ZLB',
                    APPID: e.appId || '__UNI__210B33A',
                    deviceId: e.deviceId,
                    deviceModel: e.model
                })
            }
        })

        // #ifndef APP-PLUS
        await uni.getNetworkType({ success(e) { comm.setNet(e.networkType != 'none') } })
        // #endif

        uni.onNetworkStatusChange(e => {
            // #ifdef H5
            comm.setNet(e.isConnected)
            // #endif
            if (e.isConnected) {
                if (!uni.getStorageSync('sysInited')) {
                    uni.removeStorageSync('cur_deptId')
                    this.init()
                    uni.reLaunch({ url: '/pages/index/index' })
                }
                sync.go()
            }
        })
        this.init()

        // #ifdef APP-PLUS
        setTimeout(() => { checkUpdate() }, 3000)
        // #endif
    },
    onShow() {
        sync.go()
    },
    onHide() { },
    methods: {
        async init() {

            let dict = uni.getStorageSync('sys_dict') || {}
            this.zz.req({ $url: '/public/zz/dict', obj: true, v: dict.v }).then(e => {
                // console.log("获取到的dict----", e)
                if (e.v) {
                    Object.assign(dict, e)
                    uni.setStorageSync('sys_dict', dict)
                    uni.setStorageSync('sysInited', 1)
                }
            })
            let deptId = '330213'
            if (!uni.getStorageSync('sysInited')) {
                // #ifdef H5-ZLB
                // city: "宁波市"
                // cityName: "宁波市"
                // detailAddress: "浙江省宁波市奉化区斗门北路197号"
                // latitude: 29.677769971311186
                // longitude: 121.42248984154213
                // region: "奉化区"
                // townCode: "330213"
                await ZWJSBridge.getLocation().then(({ townCode }) => {
                    deptId = townCode
                }).catch(e => {
                    deptId = '330213'
                })
                // #endif

                // #ifndef H5-ZLB
                let [_, e] = await uni.getLocation(),
                    addr = await this.zz.reGeo([e.longitude, e.latitude])

                deptId = addr.addressComponent.adcode + ''
                // #endif

                //是否浙江地区
                uni.setStorageSync('cur_deptId', deptId.startsWith('33') ? deptId : '330213')
                await this.zz.setDept()
            }


            // #ifndef APP-PLUS
            comm.on([121, 29])
            AMapLoader.load({
                key: this.bd.amapKey,
                version: "2.0",
                plugins: ['AMap.Geolocation']
            }).then(e => {
                window.amapGeo = new AMap.Geolocation({
                    enableHighAccuracy: true, //是否使用高精度定位，默认:true
                    noIpLocate: 3,				//3: 所有终端禁止使用IP定位
                    noGeoLocation: 0,		  //1: 手机设备禁止使用浏览器定位
                    // timeout: 10000,           //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0,            //定位结果缓存0毫秒，默认：0
                    convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: false,        //显示定位按钮，默认：true
                    // buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                    // buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                })
            })
            // #endif

            // #ifdef APP-PLUS
            comm.on()
            // #endif
        }
    }
}
</script>

<style lang="scss">
/*每个页面公共css */
/* #ifndef APP-PLUS-NVUE */
@import '@/comm/colorui/main.css';
@import '@/comm/colorui/icon.css';
@import '@/comm/colorui/animation.css';
@import '@/comm/css/app.css';
@import '@/comm/css/zzIcon.css'; // 远程
@import '@/components/uParse/src/wxParse.css';

// view {
//     font-size: 1.6rem;
// }

// text {
//     font-size: 1.6rem;
// }

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
    /* border-radius: 200rpx; */
    position: absolute;
    top: 0rpx;
    right: -0rpx;
    font-size: 1.3rem;
    padding: 0rpx 10rpx;
    height: 38rpx;
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
    font-size: 1.2rem;
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
    padding: 0px 40rpx 0px;
    justify-content: space-between;
}
.nav-li {
    padding: 30rpx;
    border-radius: 12rpx;
    width: 45%;
    margin: 0 2.5% 40rpx;
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
    border-radius: 10rpx;
    opacity: 0.2;
    transform: scale(0.9, 0.9);
}
.nav-li.cur {
    color: #fff;
    background: rgb(94, 185, 94);
    box-shadow: 4rpx 4rpx 6rpx rgba(94, 185, 94, 0.4);
}
.nav-title {
    font-size: 1.6rem;
    font-weight: 300;
}
.nav-title::first-letter {
    font-size: 2rem;
    margin-right: 4rpx;
}
.nav-name {
    font-size: 1.4rem;
    text-transform: Capitalize;
    margin-top: 20rpx;
    position: relative;
}
.nav-name::before {
    content: '';
    position: absolute;
    display: block;
    width: 40rpx;
    height: 6rpx;
    background: #fff;
    bottom: 0;
    right: 0;
    opacity: 0.5;
}
.nav-name::after {
    content: '';
    position: absolute;
    display: block;
    width: 100rpx;
    height: 1px;
    background: #fff;
    bottom: 0;
    right: 40rpx;
    opacity: 0.3;
}
.nav-name::first-letter {
    font-weight: bold;
    font-size: 1.8rem;
    margin-right: 1px;
}
.nav-li text {
    position: absolute;
    right: 30rpx;
    top: 30rpx;
    font-size: 52rpx;
    width: 60rpx;
    height: 60rpx;
    text-align: center;
    line-height: 60rpx;
}
.text-light {
    font-weight: 300;
}
@keyframes show {
    0% {
        transform: translateY(-50px);
    }
    60% {
        transform: translateY(40rpx);
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
        transform: translateY(40rpx);
    }
    100% {
        transform: translateY(0px);
    }
}
/* #endif */
</style>