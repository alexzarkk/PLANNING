<template>
	<view>
		<block v-for="(obj,idx) in list" :key="idx">
			<view class="padding-lr margin-top-sm">
				<view class=" radius shadow-blur bg-gray bg-img bgimg"
					@tap="href('/pages/planning/poi?id='+obj._id)"
					:style="'background-image:url('+obj.cover+');'">
					<!-- <view class="cu-tag tleft bg-blue">{{ dict.region[obj.region[0]].name }}</view> -->
					<view class="cu-bar bgtitle padding-left">
						<!-- <view class=" bg-green padding-xs light"> -->
						<text class="text-cut text-lg text-white">{{obj.name}}</text>
						<!-- </view> -->
					</view>
				</view>
				<view class="solid">
					<tui-collapse :hdBgColor="'none'" :index="idx" :current="current" @click="change3">
						<template v-slot:title>
							<tui-list-cell :backgroundColor="'none'" :hover="true">
								<view class="text-grey text-cut flex justify-between" style="width: 90%;">
									<view>
										距离当前：{{ math(obj.dist/1000,2)}}km
										<!-- <text class="cuIcon-location"></text> -->
									</view>
									<view>简介信息 ...</view>
								</view>
							</tui-list-cell>
						</template>
						<template v-slot:content>
							<view class="padding-xs text-grey pre-line ">
								{{obj.desc}}
							</view>
						</template>
					</tui-collapse>
					<block v-if="btn">
						<view class="padding-tb-xs text-grey text-sm flex justify-end align-center">
							<view>
								<text class="cuIcon-attention margin-right-xs"></text>
								<text class="text-sm text-gray">{{obj.view}}</text>
							</view>
							<view class="padding-lr-xs" @tap="userEvent(30,20,obj,idx)">
								<text class="cuIcon-appreciatefill margin-lr-xs" :class="obj.isLike?'text-red':''"></text>
								<text class="text-sm text-gray">{{obj.like}}</text>
							</view>
							<view @tap="userEvent(40,20,obj,idx)">
								<text class="cuIcon-favorfill margin-lr-xs" :class="obj.isFavor?'text-red':''"></text>
								<text class="text-sm text-gray">{{obj.favor}}</text>
							</view>
							
							<view>
								<button open-type="share" class="cu-btn xs bg-white" :data-id="obj._id" :data-title="obj.title">
									<text class="cuIcon-share"></text>
									<text class="text-sm text-green"></text>
								</button>
							</view>
						</view>
					</block>
				</view>
			</view>
		
		</block>
		
	</view>
</template>

<script>
export default {
	name: 'travelCard',
	data() {
		return {
			dict: uni.getStorageSync('sys_dict'),
			math: this.zz.math,
			current: -1,
			old:''
		}
	},

	props: {
		list: {
			type: Array
		},
		btn:{
			type:Boolean,
			default:false
		}
	},
	mounted(){
		// console.log("card-----bgimg------list",this.list)
	},
	methods: {
		
		href(h){this.zz.href(h)},
		change3(e) {
			this.current = this.current == e.index ? -1 : e.index
		},
		userEvent(t,tt,o,i){
			this.zz.userEvent(t,tt,o)
			this.$emit('change',o,i)
		}
	}
	

};
</script>

<style>
	
	
.txt{
	color: #c26c83;
}

.tright {
	/* border-radius: 200upx; */
	position: absolute;
	top: 0upx;
	left: 0upx;
	font-size: 26upx;
	padding: 0upx 6upx;
	height: 38upx;
	color: #ffffff;
	width: 150rpx;
}
.tleft {
	/* border-radius: 200upx; */
	position: absolute;
	top: 0upx;
	right: -0upx;
	font-size: 26upx;
	padding: 0upx 10upx;
	height: 38upx;
	color: #ffffff;
}

.bgimg {
		/* background-attachment:fixed; */
		background-repeat:no-repeat;
		height: 320upx;
		/* z-index: 29 */
		/* background-size:cover; */
		/* -moz-background-size:cover; */
		/* -webkit-background-size:cover; */
		
	}
	
	
	.bgtitle{
		top: 233upx;
	}
	
</style>
