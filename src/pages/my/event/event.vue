<template>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="backText"></block>
            <block slot="content">赛事活动</block>
        </cu-custom>
        <view class="padding bg-white">
            <tui-segmented-control :values="titleList" activeColor="#8fc42f" @click="modeChange"></tui-segmented-control>
        </view>
        <view v-if="curTab===0">
            <!-- <activities></activities> -->
        </view>
        <view v-if="curTab===1">
            <!-- <match></match> -->
        </view>
        <zz-page-status :loading="loading" :length="tabList[curTab].list.length" :total="tabList[curTab].total"></zz-page-status>
    </view>
</template>

<script>
import activities from './components/activities.vue';
import match from './components/match.vue';
export default {
    components: {
        // activities,
        // match
    },
    data() {
        return {
            data: [],
            titleList: ['活动', '赛事'],
            curTab: 0, // 当前的tab
            loading: false,  // 当前的页面加载状态
            tabList: [  // tab下面的list
                {
                    pageNum: 1,
                    pageSize: 10,
                    total: -1,
                    list: []
                },
                {
                    pageNum: 1,
                    pageSize: 10,
                    total: -1,
                    list: []
                }
            ],
        };
    },
    onLoad() {
        this.loadData('init')
    },
    methods: {
        loadData(mode) {
            if (mode === 'init') {
                this.tabList[curTab] = {
                    pageNum: 1,
                    pageSize: 2,
                    total: -1,
                    list: []
                };
            }
            let requestParams = null,
                curTab = this.curTab,
                curList = this.tabList[curTab];
            if (curList.total === 0 || this.loading || curList.list.length === curList.total) {  // 当前页面数据为空  || 正在加载则不继续加载  || 当前数据已经加载完毕
                return;
            }
            this.loading = true;
            if (curTab === 0) {
                
                // 评论列表
            } else if (curTab === 1) {
                requestParams = {
                    $url: 'user/blog/page',
                    page: curList.pageNum,
                    size: curList.pageSize,
                    my: true
                };
            }
            if (requestParams) {
                // this.zz.req(requestParams).then(({ pagination, list }) => {
                //     curList.total = pagination.total; // 赋值total
                //     curList.pageNum++;
                //     curList.list = curList.list.concat(list); // 拼接列表
                // }).catch((err) => {
                //     console.error('列表加载失败=========', err);
                // }).finally(() => {
                    this.loading = false;
                // });
            } else {
                curList.list = [];
                curList.total = 0;
                this.loading = false;
            }
            this.loading = false;
            this.tabList[curTab].total = 0
            setTimeout(() => {
                // console.log('列表===============', JSON.parse(JSON.stringify(this.tabList)));
            }, 1000);
        },
        modeChange(event) {
            this.curTab = event.index;
            this.loadData('init');
        }
    }
};
</script>

<style lang="scss">
</style>
