<template>
    <!-- 带tab栏的分页实现 -->
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">页</block>
        </cu-custom>
        <view class="container">
            <view class="padding bg-white">
                <tui-segmented-control :values="titleList" activeColor="#8fc42f" @click="modeChange"></tui-segmented-control>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            curTab: 0, // 当前的tab
            titleList: ['我的帖子', '我的评论'],  // 分段器名称
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
            ]
        };
    },
    onLoad() {
        this.loadData();
    },
    methods: {
        async loadData() {
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
                    $url: 'page',
                    page: curList.pageNum,
                    size: curList.pageSize,
                    my: true
                };
            }
            if (requestParams) {
                this.zz.req(requestParams).then(({ pagination, list }) => {
                    curList.total = pagination.total; // 赋值total
                    curList.pageNum++;
                    curList.list = curList.list.concat(list); // 拼接列表
                }).catch((err) => {
                    console.error('列表加载失败=========', err);
                }).finally(() => {
                    this.loading = false;
                });
            } else {
                curList.list = [];
                curList.total = 0;
                this.loading = false;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    background-color: #f1f1f1;
}
</style>
