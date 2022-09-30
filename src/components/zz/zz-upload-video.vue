<template>
    <view class="form-section">
        <view class="cu-bar bg-white">
            <view class="action">
               视频
            </view>
            <view class="action"></view>
        </view>
        <view class="bg-white padding-sm flex flex-direction">
        	<block v-if="video">
        		<zz-video :video="video"></zz-video>
				<view class="padding margin-lr">
					<button class="cu-btn block lines-red lg round" @click="del"><text class="cuIcon-close margin-right-xs"></text> 删除</button>
				</view>
        	</block>
        	<block v-else>
				<view class="padding-lr margin-lr">
					<button class="cu-btn block lines-orange lg round" @click="record"><text class="cuIcon-record margin-right-xs"></text> 录制视频</button>
				</view>
				<!-- <view class="solids" @tap="record"><text class="cuIcon-record"></text></view> -->
        	</block>
        </view>
    </view>
</template>

<script>

export default {
    props: {
        local: {
            type: Boolean,
            default: true
        },
		video: {
			type: Object,
			default:()=>{
				return null
			}
		}
    },
    data() {
        return { }
    },
    methods: {
        async record(){
        	let v = await this.zz.chooseVideo({}, !this.local)
        	if(v) this.$emit('add', v)
        },
        del() {
			this.$emit('del')
        }
    }
};
</script>

<style lang="scss" scoped></style>
