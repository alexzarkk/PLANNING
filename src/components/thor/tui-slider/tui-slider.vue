<template>
	<view class="tui-slider__box" :style="{ width: width + 'px', height: height + 'px', borderRadius: radius, background: backgroundColor,border:border }">
		<view class="tui-slider__glided" :style="{ background: activeColor, borderTopLeftRadius: radius, borderBottomLeftRadius: radius }"></view>
		<view class="tui-slider__block" :style="{
				width: blockWidth + 'px',
				height: blockHeight + 'px',
				marginTop: `-${blockHeight / 2}px`,
				borderRadius: blockRadius,
				boxShadow: blockShadow,
				border: blockBorder,
				background: blockColor
			}"
		 :change:prop="parse.slidevalue" :prop="initValue" :data-blockWidth="blockWidth" :data-width="width" :data-step="step"
		 :data-min="min" :data-max="max" :data-disabled="disabled" :data-value="start" :data-endValue="end" :data-section="section"
		 @touchstart="parse.touchstart" @touchmove="parse.touchmove" @touchend="parse.touchend">
			<slot name="start"></slot>
			<view v-if="showValue" class="tui-value__box" :class="['tui-value__' + position]" :style="{ backgroundColor: boxColor, padding: padding, color: valueColor, fontSize: valueSize+'rpx', zIndex: zIndex }"
			 @touchmove.stop="stop">
				{{ formatValue(start) }}
				<view :class="['tui-triangle__' + position]" :style="{ borderColor: position == 'top' ? `${boxColor} transparent transparent transparent` : `transparent transparent ${boxColor} transparent` }"></view>
			</view>
		</view>

		<view v-if="section" class="tui-section__block" :style="{
				width: blockWidth + 'px',
				height: blockHeight + 'px',
				marginTop: `-${blockHeight / 2}px`,
				borderRadius: blockRadius,
				boxShadow: blockShadow,
				border: blockBorder,
				background: blockColor
			}"
		 :change:prop="parse.sectionSlidevalue" :prop="initEndValue" :data-blockWidth="blockWidth" :data-width="width"
		 :data-step="step" :data-min="min" :data-max="max" :data-disabled="disabled" :data-value="start" :data-endValue="end"
		 :data-section="section" @touchstart="parse.sectionTouchstart" @touchmove="parse.sectionTouchmove" @touchend="parse.sectionTouchend">
			<slot name="end"></slot>
			<view v-if="showValue" class="tui-value__box" :class="['tui-value__' + position]" :style="{ backgroundColor: boxColor, padding: padding, color: valueColor, fontSize: valueSize + 'rpx', zIndex: zIndex }"
			 @touchmove.stop="stop">
				{{ formatValue(end) }}
				<view :class="['tui-triangle__' + position]" :style="{ borderColor: position == 'top' ? `${boxColor} transparent transparent transparent` : `transparent transparent ${boxColor} transparent` }"></view>
			</view>
		</view>
		<view class="tui-section__glided" :style="{ background: activeColor, borderTopRightRadius: radius, borderBottomRightRadius: radius }"></view>
	</view>
