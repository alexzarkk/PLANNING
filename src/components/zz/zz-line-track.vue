<template>
    <!-- 
    name: 记录的线路的卡片显示
 -->
    <view>
        <view class="line-card-box" @click="openLineDetail">
            <view class="flex align-center line-sport-type-box">
                <view class="sport-icon" :class="'zzIcon-z'+details.type"></view>
                <view class="flex flex-direction line-name-sport">
                    <view class="text-cut text-xl text-bold" style="width:580rpx">
                        {{ details.name }}
                    </view>
                    <view class="margin-top-xs text-cut text-sm" style="width:580rpx">
						<text class="cuIcon-locationfill text-grey" v-if="addr"></text>
                        {{ details.loop? addr: dict.trail_type[details.type].label }}
                    </view>
                </view>
            </view>
            <view v-if="coverMode" class="flex align-center">
                <view class=" basis-sm flex   line-info-box line-info-column-box">
                    <view class="line-info-item line-info-item-col">
                        <text class="line-info-item-title">
                            里程
                        </text>
                        <text class="line-info-item-value">
                            {{ (details.info.len/1000).toFixed(2) }}km
                        </text>
                    </view>
                    <view class="line-info-item line-info-item-col">
                        <text class="line-info-item-title">
                            海拔落差
                        </text>
                        <text class="line-info-item-value">
                            <!-- ⇡{{ details.info.top }}⇣{{ details.info.bottom }}m -->
                            {{ details.info.top + details.info.bottom }}m
                        </text>
                    </view>
                    <view class="line-info-item line-info-item-col">
                        <text class="line-info-item-title">
                            最高最低
                        </text>
                        <text class="line-info-item-value"> 
                            ⩑{{ details.info.up }}⩒{{ details.info.down }}m
                        </text>
                    </view>
                </view>
                <view class="basis-lg">
                    <image class="response cover" :src="details.imgs[0]" mode="aspectFill" @error="imageError"></image>
                    <view v-if="details.userInfo" class="flex align-center avatar-box">
                        <view class="cu-avatar radius margin-right" :style="'background-image: url('+(details.userInfo.headImg||bd.sys.logo)+')'"></view>
                        <view>{{ details.userInfo.nickName }}</view>
                    </view>
                </view>
            </view>
            <view v-else class="flex flex-wrap  align-center justify-start line-info-box">
                <view class="line-info-item">
                    <text class="line-info-item-title">
                        里程
                    </text>
                    <text class="line-info-item-value">
                        {{ (details.info.len/1000).toFixed(2) }}km
                    </text>
                </view>
                <view class="line-info-item">
                    <text class="line-info-item-title">
                        累计海拔
                    </text>
                    <text class="line-info-item-value">
                        <!-- ⇡{{ details.info.top+'000' }}⇣{{ details.info.bottom+'000' }}m -->
                        {{ details.info.top + details.info.bottom }}m
                    </text>
                </view>
                <view class="line-info-item">
                    <text class="line-info-item-title">
                        最高/最低
                    </text>
                    <text class="line-info-item-value">
                        ⩑{{ details.info.up }}⩒{{ details.info.down }}m
                    </text>
                </view>
            </view>
            <view class="record-time-box">
                <text class="record-time-box-title">
                    记录时间:
                </text>
                <text class="record-time-box-value">
                    {{ details.createTime }}
                </text>
            </view>
            <view v-if="!coverMode && details.userInfo" class="flex align-center avatar-box">
                <view class="cu-avatar radius margin-right" :style="'background-image: url('+(details.userInfo.headImg||bd.sys.logo)+')'"></view>
                <view>{{ details.userInfo.nickName }}</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        details: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            dict: uni.getStorageSync('sys_dict'),
			addr: '',
			bd: this.bd,
            typeObj: null,
            coverMode: false  // 是否是封面模式    true:有封面 false:无封面的
        };
    },
    mounted() {
        if (this.details.imgs && this.details.imgs.length > 0) {
            this.coverMode = true
        }
		if(this.details.loop) {
			this.zz.reGeo(this.details.t1[0].coord[0]).then(e=>{
				this.addr = e.formatted_address.replace('浙江省','')
			})
		}
    },
    methods: {
        openLineDetail() {
            this.zz.href(this.details.loop? '/pages/comm/kml' : '/pages/nav/rec/lineDetail', this.details)
        },
        imageError(error) {
            this.coverMode = false
        }
    }
};
</script>

<style lang="scss" scoped>
.line-card-box {
    background-color: #ffffff;
    border-radius: 20rpx;
    width: 690rpx;
    margin: 16rpx auto;
    padding: 20rpx;
    .line-sport-type-box {
        height: 120rpx;
        border-bottom: 1px solid #e2e2e2;
        .sport-icon {
            font-size: 70rpx;
            margin-right: 20rpx;
        }

        .line-name-sport {
            &-name {
                color: #232323;
                font-size: 1.6rem;
                font-weight: bold;
            }

            &-sport {
                color: #4e4e4e;
                font-size: 1.2rem;
            }
        }
    }
    .line-info-column-box {
        // width: 375rpx;
        height: 400rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .cover {
        height: 220rpx;
        // margin-bottom: 20rpx;
    }

    .line-info-box {
        // height: 120rpx;
        padding: 30rpx 0;
        // display: flex;
        // flex-direction: row;
        .line-info-item-col {
            height: 110rpx;
        }
        .line-info-item {
            min-width: 160rpx;
            // height: 110rpx;
            display: flex;
            flex-direction: column;
            margin-bottom: 10rpx;
            margin-right: 20rpx;
            // justify-content: space-around;
            &-title {
                font-size: 1.2rem;
                color: #858585;
            }

            &-value {
                font-size: 1.6rem;
                font-weight: bold;
                color: #282828;
            }
        }
    }

    .avatar-box {
        height: 100rpx;
    }
}

.record-time-box {
    &-title {
        font-size: 1.6rem;
        font-weight: bold;
        margin-right: 20rpx;
    }

    &-value {
        font-size: 1.4rem;
    }
}
</style>
