<template>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">创建队伍</block>
            <view slot="right">
                <!-- <view class="padding-right">完成</view> -->
            </view>
        </cu-custom>
        <view class="container">
            <!-- 上传头像 (可选) -->
            <view @click="changeAvatar" style="height:500rpx;" class=" padding">
                <!-- <tui-upload :value="teamHeadImg" :limit="1"  @complete="imgComplete" @remove="remove"></tui-upload> -->
                <view v-if="teamHeadImg" class="flex flex-direction align-center justify-center">
                    <tui-lazyload-img v-if="teamHeadImg" width="400rpx" height="400rpx" :src="teamHeadImg"></tui-lazyload-img>
                </view>
                <view v-else style="height:500rpx" class="flex flex-direction align-center justify-center">

                    <view class="cu-avatar xl round margin-bottom">
                        <text class="cuIcon-add"></text>
                    </view>
                    <text>点击添加队伍头像头像</text>
                </view>
            </view>

            <!-- 队伍名字 -->
            <view class="cu-form-group margin-top margin-bottom">
                <view class="title">队名</view>
                <input  v-model="teamName" placeholder="点击输入队伍名字" name="input"></input>
            </view>
            <!-- 队伍描述 -->
            <view class="cu-form-group align-start">
                <view class="title">简介</view>
                <textarea v-model="teamDesc" maxlength="140" :disabled="modalName!=null" @input="textareaBInput" placeholder="点击添加队伍介绍（可选）"></textarea>
            </view>
            <!-- 发布动态 -->
            <view class="padding response" @click="createTeam">
                <button class="cu-btn radius bg-ztsgreen lg response">创建队伍</button>
            </view>
            <!-- 是否同步到动态 -->
        </view>
    </view>
</template>

<script>
import { base64ToPath } from '@/js_sdk/mmmm-image-tools/index.js';
export default {
    data() {
        return {
            teamHeadImg: "",
            modalName: "",
            teamName:"",
            teamDesc:""
        };
    },
    onLoad() {
        this.loadData();
    },
    async onShow() {
        let avatar = uni.getStorageSync('tempAvatar');
        if (avatar) {
            this.avatar = avatar;
            let tempImg = '';
            // #ifdef APP-PLUS
            tempImg = avatar;
            this.teamHeadImg = avatar
            // #endif
            // #ifdef H5
            await base64ToPath(avatar).then((img) => {
                tempImg = img;
                this.teamHeadImg = avatar
            });
            // #endif
            // console.log('上传图片==========', tempImg);

            // 上传图片
            // const imgs = await this.zz.uploadImg([tempImg]);
            uni.setStorageSync('tempAvatar', null);
        }
    },
    methods: {
        async loadData() { },
        changeAvatar() {
            uni.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album'], // 直接跳转到相册选图片
                success: (res) => {
                    const tempFilePaths = res.tempFilePaths[0];
                    this.zz.href('/pages/my/set/avatarCropper?src=' + tempFilePaths);
                    // this.tui.href('../cropper-default/cropper-default?src=' + tempFilePaths);
                }
            });
        },
        textareaBInput() {

        },
        createTeam(){
            console.info('创建队伍',this.teamHeadImg,this.teamName,this.teamDesc);
        }
    }

};
</script>

<style lang="scss" scoped>
</style>
