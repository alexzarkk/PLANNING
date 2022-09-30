<template>
    <view class="login">
        <view class="content">
            <image class="logo" src="@/static/icon/login.png" mode="heightFix"></image>
            <view class="describe">环浙步道步道资讯APP</view>

            <uni-forms :rules="rules" :value="form" ref="uForm" class="login-form">
                <uni-forms-item class="item-row" label="账号" name="username" required><input placeholder="用户名或手机号" v-model="form.username" /></uni-forms-item>
                <uni-forms-item class="item-row" label="密码" name="password" required><input placeholder="请输入密码" type="password" v-model="form.password" /></uni-forms-item>
                <uni-forms-item class="item-row" label="验证码" name="verifyCode" required>
                    <input type="number" placeholder="请输入验证码" v-model="form.verifyCode" />
                    <image @click="getVerifyCode" class="svg" :src="base64" style="height: 35px" v-if="base64" mode="heightFix" slot="right"></image>
                    <view @click="getVerifyCode" class="svg" v-html="svg" v-if="svg"></view>
                </uni-forms-item>
            </uni-forms>
            <button class="btn" @click="submit">登录</button>

            <view class="padding-top text-gray text-right flex justify-between">
                <view><text class="text-blue" @click="repsd">找回密码</text></view>
                <view><text class="text-blue" @click="reg">注册</text></view>
            </view>
            <!-- <view class="padding-top text-dark"> ©浙江省体育科学研究所 2022</view> -->
            <!-- <text class="padding-top text-center text-dark text-xs">当前版本：{{sys.version +' '+ sys.versionCode}}</text> -->
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            // sys: plus.runtime,
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
                            // min: 5,
                            required: true,
                            errorMessage: '请输入密码'
                        }
                    ]
                },
                verifyCode: {
                    rules: [
                        {
                            required: true,
                            errorMessage: '请输入验证码'
                        }
                    ]
                }
            }
        };
    },
    onLoad() {
        this.getVerifyCode();
    },
    methods: {
        async submit(form) {
            try {
                const isPass = await this.$refs.uForm.submit();
                if (!isPass) return;
                const res = await this.zz.req({
                    url: '/admin/comm/login',
                    loading: true,
                    veri: false,
                    data: {
                        ...this.form
                    }
                });
                // console.log(res);
                if (res.code == 1000) {
                    uni.setStorageSync('user', res.data.user);
                    uni.setStorageSync('token', res.data.token);
                    uni.reLaunch({
                        url: '/pages/index'
                    });
                } else {
                    this.getVerifyCode();
                }
            } catch (res) {
                this.getVerifyCode();
                // if (!(res.message || "").includes('验证码不正确')) this.getVerifyCode();
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
                console.log('res==========', res);

                // const data = res.data.data;
                // this.form.captchaId = res.data.captchaId;
                // if (data.includes('data:image/png;base64,')) {
                //     this.base64 = data;
                // } else {
                //     this.svg = data.replace('height=', 'height="35" test=');
                // }
            } catch (e) {
                console.log('请求错误', e);
            }
        },
        reg() {
            this.zz.href('/pages/comm/reg');
            // uni.redirectTo({
            // 	url:'/pages/login/input'
            // })
        },
        repsd() {
            this.zz.href('/pages/comm/repsd');
        }
    }
};
</script>
<style lang="scss">
@import url('./index.scss');
</style>
