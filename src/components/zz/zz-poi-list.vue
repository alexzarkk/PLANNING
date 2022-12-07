<template>
    <view>
        <!-- 线路 -->
        <block v-if="dataList.length>2">
            <view class="cu-card case dynamic solid-bottom bg-gray" v-for="(t1, i1) in dataList" :key="i1">
                <view class="cu-item shadow">
                    <view class="cu-list menu-avatar ">
                        <view class="cu-item">
                            <view class="cu-avatar margin-lr-sm round bg-blue">
                                <text class="title">{{i1+1}}</text>
                            </view>
                            <view class="content flex-sub">
                                <view class="title" :id="t1._id" @tap="poiDetail(i1)">
                                    <view class="text-cut text-lg" style="color: #0062CC;">{{ t1.name }}</view>
                                </view>
                                <view class="text-gray text-sm flex justify-between">
                                    <view class="text-grey text-sm">
                                        位置：
                                        <text class="margin-lr-sm">{{ t1.addr }}</text>
                                    </view>
                                    <!-- <view class="text-orange text-sm" @tap="goLocation(i1)">
                                        <button class="cu-btn round bg-orange shadow sm">
                                            <text class="cuIcon-forward margin-right-xs"></text>
                                            地图
                                        </button>
                                    </view> -->
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="cu-card case no-card">
                        <view class="cu-item shadow padding-bottom">
                            <view class="image" style="height:400rpx" :id="t1._id" @tap="poiDetail(i1)">
                                <image :src="t1.cover" mode="aspectFill"></image>
                                <!-- <view class="cu-tag" :class="'bg-blue'">
									{{ dict['poi_'+t1.level][t1.type[0]].text }}
								</view> -->
                                <view class="cu-bar bg-shadeBottom">
                                    <text class="text-cut text-sm">{{ t1.desc }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </block>
        <block v-else>
            <view class="cu-card no-card solid-bottom bg-gray" v-for="(poi, index) in dataList" :key="index">
                <view class="cu-item shadow">
                    <view class="cu-list menu-avatar ">
                        <view class="cu-item">
                            <view class="cu-avatar margin-lr-sm round bg-blue">
                                <text class="title">
                                    <block v-if="dataList.length>1">
                                        {{index+1}}
                                    </block>
                                    <block v-else>
                                        ·
                                    </block>
                                </text>
                            </view>
                            <view class="content flex-sub">
                                <view class="title" :id="poi._id" @tap="poiDetail(index)">
                                    <view class="text-cut text-lg" style="color: #0062CC;">{{ poi.name }}</view>
                                </view>
                                <view class="text-gray text-sm flex justify-between">
                                    <view class="text-grey text-sm">
                                        位置：
                                        <text class="margin-lr-sm">{{ poi.addr }}</text>
                                    </view>
                                    <!-- 浙里办内不使用！！！ -->
                                    <!-- <view class="text-orange text-sm" @tap="goLocation(index)">
										<button class="cu-btn round bg-orange shadow sm">
											<text class="cuIcon-forward margin-right-xs"></text>
											地图
										</button>
									</view> -->
                                </view>
                            </view>
                        </view>
                    </view>

                    <view class="bg-white text-gray text-sm text-right padding-top padding-lr">
                        <view>
                            <text class="cuIcon-attentionfill margin-lr-xs"></text>
                            {{poi.view}}
                            <text class="cuIcon-appreciatefill margin-lr-xs"></text>
                            {{poi.like}}
                            <!-- <text class="cuIcon-messagefill margin-lr-xs"></text> -->
                        </view>
                    </view>

                    <view class="bg-white padding-lr-sm padding-top-sm solid-top">
                        <!-- <wxParse :content="poi.content"></wxParse> -->
                        <u-parse :content="poi.content"></u-parse>
                    </view>

                    <view class="cu-progress margin-top xs bg-gray"></view>
                </view>
            </view>
        </block>
    </view>
</template>

<script>

import uParse from '@/components/u-parse/u-parse.vue'

export default {
    name: 'poiList',
     components: {
        uParse
    },
    data() {
        return {
            dict: uni.getStorageSync('sys_dict')
        }
    },
    props: {
        dataList: {
            type: Array,
            default: () => { return [] }
        }
    },
    methods: {
        poiDetail: function (e) {
            uni.setStorageSync('trailPoi', this.dataList[e])
            this.zz.href('/pages/planning/poi?id=' + this.dataList[e]._id)
        },
        goLocation: function (e) {
            const t = this.dataList[e]
            uni.openLocation({
                longitude: t.location.coord[0],
                latitude: t.location.coord[1],
                name: t.location.name,
            })
        },
        imgView: function (img) { this.zz.viewIMG([img], 0) }
    }
};
</script>

<style>
</style>
