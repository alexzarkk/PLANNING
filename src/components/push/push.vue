<template>
    <!-- 
    name: 动态内容组件，带分页加载
 -->
    <view>
        <view v-for="(item, index) in momentList" :key="index" class="bg-white padding solid-bottom" @click="openDetail(item)">
            <view v-if="item.title">
                <!-- {{item.title}} -->
            </view>
            <view v-else>
                <view class="flex align-end">
                    <text class="text-xxl margin-right-xs text-bold" style="font-size: 2.4rem; letter-spacing: 2px">
                        {{ item.dateInfo.day }}
                    </text>
                    <text>{{ item.dateInfo.month }}月</text>
                </view>
                <view class="margin-top-sm">
                    <text class="round bg-gray padding-lr margin-left text-bold">
                        {{ item.dateInfo.time }}
                    </text>
                </view>
                <view class="margin-top-xs push-wrapper padding">
                    <view class="push-title">
                        {{ item.content }}
                    </view>
                    <view class="push-content">
                        <zz-upload-image v-if="item.imgs && item.imgs.length > 0" :readOnly="true" :imgs="item.imgs"></zz-upload-image>
                    </view>
                </view>
                <view v-if="item.tagList && item.tagList.length > 0" class="padding-lr tag-box">
                    <view v-for="(tag,tIndex) in item.tagList" :key="tIndex" class="cu-tag radius" :class="'bg-' + tag.color">
                        {{ tag.label }}
                    </view>
                </view>
            </view>
        </view>
        <zz-page-status :loading="loading" :is-center="center" :length="momentList.length" :total="total" msg="当前没有发布动态~" btn="去发布"></zz-page-status>
    </view>
</template>

<script>
export default {
    props: {
        userId: {
            type: String,
            default: ''
        },
        center: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isInPreview: false, //  如果是点击预览
            page: 1,
            size: 10,
            loading: false, // 当前是否正在加载数据
            total: -1, //  当前的加载状态控制  -1:当前未加载开始加载数据  0:没有数据  >0&&currentList.length<total:当前有数据   =currentList.length:数据已经加载完毕
            momentList: [], // 动态列表
            dict_tag: []
        };
    },
    created() {
        this.loadData('init');
    },
    mounted() {

        // console.log("push----------------userId----------------------",this.userId)
        // console.log("push-------------------------------------------------------")
    },
    methods: {
        async loadTag() {
            const req1 = {
                $url: 'public/zz/dict',
                tar: ['article']
            }
            await this.zz.req(req1).then(({ article }) => {
                this.dict_tag = article
            })
        },
        /**
         * type: add or init
         */
        async loadData(type, stopPullDown) {
            if (this.dict_tag.length === 0) {
                await this.loadTag()
            }
            if (type === 'init') {  // init
                this.momentList = [];
                this.page = 1;
                this.total = -1;
            }
            if (this.loading || this.momentList.length === this.total) {  // 防止重复加载
                return;
            }
            this.loading = true;
            // this.userInfo._id
            const requestParams = {
                $url: 'user/moment/page',
                userId: this.userId,
                page: this.page,
                size: this.size
            };
            this.zz.req(requestParams).then(({ pagination, list }) => {
                // console.log("动态列表===",list)
                this.total = pagination.total; // 赋值total
                list = list.map((item) => {
                    item.dateInfo = this.zz.time2Date(item.createTime, 'obj');
                    if (item.type && item.type.length > 0) {
                        item.tagList = item.type.map(tag => {
                            const newTag = this.dict_tag.find(dict => {
                                return tag === dict.value
                            })
                            return newTag
                        })
                    }
                    return item;
                });
                this.page++;
                this.momentList = this.momentList.concat(list); // 拼接列表
                this.loading = false;
                if (stopPullDown) {
                    this.zz.toast("刷新成功", 1000)
                    uni.stopPullDownRefresh();
                }
            });
        },
        // 动态详情
        openDetail(item) {
            if (!this.isInPreview) {
                this.zz.href('/pages/my/social/pushDetails', { _id: item._id });
            }
        },
        // 控制图片点击的时候不进入详情
        isPreview() {
            this.isInPreview = true
            setTimeout(() => {
                this.isInPreview = false
            }, 500)
        },
    }
};
</script>

