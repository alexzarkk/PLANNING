<template>
    <view class="container-wrapper">
        <view id="tabNav" class="container">
            <scroll-view scroll-x class="bg-white nav news-sticky-box" :style="showMore?{ top: stickyHeight,height:'100rpx' }:{position:'fixed'}">
                <view v-if="articleTabs && articleTabs.length > 0" class="flex text-center">
                    <view v-for="(item, index) in articleTabs" :key="index" class="cu-item flex-sub" :class="index === currentTab ? 'text-orange cur text-bold' : ''" :data-id="index" @tap="tabSelect">
                        {{ item.label }}
                    </view>
                </view>
            </scroll-view>
            <view v-if="!showMore" style="width:750rpx;height:100rpx;"></view>
            <view v-for="(item,index) in articleTabs" :key="index">
                <view>
                    <view v-if="item.total===-1">
                        <view v-if="index===currentTab" :style="listHeight">
                            <tui-loadmore text="加载中..."></tui-loadmore>
                        </view>
                    </view>
                    <view v-if="item&&item.list && item.list.total !== 0 && index===currentTab" v-show="index===currentTab">
                        <view v-for="(article) in item.list" :key="article._id">
                            <article-card v-if="!article.title" :details="article"></article-card>
                            <push-card v-else :details="article"></push-card>
                        </view>
                        <view v-if="showMore && item.list.length > 4" class="response padding bg-white border-bottom" @click="href('/pages/station/news',{tab:index})">
                            <view class="text-center text-blue">查看更多</view>
                        </view>
                        <view v-if="showMore && item.list.length <= 4 && item.list.length > 0" class="padding-tb-sm bg-white">
                            <tui-nomore text="没有更多了"></tui-nomore>
                        </view>
                        <!-- <view style="height:136rpx"></view> -->
                        <view v-if="item.total===0" :style="listHeight">
                            <tui-no-data :imgWidth="500" :imgHeight="500" :fixed="false" :imgUrl="bd.imgs.nodata">
                            </tui-no-data>
                        </view>
                        <zz-page-status v-if="!showMore" :loading="loading" :length="item.list.length" :total="item.total"></zz-page-status>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import articleCard from './article-card.vue'
