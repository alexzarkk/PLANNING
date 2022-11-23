<template>
    <view>
        <home ref="home" v-if="hotList" v-show="PageCur == 'home'" :deptId="deptId" :hotList="hotList" :scrollTop="pageScroll[0]" :user="user" @homeDone="homeDone"></home>
        <planning ref="planning" v-if="trailData" v-show="PageCur == 'planning'" :deptId="deptId" :indexTrailData="trailData" :scrollTop="pageScroll[1]" :user="user"></planning>
        <planning-pub v-else ref="planningPub" :home="true" v-show="PageCur == 'planning'" :scrollTop="pageScroll[1]"></planning-pub>
        <event ref="event" v-show="PageCur == 'event'" :user="user" :person="person" @personInfo="personInfo"></event>
        <me ref="me" v-show="PageCur == 'me'" :user="user" :person="person"></me>
        <view class="cu-bar tabbar bg-white shadow foot ">

            <view class="action" @click="NavChange" data-cur="home" data-index="0">
                <view class="cuIcon-cu-image">
                    <image :src="'/static/bar/discover' + [PageCur == 'home'? '' : '_'] + '.png'"></image>
                </view>
                <view :class="PageCur == 'home' ? 'text-ztsblue' : 'text-gray'">发现</view>
            </view>

            <view class="action" @click="NavChange" data-cur="planning" data-index="1">
                <view class="cuIcon-cu-image">
                    <image :src="'/static/bar/nav' + [PageCur == 'planning'? '' : '_'] + '.png'"></image>
                </view>
                <view :class="PageCur == 'planning' ? 'text-ztsblue' : 'text-gray'">行程</view>
            </view>

            <view class="action" @click="NavChange" data-cur="event" data-index="2">
                <view class="cuIcon-cu-image">
                    <image :src="'/static/bar/event' + [PageCur == 'event'? '' : '_'] + '.png'"></image>
                </view>
                <view :class="PageCur == 'event' ? 'text-ztsblue' : 'text-gray'">活动</view>
            </view>

            <view class="action" @click="NavChange" data-cur="me" data-index="3">
                <view class="cuIcon-cu-image">
                    <image :src="'/static/bar/me' + [PageCur == 'me'? '' : '_'] + '.png'"></image>
                </view>
                <view :class="PageCur == 'me' ? 'text-ztsblue' : 'text-gray'">我</view>
            </view>

        </view>
        <tui-scroll-top :scrollTop="pageScroll[curTab]"></tui-scroll-top>
        <!-- <view class="load-progress" :class="loadProgress != 0 ? 'show' : 'hide'" :style="[{ top: CustomBar + 'px' }]">
			<view class="load-progress-bar bg-green" :style="[{ transform: 'translate3d(-' + (100 - loadProgress) + '%, 0px, 0px)' }]"></view>
			<view class="load-progress-spinner text-green"></view>
		</view> -->
    </view>
</template>

<script>
import home from './index/index.vue'
import planning from './index/planning.vue'
import event from './index/event.vue';
import me from './index/me.vue';

import planningPub from './index/planningPub.vue'


