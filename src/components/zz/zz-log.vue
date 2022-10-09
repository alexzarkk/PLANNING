<template>
	<view>
		<view v-if="title" class="cu-bar cu-tabbar-height bg-orange light solid-bottom">
			<view class="action">
				<text class="cuIcon-list text-grey"></text> 日志记录
			</view>
		</view>
		<block v-if="list.length > 0">
			<view class="cu-list menu">
				<block v-for="(log, i) in list" :key="i">
					<view class="cu-item" :class="log.imgs&&log.imgs.length?'arrow':''" style="height: 120rpx;" @click="logImg(i)">
						<view class="cu-avatar round lg" :class="'bg-el-'+dict.laySt[log.status].type">
							<!-- <view class="cu-tag badge bg-grey">
								<view class="text-white cuIcon-light"></view>
							</view> -->
							<text class="text-black" :class="log.status==32? 'text-sm':'text-xl'">{{dict.laySt[log.status].label}}</text>
						</view>
						<view class="content margin-left">
							<view class="text-grey">{{log.user}}</view>
							<view class="text-gray text-sm flex">
								<view class="text-cut">
									<text class="cuIcon-remind text-dark margin-right-xs"></text>
									{{log.time}}
								</view>
							</view>
						</view>
						<view class="action">
							<view class="cu-avatar-group flex">
								<block v-if="log.imgs&&log.imgs.length">
									<block v-for="(p,j) in log.imgs" :key="'_'+j">
										<view class="cu-avatar" :style="'background-image:url('+p+')'"></view>
									</block>
								</block>
							</view>
							<!-- <text class="text-grey text-sm cuIcon-pic"></text> -->
						</view>
					</view>
				</block>
			</view>
		</block>
		<block v-else>
			<tui-no-data :fixed="true">无数据~</tui-no-data>
		</block>
	</view>
</template>
<script>
	export default {
		name: 'zzLog',
		data() {
			return {
				dict: uni.getStorageSync('sys_dict')
			};
		},
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			},
			title:{
				type: Boolean,
				default: true
			}
		},
		
		methods: {
			logImg(i){
				let log = this.list[i]
				if(log.imgs&&log.imgs.length) {
					this.zz.viewIMG(log.imgs)
				}
			}
		}
	};
</script>

<style>
</style>