import pushCard from './push-card.vue'
export default {
    components: {
        articleCard,
        pushCard
    },
    props: {
        tab: {
            type: Number,
            default: 0
        },
        showMore: {  // true:来自首页加载 false:单独页面
            type: Boolean,
            default: false
        },
        stickyHeight: {
            type: String,
            default: '0'
        },
        scrollTop: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            dict: uni.getStorageSync('sys_dict'),
            stickyHeightNumber: 0,
            scrollTimer: null,
            swiperTouch: false,
            customBar: this.CustomBar,
            statusBar: this.StatusBar,
            loading: false,  // 加载状态
            currentTab: 0,  // 激活的tab
            swiperCurrent: 0, // 激活的swiper
            articleTabs: [],  // tabs 列表
            topHeight: 0,  // 吸顶tab栏 与顶部的距离
            scrollList: [0, 0, 0, 0, 0, 0],
            inTabChange: false, // 是否正在切换tab
            inTop: false  // 是否吸顶
        };
    },
    computed: {
        // 列表scroll-view的高度
        listHeight() {
            // const sysInfo = uni.getStorageSync('sysInfo')
            // 状态栏 + cu-customeBar 高度 + 搜索栏(100rpx) + tabbar高度
            // const height = this.customBar + this.statusBar + sysInfo.safeAreaInsets.bottom
            // const height = this.stickyHeightNumber + 50
            // const height = this.customBar + this.statusBar + 100
            // return `height:calc(100vh - ${height}px)`  // android
            const len = this.stickyHeight.length
            return `height:calc(100vh - ${Number(this.stickyHeight.slice(0, len - 2)) + 50}px)`
        },
        headerHeight() {
            return `${this.customBar + this.statusBar}px`
        }
    },
    watch: {
        tab: {
            async handler(newVal) {
                this.currentTab = newVal
                this.swiperCurrent = newVal
            },
            deep: true,
            immediate: true
        },
        scrollTop(newVal) {
            if (newVal >= (this.topHeight - 5) && !this.inTabChange) {
                this.scrollList[this.currentTab] = newVal
                this.inTop = true
                console.log("吸顶了===========================")
            } else {
                this.inTop = false
            }
        }
    },
    async mounted() {
        this.articleTabs = this.zz.toArr(this.dict.article).filter(e => e.tab).map(item => {
            return Object.assign(item, {
                size: 5,
                page: 1,
                list: [],
                total: -1,
            })
        })
        this.loadData('init');
        this.resetHeight()
    },
    methods: {
        resetHeight() {
            if (this.showMore) {
                const len = this.stickyHeight.length
                // console.log("高度======", this.stickyHeight)
                this.stickyHeightNumber = Number(this.stickyHeight.slice(0, len - 2))
                // console.log("吸顶栏高度===", this.stickyHeightNumber) //  138
                const sysInfo = uni.getStorageSync('sysInfo')
                uni.createSelectorQuery()
                    .select('#tabNav')
                    .boundingClientRect((data) => {
                        // console.log("tabNav===================", data)
                        this.topHeight = data.top - this.stickyHeightNumber
                        // console.log("topheight", this.topHeight)
                        this.scrollList = this.scrollList.map(res => {
                            return this.topHeight
                        })
                        // console.log("this.scrollList========", this.scrollList)
                        // console.log("this.topHeight======", this.topHeight)
                        // - sysInfo.statusBarHeight
                    })
                    .exec();
            }
        },
        async loadData(type) {
            if (type === 'init' || type === 'pullDown') {
                this.articleTabs[this.currentTab].list = []
                this.articleTabs[this.currentTab].page = 1
                this.articleTabs[this.currentTab].total = -1
            }
            let cur = this.articleTabs[this.currentTab]
            if (this.loading || cur.list.length === cur.total || cur.total === 0) {
                return;
            }
            this.loading = true
            // 加载动态信息
            const req1 = {
                $url: '/public/article/page',
                page: cur.page,
                size: cur.size,
                ui: true,  // 带上个人信息
                type: [cur.value]  // 科普
            };
            this.zz.req(req1).then(({ pagination, list }) => {
                // console.log("/public/article/page--------------",pagination)
                // console.log(pagination)
                cur.total = pagination.total
                list = list.map((item) => {
                    item.isAdmin = this.dict.sysUser[item.userId || item.uid]

                    if (item.type && item.type.length > 0) {
                        item.tagList = []
                        item.tagList = item.type.map(tag => {
                            return this.dict.article[tag]
                        })
                    }
                    return item;
                });
                cur.page++
                cur.list = cur.list.concat(list)
                this.$set(this.articleTabs, this.currentTab, cur)
                if (type === 'pullDown') {
                    uni.stopPullDownRefresh()
                    this.zz.toast("刷新成功")
                }
                if (this.showMore && type === 'tab' && this.inTop) {
                    uni.pageScrollTo({
                        scrollTop: this.topHeight,
                        duration: 0
                    });
                }
            }).finally(() => {
                this.loading = false
            })
        },

        loadMore() {
            if (!this.showMore) {
                this.loadData()
            }
        },
        href(url, query) {  // /pages/station/news
            this.zz.href(url, query)
        },
        tabSelect(event) {
            // console.log("切换之前=======", this.scrollList[this.currentTab])
            this.inTabChange = true
            setTimeout(() => {
                this.inTabChange = false
            }, 50)
            this.currentTab = event.currentTarget.dataset.id;
            this.swiperCurrent = event.currentTarget.dataset.id;
            // console.log("切换tab以后的total", this.articleTabs[this.currentTab].total)
            if (this.articleTabs[this.currentTab].total === -1) {
                // console.log("重新加载，loadData(tab)")
                this.loadData('tab')
            }
            // console.log('this.inTop========',this.inTop);
            if (this.inTop) {
                this.$nextTick(() => {
                    // console.log("滚动至指定位置=========", this.scrollList[this.currentTab])
                    uni.pageScrollTo({
                        scrollTop: this.scrollList[this.currentTab],
                        duration: 50
                    });
                })
            }
            this.$emit("tabChange")
        },
        swiperChange(event) {
            this.currentTab = event.detail.current;
            if (event.detail.source === "touch" && this.articleTabs[this.currentTab].total === -1) {
                this.loadData()
            }
        },
        listScroll() {
            clearTimeout(this.scrollTimer)
            this.swiperTouch = true
            this.scrollTimer = setTimeout(() => {
                this.swiperTouch = false
            }, 600)
        }
    }
};
</script>

<style lang="scss" scoped>
// .container {
// background-color: antiquewhite;
// padding-bottom: 100px;
// }

.news-sticky-box {
    position: sticky;
    z-index: 10;
}
// .news-swiper {
// }

// .news-swiper-item {
// padding-bottom: 50px;
// }

// .scroll-view-box {
// background-color: red;
// height: calc(100vh - 400px);
// padding-top: 100px;
// padding-bottom: 100px;
// }

.tabbar-box {
    // #ifdef APP-PLUS
    height: 50rpx;
    // #endif
    // #ifndef APP-PLUS
    height: var(--window-bottom);
    // #endif
    width: 750rpx;
}

.vis-hide {
    visibility: hidden;
}
</style>