</template>
<script src="./tui-slider.wxs" module="parse" lang="wxs"></script>
<script>
	export default {
		name: 'tuiSlider',
		emits: ['change','changing'],
		props: {
			//slider?????? px
			width: {
				type: Number,
				default: 240
			},
			//slider?????? px
			height: {
				type: Number,
				default: 4
			},
			border: {
				type: String,
				default: '0'
			},
			//slider??????
			radius: {
				type: String,
				default: '2px'
			},
			//?????????
			min: {
				type: Number,
				default: 0
			},
			//?????????
			max: {
				type: Number,
				default: 100
			},
			//??????????????????????????? 0???????????????(max - min)??????
			step: {
				type: Number,
				default: 1
			},
			//????????????
			disabled: {
				type: Boolean,
				default: false
			},
			//????????????????????????
			value: {
				type: Number,
				default: 0
			},
			//?????????????????????/??????
			section: {
				type: Boolean,
				default: false
			},
			//???????????????????????????section???true?????????
			endValue: {
				type: Number,
				default: 0
			},
			//??????????????????????????????????????????
			activeColor: {
				type: String,
				default: '#5677fc'
			},
			//??????????????????????????????
			backgroundColor: {
				type: String,
				default: '#e9e9e9'
			},
			//???????????? px
			blockWidth: {
				type: Number,
				default: 20
			},
			//???????????? px
			blockHeight: {
				type: Number,
				default: 20
			},
			//??????????????????
			blockColor: {
				type: String,
				default: '#fff'
			},
			//????????????
			blockRadius: {
				type: String,
				default: '50%'
			},
			//????????????
			blockShadow: {
				type: String,
				default: '#b2b2b2 0 0 10rpx'
			},
			//????????????
			blockBorder: {
				type: String,
				default: '0'
			},
			//??????????????????value
			showValue: {
				type: Boolean,
				default: false
			},
			//value???????????? top???bottom
			position: {
				type: String,
				default: 'top'
			},
			//value????????????????????????value,?????????value?????????????????????
			valueFormat: {
				type: String,
				default: 'value'
			},
			//value???z-index???
			zIndex: {
				type: Number,
				default: 10
			},
			//value?????????
			boxColor: {
				type: String,
				default: 'rgba(255,255,255,.9)'
			},
			padding: {
				type: String,
				default: '2px 6px'
			},
			//value????????????
			valueColor: {
				type: String,
				default: '#333'
			},
			//value???????????? rpx
			valueSize: {
				type: Number,
				default: 30
			}
		},
		watch: {
			value(val) {
				this.initValue = val
				this.start = val
			},
			endValue(val) {
				this.initEndValue = val
				this.end = val
			}
		},
		data() {
			return {
				start: 0,
				end: 0,
				initValue: 0,
				initEndValue: 0
			};
		},
		created() {
			this.start = this.value || this.min;
			this.end = this.endValue || this.max;
			setTimeout(() => {
				this.initValue = this.value;
				this.initEndValue = this.endValue || this.max;
			}, 10)
		},
		methods: {
			getParams(e) {
				let val = e.value;
				if (this.section && !e.isStart) {
					this.end = val
				} else {
					this.start = val
				}
				let params = {
					value: this.start
				}
				if (this.section) {
					params.endValue = this.end
				}
				return params
			},
			change(e) {
				let params = this.getParams(e)
				this.$emit('change', params);
			},
			changing(e) {
				let params = this.getParams(e)
				this.$emit('changing', params);
			},
			formatValue(val) {
				let value = val;
				if (this.valueFormat) {
					value = this.valueFormat.replace('value', val);
				}
				return value;
			},
			stop() {}
		}
	};
</script>

<style scoped>
	.tui-slider__box {
		width: 100%;
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.tui-slider__glided {
		width: 0;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
		overflow: hidden;
	}

	.tui-section__glided {
		width: 0;
		height: 100%;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 1;
		overflow: hidden;
	}

	.tui-slider__trans {
		transition: all 0.2s;
	}

	.tui-slider__block {
		position: absolute;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		left: 0;
		top: 50%;
	}

	.tui-section__block {
		position: absolute;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		right: 0;
		top: 50%;
	}

	.tui-value__box {
		position: absolute;
		border-radius: 4px;
		display: flex;
		align-items: center;
	}

	.tui-value__top {
		left: 50%;
		top: 0;
		transform: translate(-50%, -100%);
		margin-top: -10px;
	}

	.tui-triangle__top {
		position: absolute;
		top: 97%;
		left: 50%;
		transform: translate(-50%, 0);
		border-width: 5px;
		border-style: solid;
	}

	.tui-value__bottom {
		left: 50%;
		top: 100%;
		transform: translate(-50%, 0);
		margin-top: 10px;
	}

	.tui-triangle__bottom {
		position: absolute;
		top: 1rpx;
		left: 50%;
		transform: translate(-50%, -100%);
		border-width: 5px;
		border-style: solid;
	}
</style>
