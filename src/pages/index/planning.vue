<template>

    <view class="container">
        <cu-custom bgColor="bg-ztsblue">
            <block slot="left">
                <button class="cu-btn xs line-white round shadow margin-left-sm" @tap="onCollect">
                    <text class="zzIcon-dist margin-right-xs"></text>
                    <text class="text-sm">去记录</text>
                </button>
            </block>
            <block slot="content">行程推荐</block>
        </cu-custom>
        <!--搜索框-->
        <!-- <view class="cu-bar bg-blue search fixed" id="searchBar" :style="[{top:customBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"/>
				<input type="text" placeholder="搜索地名/路线 …" confirm-type="search" v-model="searchKey"></input>
			</view>
			<view class="action text-white" @click="doSearch">
				<text class="cuIcon-search"></text>
				<view class="margin-left-xs">搜索</view>
			</view> 
		</view> -->

        <!--   	<view id="t1" class="sticky-box bg-cyan margin-top fixed" :style="[{ top: customBar + 'px' }]">
			<scroll-view scroll-x class="bg-blue light nav text-center">
				<view class="cu-item" :class="index == tabCur ? 'text-blue cur text-bold' : ''" v-for="(item, index) in tabs" :key="index" @click="tabSelect(index)">
					{{ item.label }}
				</view>
			</scroll-view>
		</view> -->
        <!-- App独有 -->
        <view>
            <!-- 搜索框 -->
            <view class="cu-bar search bg-blue light">
                <view class="search-form round">
                    <text class="cuIcon-search"></text>
                    <input style="padding-left: 20rpx" class="text-center" :adjust-position="false" type="text" placeholder="搜索线路" confirm-type="search" />
                </view>
            </view>
            <!-- 筛选条件+线路统计+切换到地图按钮 -->
            <view class="flex justify-around title-search-bar bg-blue light">
                <view class="planing-search-btn" @click="kmls">轨迹</view>
                <view class="text-blue light">{{trailData&&trailData.length > 0 ?trailData.length:0}}路线</view>
                <view class="planing-search-btn" @click="pub">广场</view>
            </view>
        </view>
        <view class="nav-list bg-white" style="padding-top: 30rpx">
            <navigator hover-class="none" :url="item.path" class="nav-li" navigateTo :class="'bg-' + item.color" v-for="(item, index) in elements" :key="index">
                <view class="nav-title">{{ item.title }}</view>
                <view class="nav-name">{{ item.name }}</view>
                <text :class="'cuIcon-' + item.cuIcon"></text>
            </navigator>
        </view>
        <!-- 瀑布流 -->
        <view v-if="isReady && trailShowData.length > 0" class="padding-sm">
            <tui-waterfall :type="2" :pageSize="5" columnGap="0rpx" :listData="trailShowData">
                <template v-slot:left="slotProps">
                    <zz-line-item :lineData="slotProps.entity"></zz-line-item>
                </template>
                <template v-slot:right="slotProps">
                    <zz-line-item :lineData="slotProps.entity"></zz-line-item>
                </template>
            </tui-waterfall>
            <tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
        </view>
        <view v-else class="flex justify-center align-center">
            <tui-no-data :imgWidth="300" :imgHeight="300" :fixed="false" :imgUrl="bd.imgs.nodata">
                <!-- <text class="tui-color__black">{{ msg }}</text> -->
            </tui-no-data>
        </view>
        <tui-scroll-top ref="top" :scrollTop="scrollTop"></tui-scroll-top>
    </view>
