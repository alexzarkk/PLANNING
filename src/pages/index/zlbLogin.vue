<template>
    <view>
        <!-- 执行浙里办单点登录跳转 -->
        <!-- 登录中... -->
    </view>
</template>

<script>

// #ifdef H5-ZLB
import zwLogUtils from '@/comm/zwLogUtils'

console.log("引入浙里办日志工具", zwLogUtils)

// #endif

export default {
    data() {
        return {};
    },
    async onLoad() {
        uni.showLoading({
            title: '登录中...',
            mask: true
        })
        let ticket = this.zz.getQueryParam(window.location.search, 'ticket')
        if (ticket) {  // 有票据直接后台登录
            await this.loginSys(ticket)
        } else { // 没有票据去获取票据
            return this.loginZlb()  // 去单点登录 （或者微信的登录流程
        }
        // }
        // #endif
    },
    methods: {
        // #ifdef H5-ZLB
        // 去登录系统，使用ticket  
        // return: user:用户
        async loginSys(ticket, ticketId) {
            let res = await this.zz.req({ $url: '/admin/comm/loginGov', ticket, ticketId })
            console.error("loginSys====================", res)
            if (res) {
                const { user, token } = res
                if (user) {
                    // console.error('单点登录成功------------------:', user);
                    this.zz.setAcc(user) // 用户载入到缓存
                    this.zz.setToken(token) // token 载入到缓存
                    console.error("单点登录成功，去埋点")
                    zwLogUtils.initZwLog() // 新版埋点
                    this.$Router.push({
                        path: '/pages/index/index'
                    })
                    uni.hideLoading()
                }
            }
        },
        // 登录浙里办
        async loginZlb() {
            const sUserAgent = window.navigator.userAgent.toLowerCase()
            // 浙里办APP
            const bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1
            // 浙里办支付宝小程序
            const bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1
            //微信小程序
            const weChartApply = sUserAgent.indexOf("micromessenger") > -1;
            const { AccessKey, ZLB_ADDR, isDev } = this.bd
            console.info("ZLB_ADDR-----------------", ZLB_ADDR)
            let url = ''
            if (bIsAlipayMini || weChartApply) { // 支付宝小程序或者 微信小程序
                url = `https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&scope=1&servicecode=${AccessKey}&redirectUrl=${ZLB_ADDR[isDev]}`
            } else { // 浙里办APP
                url = `https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=${AccessKey}&redirectUrl=${ZLB_ADDR[isDev]}`
            }
            if (weChartApply) {
                console.log("微信端，不跳转地址----------", window.location.search)
                if (ZWJSBridge.ssoTicket) {
                    const ssoFlag = await ZWJSBridge.ssoTicket({})
                    if (ssoFlag && ssoFlag.result === true) {
                        if (ssoFlag.ticketId) {
                            console.info("微信单点登录", ssoFlag)
                            this.loginSys(null, ssoFlag.ticketId)
                        } else {
                            ZWJSBridge.openLink({ type: "reload" }).then(res => { res.ticketId })
                        }
                    }
                }
            } else {
                console.info('回调地址', url);
                window.location.replace(url)
            }
        },
        // #endif
    }
};
</script>

<style lang="scss" scoped>
</style>
