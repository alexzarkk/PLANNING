<template>
    <view class="container">
        <cu-custom :isBack="true" bgColor="bg-gradual-blue">
            <block slot="content">个人设置</block>
            <!-- <block slot="right">
				<button class="cu-btn xs line-red round shadow" @tap="killme">
					<text class="cuIcon-delete"></text>
					<text class="text-sm text-white">删除账号</text>
				</button>
			</block> -->
        </cu-custom>

        <view class="padding-tb flex flex-direction align-center">
            <view class="flex">
                <view class="flex-sub padding-sm radius"></view>
                <view class="flex-treble padding-sm radius">
                    <view class="text-center">
                        <image :src="img || 'https://zts.5618.co/static/default-avatar.png'" mode="aspectFill" @tap="chooseImg"></image>
                    </view>
                </view>
                <!-- <view class="flex-sub padding-sm radius text-gray text-right">
					{{ dept[user.departmentId] }}
				</view> -->
            </view>
            <view class="text-center">
                <text class="padding-xs text-center text-gray">点击更换头像照片</text>
            </view>
        </view>

        <form class="bg-white">
            <view class="cu-form-group padding-top">
                <view class="title">姓名</view>
                <input name="input" v-model="user.name" maxlength="12" placeholder="请输入姓名" @blur="val" />
            </view>
            <view class="cu-form-group padding-top-xs">
                <view class="title">手机</view>
                <input name="input" v-model="user.phone" maxlength="11" placeholder="请输入手机号" @blur="val" />
            </view>
            <view class="cu-form-group padding-top-xs">
                <view class="title">邮箱</view>
                <input name="input" v-model="user.email" maxlength="30" placeholder="请输入邮箱" @blur="val" />
            </view>
            <view class="cu-form-group">
                <view class="title">用户名</view>
                <input name="input" v-model="user.username" maxlength="12" placeholder="请输入用户名" @blur="val" />
            </view>
            <view class="cu-form-group padding-top-xs">
                <view class="title">昵称</view>
                <input name="input" v-model="user.nickName" maxlength="12" placeholder="请输入昵称" @blur="val" />
            </view>
            <view class="padding-left bg-white flex align-center solid-bottom">
                <view class="title">签名</view>
                <view class="flex-twice padding-sm">
                    <view class="tui-cells">
                        <textarea class="tui-textarea" placeholder="如有请输入..." maxlength="100" placeholder-class="phcolor" v-model="user.desc" />
                        <view class="textarea-counter">{{ descNum }}/100</view>
                    </view>
                </view>
            </view>
        </form>

        <!--底部操作栏-->
        <view class="cu-tabbar-height"></view>
        <view class="cu-bar bg-white tabbar border shop foot">
            <button class="action text-red" @tap="killme">
                <view class="cuIcon-delete"></view>
                删除账号
            </button>
            <button class="action text-orange" @tap="repsd">
                <view class="cuIcon-safe"></view>
                重设密码
            </button>
            <view class="submit cuIcon-check" :class="'bg-' + (vali ? 'blue' : 'gray')" @tap="save">保 存</view>
        </view>
    </view>
</template>

<script>
var _isMobile = (v) => {
    return /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(v);
};
var _isEmail = (v) => {
    return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(v);
};

// import { deptk } from '@/common/dict';
export default {
    computed: {
        descNum: function () {
            return this.user.desc.length;
        }
    },
    data() {
        return {
            // dept: deptk(),
            user: { desc: '' },
            img: '',
            vali: false
        };
    },
    onLoad: async function (e) {
        let user = this.zz.getAcc();
        Object.assign(this.user, user);
        this.img = this.user.headImg;
        this.val();
    },
    methods: {
        repsd(n) {
            this.zz.href('/pages/login/repsd');
        },
        val() {
            let bool = false;
            if (this.user.phone != '' && _isMobile(this.user.phone) && this.user.name != '' && this.user.username != '' && this.user.nickName != '') {
                bool = true;
            }
            if (this.user.email && !_isEmail(this.user.email)) {
                this.zz.toast('邮箱格式输入有误');
                bool = false;
            }
            this.vali = bool;
        },
        chooseImg() {
            //选择图片
            uni.chooseImage({
                sourceType: ['camera', 'album'],
                sizeType: ['compressed'],
                count: 1,
                success: (res) => {
                    this.img = res.tempFilePaths[0];
                    this.uploadImg(res.tempFilePaths[0]);
                }
            });
        },
        async uploadImg(url) {
            uni.showLoading();
            const result = await uniCloud.uploadFile({
                filePath: url,
                cloudPath: this.user._id + '_avtar.jpg',
                onUploadProgress: function (progressEvent) {
                    // console.log(progressEvent)
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                }
            });
            await this.zz.req({
                url: '/admin/app/space/info/delete',
                data: { url: this.user.headImg }
            });
            this.img = result.fileID;
            this.user.headImg = result.fileID;
            this.update();
        },
        async save() {
            this.val();
            if (!this.vali) return this.zz.toast('请完善表单内容');
            this.update();
        },
        killme() {
            this.zz.modal(
                '删除账号操作将会同时删除您在本APP所保存的所有个人数据',
                (e) => {
                    if (e) {
                        this.zz
                            .req({
                                url: '/admin/comm/logout',
                                data: { userId: this.user._id, killme: true }
                            })
                            .then((e) => {
                                uni.removeStorageSync('user');
                                uni.removeStorageSync('token');
                                uni.reLaunch({
                                    url: '/pages/login/login'
                                });
                            });
                    }
                },
                true,
                '高风险提示'
            );
        },
        update() {
            this.zz
                .req({
                    url: '/admin/comm/personUpdate',
                    loading: true,
                    data: this.user
                })
                .then((res) => {
                    if (res.code == 1000) {
                        uni.setStorageSync('user', this.user);
                        this.zz.toast('信息修改成功');
                        setTimeout(() => {
                            uni.navigateBack({
                                delta: 1
                            });
                        }, 500);
                    }
                });
        }
    }
};
</script>

<style lang="scss" scoped>

.container{
    height: 100vh;
    background-color: #f1f1f1;
}
page{
    background-color: #f1f1f1;
}

body{
    background-color: #f1f1f1;
}

.cu-form-group .title {
    min-width: calc(4em + 15px);
    border-right: 1rpx solid rgba(0, 0, 0, 0.1);
}

image {
    width: 320rpx;
    height: 320rpx;
    border-radius: 60rpx;
}
input {
    margin-left: 5rpx;
}

.tui-cells {
    border: 1rpx solid #e6e6e6;
}

.tui-textarea {
    padding: 5px;
    height: 120rpx;
    width: 100%;
    color: #737373;
    font-size: 1.4rem;
}

.tui-phcolor {
    color: #c8c8c8;
    font-size: 1.4rem;
}

.textarea-counter {
    font-size: 1.2rem;
    color: #999;
    text-align: right;
    height: 40rpx;
    line-height: 40rpx;
    padding-top: 4rpx;
}

.tui-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    overflow: hidden;
    position: relative;
}

.tui-icon-close {
    position: absolute;
    right: 30rpx;
    top: 50%;
    transform: translateY(-50%);
}
</style>
