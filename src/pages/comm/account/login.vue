<template>
    <view class="login">
        <view v-if="isReady" class="content">
            <image class="logo" src="https://zts.5618.co/repo/login.png" mode="heightFix"></image>
            <view class="describe">环浙步道服务应用</view>

            <!-- <uni-forms :rules="rules" :value="form" ref="uForm" class="login-form">
                <uni-forms-item class="item-row" label="账号" name="username" required>
                    <input placeholder="用户名或手机号" maxlength="11" v-model="form.username" />
                </uni-forms-item>
                <uni-forms-item class="item-row" label="密码" name="password" required>
                    <input placeholder="请输入密码" type="password" maxlength="12" v-model="form.password" />
                </uni-forms-item>
                <uni-forms-item class="item-row" label="验证码" name="verifyCode" required>
                    <input type="number" placeholder="请输入验证码" maxlength="4" v-model="form.verifyCode" />
                    <image @click="getVerifyCode" class="svg" :src="base64" style="height: 35px" v-if="base64" mode="heightFix" slot="right"></image>
                    <view @click="getVerifyCode" class="svg" v-html="svg" v-if="svg"></view>
                </uni-forms-item>
            </uni-forms>
            <view class="login-opt-list">
                <button class="btn lg cu-btn" @click="submit">
                    <text v-if="loading" class="cuIcon-loading2 cuIconfont-spin"></text>
                    账号密码登录
                </button>
                <button v-if="isPreUniLogin" class="btn lg cu-btn bg-blue margin-sm" @click="handleUniLogin">
                    本机号码一键登录
                </button>
                <button class=" btn lg cu-btn apple-btn" @click="appleLogin">
                     通过Apple登录
                </button>
            </view>
            <view class="padding-top text-gray text-right flex justify-between">
                <view><text class="text-blue" @click="repsd">找回密码</text></view>
                <view><text class="text-blue" @click="reg">注册</text></view>
            </view> -->
            <view v-show="isLoginFormShow">
                <uni-forms :rules="rules" :value="form" ref="uForm" class="login-form">
                    <uni-forms-item class="item-row" label="账号" name="username" required>
                        <input placeholder="用户名或手机号" maxlength="11" v-model="form.username" />
                    </uni-forms-item>
                    <uni-forms-item class="item-row" label="密码" name="password" required>
                        <input placeholder="请输入密码" type="password" maxlength="12" v-model="form.password" />
                    </uni-forms-item>
                    <uni-forms-item class="item-row" label="验证码" name="verifyCode" required>
                        <input type="number" placeholder="请输入验证码" maxlength="4" v-model="form.verifyCode" />
                        <image @click="getVerifyCode" class="svg" :src="base64" style="height: 35px" v-if="base64" mode="heightFix" slot="right"></image>
                        <view @click="getVerifyCode" class="svg" v-html="svg" v-if="svg"></view>
                    </uni-forms-item>
                </uni-forms>

                <button class=" login-btn" @click="submit">
                    <text v-if="loading" class="cuIcon-loading2 cuIconfont-spin"></text>
                    登录
                </button>

                <view class="padding-top text-gray text-right flex justify-between">
                    <view><text class="text-blue" @click="repsd">找回密码</text></view>
                    <view><text class="text-blue" @click="reg">注册</text></view>
                </view>

                <!--  v-if="isPreUniLogin" -->
                <!-- 如果可以一键登录或者使用苹果登录则可以跳转 -->
                <view v-if="isPreUniLogin || sysInfo.platform == 'ios'" class="padding-top text-center flex justify-center">
                    <view><text class="text-blue text-lg" @click="isLoginFormShow = !isLoginFormShow">其他登录方式</text></view>
                </view>

            </view>
            <view v-show="!isLoginFormShow" class="margin-lr margin-top">
                <view class="login-opt-list">
                    <button v-if="isPreUniLogin" class="btn bg-blue" @click="handleUniLogin">
                        <text class="cuIcon-mobile"></text>
                        <text class="margin-left-xs">本机号码一键登录</text>
                    </button>

                    <!-- <button v-if="sysInfo.platform == 'ios'" class="bg-white margin-lg" @click="appleLogin">
                        <text class="zzIcon-apple-fill"></text>
                        <text class="margin-left-xs">通过 Apple 登录</text>
                    </button> -->

                    <button v-if="sysInfo.platform == 'ios'" class="btn apple-btn" @click="appleLogin">
                         通过Apple登录
                    </button>
                </view>

                <view class="padding-top text-center flex justify-center">
                    <view><text class="text-blue text-lg" @click="isLoginFormShow = !isLoginFormShow">账号密码登录</text></view>
                </view>
            </view>
            <view class="text-center padding margin-top">
                <text class="text-white text-center" @click="back">返回{{ isBack ? '' : '首页' }}</text>
            </view>

            <view class="padding-top text-dark text-sm">{{ sys.copyright }}</view>
            <!-- #ifdef APP-PLUS -->
            <text class="padding-top text-center text-dark text-xs">当前版本：{{ sys.version + ' ' + sys.versionCode }}</text>
            <!-- #endif -->
        </view>
    </view>
