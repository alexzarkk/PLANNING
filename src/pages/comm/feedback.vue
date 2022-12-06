<template>
    <page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">意见反馈</block>
        </cu-custom>
        <view class="container">
            <!-- 反馈类型  APP异常  功能建议    其他原因-->
            <view class="padding bg-white">
                <view class="margin-bottom">请选择反馈类型:</view>
                <radio-group class="flex justify-center" @change="RadioChange">
                    <view class="padding-lr">
                        <radio class="margin-right-xs" :class="radio == 'A' ? 'checked' : ''" :checked="radio == 'A' ? true : false" value="A"></radio>
                        <text class="margin-left-xs">应用异常</text>
                    </view>
                    <view class="padding-lr">
                        <radio class="margin-right-xs" :class="radio == 'B' ? 'checked' : ''" :checked="radio == 'B' ? true : false" value="B"></radio>
                        <text>功能建议</text>
                    </view>
                    <!-- <view>
                        <radio class="margin-right-xs" :class="radio == 'C' ? 'checked' : ''" :checked="radio == 'C' ? true : false" value="C"></radio>
                        <text>其他原因</text>
                    </view> -->
                </radio-group>
            </view>
            <view v-if="radio === 'A'" class="margin-top">
                <!-- APP异常  上传日志 -->
                <!--    <view class="padding bg-white flex align-center justify-between">
                    <text>是否上传错误日志:</text>
                    <view>
                        <switch @change="switchChange" :class="switchA ? 'checked' : ''" :checked="switchA ? true : false" class="green" color="#39b54a"></switch>
                    </view>
                </view> -->
                <!-- 反馈内容  多行文本 -->
                <view class="padding bg-white">
                    <view class="margin-bottom">反馈内容:</view>
                    <tui-textarea isCounter placeholder="请描述异常出现的场景，有助于工程师排查问题。" v-model="desc"></tui-textarea>
                </view>
                <!-- 图片上传 （如有） -->
                <view class="padding bg-white">
                    <zz-upload-image :title="'上传图片（如有）'" :imgs="imgs" @add="addImage" @del="delImage"></zz-upload-image>
                </view>
            </view>
            <view v-if="radio === 'B'" class="padding bg-white">
                <view class="margin-bottom">功能建议:</view>
                <tui-textarea isCounter placeholder="您的反馈将帮助环浙步道变得越来越好。" v-model="desc"></tui-textarea>
            </view>
            <view class="padding bg-white">
                <view class="margin-bottom">联系方式:</view>
                <tui-input placeholder="邮箱或手机号" v-model="contact"></tui-input>
            </view>

            <view class="padding bg-white">
                <view class="margin-bottom">如有需要我们将会尽快回复您的反馈。</view>
            </view>
            <view class="padding response">
                <button class="cu-btn round bg-ztsblue lg response" @click="save">提交</button>
            </view>
        </view>
    </view>
</template>

<script>

import xss from 'xss'

export default {
    data() {
        return {
            radio: 'A',  // 反馈类型切换
            // switchA: false,
            imgs: [],  // 图片
            video: null,
            desc: '', // 功能建议
            contact: '',  // 联系方式
        };
    },
    onBackPress() {
        for (let s of this.imgs) {
            this.zz.removeFile(s)
        }
    },
    methods: {
        switchChange() { },
        RadioChange(event) {
            this.radio = event.detail.value;
        },
        // 图片上传
        addImage(e) {
            this.imgs = this.imgs.concat(e)
        },
        // 删除图片
        delImage(i) {
            this.zz.removeFile(this.imgs[i])
            this.imgs.splice(i, 1)
        },
        addVideo(e) {
            this.video = e
        },
        delVideo(e) {
            this.zz.removeFile(this.video.tempFilePath)
            this.video = null
        },

        async save() {
            if (!this.desc) return this.zz.toast('请输入反馈内容~')
            if (!this.contact) return this.zz.toast('请输入联系方式~')
            let args = {
                $url: '/admin/comm/feedback',
                desc: xss(this.desc),
                contact: xss(this.contact),
                // video: this.video,
                type: this.radio,
                imgs: []
            }
            uni.showLoading({ mask: true })
            for (let s of this.imgs) {
                args.imgs.push(await this.zz.upload(s, true))
            }
            
            this.zz.req(args).then(e => {
				uni.hideLoading()
                this.zz.modal('递交成功,感谢您的反馈!')
                this.radio = 'A'
                this.imgs = []
                this.desc = ''
                this.contact = ''
            })
        }
    }
};
</script>