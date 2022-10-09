<template>
    <view>
        <cu-custom bg-color="bg-ztsblue" :is-back="true">
            <block slot="content">我的兴趣点</block>
        </cu-custom>
        <view class="container">
            <!-- 地图 ，地图上展示  兴趣点的位置 -->
            <!-- 筛选条件 -->
            <!-- <view class="flex align-center justify-between bg-white padding">
                <view @click="gotoFilter()">
                    <button class="cu-btn bg-olive">筛选条件</button>
                </view>
                <view class="text-olive">123个兴趣点</view>
                <view class="text-xl">
                    <button class="cu-btn bg-olive" @click="isCard = !isCard">
                        <text v-if="!isCard" class="cuIcon-apps">卡片</text>
                        <text v-else class="cuIcon-list">列表</text>
                    </button>
                </view>
            </view> -->
            <view v-for="(line,lIndex) in pageList" :key="lIndex">
                <view class="padding" @click="openLineDetails(line)">
                    <view class="cu-bar bg-white radius-df-lg">
                        <view class="action">
                            <text class="cuIcon-titles text-green"></text>
                            <text class="text-xl text-bold text-cut-2">{{ line.name }}</text>
                        </view>
                        <view class="padding-right text-black text-w4 text-right">{{ line.point.length }}个</view>
                    </view>
                </view>
                <zz-point-track
                    v-for="(point,pIndex) in line.point" :key="pIndex" :cardMode="isCard" :details="point" :userInfo="line.userInfo"
                    @userEvent="userEvent($event,lIndex,pIndex)" @pointDetails="openPointDetails($event,lIndex,pIndex)"
                ></zz-point-track>
            </view>
            <zz-page-status :loading="loading" :length="pageList.length" :total="total"></zz-page-status>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            loading: false,  // 数据加载状态
            total: -1,  // 服务器 分页 total
            pageList: [], // 分页列表
            pageNum: 1,  // 页码
            pageSize: 5,  // 数量
            isCard: true,
            dict: uni.getStorageSync('sys_dict'),
        };
    },
    onLoad() {
        this.loadData();
    },
    methods: {
        /**
        * type: add:加载更多  init:重新加载列表数据
        * stopPullDown:是否在加载完成时下拉刷新
        */
        async loadData(type, stopPullDown = false) {
            if (type === 'init') {
                this.pageList = [];
                this.pageNum = 1;
                this.total = -1;
            }
            if (this.loading || this.pageList.length === this.total || this.total === 0) {
                return;
            }
            this.loading = true
            const req1 = {
                $url: '/user/rec/pagePoint',
				i_s: ['isFavor'],
                page: this.pageNum,
                size: this.pageSize
            }
            this.zz.req(req1).then(({ pagination, list }) => {
				console.log(list);
                this.total = pagination.total
                this.pageNum ++
                this.pageList = this.pageList.concat(list)
                this.loading = false
                if (stopPullDown) {
                    this.zz.toast("刷新成功", 1000)
                    uni.stopPullDownRefresh();
                }
            })
        },
        openLineDetails(line) {
            this.zz.href('/pages/nav/rec/lineDetail', line)
        },
        // 打开坐标点详情
        async openPointDetails($event, lIndex, pIndex) {
			let kml = this.pageList[lIndex]
			if(!kml.t1) kml.t1 = await this.zz.req({ $url: '/user/rec/line', pid: kml._id }, true)
			this.zz.href('/pages/comm/point', { kml: { ...kml, t1: kml.t1, t2: kml.point }, idx: pIndex })
        },
        // 收藏事件
        userEvent({ t, tt }, lIndex, pIndex) {
			let o = this.pageList[lIndex].point[pIndex]
			console.log(o);
            this.zz.userEvent(t,tt,o)
			this.$set(o, 'isFavor', o.isFavor)
        }
        // 跳转到兴趣点筛选
        // gotoFilter() {
        //     this.zz.href("/pages/nav/rec/pointFilter")
        // }
    },
    onReachBottom() {
        this.loadData('add');
    }

};
</script>

<style lang="scss" scoped>
.tui-header {
    width: 100%;
    // padding-top: 34rpx;
    /* box-shadow: 0 15rpx 10rpx -15rpx #f2f2f2; */
    box-sizing: border-box;
    background-color: #fff;
    // position: fixed;
    // z-index: 1000;
}

.tui-header-top,
.tui-header-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.3rem;
    color: #333;
}

.tui-top-item {
    height: 26rpx;
    line-height: 26rpx;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tui-topitem-active {
    position: relative;
    font-weight: bold;
}

.tui-topitem-active::after {
    content: '';
    position: absolute;
    width: 44rpx;
    height: 6rpx;
    background: #5677fc;
    border-radius: 6rpx;
    bottom: -10rpx;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
}

.tui-price-arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 20rpx;
}

.tui-bottom-item .tui-icon-class,
.tui-screen .tui-icon-class {
    margin-left: 6rpx;
}

.tui-icon-box {
    line-height: 12px !important;
    padding: 0 !important;
    display: block !important;
    position: relative;
}

.tui-arrow-up {
    top: 5px;
}

.tui-arrow-down {
    top: -3px;
}

.tui-header-bottom {
    // margin-top: 56rpx;
    height: 84rpx;
    padding: 10rpx 30rpx;
    box-sizing: border-box;
    font-size: 1.2rem;
    align-items: center;
    overflow: hidden;
}

.tui-bottom-text {
    line-height: 24rpx;
}

.tui-bottom-item {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 18rpx 12rpx;
    border-radius: 40rpx;
    box-sizing: border-box;
    background: #f2f2f2;
    margin-right: 20rpx;
    white-space: nowrap;
}

.tui-bottom-item:last-child {
    margin-right: 0;
}

.tui-btmItem-active {
    padding-bottom: 60rpx;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.tui-bold {
    font-weight: bold;
}

.tui-active {
    color: #5677fc;
}

.tui-ml {
    margin-left: 6rpx;
}

.tui-seizeaseat-20 {
    height: 20rpx;
}

.tui-seizeaseat-30 {
    height: 30rpx;
}

.tui-middle {
    vertical-align: middle;
}

.tui-drop-item .tui-icon-class {
    vertical-align: middle;
}
</style>