export default {
    components: {
        home,
        planning,
        event,
        me,
        planningPub
    },
    data() {
        return {
            scrollTop: 0,
            sysInfo: uni.getStorageSync('sysInfo'),
            enableReach: true, // 是否开启下拉刷新
            CustomBar: this.CustomBar,
            loadProgress: 0,
            PageCur: 'home',
            curTab: 0,
            load: false,
            loadmore: false,
            nomore: false,

            data: [[], [], [], []],
            page: [{}, {}, {}, {}],
            pageScroll: [0, 0, 0, 0],


            deptId: '330213',  // 部门|地区id
            hotList: [],  // 首页数据
            trailData: null,  // planning页面使用的数据


            tab: '', //页面传参过来的

            user: {},
            person: null,
        };
    },
    onLoad({ tab }) {
        if (tab) {
            this.tab = tab
            this.PageCur = tab
        }
        this.loadData('init')
    },
    onReady() {
        if (this.tab) {
            this.$refs[this.tab].loadData(1)
        }
    },
    mounted() {
        if (this.sysInfo.platform == 'ios') {
            this.$scope.$getAppWebview().setStyle({ 'popGesture': 'none' })
        }
    },
    onShow() {
        this.user = this.zz.getAcc()
        this.personInfo()
    },
    methods: {
        personInfo() {
            if (this.user) {
                this.person = null
                this.zz.req({ $url: '/user/person/info' }).then(e => {
                    this.person = e
                })
            }
        },
        async loadData(init) {
            let { deptId, region } = this.zz.getDept()
            if (init || this.deptId != deptId) {
                this.deptId = deptId
                let hots = [
                    { _id: '627911aac2b3040001747310', name: '环浙样板线' },
                    { _id: '609805434c73e7000189c405', name: '奉城屋基' },
                    { _id: '6097e85c9efd500001a7766a', name: '栖霞坑环线' },
                    { _id: '60312048fac28b0001bd5a3a', name: '金峨登山步道' },
                    { _id: '602fe5e55dc5370001e716b0', name: '九峰山环线' },
                    { _id: '60312b1fedb62e0001beeeac', name: '笔架山环线' },
                    { _id: '5ebbd5f04c6c4b004c1e9af5', name: '五百岙-王家山-大岭头-山下' },
                    { _id: '5eba7e994c6c4b004c1e99b3', name: '石头岭古道' }
                ],
                    tStyle = [
                        { label: '当季热门', value: 20 },
                        { label: '古道探幽', value: 40 },
                        { label: '红色教育', value: 60 },
                        { label: '户外挑战', value: 80 }
                    ],
                    regionData = [],
                    hotList = [],
                    tabIndex = 0

                await this.zz.req({ $url: 'public/trail/list', deptId: [deptId], status: 10, type: 60 }).then(list => {
                    for (let s of tStyle) { s.list = [] }
                    for (let k in region) {
                        regionData.push({ tabIndex, code: region[k]._id, name: region[k].name, list: [] })
                        tabIndex++
                    }
                    for (let i = 0; i < list.length; i++) {
                        let s = list[i]
                        for (let r of s.region) {
                            regionData.find(e => e.code == r).list.push(s)
                        }
                        for (let h of hots) {
                            if (h._id == s._id) hotList.push(s)
                        }
                        for (let t of tStyle) {
                            if (s.tStyle && s.tStyle.includes(t.value)) t.list.push(s)
                        }
                    }
                    this.hotList = hotList
                    this.$refs.home.dataLoaded()
                    if (list && list.length > 0) {
                        this.trailData = { trailData: list, regionData, hotList, tStyle }
                        // console.log("首页加载了trailData=================", this.trailData)
                        setTimeout(() => {
                            this.$refs.planning.loadData('init')
                        }, 500)
                        uni.setStorageSync('trailData', this.trailData)
                    }
                })
            }
        },
        // 首页数据加载完成，去加载第二页
        homeDone() {
            // this.$refs.planning.loadData('init')
        },
        // 切换页面
        NavChange(e) {
            // console.log("切换页面=====", e)
            this.curTab = Number(e.currentTarget.dataset.index)
            this.PageCur = e.currentTarget.dataset.cur
            this.$nextTick(() => {
                uni.pageScrollTo({
                    scrollTop: this.pageScroll[this.curTab],
                    duration: 1,
                    success: (res) => {
                        // console.log("滚动成功", res)
                    },
                    fail: () => {
                    }
                })
            })
        },
        loading(e) {
            this.loadProgress += 3;
            if (this.loadProgress < 100 && this.load) {
                setTimeout(() => {
                    this.loading()
                }, 100);
            } else {
                this.loadProgress = 0;
                if (this.load) this.loading()
            }
        },
    },
    onBackPress() { return true }, //安卓有效
    onPageScroll: function (e) {
        this.pageScroll[this.curTab] = e.scrollTop
        this.$set(this.pageScroll, this.curTab, e.scrollTop)
        // console.log("pageScroll==========", e)
        // console.log("this.pageScroll[this.curTab]=======",this.pageScroll)
        this.scrollTop = e.scrollTop;
        // this.scrolled = e.scrollTop;
        // let _this = this;
        // let scrollTop = e.scrollTop + (this.customBar + this.stickBarHeight);
        // if (this.isTopBottomLoad) {
        // for (let i = 0; i < this.articleTabs.length; i++) {
        //     uni.createSelectorQuery()
        //         .select('#' + this.articleTabs[i].boxName)
        //         .boundingClientRect((data) => {
        //             if (data) {
        //                 _this.articleTabs[i].top = data.top + e.scrollTop;
        //                 _this.articleTabs[i].bottom = data.bottom + e.scrollTop;
        //             }
        //         })
        //         .exec();
        // }
        // this.isTopBottomLoad = false;
        // }
        // for (let i = 0; i < this.articleTabs.length; i++) {
        //     if (this.articleTabs[i].top && this.articleTabs[i].bottom) {
        //     }
        // }
        // if (e.scrollTop >= this.videoBottom) {
        //     if (this.deptId && this.deptId != '330213') {
        //         this.pause();
        //     }
        // } else if (e.scrollTop <= this.videoTop) {
        //     if (this.deptId && this.deptId != '330213') {
        //         this.videoContext.play();
        //     }
        // }
    },
    onPullDownRefresh(e) {
        console.log('onPullDownRefresh ..........', e);

    },
    onReachBottom(e) {
        if (this.PageCur == 'planning' && this.$refs.planning) {
            this.$refs.planning.inReachBottom()
        }

        if (this.PageCur == 'planning' && this.$refs.planningPub) {
            this.$refs.planningPub.loadData('add')
        }
        if (this.PageCur == 'home') {
            this.$refs.home.handleReachBottom()
        }

        console.log('onReachBottom ..........', e);
    }
};
</script>

<style>
</style>
