<template>
<!-- https://ext.dcloud.net.cn/plugin?id=6017 -->
	<view>
		<view class="tips-box" @touchmove.stop.prevent @tap.stop="next" v-if="isShow">
			<view class="view-box" :style="{
					top: tipInfo.top - newPadding + 'px',
					left: tipInfo.left - newPadding + 'px',
					height: tipInfo.height+'px',
					width: tipInfo.width+'px',
					transition: duration + 'ms all',
					borderRadius: borderRadius + 'rpx',
					padding:padding + 'rpx'}">
			</view>
			<view class="content" :style="{
				top: isUp===1?tipInfo.top + tipInfo.height + Number(offset) + 'px' : '',
				bottom: isUp===0?height - tipInfo.bottom + tipInfo.height + Number(offset) + 'px':''}">
				<!-- #ifndef MP -->
				<slot :name="list[index].name">
					<view class="content-info">
						{{list[index].content}}
					</view>
					<view class="content-next">
						{{index === list.length-1?finishText:nextText}}
					</view>
				</slot>
				<!-- #endif -->

				<!-- #ifdef MP -->
				<view class="content-info">
					{{list[index].content}}
				</view>
				<view class="content-next">
					{{index === list.length-1?finishText:nextText}}
				</view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "useTips",
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			},
			show: {
				type: Boolean,
				default: true
			},
			offset: {
				type: [String, Number],
				default: "40"
			},
			duration: {
				type: [String, Number],
				default: "300"
			},
			borderRadius: {
				type: [String, Number],
				default: "16"
			},
			padding: {
				type: [String, Number],
				default: "10"
			},
			nextText: {
				type: String,
				default: "下一步"
			},
			finishText: {
				type: String,
				default: "完成"
			}
		},
		data() {
			return {
				tipInfo: {},
				index: 0,
				height: '',//屏幕安全高度
				windowHeight: '',//屏幕高度
				isUp: 1, //判断元素位置，确定提示信息在该元素的上方还是下方
				isShow: true,
				oldscrollTop: 0,
				newPadding: '',
			};
		},
		created() {
			this.isShow = this.show;
			this.newPadding = uni.rpx2px(this.padding);
		},
		mounted() {
			let sysInfo = uni.getSystemInfoSync();
			this.height = sysInfo.safeArea.height;
			this.windowHeight = sysInfo.windowHeight;
			this.getTipInfo();
		},
		computed: {},
		methods: {
			async getTipInfo() {
				let element = this.list[this.index].element;
				// console.log(element);
				// 获取节点信息
				const query = uni.createSelectorQuery();
				query.select(element).boundingClientRect(res => {
					this.tipInfo = res
					
					// 当元素的节点信息bottom的大小大于屏幕的高度，证明它需要滚动才能显示全部
					// 向下滚动
					if (res.bottom > this.windowHeight) {
						// console.log("向下滚");
						let num = res.bottom - this.windowHeight + this.newPadding;
						uni.pageScrollTo({
							scrollTop: num + this.oldscrollTop,
							duration: parseInt(this.duration),
							success: () => {
								this.oldscrollTop = num + this.oldscrollTop;
							}
						})
						// 修改显示框位置
						this.tipInfo.top = this.windowHeight - res.height - this.newPadding;
						// 修改提示位置
						this.tipInfo.bottom = this.windowHeight - this.newPadding;
					}
					
					// 向上滚动
					if(res.top < 0 ) {
						// console.log("向上滚");
						let num = this.oldscrollTop - Math.abs(res.top) - this.newPadding;
						uni.pageScrollTo({
							scrollTop:  num,
							duration: parseInt(this.duration),
							success: () => {
								this.oldscrollTop = num;
							}
						})
						// 修改显示框位置
						this.tipInfo.top = this.newPadding;
						// 修改提示位置
						this.tipInfo.bottom = res.height + this.newPadding;
					}
					
					// 计算元素所在位置，是在屏幕上半部分还是下半部分
					if (res.top + res.height < this.height / 2 || res.top < this.height / 2) {
						// console.log("提示在下面");
						this.isUp = 1;
					} else {
						// console.log("提示在上面");
						this.isUp = 0;
					}
					
	
				}).exec();
				
			},
			// 下一步操作可在这里及最后的操作
			next() {
				if (this.index >= this.list.length - 1) {
					this.$emit('finish', this.index);
					this.isShow = false;
				} else {
					this.index += 1;
					this.$emit('next', this.index);
					this.getTipInfo();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tips-box {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9999;

		.view-box {
			position: fixed;
			background-color: transparent;
			box-sizing: content-box;
			box-shadow: 0 0 0 2000px rgba($color: #000000, $alpha: 0.6);
		}

		.content {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			width: 686rpx;
			color: #fff;
			text-align: center;

			.content-info {
				font-size: 1.8rem;
			}

			.content-next {
				font-size: 1.8rem;
				width: 160rpx;
				border: 2rpx solid #fff;
				border-radius: 8rpx;
				padding: 8rpx 0;
				margin: 32rpx 0 0;
			}
		}
	}
</style>
