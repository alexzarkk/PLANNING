<!-- 我改写的组件 -->
<template>
	<view>
		<view class="tui-header-box flex flex-direction" 
		:style="{paddingTop: StatusBar+'px', height: CustomBar + 'px', background: 'rgba(255, 255, 255,' + opacity + ')' }">
		
			<view class="flex align-center justify-center">
				<view class="basis-xs padding-sm">
					<view class="flex align-center justify-around">
						<view class="tui-icon-box" :style="{ backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')' }" @tap="BackPage">
							<tui-icon name="arrowleft" :size="28" :color="opacity >= 1 ? '#000' : '#fff'"></tui-icon>
						</view>
						<view class="tui-icon-box tui-icon-ml" :style="{backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')'}" @tap.stop="openMenu">
							<tui-icon name="more-fill" :size="28" :color="opacity >= 1 ? '#000' : '#fff'"></tui-icon>
							<view class='cu-tag badge' v-if="noteCount>0">{{noteCount}}</view>
						</view>
					</view>
				</view>
				<view class="flex-sub  padding-sm">
					<view class="tui-header" :style="{opacity: opacity}">商品信息</view>
				</view>
				<view class="basis-xs  padding-sm"></view>
			</view>
			<view style="position: absolute; width: 100%;" :style="{top: (CustomBar)+'px', opacity: opacity, background: 'rgba(255, 255, 255,' + opacity + ')' }">
				<scroll-view class="nav" scroll-x scroll-with-animation>
					<view class="flex text-center">
						<view class="cu-item flex-sub" :class="item.sight?'text-red cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabMove" :id="item.id">
							{{item.name}}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		name: 'zzHeader',
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				
				
				curTab: 0,
				isTabTap: false,
			};
		},
		
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			noteCount:{
				type: Number,
				default: 0
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
			opacity: {
				type: Number,
				default: 1
			},
			iconOpcity: {
				type: Number,
				default: 0.5
			},
			tabList:{
				type: Array,
				default: ()=>{ return []}
			},
			scrolled:{
				type: Number,
				default: 0
			}
		},
		watch: {
			scrolled() {
				// console.log(this.scrolled)
				// return false
				if(!this.isTabTap){
					let scrollTop = this.scrolled + (this.CustomBar + 50)
					for (let i = 0; i < this.tabList.length; i++) {
						this.tabList[i].sight = (scrollTop > this.tabList[i].top && scrollTop < this.tabList[i].bottom)
					}
				}
			}
		},
		methods: {
			tabMove: function(e) {
				this.isTabTap = true
				this.$emit('moveTo', e.target.id)
				setTimeout(function() {this.isTabTap = false}, 100)
			},
			BackPage() {
				if(getCurrentPages().length==1){
					uni.switchTab({url:'/pages/index/index'})
				}
				if (getCurrentPages().length < 2 && 'undefined' !== typeof __wxConfig) {
					let url = '/' + __wxConfig.pages[0]
					return uni.redirectTo({url})
				}
				uni.navigateBack({
					delta: 1
				});
			},
			openMenu(){
				this.$emit('openMenu')
			}
			
		}
		
	}
</script>

<style>
.tui-header-box {
		width: 100%;
		position: fixed;
		left: 0;
		/* top: 0; */
		z-index: 111;
	}

	.tui-header {
		width: 100%;
		font-size: 1.8rem;
		/* line-height: 18px; */
		font-weight: 500;
		height: auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-header-icon {
		/* position: fixed; */
		top: 0;
		left: 10px;
		display: flex;
		align-items: flex-start;
		justify-items: center;
		justify-content: space-between;
		height: 26px;
		transform: translateZ(0);
		z-index: 9999;
	}

	.tui-header-icon .tui-badge {
		background: #e41f19 !important;
		position: absolute;
		right: -4px;
	}

	.tui-icon-ml {
		margin-left: 20rpx;
	}

	.tui-icon-box {
		position: relative;
		height: 26px !important;
		width: 26px !important;
		padding: 6px !important;

		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

</style>
