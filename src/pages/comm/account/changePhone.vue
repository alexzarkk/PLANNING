<template>
    <view class="container">
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">环浙步道</block>
        </cu-custom>
        <view class="tui-page-title">更换绑定手机号</view>

        <view class="tui-form">
            <view class="tui-view-input">
                <tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
                    <view class="tui-cell-input">
                        <text class="cuIcon-mobile"></text>
                        <input type="number" maxlength="11" placeholder="请输入新的手机号" :value="phone" @input="inputMobile" />
                        <view class="tui-icon-close" v-show="phone" @tap="clearInput(1)">
                            <text class="cuIcon-close"></text>
                        </view>
                    </view>
                </tui-list-cell>
                <view>
                    <tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
                        <view class="tui-cell-input">
                            <text class="cuIcon-roundcheck"></text>
                            <input placeholder="请输入验证码" type="number" maxlength="4" @input="inputCode" />
                            <view class="tui-btn-send" :class="{ 'tui-gray': isSend }" :hover-class="isSend ? '' : 'tui-opcity'" :hover-stay-time="150" @click="getCode">
                                {{ btnSendText }}
                            </view>
                        </view>
                    </tui-list-cell>
                </view>
            </view>
            <view class="padding-top">
                <view class="padding flex flex-direction">
                    <button class="cu-btn bg-blue lg" @click="bindPhone" :disabled="veried">确认换绑</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
// import { sys } from '@/common/dict';
var _isMobile = (v) => {
    return /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(v);
};

import { md5 } from '@/comm/libs/md5.js';

export default {
    computed: {
        
        // disabled: function () {
        //     let bool = true;
        //     if (_isMobile(this.phone) && this.vali.phone && this.code.length == 4) {
        //         bool = false;
        //     }
        //     return bool;
        // },
        // 当手机号和验证码都正确输入以后开启按钮
        veried: function () {
            let bool = true;
            // console.log(_isMobile(this.phone),!this.vali.phone,this.code.length == 4)
           if (_isMobile(this.phone) && !this.vali.phone && this.code.length == 4) {
                bool = false;
            }
            return bool;
        }
    },
    data() {
        return {
            // sys: sys,
            phone: '',
            code: '',
            isSend: true, // 是否可以发送验证码
            btnSendText: '获取验证码', //倒计时格式：(60秒)
            vali: {}
        };
    },
    onLoad() {},
    methods: {
        // 确认绑定新的手机号
        bindPhone() {
            // 手机号 + 验证码
            // 换绑成功 返回上一级，刷新缓存
            this.zz.req({
                // $url:'/admin/user/changeBindPhone',
                $url:'/user/user/changeBindPhone',
                phone:this.phone,  // 手机号
                verifyCode:this.code, // 验证码
                userId: this.zz.getAcc()._id
            }).then(res=>{
                // console.log("更换绑定的手机号",res)
                this.zz.toast("绑定成功")
                let userInfo = this.zz.getAcc()
                userInfo.phone = this.phone
                this.zz.setAcc(userInfo)
                setTimeout(()=>{
                    uni.navigateBack()
                },1000)
            }).catch(error=>{
                this.zz.toast("换绑失败",error.message)
            })
        },
        // 获取验证码
        getCode() {
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
            this.zz.req({ $url: '/admin/comm/captcha', phone: this.phone })
            this.code = ''
        },
        // 校验手机号是否已经被注册/绑定
        veri() {
			if(_isMobile(this.phone)) {
				this.zz.req({ $url: '/admin/comm/veriReg', phone: this.phone }).then((res)=>{
					this.vali = res
					this.isSend = this.vali.phone
					if(this.vali.phone) return this.zz.toast('此手机号已有绑定账户！')
				})
			}
			
            // if (_isMobile(this.phone)) {
            //     this.zz
            //         .req({
            //             $fn: 'zz',
            //             $url: 'veriReg',
            //             veri: false,
            //             phone: this.phone
            //         })
            //         .then((data) => {
            //             this.vali = data;
            //             this.isSend = this.vali.phone;
            //             if (this.vali.phone) {
            //                 return this.zz.toast('此手机号已有绑定账户');
            //             }
            //         });
            // }
        },
        // 输入验证码
        inputCode(e) {
            this.code = e.detail.value;
        },
        // 输入手机号
        inputMobile: function (e) {
            this.phone = e.detail.value;
            this.veri();
        },
        // 清空手机号
        clearInput() {
                this.phone = '';
        }
    }
};
</script> 

<style lang="scss" scoped>
.container {
    background-color: #ffffff;
    height: 100vh;
    .tui-page-title {
        width: 100%;
        font-size: 2.4rem;
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
    font-size: 1.6rem;
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
    font-size: 1.6rem;
    color: #353535;
    width: 565rpx;
    padding-right: 5rpx;
    box-sizing: border-box;
    height: 100%;
}

.text {
    padding: 0 10rpx;
    font-size: 1.6rem;
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
