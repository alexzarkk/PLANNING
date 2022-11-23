<template>

	<view>
		<cu-custom bgColor="bg-black" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">奉化体育</block>
		</cu-custom>
		<block v-if="content.title">
			<view class="cu-bar justify-start bg-white margin-top">
				<view class="action border-title">
					<text class="text-xl text-bold">{{content.title}}</text>
					<text class="bg-grey" style="width:40rpx"></text>
					<!-- 底部样式 last-child选择器-->
				</view>
			</view>
				
			<view class="padding pre-line text-grey">
				{{content.about}}
			</view>
			
			<block v-for="(c,idx) in content.cList" :key="c.id">
				<view class="cu-bar bg-gray">
					<view class="action">
						<text class="cuIcon-title text-grey"></text>
						<text>{{c.title}}</text>
					</view>
				</view>
				<block v-for="(d,idxx) in c.desc" :key="idxx">
					<view class="padding-lr text-grey pre-line margin-top-sm">
						{{d}}
					</view>
				</block>
				<block v-for="(p,idxx) in c.pic" :key="idxx">
					<view class="tui-product-img">
						<image :src="p" mode="widthFix" @tap="imgView(idx,idxx)"></image>
					</view>
				</block>
			</block>
		</block>
		<block v-else>
			<tui-loadmore :fixed="true" :index="3" type="green"></tui-loadmore>
		</block>
		
		
		<view class="cu-tabbar-height"></view>
			
			<!-- <view class="padding flex flex-direction">
				<button class="margin-tb-sm cu-btn bg-grey lg" @tap="_do('feedback')">建议反馈</button>
			</view> -->
	</view>
</template>
<script>
	export default {
		data() {
			return {
				content: {}
			}			
		},
		onLoad() {
			this.zz.request('opration',{action:'sysHelp'},false,true).then(res=>{
				// console.log(res.data)
				this.content = res.data
				
			})
		},
		methods: {
			_do(e) {
				if(e=='feedback') {
					this.zz.href('/pages/common/feedback?path=help')
				}
			},
			imgView(idx,e) {
				this.zz.viewIMG(this.content.cList[idx].pic, e)
			},
		},
		onShareAppMessage(res) {
			return {
				title: '奉化体育 - 关于',
				path: '/pages/share?path=/pages/my/doc/help'
			}
		}
	}
</script>

<style>
	.tui-product-img image {
		width: 100%;
		display: block;
		padding: 20rpx;
	}
</style>