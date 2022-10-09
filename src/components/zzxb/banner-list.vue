<template>
	<view>
		<block v-for="(obj,idx) in list" :key="idx">
			<view class="padding-lr">
				<view class="padding-top-xs">
					<view class="radius shadow-blur bg-pink light margin-top-sm bg-img bgimg" @tap="href(obj.path)"
						:style="'background-image:url('+obj.img+');'">
						<view v-if="obj.title" class="cu-tag text-left" :class="obj.tposition+' bg-' + obj.tcolor">{{obj.title}}</view>
					</view>
					<view class="solid">
						<tui-collapse :hdBgColor="'none'" :index="idx" :current="current" @click="change3">
							<template v-slot:title>
								<tui-list-cell :backgroundColor="'none'" :hover="true">
									<view class="text-grey text-cut" style="width: 90%;">{{obj.about}} ...</view>
								</tui-list-cell>
							</template>
							<template v-slot:content>
								<block v-if="obj.desc.line==1" >
									<view class="padding-xs" :class="'text-'+obj.desc.ttext" v-for="(c,idxx) in obj.desc.content" :key="idxx">
										<text class="txt">{{c}}</text>
									</view>
								</block>
								<block v-else>
									<view class="padding-sm pre-line text-grey" v-for="(c,idxx) in obj.desc.content" :key="idxx"> 
										{{c}}
									</view>
								</block>
								<view class="padding-xs txt text-center">
									<text class="text-red">{{obj.desc.sign}}</text>
								</view>
							</template>
						</tui-collapse>
					</view>
				</view>
			</view>
		
			<view class="flex padding-lr-xs">
				
				<block v-for="(item,index) in obj.item" :key="index">
					<view class="flex-sub padding-lr-sm padding-top-sm">
						<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="href(obj.path)">
							<image :src=" item.img " class="tui-pro-img" mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{ item.name }}</view>
								<view>
									<view class="tui-pro-price">
										<text class="tui-sale-price">￥{{ item.price.v * item.price.cut }}</text>
										<text class="tui-factory-price">￥{{ item.price.v * item.price.cut *1.2 }}</text>
									</view>
									<view class="tui-pro-pay">已销 1000+</view>
								</view>
							</view>
						</view>
					</view>
					
				</block>
				
			</view>
			
			<view class="padding-lr-sm margin-bottom-sm" @tap="href(obj.path)">
				<swiper class="screen-swiper round-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500">
					<swiper-item v-for="(pic,index) in obj.swiperList" :key="index">
						<image :src="pic" mode="aspectFit"></image>
					</swiper-item>
				</swiper>
			</view>
			
		</block>
		
	</view>
</template>

<script>
export default {
	name: 'bannerList',
	data() {
		return {
			current: -1
		}
	},

	props: {
		list: {
			type: Array,
			default:()=>{return []}
		}
	},
	methods: {
		href(h){this.zz.href(h)},
		change3(e) {
			this.current = this.current == e.index ? -1 : e.index
		},
	}
	

};
</script>

<style>
	
	
.txt{
	color: #c26c83;
}

.tright {
	/* border-radius: 200rpx; */
	position: absolute;
	top: 0rpx;
	left: 0rpx;
	font-size: 1.3rem;
	padding: 0rpx 6rpx;
	height: 38rpx;
	color: #ffffff;
	width: 150rpx;
}
.tleft {
	/* border-radius: 200rpx; */
	position: absolute;
	top: 0rpx;
	right: -0rpx;
	font-size: 1.3rem;
	padding: 0rpx 10rpx;
	height: 38rpx;
	color: #ffffff;
}

.bgimg {
		/* background-attachment:fixed; */
		background-repeat:no-repeat;
		height: 240rpx;
		/* z-index: 29 */
		/* background-size:cover; */
		/* -moz-background-size:cover; */
		/* -webkit-background-size:cover; */
		
	}
	
	
	
		
		/* 商品列表 */
		
	
	
	
	.tui-pro-item {
		width: 100%;
		margin-bottom: 4%;
		background: #fff;
		box-sizing: border-box;
		border-radius: 12rpx;
		overflow: hidden;
	}
	
	.tui-pro-img {
		width: 100%;
		display: block;
	}
	
	.tui-pro-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx;
	}
	
	.tui-pro-tit {
		color: #2e2e2e;
		font-size: 1.3rem;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	
	.tui-pro-price {
		padding-top: 15rpx;
	}
	
	.tui-sale-price {
		font-size: 1.7rem;
		font-weight: 500;
		color: #e41f19;
	}
	
	.tui-factory-price {
		font-size: 1.2rem;
		color: #a0a0a0;
		text-decoration: line-through;
		padding-left: 12rpx;
	}
	
	.tui-pro-pay {
		padding-top: 10rpx;
		font-size: 1.2rem;
		color: #a0a0a0;
	}	
</style>
