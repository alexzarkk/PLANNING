<template>
    <view class="container">
        <cu-custom bgColor="bg-zzblue" :isBack="true">
            <!-- <block slot="content">{{sys.name}}</block> -->
            <block slot="content">环浙步道</block>
        </cu-custom>
        <view class="flex justify-between align-center">
            <view class="tui-page-title">用户注册</view>
            <view style="width: 200rpx" class="padding-right text-blue tui-btn-send" @click="repsd">找回密码</view>
        </view>

        <view class="tui-form">
            <view class="tui-view-input">
                <zz-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
                    <view class="tui-cell-input">
                        <text class="cuIcon-profile"></text>
                        <input placeholder="请输入姓名(请实名注册)" type="text" maxlength="6" :value="name" @input="inputName" />
                        <view class="tui-icon-close" v-show="name" @tap="clearInput(4)"><text class="cuIcon-close"></text></view>
                    </view>
                </zz-list-cell>
                <zz-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
                    <view class="tui-cell-input">
                        <text class="cuIcon-mobile"></text>
                        <input type="number" maxlength="11" placeholder="请输入手机号" :value="phone" @input="inputMobile" />
                        <view class="tui-icon-close" v-show="phone" @tap="clearInput(1)"><text class="cuIcon-close"></text></view>
                    </view>
                </zz-list-cell>
                <zz-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
                    <view class="tui-cell-input">
                        <text class="cuIcon-roundcheck"></text>
                        <input placeholder="请输入验证码" type="number" maxlength="4" @input="inputCode" />
                        <view class="tui-btn-send" :class="{ 'tui-gray': isSend }" :hover-class="isSend ? '' : 'tui-opcity'" :hover-stay-time="150" @click="getCode">
                            {{ btnSendText }}
                        </view>
                    </view>
                </zz-list-cell>
                <zz-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
                    <view class="tui-cell-input">
                        <text class="cuIcon-profile"></text>
                        <input :value="username" placeholder="请输入用户名" type="text" maxlength="12" @input="inputUsername" @blur="veri" />
                        <view class="tui-icon-close" v-show="username" @tap="clearInput(2)"><text class="cuIcon-close"></text></view>
                    </view>
                </zz-list-cell>
                <zz-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
                    <view class="tui-cell-input">
                        <text class="cuIcon-safe"></text>
                        <input :value="password" placeholder="请输入密码" password type="text" maxlength="12" @input="inputPwd" />
                        <view class="tui-icon-close" v-show="password" @tap="clearInput(3)"><text class="cuIcon-close"></text></view>
                    </view>
                </zz-list-cell>
            </view>

            <!-- <zz-dept @setDept="setDept"></zz-dept> -->

            <view class="padding-top">
                <view class="padding flex flex-direction">
                    <button class="cu-btn bg-blue lg" @click="submit" :disabled="disabled">
                        <text class="cuIcon-check"></text>
                        注册
                    </button>
                </view>
            </view>

            <view class="tui-cell-text text-center">
                注册即代表同意【环浙步道】用户
                <view class="tui-color-primary" hover-class="tui-opcity" :hover-stay-time="150" @tap="protocol('protocol')">服务协议</view>
                、
                <view class="tui-color-primary" hover-class="tui-opcity" :hover-stay-time="150" @tap="protocol('privacy')">隐私政策</view>
            </view>
        </view>
    </view>
</template>

<script>
// import { sys } from '@/common/dict';
var _isMobile = (v) => {
    return /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(v);
};
var cityData;

