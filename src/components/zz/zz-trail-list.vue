<template>
    <!-- :class="show ? 'show' : ''" -->
    <view style="background-color:aqua;" class="zaiui-goods-list-box" :class="show ? 'show' : ''">
        <view class="cu-card case dynamic solid-bottom bg-gray" v-for="(t1, i1) in dataList" :key="i1">
            <view class="cu-item shadow">
                <view class="cu-list menu-avatar ">
                    <view class="cu-item">
                        <view class="cu-avatar round lg" :style="'background-image:url(' +t1.userInfo.headImg + ');'" @click="openProfile(t1.userInfo)"></view>
                        <view class="content flex-sub">
                            <view class="title" :id="t1._id" @tap="trailDetail">
                                <view class="text-cut text-lg">{{ t1.name }}</view>
                            </view>
                            <view class="text-gray text-sm flex justify-between align-center">
                                <view class="text-grey text-sm" v-if="t1&&t1.kml&&t1.kml.len">
                                    <!-- v-if="t1&&t1.kml&&t1.kml.len" -->
                                    {{ zz.math(t1.kml.len/1000,2) }} Km
                                    <text class="margin-lr-xs" v-if="t1.kml.up == t1.kml.down">↑↓{{ t1.kml.down }} m</text>
                                    <text class="margin-lr-xs" v-else>↑{{ t1.kml.up }}↓{{ t1.kml.down }} m</text>
                                </view>
                                <view class="text-green text-sm">
                                    <text class="cuIcon-time"></text>
                                    <!-- v-if="t1.kml&&t1.kml.time" -->
                                    <text class="margin-lr-xs" v-if="t1.kml&&t1.kml.time">{{ zz.formatDuring(t1.kml.time*1000) }}</text>
                                </view>
                                <view class="flex align-center">
                                    <view class="text-orange" :id="t1._id" @click="userEvent(40, 40, i1)">
                                        <text :class="'cuIcon-favor' + (t1.isFavor ? 'fill' : '')"></text>
                                    </view>
                                    <!-- <view class="text-orange" :id="t1._id" @click="userEvent(50, 40, i1)">
										<button open-type="share" class="cu-btn xs bg-white" :data-id="i1">
											<text class="cuIcon-share text-orange"></text>
										</button>
									</view> -->
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="cu-card case no-card">
                    <view class="cu-item shadow">
                        <view class="image" :id="t1._id" @tap="trailDetail">
                            <image :src="t1.cover" mode="aspectFill"></image>
                            <!-- 		<view class="cu-tag" :class="'bg-blue'">
								{{ dict.trail_type[t1.type[0]].label }}
							</view> -->
                            <view class="cu-bar bg-shadeBottom">
                                <text class="text-cut">{{ t1.path.join('—') || '' }}</text>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="text-sm text-right padding flex justify-between">
                    <block v-for="(e, i4) in t1.element" :key="i4">
                        <view v-if="i4 < 5">
                            <view class="cu-tag light sm round" :class="'bg-green'">
                                {{ dict.trail_element[e].label }}
                            </view>
                        </view>
                    </block>
                    <view>
                        <text class="cuIcon-attentionfill margin-left-xs text-gray"></text>
                        <text class="text-sm margin-left-xs">{{ t1.view || 0 }}</text>

                        <text class="cuIcon-appreciatefill margin-left-xs" :class="'text-' + (t1.isLike ? 'red' : 'gray')" @click="userEvent(30, 40, i1)"></text>
                        <text class="text-sm margin-left-xs">{{ t1.like || 0 }}</text>
                    </view>
                </view>

                <view class="text-content" :id="t1._id" @tap="trailDetail">
                    <view class="pre-line text-left">{{ t1.desc || '……' }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'trailList',
    data() {
        return {
            zz: this.zz,
            dict: uni.getStorageSync('sys_dict'),
        };
    },
    props: {
        dataList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        show: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
    },
    methods: {
        trailDetail: function (e) {
            this.$emit('detail', e.currentTarget.id);
        },
        openProfile(userInfo) {
            console.log("userInfo---------", userInfo)
            this.zz.profile(userInfo._id)
        },
        userEvent(t, tt, idx) {
            this.$emit('userEvent', { t, tt, idx });
        }
    },
    onShareAppMessage(res) {
        let o = this.dataList[res.target.dataset.id];
        // this.userEvent(50, 40, res.target.dataset.id)
        return {
            title: o.name,
            path: '/pages/share?path=/pages/planning/detail&id=' + o._id
        };
    }
};
</script>

<style>
.zaiui-goods-list-box {
    display: none;
}
.zaiui-goods-list-box.show {
    display: block;
}
</style>
