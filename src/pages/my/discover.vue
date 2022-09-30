<template>
    <view>
        <cu-custom bg-color="bg-ztsblue" :is-back="true">
            <block slot="content">
                我的动态
            </block>
        </cu-custom>
        <view class="container">
            <push ref="push" :center="true" :user-id="userInfo._id"></push>
            <!-- <view class="bg-white padding solid-bottom" @click="openDetail(item)" v-for="(item, index) in momentList" :key="index">
                <view class="flex align-end">
                    <text class="text-xxl margin-right-xs text-bold" style="font-size: 48rpx; letter-spacing: 2px">{{ item.dateInfo.day }}</text>
                    <text>{{ item.dateInfo.month }}月</text> 
                </view>
                <view class="margin-top-sm">
                    <text class="round bg-gray padding-lr margin-left text-bold">{{ item.dateInfo.time }}</text>
                </view>
                <view class="margin-top-xs push-wrapper padding">
                    <view class="push-title">{{ item.content }}</view>
                    <view class="push-content">
                        <zz-grid-pic v-if="item.imgs && item.imgs.length > 0" :imgList="item.imgs" @isPreview="isPreview"></zz-grid-pic>
                    </view>
                </view>
                <view class="padding-lr tag-box" v-if="item.tagList && item.tagList.length > 0">
                    <view class="cu-tag radius" :class="'bg-' + tag.color" v-for="(tag, index) in item.tagList">
                        {{ tag.label }}
                    </view>
                </view>
            </view> -->
            <!-- <view class="bg-white padding-top" @click="openPage('/pages/my/social/pushDetails')">
                <view class="flex align-end padding-left">
                    <text class="text-xxl margin-right-xs text-bold" style="font-size: 48rpx; letter-spacing: 2px">28</text>
                    <text>2月</text>
                </view>
                <view class="margin-top-sm padding-left"><text class="round bg-gray padding-lr margin-left text-bold">08:30:59</text></view>
                <view class="margin-top-xs push-wrapper">
                    <view class="push-title padding-left">上传了一条轨迹“2022-02-28”</view>
                    <zz-grid-pic :imgCount="6"></zz-grid-pic>
                    <view class="padding">
                        <zz-line-card></zz-line-card>
                    </view>
                </view>
            </view>

            <view class="bg-white padding">
                <view class="flex align-end">
                    <text class="text-xxl margin-right-xs text-bold" style="font-size: 48rpx; letter-spacing: 2px">20</text>
                    <text>2月</text>
                </view>
                <view class="margin-top-sm"><text class="round bg-gray padding-lr margin-left text-bold">15:30:59</text></view>
                <view class="margin-top-xs push-wrapper">
                    <view class="push-title">图片</view>
                    <view class="push-content">
                        <image src="https://s1.ax1x.com/2022/06/24/ji7ipq.jpg" />
                    </view>
                </view>
            </view>

            <view class="bg-white padding">
                <view class="flex align-end padding">
                    <text class="text-xxl margin-right-xs text-bold" style="font-size: 48rpx; letter-spacing: 2px">20</text>
                    <text>2月</text>
                </view>
                <view class="margin-top-sm"><text class="round bg-gray padding-lr margin-left text-bold">15:30:59</text></view>
                <view class="margin-top-xs push-wrapper">
                    <view class="push-title">视频</view>
                    <view class="push-content">
                        <image src="https://s1.ax1x.com/2022/06/24/ji7ipq.jpg" />
                    </view>
                </view>
            </view> -->
            <!-- <tui-no-data v-if="total === 0" imgUrl="https://s1.ax1x.com/2022/07/19/jT9EWt.png" btnText="去发布" @click="openPage">
                <text class="tui-color__black">暂时还没有发布动态~</text>
            </tui-no-data>
            <tui-loadmore v-if="loading" :index="2"></tui-loadmore>
            <tui-divider v-if="momentList.length < total && total > 0 && !loading"><view class="tui-nomore-text">上滑或点击加载</view></tui-divider>
            <tui-nomore v-if="momentList.length === total && total > 0" text="没有更多了"></tui-nomore> -->
            <!-- <zz-page-status :loading="loading" :isCenter="true" :length="momentList.length" :total="total" msg="当前没有发布动态~" btn="去发布"></zz-page-status> -->
            <view style="height: 100rpx; width: 750rpx"></view>
        </view>
    </view>
</template>

<script>
import push from '@/components/push/push.vue'
export default {
    components: {
        push
    },
    data() {
        return {
            userInfo: null,
            isInPreview: false, //  如果是点击预览
            pageNum: 1,
            pageSize: 10,
            loading: false, // 当前是否正在加载数据
            total: -1, //  当前的加载状态控制  -1:当前未加载开始加载数据  0:没有数据  >0&&currentList.length<total:当前有数据   =currentList.length:数据已经加载完毕
            momentList: [], // 动态列表
            dict_tag: []
        };
    },
    async onLoad() {
        this.userInfo = this.zz.getAcc();
        // await this.loadTag()
        // this.loadData('init');
        uni.$on("deletePush", () => {
            this.loadData('init');
        })

    },
    onShow() {
        // this.loadData('init');

    },
    methods: {
    },
    onPullDownRefresh() {
        // this.loadData('init', true)
        this.$refs.push.loadData('init',true)
    },
    onReachBottom() {
        this.$refs.push.loadData('add')
    }
};
</script>

<style>
page {
    background-color: #ffffff;
}

body {
    background-color: #ffffff;
}
</style>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    // background-color: #f1f1f1;
}

.solid-bottom {
    border-bottom: 1px solid #f1f1f1;
}
</style>