export default {
    computed: {
        disabled: function () {
            let bool = true;
            if (_isMobile(this.phone) && this.code.length == 4 && this.name && this.username && this.password.length >= 6 && !this.vali.phone && !this.vali.username && this.dept) {
                bool = false;
            }
            return bool;
        }
    },
    data() {
        return {
            // sys: sys,
            phone: '',
            name: '',
            username: '',
            password: '',
            code: '',
            dept: null,
            isSend: true,
            btnSendText: '获取验证码', //倒计时格式：(60秒)
            vali: {}
        };
    },
    methods: {
        getCode() {
            if (!this.phone || !_isMobile(this.phone)) return;
            if (this.isSend) return;
            const cutDown = (s) => {
                s--;
                if (s > 0) {
                    this.isSend = true;
                    this.btnSendText = '获取验证码（' + s + '）';
                    setTimeout(() => {
                        cutDown(s);
                    }, 1000);
                } else {
                    this.btnSendText = '获取验证码';
                    this.isSend = false;
                }
            };
            cutDown(61);
            this.zz
                .req({
                    url: '/admin/comm/captcha',
                    veri: false,
                    data: { phone: this.phone }
                })
                .then((res) => {
                    // console.log(res.data);
                });
        },
        submit() {
            if (!_isMobile(this.phone)) return this.zz.toast('请输入正确的手机号');
            if (this.code.length != 4) return this.zz.toast('请输入正确的验证码');
            if (!this.name) return this.zz.toast('请输入姓名');
            if (!this.username) return this.zz.toast('请输入用户名');
            if (this.password.length < 6) return this.zz.toast('密码长度不能少于6位数');
            if (!this.dept) return this.zz.toast('请选择属地');

            let user = {
                phone: this.phone,
                name: this.name,
                username: this.username,
                verifyCode: this.code,
                password: this.password,
                departmentId: this.dept.id + ''
            };
            this.zz
                .req({
                    url: '/admin/comm/reg',
                    veri: false,
                    loading: true,
                    data: user
                })
                .then((res) => {
                    if (res.code == 1000) {
                        uni.setStorageSync('user', res.data.user);
                        uni.setStorageSync('token', res.data.token);
                        uni.reLaunch({
                            url: '/pages/index'
                        });
                    }
                });
        },
        veri() {
            if (_isMobile(this.phone) || this.username != '') {
                this.zz
                    .req({
                        table: 'zz',
                        url: 'veriReg',
                        veri: false,
                        data: {
                            phone: this.phone,
                            username: this.username
                        }
                    })
                    .then((res) => {
                        // console.log(res);
                        this.vali = res.data;
                        if (this.vali.phone) return this.zz.toast('此手机号已注册');
                        this.isSend = false;
                        if (this.vali.username) this.zz.toast('此用户名已注册');
                    });
            }
        },

        setDept(e) {
            this.dept = e;
        },
        inputCode(e) {
            this.code = e.detail.value;
        },
        inputMobile: function (e) {
            this.phone = e.detail.value;
            this.veri();
        },
        inputName: function (e) {
            this.name = e.detail.value;
        },
        inputUsername: function (e) {
            this.username = e.detail.value;
        },
        inputPwd: function (e) {
            this.password = e.detail.value;
        },
        clearInput(type) {
            if (type == 1) {
                this.phone = '';
                this.isSend = true;
            } else if (type == 2) {
                this.username = '';
            } else if (type == 3) {
                this.password = '';
            } else {
                this.name = '';
            }
        },
        protocol(e) {
            this.zz.href('/pages/comm/doc/' + e);
        },
        repsd() {
            this.zz.href('/pages/comm/repsd');
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    background-color: #ffffff;
    height: 100vh;
    .tui-page-title {
        width: 80%;
        font-size: 48rpx;
        font-weight: bold;
        color: $uni-text-color;
        line-height: 42rpx;
        padding: 110rpx 40rpx 40rpx 40rpx;
        box-sizing: border-box;
    }
    .tui-form {
        padding-top: 32rpx;
        .tui-view-input {
            width: 100%;
            box-sizing: border-box;
            padding: 0 60rpx;
            .tui-cell-input {
                width: 100%;
                display: flex;
                align-items: center;
                padding-top: 20rpx;
                padding-bottom: $uni-spacing-col-base;
                input {
                    flex: 1;
                    padding-left: $uni-spacing-row-base;
                }
                .tui-icon-close {
                    margin-left: auto;
                }
                .tui-btn-send {
                    width: 200rpx;
                    white-space: nowrap;
                    text-align: right;
                    flex-shrink: 0;
                    font-size: $uni-font-size-base;
                    color: $uni-color-primary;
                }
                .tui-gray {
                    color: $uni-text-color-placeholder;
                }
            }
        }
        .tui-cell-text {
            width: 100%;
            padding: 40rpx $uni-spacing-row-lg;
            box-sizing: border-box;
            font-size: $uni-font-size-sm;
            color: $uni-text-color-grey;
            display: flex;
            align-items: center;
            .tui-color-primary {
                color: $uni-color-primary;
                padding-left: 4rpx;
            }
        }
        .tui-btn-box {
            width: 100%;
            padding: 0 $uni-spacing-row-lg;
            box-sizing: border-box;
            margin-top: 80rpx;
        }
    }
}

.tui-mask-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99996;
    transition: all 0.3s ease-in-out;
    opacity: 0;
    visibility: hidden;
}

.tui-mask-show {
    opacity: 1;
    visibility: visible;
}

.tui-picker-box {
    width: 100%;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    visibility: hidden;
    transform: translate3d(0, 100%, 0);
    transform-origin: center;
    transition: all 0.3s ease-in-out;
    min-height: 20rpx;
    background: #fff;
}

.tui-pickerbox-show {
    transform: translate3d(0, 0, 0);
    visibility: visible;
}

.picker-header {
    width: 100%;
    height: 90rpx;
    padding: 0 46rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    font-size: 32rpx;
    background: #fff;
}

.tui-list-item::after {
    left: 0;
}

.btn-cancle {
    padding: 20rpx;
    color: #888;
}

.btn-sure {
    padding: 20rpx;
    color: #5677fc;
}

.picker-view {
    width: 100%;
    height: 260px;
}

.item {
    line-height: 50px;
    text-align: center;
}

/* picker end*/

.search-box {
    width: 672rpx;
    border-radius: 10rpx;
    box-sizing: border-box;
    margin: 80rpx auto 40rpx auto;
    position: relative;
    /* #ifdef MP-ALIPAY */
    background: #fff;
    /* #endif */
}

.search-box::after {
    content: '';
    position: absolute;
    height: 200%;
    width: 200%;
    border: 1rpx solid #dbe1ef;
    transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    left: 0;
    top: 0;
    border-radius: 20rpx;
    pointer-events: none;
}

.s-img {
    width: 34rpx;
    height: 34rpx;
    margin-right: 17rpx;
    flex-shrink: 0;
}

.input {
    font-size: 32rpx;
    color: #353535;
    width: 565rpx;
    padding-right: 5rpx;
    box-sizing: border-box;
    height: 100%;
}

.text {
    padding: 0 10rpx;
    font-size: 32rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.pdr20 {
    padding-right: 20rpx;
}

.flr {
    margin-left: auto;
}

.btn-select {
    padding: 20rpx 40rpx;
}
</style>