<style lang="scss" scoped></style>
<template>
    <!-- 
    name: 动态内容组件，带分页加载
 -->
    <view>
        <view v-for="(item, index) in momentList" :key="index" class="bg-white padding solid-bottom" @click="openDetail(item)">
            <view class="flex align-end">
                <text class="text-xxl margin-right-xs text-bold" style="font-size: 2.4rem; letter-spacing: 2px">
                    {{ item.dateInfo.day }}
                </text>
                <text>{{ item.dateInfo.month }}月</text>
            </view>
            <view class="margin-top-sm">
                <text class="round bg-gray padding-lr margin-left text-bold">
                    {{ item.dateInfo.time }}
                </text>
            </view>
            <view class="margin-top-xs push-wrapper padding">
                <view class="push-title">
                    {{ item.content }}
                </view>
                <view class="push-content">
                    <zz-upload-image v-if="item.imgs && item.imgs.length > 0" :readOnly="true" :imgs="item.imgs"></zz-upload-image>
                </view>
            </view>
            <!-- 标签 -->
            <view v-if="item.tagList && item.tagList.length > 0" class="padding-lr tag-box">
                <view v-for="(tag,tIndex) in item.tagList" :key="tIndex" class="cu-tag radius" :class="'bg-' + tag.color">
                    {{ tag.label }}
                </view>
            </view>
            <!-- 话题 -->
            <!-- <view v-if="item.topic && item. topic.length > 0" class="padding flex align-center flex-wrap">
                    <view v-for="(topic, index) in item.topic" :key="index" class="cu-tag line-blue round padding-lr">
                        <text class="margin-right-sm">#{{ topic.title }}</text>
                    </view>
                </view> -->
        </view>
        <!-- <view class="bg-white padding-top" @click="openPage('/pages/my/social/pushDetails')">
                <view class="flex align-end padding-left">
                    <text class="text-xxl margin-right-xs text-bold" style="font-size: 2.4rem; letter-spacing: 2px">28</text>
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
                    <text class="text-xxl margin-right-xs text-bold" style="font-size: 2.4rem; letter-spacing: 2px">20</text>
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
                    <text class="text-xxl margin-right-xs text-bold" style="font-size: 2.4rem; letter-spacing: 2px">20</text>
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
        <zz-page-status :loading="loading" :is-center="center" :length="momentList.length" :total="total" msg="当前没有发布动态~" btn="去发布"></zz-page-status>
    </view>
</template>

<script>
export default {
    props: {
        userId: {
            type: String,
            default: ''
        },
        center: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isInPreview: false, //  如果是点击预览
            page: 1,
            size: 10,
            loading: false, // 当前是否正在加载数据
            total: -1, //  当前的加载状态控制  -1:当前未加载开始加载数据  0:没有数据  >0&&currentList.length<total:当前有数据   =currentList.length:数据已经加载完毕
            momentList: [], // 动态列表
            dict_tag: []
        };
    },
    created() {
        this.loadData('init');
    },
    mounted() {

    },
    methods: {
        async loadTag() {
            const req1 = {
                $url: 'public/zz/dict',
                tar: ['article']
            }
            await this.zz.req(req1).then(({ article }) => {
                this.dict_tag = article
            })
        },
        /**
         * type: add or init
         */
        async loadData(type, stopPullDown) {
            if (this.dict_tag.length === 0) {
                await this.loadTag()
            }
            if (type === 'init') {  // init
                this.momentList = [];
                this.page = 1;
                this.total = -1;
            }
            if (this.loading || this.momentList.length === this.total) {  // 防止重复加载
                return;
            }
            this.loading = true;
            // this.userInfo._id
            const requestParams = {
                $url: 'public/moment/page',
                userId: this.userId,
                page: this.page,
                size: this.size
            };
            this.zz.req(requestParams).then(({ pagination, list }) => {
                // console.log("动态列表===",list)
                this.total = pagination.total; // 赋值total
                list = list.map((item) => {
                    item.dateInfo = this.zz.time2Date(item.createTime, 'obj');
                    if (item.type && item.type.length > 0) {
                        item.tagList = item.type.map(tag => {
                            const newTag = this.dict_tag.find(dict => {
                                return tag === dict.value
                            })
                            return newTag
                        })
                    }
                    return item;
                });
                this.page++;
                this.momentList = this.momentList.concat(list); // 拼接列表
                this.loading = false;
                if (stopPullDown) {
                    this.zz.toast("刷新成功", 1000)
                    uni.stopPullDownRefresh();
                }
            });
        },
        // 动态详情
        openDetail(item) {
            if (!this.isInPreview) {
                this.zz.href('/pages/my/social/pushDetails', { _id: item._id });
            }
        },
        // 控制图片点击的时候不进入详情
        isPreview() {
            this.isInPreview = true
            setTimeout(() => {
                this.isInPreview = false
            }, 500)
        },
    }
};
</script>

<style lang="scss" scoped></style>
