<template>
	<view>
		<view class="cu-bar" :class="'bg-gradual-' + color" v-if="dataList.length>0">
			<view class='action'>
				<text class='cuIcon-titles'></text><text class="text-bold">{{title}}</text>
			</view>
		</view>
		<block v-for="(item,index) in dataList" :key="item.idx">
			<view class="light padding-xs" :class="'bg-'+color" v-if="item.title != undefined && item.title != ''">
				<view class="flex solid-bottom justify-center">
					<view class="content radius">
						<text class='cuIcon-title' :class="'text-'+color"></text>
						<text class="text-bold" :class="'text-'+color">{{item.title}}</text>
					</view>
				</view>
			</view>
			<view class="cu-card case no-card" v-if="item.url && item.url != ''">
				<view class="cu-item shadow">
					<view class="image">
						<image :src="item.url" mode="widthFix" @tap="imgView(item.url)"></image>
					</view>
				</view>
			</view>
			<view class="pre-line padding-lr margin-top-sm text-left text-content" v-for="(text, idx) in item.desc" :key="idx">
				{{text}}
			</view>
			<view class="margin-sm"></view>
		</block>
	</view>
</template>

<script>
	export default {
		name: 'tuiListCell',
		data() {
			return {
				
			};
		},
		props: {
			dataList: {
				type: Array,
				default: []
			},
			
			title: { 
				type: String,
				default: ""
			},
			
			color: { 
				type: String,
				default: ""
			},
		},
		methods:{
			imgView: function(img){this.zz.viewIMG([img], 0)}
		}
	}
</script>

<style>

</style>
