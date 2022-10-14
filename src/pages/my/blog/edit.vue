<template>
<page-meta root-font-size="10px"></page-meta>
	<view>
		<!-- 发送评论 -->
		<cu-custom bgColor="bg-ztsblue" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">留言评论</block>
		</cu-custom>
		<view class="cu-bar bg-grey light solid-bottom">
			<view class="action">
				<text class="cuIcon-community"></text>
				评论/留言
			</view>
		</view>
		<tui-textarea isCounter placeholder="请输入简介" v-model="content"></tui-textarea>
		<block v-if="!qr.pid">
			<!-- <view class="cu-bar bg-white">
                <view class="action">图片上传</view>
                <view class="action">{{ imgs.length }}/9</view>
            </view>
            <view class="cu-form-group">
                <view class="grid col-4 grid-square flex-sub">
                    <view class="bg-img" v-for="(item, index) in imgs" :key="index" @click="ViewImage" :data-index="index">
                        <image :src="imgs[index]" mode="aspectFill"></image>
                        <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
                            <text class="cuIcon-close"></text>
                        </view>
                    </view>
                    <view class="solids" @tap="ChooseImage" v-if="imgs.length < 9">
                        <text class="cuIcon-cameraadd"></text>
                    </view>
                </view>
            </view> -->

			<!-- 图片上传 （如有） -->
			<view class="padding bg-white"><zz-upload-image :title="'上图片（如有）'" :imgs="imgs" @add="addImage" @del="delImage"></zz-upload-image></view>
			<!-- <view class="flex align-center justify-center" style="width:750rpx;">
			    <zz-upload-video :video="video" @add="addVideo" @del="delVideo"></zz-upload-video>
			</view> -->
		</block>
		<view class="cu-tabbar-height"></view>
		<view class="padding-xl">
			<!-- <tui-button shadow :disabled="content == ''" height="88rpx" shape="circle" @click="submit">提 交</tui-button> -->
			<button class="cu-btn round block bg-blue margin-tb-sm lg" @click="submit">
				<text v-show="loading" class="cuIcon-loading2 cuIconfont-spin"></text>
				<text>提 交</text>
			</button>
		</view>

		<tui-loading v-show="loading"></tui-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			loading: false, // 页面加载状态
			imgs: [], // 图片列表
			video: null,
			content: '', // 评论内容
			qr: {}, // 上一个页面传过来的参数
			tid: '' // 当前评论回复的内容的id
		};
	},
	onLoad(qr) {
		this.qr = qr;
	},
	methods: {
		// 图片上传
		addImage(e) {
			this.imgs = this.imgs.concat(e);
		},
		// 删除图片
		delImage(i) {
			this.zz.removeFile(this.imgs[i]);
			this.imgs.splice(i, 1);
		},
		addVideo(e) {
			this.video = e;
		},
		delVideo(e) {
			this.zz.removeFile(this.video.tempFilePath);
			this.video = null;
		},
		// 提交评论回复
		async submit() {
			if (!this.content) return this.zz.toast('请输入评论内容~');
			if (this.loading) return;
			this.loading = true;
			let requestParams = {
				$url: '/user/blog/add',
				content: this.content,
				tid: this.qr.tid,
				pid: this.qr.pid,
				imgs: []
			};
			if (this.imgs.length > 0 && this.qr.tid) {
				for (let s of this.imgs) {
					requestParams.imgs.push(await this.zz.upload(s, true));
				}
			}
			// if(this.video) {
			//  this.video.url = await this.zz.upload(this.video.tempFilePath,true))
			//  delete this.video.tempFilePath
			//  requestParams.video = this.video
			// }
			this.zz.req(requestParams).then(() => {
				this.loading = false;
				uni.$emit('newComment'+this.qr.tid, {})
				setTimeout(() => {
					uni.navigateBack();
				}, 100);
			});
		}
	}
};
</script>

<style>
.cu-form-group .title {
	min-width: calc(4em + 15px);
}
</style>
