<template>
    <!-- 新闻资讯的swiper组件，首页以及驿站调用 -->
    <!-- <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">资讯</block>
        </cu-custom> -->

    <!-- \
        article = [
	{label:"资讯", value:10 },
	// {label:"", value:20},
	{label:"游记", value:40, pub:true, color:'green'},
	{label:"视频", value:35, pub:true },
	{label:"动态", value:30, pub:true, color:'blue'},
	{label:"文化", value:50 },
	{label:"科普", value:60, pub:true, color:'orange'},
	// {label:"廉政", value:99},
],
         -->
    <view class="container">
        <!-- tab切换。 -->
        <scroll-view id="tabNav" scroll-x class="bg-white nav news-sticky-box" :style="showMore?{ top: stickyHeight,height:'100rpx' }:{position:'fixed'}">
            <view v-if="articleTabs && articleTabs.length > 0" class="flex text-center">
                <!--  -->
                <view v-for="(item, index) in articleTabs" :key="index" class="cu-item flex-sub" :class="index == currentTab ? 'text-orange cur text-bold' : ''" :data-id="index" @tap="tabSelect">
                    {{ item.label }}
                </view>
            </view>
        </scroll-view>
        <view v-if="!showMore" style="width:750rpx;height:100rpx;"></view>
        <!-- class="news-swiper" -->
        <swiper v-if="articleTabs && articleTabs.length>0" :style="listHeight" :current="swiperCurrent" :disable-touch="swiperTouch" @change="swiperChange">
            <!-- 资讯 -->
            <swiper-item v-for="(item,index) in articleTabs" :key="index" class="news-swiper-item">
                <scroll-view :scroll-y="isCanScroll || !showMore" class="scroll-view-box" :style="listHeight" @scroll="listScroll" @scrolltolower="loadMore">
                    <view v-if="item&&item.list&&item.list.length > 0">
                        <view v-for="(article) in item.list" :key="article._id">
                            <article-card v-if="!article.title" :details="article"></article-card>
                            <push-card v-else :details="article"></push-card>
                            <!-- <view>
                                {{ article.title }}
                            </view> -->
                        </view>
                        <view v-if="showMore && item.list.length > 4" class="response padding bg-white" @click="href('/pages/station/news',{tab:index})">
                            <view class="text-center text-blue">查看更多</view>
                            <!-- <button class="cu-btn lg bg-ztsblue radius response">查看更多</button> -->
                        </view>
                        <view v-else class="padding-tb-sm bg-white">
                            <tui-nomore text="没有更多了"></tui-nomore>
                        </view>
                        <zz-page-status v-if="!showMore" :loading="loading" :length="item.list.length" :total="item.total"></zz-page-status>
                    </view>
                    <!-- <view v-if="showMore" class="tabbar-box"></view> -->
                    <view v-if="item.total===0">
                        <tui-no-data :imgWidth="500" :imgHeight="500" :fixed="true" :imgUrl="bd.imgs.nodata">
                        </tui-no-data>
                    </view>
                </scroll-view>
            </swiper-item>
            <!-- 游记 -->
            <!-- <swiper-item class="news-swiper-item">
                <view>
                    <scroll-view scroll-y="true" class="scroll-view-box">
                        <view>
                            <view v-for="(item, index) in momentList" :key="index">
                                <recommand :details="item"></recommand>
                            </view>
                            <view v-if="showMore && " @click="href('/pages/station/news',{tab:1})" class="response padding solid-top line-blue margin-bottom-xs solid-bottom bg-white">
                                <view class="text-center text-blue">查看更多</view>
                            </view>
                            <zz-page-status :loading="loading" :length="articleTabs[1].length" :total="articleTabs[1].total"></zz-page-status>
                        </view>
                        <view v-if="showMore" class="tabbar-box"></view>
                    </scroll-view>
                </view>
            </swiper-item> -->
            <!-- 视频 -->
            <!-- <swiper-item class="news-swiper-item">
                <view>
                    <scroll-view scroll-y="true" class="scroll-view-box">
                        <view>
                            <view v-for="(item, index) in momentList" :key="index">
                                <recommand :details="item"></recommand>
                            </view>
                            <view v-if="showMore" @click="href('/pages/station/news',{tab:2})" class="response padding solid-top line-blue margin-bottom-xs solid-bottom bg-white">
                                <view class="text-center text-blue">查看更多</view>
                            </view>
                            <zz-page-status :loading="loading" :length="articleTabs[2].length" :total="articleTabs[2].total"></zz-page-status>
                        </view>
                        <view v-if="showMore" class="tabbar-box"></view>
                    </scroll-view>
                </view>
            </swiper-item> -->
            <!-- 动态 -->
            <!-- <swiper-item>
                <scroll-view scroll-y="true" class="scroll-view-box">
                    <view>
                        <view v-for="(item, index) in momentList" :key="index">
                            <recommand :details="item"></recommand>
                        </view>
                        <view v-if="showMore" @click="href('/pages/station/news',{tab:3})" class="response padding solid-top line-blue margin-bottom-xs solid-bottom bg-white">
                            <view class="text-center text-blue">查看更多</view>
                        </view>
                        <zz-page-status v-else :loading="loading" :length="articleTabs[3].length" :total="articleTabs[3].total"></zz-page-status>
                    </view>
                    <view v-if="showMore" class="tabbar-box"></view>
                </scroll-view>
            </swiper-item> -->
            <!-- 文化 -->
            <!-- <swiper-item class="news-swiper-item">
                <scroll-view scroll-y="true" class="scroll-view-box">
                    <view v-if="articleTabs && articleTabs[4] && articleTabs[4].list">
                        <view v-for="(item, index) in articleTabs[4].list" :key="item._id">
                            <article-card :details="item"></article-card>
                        </view>
                        <view v-if="showMore" @click="href('/pages/station/news',{tab:4})" class="response padding solid-top line-blue margin-bottom-xs solid-bottom bg-white">
                            <view class="text-center text-blue">查看更多</view>
                        </view>
                        <zz-page-status v-else :loading="loading" :length="articleTabs[4].length" :total="articleTabs[4].total"></zz-page-status>
                    </view>
                    <view v-if="showMore" class="tabbar-box"></view>
                </scroll-view>
            </swiper-item> -->
            <!-- 科普 -->
            <!-- <swiper-item class="news-swiper-item">
                <scroll-view scroll-y="true" class="scroll-view-box" @scrolltolower="loadMore">
                    <view v-if="articleTabs && articleTabs[5] && articleTabs[5].list">
                        <view v-for="(item, index) in articleTabs[5].list" :key="item._id">
                            <article-card :details="item"></article-card>
                        </view>
                        <view v-if="showMore" @click="href('/pages/station/news',{tab:5})" class="response padding solid-top line-blue margin-bottom-xs solid-bottom bg-white">
                            <view class="text-center text-blue">查看更多</view>
                        </view>
                        <zz-page-status v-else :loading="loading" :length="articleTabs[5].list.length" :total="articleTabs[5].total"></zz-page-status>
                    </view>
                    <view v-if="showMore" class="tabbar-box"></view>
                </scroll-view>
            </swiper-item> -->
        </swiper>
    </view>
