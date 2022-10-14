<template>
<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="backText"></block>
            <block slot="content">我的收藏</block>
        </cu-custom>
        <view class="padding bg-white">
            <tui-segmented-control :values="titleList" activeColor="#8fc42f" @click="modeChange"></tui-segmented-control>
        </view>
        <scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
            <view v-for="(item, index) in page" :key="index" class="cu-item" :class="index == TabCur ? 'text-ztsgreen cur' : ''" :data-id="index" @tap="tabSelect">
                {{ item.title }}
            </view>
        </scroll-view>
		
		<!-- 文章收藏 -->
		<template v-if="TabCur===0">
			<view v-for="(item, index) in page[TabCur].list" :key="index">
			    <view class="cu-card article" @click="detail(item._id)">
			        <view class="cu-item shadow">
			            <view class="title">
			                <view class="text-cut">
			                    {{ item.title?item.title:'动态' }}
			                </view>
			            </view>
						<template v-if="item.title">
							<view class="content">
								<image :src="item.cover.url || bd.sys.logo" mode="aspectFill"></image>
								<view class="desc">
									<view class="text-content">{{ item.desc }}</view>
								</view>
							</view>
						</template>
						<template v-else>
							<view class="content">
								<image :src="item.imgs[0]" mode="aspectFill"></image>
								<view class="desc">
									<view class="text-content">{{ item.content }}</view>
								</view>
							</view>
						</template>
			        </view>
			    </view>
			</view>
		</template>
		
		<!-- 评论 blog-->
		<template v-if="TabCur===1">
			<view v-for="(item, index) in page[TabCur].list" :key="index">
				<view class="padding bg-white flex justify-between margin-bottom-sm" style="position: relative" @click="detail(item._id)">
					<view class="flex">
						<view class="margin-right">
							<view v-if="item.userInfo" class="cu-avatar round lg" :style="'background-image:url(' + item.userInfo.headImg + ')'"></view>
						</view>
						<view class="flex flex-direction flex-start padding-top">
							<view v-if="item.userInfo" class="flex justify-between align-center">
								<view>{{ item.userInfo.nickName }}</view>
							</view>
							<view class="margin-bottom">
								<view class="padding-top">{{ item.content }}</view>
							</view>
							<view class="margin-bottom-xs">
								<view style="width: 550rpx" class="text-gray text-sm flex justify-between align-center">
									<view class="margin-right">
										{{ item.createTime }}
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
		</template>
		
		<!-- 推荐行程 trail-->
		<template v-if="TabCur===2">
			<zz-trail-list @detail="detail" :dataList="page[TabCur].list"></zz-trail-list>
		</template>
		
		<!-- kml\rec轨迹 -->
		<template v-if="TabCur===3">
			<zz-poi-list :data-list="page[TabCur].list" />
		</template>
		
		<!-- 兴趣点 poi -->
		<template v-if="TabCur===4">
			<zz-line-track v-for="(item, index) in page[TabCur].list" :key="index" :details="item"></zz-line-track>
		</template>
		
		<!-- 兴趣点 rec_pm / kml_pm -->
		<template v-if="TabCur===5">
			<zz-point-track v-for="(item, index) in page[TabCur].list" :key="index" :details="item"></zz-point-track>
		</template>
		
        <zz-page-status :loading="loading" :length="page[TabCur].list.length" :total="page[TabCur].total"></zz-page-status>
    </view>
</template>

<script>
export default {
    data() {
        return {
            t: 40,  // 40收藏  30点赞/喜欢
            loading: false,
            TabCur: 0,
            scrollLeft: 0,
            titleList: ['收藏', '喜欢'],
            page: [
                {
                    title: '文章', // 发布的资讯文章等等
                    tt: 10,
                    total: -1,
					page: 1,
                    list: [],
					url: '/pages/planning/article'
                },
                {
                    title: '评论', // 户外分享
                    tt: 2,
                    total: -1,
					page: 1,
                    list: [],
					url: '/pages/my/social/pushDetails'
                },
                {
                    title: '行程', //系统推荐
                    tt: 40,
                    total: -1,
					page: 1,
                    list: [],
					url: '/pages/planning/detail'
                },
                {
                    title: '兴趣点',
                    tt: 20,
                    total: -1,
					page: 1,
                    list: [],
					url: '/pages/planning/poi'
                },
                {
                    title: '轨迹', // 别人走的线路
                    tt: [42,100],
                    total: -1,
					page: 1,
                    list: [],
					url: '/pages/nav/rec/lineDetail'
                },
                {
                    title: '坐标',
                    tt: 44,
                    total: -1,
					page: 1,
                    list: [],
					url: ''
                },
				
                // {
                //     title: '赛事',
                // 	tt:50
                // }
            ]
        }
    },
    onLoad() {
        this.loadData('init')
    },
    methods: {
        async loadData(type) {
            let cur = this.page[this.TabCur]
            if (type === 'init') {
                Object.assign(this.page[this.TabCur], { page: 1, size: 10, total: -1, list: [], my:1, t: this.t })
            }
            if (this.loading || cur.total == cur.list.length || cur.total === 0) {
                return
            }
            this.loading = true
            this.zz.req({$url: '/user/ue/pages', ...cur}).then(e => {
				this.loading = false
                cur.total = e.pagination.total
                cur.list = cur.list.concat(e.list)
                cur.page ++
				
				// console.log(e,cur);
            })
        },
		detail(id){
			let url = this.page[this.TabCur].url
			if(url) this.zz.href(url+'?id='+id)
		},
		
        // 收藏/喜欢的切换
        modeChange(e) {
            console.log('modeCHange', e);
            this.t = e.index == 0 ? 40 : 30
            this.loadData('init')
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