</template>

<script>
import {
    md5
} from '@/comm/libs/md5'
import {
    sys
} from '@/comm/bd'
import {
    isSafe
} from './reg'

export default {
    data() {
        return {
            sys,
            sysInfo: uni.getStorageSync('sysInfo'),
            isReady: false,  // 是否已查询了一键登录
            isPreUniLogin: false, // 是否预登录，预登录则显示一键登录按钮
            isAppleLogin: false, // 是否能使用Apple一键登录
            loading: false,
            isBack: false, // 是否是返回上一页  否的话跳转到首页

            isLoginFormShow: false, // 是否显示账号密码登录
            path: '', // 返回路径
            form: {
                username: '',
                password: '',
                verifyCode: ''
            },
            svg: '',
            base64: '',
            rules: {
                username: {
                    rules: [{
                        required: true,
                        errorMessage: '请输入账号'
                    }]
                },
                password: {
                    rules: [{
                        required: true,
                        errorMessage: '请输入密码'
                    },
                    {
                        validateFunction: function (rule, value, data, callback) {
                            if (value.length < 6) {
                                callback('密码不得少于6位');
                            }
                            return true;
                        }
                    }
                    ]
                },
                verifyCode: {
                    rules: [{
                        required: true,
                        errorMessage: '请输入验证码'
                    },
                    {
                        validateFunction: function (rule, value, data, callback) {
                            if (value.length < 4) {
                                callback('验证码不得少于4位');
                            }
                            return true;
                        }
                    }
                    ]
                }
            }
        };
    },
    async onLoad({ v }) {
        if (v) {
            const {
                back,
                path
            } = this.zz.getParam(v);
            this.isBack = back
            this.path = path
        }

        // #ifdef APP-PLUS
        this.sys = Object.assign(sys, plus.runtime);
        uni.showLoading({ title: '正在获取登录方式' })
        try {
            const isCanUniLogin = await this.checkUniLogin()
            if (isCanUniLogin) {
                this.isPreUniLogin = await this.preUniLogin()
            } else {
                this.isLoginFormShow = true
            }
        } catch (error) {
            console.log("一键登录检查失败-------", error)
        }
        uni.hideLoading()
        // #endif

        // #ifdef H5
        this.isLoginFormShow = true
        // #endif

        this.getVerifyCode();
        this.isReady = true
    },
    methods: {
        // 检查是否可以使用一键登录
        // return  true:可以使用 false:无法使用
        async checkUniLogin() {
            return new Promise((resolve, reject) => {
                uni.getProvider({
                    service: 'oauth',
                    success: (res) => {
                        console.log("oauth============", res.provider) // ['qq', 'univerify']
                        if (res.provider.includes('univerify')) { // 包含了uni 一键登录
                            resolve(true)
                        }
                    },
                    fail: (err) => {
                        console.error("获取一键登录信息失败，无法使用一键登录")
                        reject(false)
                    }
                });
            })
        },
        // 预登录，查询是否可以使用uni一键登录
        preUniLogin() {
            return new Promise((resolve, reject) => {
                uni.preLogin({
                    provider: 'univerify',
                    success(res) { //预登录成功
                        // 显示一键登录选项
                        console.log("预登录========", res)
                        resolve(true)
                    },
                    fail(res) { // 预登录失败
                        console.warn("预登录失败--------", res)
                        reject(res)
                        // 不显示一键登录选项（或置灰）
                        // 根据错误信息判断失败原因，如有需要可将错误提交给统计服务器
                        // console.log(res.errCode)
                        // console.log(res.errMsg)
                    }
                })
            })
        },
        // 使用一键登录, success:去后台申请登录  fail：用户关闭了一键登录
        univerifyLogin() {
            return new Promise((resolve, reject) => {
                uni.login({
                    provider: 'univerify',  // 使用一键登录
                    univerifyStyle: { // 自定义登录框样式
                        //参考`univerifyStyle 数据结构`
                    },
                    success(res) { // 登录成功
                        resolve(res.authResult)
                        console.log("登录成功-----------------", res.authResult); // {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
                    },
                    fail(res) { // 登录失败
                        reject(res)
                        console.warn("一键登录失败-----------", res)
                        if (res.errCode) {  // 用户点击了其他登录方式
                            uni.closeAuthView()
                        }
                        console.log(res.errCode)
                        console.log(res.errMsg)
                    }
                })
            })
        },
        // 使用一键登录
        async handleUniLogin() {
            try {
                const loginParams = await this.univerifyLogin()
                const res = await this.zz.req({
                    $url: 'admin/comm/loginUni',
                    ...loginParams
                });
                console.log("uniapp 一键登录", res)
                if (res.token) {
                    this.zz.setAcc(res.user)
                    this.zz.setToken(res.token)
                    this.back()
                } else {
                    this.zz.toast("服务器错误,请稍后重试")
                    console.log("登录失败", res)
                }
            } catch (error) {
                console.error("登录失败-------", error)
                // this.zz.toast("登录失败请稍后重试")
            }
            uni.closeAuthView()
        },

        async appleLogin() {
            let thiz = this
            uni.login({
                provider: 'apple',
                success: function (loginRes) {
                    // 登录成功
                    uni.getUserInfo({
                        provider: 'apple',
                        success: async function (info) {
                            console.log("apple 一键登录", loginRes, info)
                            // 获取用户信息成功, info.authResult中保存登录认证数据
                            thiz.zz.req({
                                $url: 'admin/comm/loginApple',
                                ...info.userInfo
                            }, true).then(res => {
                                console.log("appleLogin 一键登录", res)
                                if (res.token) {
                                    thiz.zz.setAcc(res.user)
                                    thiz.zz.setToken(res.token)
                                    thiz.back()
                                } else {
                                    thiz.zz.toast("服务器错误,请稍后重试")
                                    console.log("登录失败", res)
                                }
                            })
                        }
                    })
                },
                fail: function (err) {
                    // 登录授权失败  
                    // err.code错误码参考`授权失败错误码(code)说明`
                }
            });
        },

        // 提交
        async submit(form) {
            try {
                const isPass = await this.$refs.uForm.submit();
                if (!isPass || this.loading) return
                this.loading = true
                const res = await this.zz.req({
                    $url: 'admin/comm/login',
                    username: this.form.username,
                    password: md5(this.form.password),
                    verifyCode: this.form.verifyCode,
                    captchaId: this.form.captchaId
                });
                this.loading = false;

                if (res.token) {
                    this.zz.setAcc(res.user)
                    this.zz.setToken(res.token)

                    let r = isSafe(this.form.password)
                    if (r) {
                        const [_, ask] = await uni.showModal({
                            title: '提示',
                            content: '您的密码过于简单，存在安全风险，建议您及时修改',
                            cancelText: '下次再说',
                            confirmText: '去修改'
                        })
                        if (ask.confirm) {
                            return uni.redirectTo({
                                url: '/pages/comm/account/repsd'
                            })
                        }
                    }

                    uni.$emit('commentLogin')
                    this.back()
                } else {
                    this.getVerifyCode()
                }
            } catch (res) {
                this.getVerifyCode();
            } finally {
                this.loading = false;
            }
        },
        // 获取验证码
        async getVerifyCode() {
            try {
                const res = await this.zz.req({
                    $url: '/admin/comm/captcha',
                    height: 20,
                    width: 100
                });
                const data = res.data;
                this.form.captchaId = res.captchaId;
                if (data.includes('data:image/png;base64,')) {
                    this.base64 = data;
                } else {
                    this.svg = data.replace('height=', 'height="35" test=');
                }
            } catch (e) {
                console.error('请求错误', e);
            }
        },
        // 注册
        reg() {
            this.zz.href('/pages/comm/account/reg');
        },
        // 找回密码
        repsd() {
            this.zz.href('/pages/comm/account/repsd');
        },
        back() {
            if (this.isBack) {
                uni.navigateBack()
            } else {
                // this.zz.href(this.path || '/pages/index/index');
                this.zz.href(this.path || '/pages/share');
            }
        }
    }
};
</script>
<style lang="scss">
input {
    color: #fff !important;
    font-weight: 600;
}

.login {
    background: #2f3447;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
}

.content {
    text-align: center;
    width: calc(100vw - 40rpx);
    padding: 0 24rpx;
}

.logo {
    height: 80rpx;
}

.describe {
    color: #ccc;
    margin-top: 20rpx;
}

.login-form {
    margin-top: 40rpx;
}

.u-form-item__body,
.u-input__input,
.u-form-item,
.uni-input-wrapper,
.u-input {
    color: #ccc !important;
}

.login-btn {
    margin-top: 100rpx;
}

.login-opt-list {
    margin-top: 100rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .btn {
        width: 600rpx;
        margin-bottom: 40rpx;
        font-size: 32rpx;
        border-radius: 16rpx;
    }

    .apple-btn {
        margin-top: 10rpx;
        color: #000000;
        background-color: #ffffff;
        // height: 30pt;
        // border-radius: 6pt;
    }
}

.item-row {
    border-bottom: 1px solid #fff;
    display: flex;
    align-items: center;
}
</style>
