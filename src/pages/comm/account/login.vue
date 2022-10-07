<template>
    <view class="login">
        <view class="content">
            <image class="logo" src="https://zts.5618.co/repo/login.png" mode="heightFix"></image>
            <view class="describe">环浙步道服务应用</view>

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
            <button class="btn" @click="submit">
                <text v-if="loading" class="cuIcon-loading2 cuIconfont-spin"></text>
                登录
            </button>

            <view class="padding-top text-gray text-right flex justify-between">
                <view><text class="text-blue" @click="repsd">找回密码</text></view>
                <view><text class="text-blue" @click="reg">注册</text></view>
            </view>

            <view class="text-center padding margin-top">
                <text class="text-white text-center" @click="back">返回{{ isBack ? '' : '首页' }}</text>
            </view>

            <view class="padding-top text-dark text-sm">{{ sys.footer.content }}</view>
            <!-- #ifdef APP-PLUS -->
            <text class="padding-top text-center text-dark text-xs">当前版本：{{ sys.version + ' ' + sys.versionCode }}</text>
            <!-- #endif -->
        </view>
    </view>
</template>

<script>
import { md5 } from '@/comm/libs/md5'
import { sys } from '@/comm/bd'
import { isSafe } from './reg'

export default {
    data() {
        return {
            sys,
            loading: false,
            isBack: false, // 是否是返回上一页  否的话跳转到首页
            form: {
                username: '',
                password: '',
                verifyCode: ''
            },
            svg: '',
            base64: '',
            rules: {
                username: {
                    rules: [
                        {
                            required: true,
                            errorMessage: '请输入账号'
                        }
                    ]
                },
                password: {
                    rules: [
                        {
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
                    rules: [
                        {
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
    onLoad({ v }) {
        if (v) {
            const { back } = this.zz.getParam(v);
            this.isBack = back;
        }
        // #ifdef APP-PLUS
        this.sys = Object.assign(sys, plus.runtime);
        // #endif
        this.getVerifyCode();
    },
    methods: {
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
                    await this.zz.setAcc(res.user);
                    this.zz.setToken(res.token)
					
					let r = isSafe(this.form.password)
					if(r) {
						const [_, ask] = await uni.showModal({
							title: '提示',
							content: '您的密码过于简单，存在安全风险，建议您及时修改',
							cancelText: '下次再说',
							confirmText: '去修改'
						})
						if (ask.confirm) {
							return uni.redirectTo({
								url:'/pages/comm/account/repsd'
							})
						}
					}
					
                    uni.$emit('commentLogin');
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
			    uni.navigateBack();
			} else {
			    this.zz.href('/pages/index/index');
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
.btn {
    margin-top: 120rpx;
}

.item-row {
    border-bottom: 1px solid #fff;
    display: flex;
    align-items: center;
}
</style>
