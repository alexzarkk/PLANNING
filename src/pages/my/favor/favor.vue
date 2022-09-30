<template>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="backText"></block>
            <block slot="content">我的收藏</block>
        </cu-custom>
        <view class="padding bg-white">
            <tui-segmented-control :values="titleList" activeColor="#8fc42f" @click="modeChange"></tui-segmented-control>
        </view>
        <scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
            <view
                v-for="(item, index) in page" :key="index" class="cu-item" :class="index == TabCur ? 'text-ztsgreen cur' : ''" :data-id="index"
                @tap="tabSelect"
            >
                {{ item.title }}
            </view>
        </scroll-view>
        <view v-for="(item, index) in page[TabCur].list" :key="index">
            <!-- 文章收藏 -->
            <view v-if="item.info && TabCur===0" class="cu-card article">
                <view class="cu-item shadow">
                    <view class="title">
                        <view class="text-cut">
                            {{ item.info.title }}
                        </view>
                    </view>
                    <view class="content">
                        <image :src="item.info.cover.url" mode="aspectFill"></image>
                        <view class="desc">
                            <view class="text-content">{{ item.info.desc }}</view>
                            <!-- <view>
                                <view class="cu-tag bg-red light sm round">正义天使</view>
                                <view class="cu-tag bg-green light sm round">史诗</view>
                            </view> -->
                        </view>
                    </view>
                </view>
            </view>
            <!-- 评论 -->
            <view v-if="item.info && TabCur ===1">
                <view class="padding bg-white flex justify-between margin-bottom-sm" style="position: relative">
                    <view class="flex">
                        <view class="margin-right">
                            <view v-if="item.userInfo" class="cu-avatar round lg" :style="'background-image:url(' + item.userInfo.headImg + ')'"></view>
                        </view>
                        <view class="flex flex-direction flex-start padding-top">
                            <view v-if="item.userInfo" class="flex justify-between align-center">
                                <view>{{ item.userInfo.nickName }}</view>
                            </view>
                            <view class="margin-bottom">
                                <view class="padding-top">{{ item.info.content }}</view>
                            </view>
                            <view class="margin-bottom-xs">
                                <view style="width: 550rpx" class="text-gray text-sm flex justify-between align-center">
                                    <view class="margin-right">
                                        {{ item.info.createTime }}
                                    </view>
                                    <!-- <view class="flex align-center">
                                        <view class="flex">
                                            <view class="margin-right-xs">
                                                <text v-if="!item.isLike" class="cuIcon-appreciate text-gray"></text>
                                                <text v-else class="cuIcon-appreciatefill text-orange"></text>
                                            </view>
                                            <text v-show="item.like > 0" class="padding-right" :class="item.isLike ? 'text-orange' : ''">{{ item.like }}</text>
                                        </view>
                                    </view> -->
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 行程和轨迹 -->
            <view v-if="item.info && TabCur===2||TabCur===3">
                <zz-line-track :details="item.info"></zz-line-track>
            </view>
            <!-- 兴趣点 -->
            <view v-if="item.info && TabCur===4">
                <zz-point-track :details="item.info"></zz-point-track>
            </view>
        </view>
        <zz-page-status :loading="loading" :length="page[TabCur].list.length" :total="page[TabCur].total"></zz-page-status>
        <!-- <tui-no-data :fixed="true" :imgWidth="300" :imgHeight="300" :imgUrl="bd.imgs.nodata"></tui-no-data> -->
    </view>
</template>

<script>
export default {
    data() {
        return {
            t: 0,
            loading:false,
            TabCur: 0,
            scrollLeft: 0,
            titleList: ['收藏', '喜欢'],
            page: [
                // {
                //     title: '全部',
                //     tt: 0,
                //     total: -1,
                //     page: 1,
                //     list: []
                // },
                {
                    title: '文章', // 发布的资讯文章等等
                    tt: 10,
                    total: -1,
                    page: 1,
                    list: []
                },
                {
                    title: '评论', // 户外分享
                    tt: 2,
                    total: -1,
                    page: 1,
                    list: []
                },
                {
                    title: '行程', //系统推荐
                    tt: 40,
                    total: -1,
                    page: 1,
                    list: []
                },
                {
                    title: '轨迹', // 别人走的线路
                    tt: 42,
                    total: -1,
                    page: 1,
                    list: []
                },
                {
                    title: '兴趣点',
                    tt: 44,
                    total: -1,
                    page: 1,
                    list: []
                },

                // {
                //     title: '兴趣点',
                //     tt: 20,
                //     total: -1,
                //     page: 1,
                //     list: []
                // },
                // {
                //     title: '赛事',
                // 	tt:50
                // }
            ]
        }
    },
    onLoad() {
        this.user = this.zz.getAcc()
        this.loadData('init')
    },
    methods: {
        async loadData(type) {
            let cur = this.page[this.TabCur]
            if (type === 'init') {
                Object.assign(cur, { page: 1, size: 10, total: -1, list: [], tt: cur.tt })
            }
            let { tt, page, size, total } = cur
            if (this.loading || total == cur.list.length || total === 0) {
                return;
            }
            this.loading = true
            const req1 = {
                $url: '/user/ue/pages',
                tt,
                page,
                size,
                t: this.t,
                my: 1
            }
            await this.zz.req(req1).then(e => {
                cur.total = e.pagination.total
                cur.list = cur.list.concat(e.list)
                cur.page++
                console.log('cur========',JSON.parse(JSON.stringify(cur)));
            })
            this.loading = false
            console.log("this.loading============", this.loading)
        },
        // 收藏/喜欢的切换
        modeChange(e) {
            console.log('modeCHange', e);
            this.t = e.index == 0 ? 1 : 2
        },
        tabSelect(e) {
            this.TabCur = e.currentTarget.dataset.id
            this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
            this.loadData()
        },
    },
    async onPullDownRefresh() {
        uni.showLoading({ title: '正在刷新' })
        await this.loadData('init')
        uni.hideLoading()
        uni.stopPullDownRefresh()
    },
    onReachBottom() {
        this.loadData('add')
    }
};
</script>