</template>

<script>
// import recommand from './recommand.vue';
import articleCard from './article-card.vue'
import pushCard from './push-card.vue'
// import news from './news.vue';
// import topic from './topic.vue';
// import newSwiper from './news-swiper.vue'
export default {
    components: {
        // recommand,
        // topic,
        // news,
        // newSwiper,
        articleCard,
        pushCard
    },
    props: {
        tab: {
            type: Number,
            default: 0
        },
        showMore: {
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
            // dict_tag: [],  // 文章标签
            currentTab: 0,  // 激活的tab
            swiperCurrent: 0, // 激活的swiper
            articleTabs: [],  // tabs 列表
            momentList: [],
            topHeight: 0,  // 吸顶tab栏 与顶部的距离
            isCanScroll: false
        };
    },
    computed: {
        // 列表scroll-view的高度
        listHeight() {
            const height = this.customBar + this.statusBar + 50
            return `height:calc(100vh - ${height}px)`  // android
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
                // setTimeout(async ()=>{
                //     await this.loadTag()
                // this.loadData()
                // },500)
            },
            deep: true,
            immediate: true
        },
        scrollTop(newVal) {
            if (newVal > (this.topHeight - 10)) {
                // console.log("可滑动=========")
                this.isCanScroll = true
            } else {

                this.isCanScroll = false
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


        // const timestamp = this.zz.date2Time("2022-08-15 14:57:15")
        // const time = this.zz.timeFrom(timestamp)  // 个性化显示时间
    },
    methods: {
        resetHeight() {
            if (this.showMore) {
                const len = this.stickyHeight.length
                this.stickyHeightNumber = Number(this.stickyHeight.slice(0, len - 2))
                const sysInfo = uni.getStorageSync('sysInfo')
                uni.createSelectorQuery()
                    .select('#tabNav')
                    .boundingClientRect((data) => {
                        this.topHeight = data.top - this.stickyHeightNumber - sysInfo.statusBarHeight
                    })
                    .exec();
            }
        },
        async loadData(type) {
            // if (!this.articleTabs.length) {
            // this.dict = uni.getStorageSync('sys_dict')

            // return setTimeout(()=> { this.loadData(type) }, 120)
            // }
            if (type === 'init') {
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
                ui:true,  // 带上个人信息
                type: [cur.value]  // 科普
            };
            this.zz.req(req1).then(({ pagination, list }) => {
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
                // console.log("新list", cur)
                this.$set(this.articleTabs, this.currentTab, cur)
                // console.log('科普========', this.articleTabs[5].list);
                // console.log('this.articleTabs', JSON.parse(JSON.stringify(this.articleTabs)));
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
            this.currentTab = event.currentTarget.dataset.id;
            this.swiperCurrent = event.currentTarget.dataset.id;
            if (this.articleTabs[this.currentTab].total === -1) {
                this.loadData()
            }
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
.container {
    background-color: #ffffff;
}

.news-sticky-box {
    position: sticky;
    z-index: 10;
}
// .news-swiper {
// }
.scroll-view-box {
    height: calc(100vh - 150px);
}

.tabbar-box {
    // #ifdef APP-PLUS
    height: 50rpx;
    // #endif
    // #ifndef APP-PLUS
    height: var(--window-bottom);
    // #endif

    width: 750rpx;
}
</style>
`