</template>
<script>
// import tabsData from '@/comm/test/json/line.json';
export default {
    props: {
        scrollTop: {
            type: Number,
            default: 0
        },
        indexTrailData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        deptId: {
            type: [String, Number],
            default: '330213',
            required: true
        }
    },
    data() {
        return {
            timer: new Date().getTime(),
            isReady: false, // 数据准备
            trailData: [],  // 总共线路
            bd: this.bd,
            td: {},
            pageSize: 5, // 当前的数量
            pageNum: 0, // 当前的页码
            isLoaded: false,
            customBar: this.CustomBar,
            tabCur: 0,
            tabs: this.bd.tStyle,
            searchKey: '',
            // scrollTop: 0,
            elements: [
                {
                    title: '本地频道',
                    name: 'choise',
                    color: 'cyan',
                    cuIcon: 'newsfill',
                    path: '/pages/planning/localLine'
                },
                {
                    title: '行程套餐',
                    name: 'recommand',
                    color: 'blue',
                    cuIcon: 'colorlens',
                    path: '/pages/planning/recommandLine'
                }
            ],
            trailShowData: [], // 瀑布流使用的列表
            loadding: false
        };
    },
    mounted() {
        // this.$nextTick
        // this.loadData('init')
    },
    // onBackPress() { return true },
    // onLoad(qr) {
    // this.loadData()
    // },
    methods: {
        loadData(type) {
            console.warn("planning===============loadData================", this.indexTrailData)
            try {
                if (type === "init") {
                    this.isReady = false
                    this.trailShowData = []
                    this.trailData = []
                }
                let td = null
                td = this.indexTrailData
                this.trailData = td.trailData;
                if (td && td.tStyle) {
                    this.tabs = td.tStyle;
                }
                const list = td.trailData.slice(0, this.pageSize);
                this.trailShowData = this.trailShowData.concat(list)
                console.log("this.trailShowData========", this.trailShowData.length)
                if (this.trailShowData.length === 0) {  // 没有数据
                    this.$emit("noData")
                }
                this.isReady = true
                console.log("PLANNING-------------isReady===========", this.isReady)
            } catch (error) {

                console.log("planning--------------init----------", error)
            }
        },
        kmls() { this.zz.href('/pages/comm/kmlPage') },
        onCollect() {
            // #ifdef APP-PLUS
            this.zz.href('/pages/nav/navApp', 0, 1, 'slide-in-bottom')
            // #endif
        },
        openMap() {
            this.zz.href('/pages/planning/lineMap', 0, 0, 'slide-in-bottom');
        },
        pub() {
            this.zz.href('/pages/index/planningPub')
            // uni.navigateTo({ url: '/pages/index/planningPub' })
        },
        doSearch: function (e) {
            let key = e ? e : this.searchKey;
            if (key == '') return;
            try {
                this.$refs.top.goTop();
            } catch (e) { }
            this.list = [];
            let td = [];
            if (key == 1) {
                this.td.trailData.sort(this.zz.compare('ip', true, true));
                for (var i = 0; i < this.td.trailData.length && i < 20; i++) {
                    td.push(this.td.trailData[i]);
                }
            } else {
                for (let s of this.td.trailData) {
                    if (s.name.includes(this.searchKey) || s.path.includes(this.searchKey)) td.push(s);
                }
            }
            td.sort(this.zz.compare('ip', true, true));
            this.list = td;
            // console.log(td)
        },
        tabSelect(idx) {
            this.tabCur = idx;
        },
        detail(id) {
            this.zz.href('/pages/planning/detail?id=' + id);
        },
        userEvent(e) {
            let o = this.tabs[this.tabCur].list[e.idx];
            this.zz.userEvent(e.t, e.tt, o);
        },
        addTrailShowData() {
            this.pageNum++;
            let list = this.trailData.slice(this.pageSize * this.pageNum, this.pageSize * (this.pageNum + 1));
            if (list.length < this.pageSize || list.length === 0) {
                this.isLoaded = true;
            }
            this.trailShowData = this.trailShowData.concat(list);
        },
        inReachBottom() {
            // console.log("触底加载");
            if (this.isLoaded) {
                return;
            }
            this.addTrailShowData()
        }
    },

    // 触底加载，优化瀑布流
    // onReachBottom: function () {

    // },
    // onPageScroll: function (e) {
    //     this.scrollTop = e.scrollTop;
    // }
};
</script>

<style lang="scss" scoped>
page {
    background-color: #f1f1f1;
}

body {
    background-color: #f1f1f1;
}

.container {
    // height: 100%;
    // min-height: calc(100vh - 100rpx);
    background-color: #f1f1f1;
}

.title-search-bar {
    align-items: center;
    color: #ffffff;
    height: 100rpx;

    .planing-search-btn {
        // height: 40rpx;
        // line-height: 40rpx;
        border-radius: 15rpx;
        background-color: $zts-blue;
        padding: 10rpx 20rpx;
    }
}
</style>
