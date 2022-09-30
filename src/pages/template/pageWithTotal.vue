<template>
    <!-- 
    分页模板页面
    控制方式:total
 -->
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">导航栏名字</block>
        </cu-custom>
        <view class="container"></view>
        <zz-page-status :loading="loading" :length="pageList.length" :total="total"></zz-page-status>
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
            pageSize: 10,  // 数量

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
            this.loading = true;
            const req1 = {
                $url: 'page',
                page: this.pageNum,
                size: this.pageSize
            }
            this.zz.req(req1).then(({ pagination, list }) => {
                this.total = pagination.total; // 赋值total
                this.pageNum++;
                this.pageList = this.pageList.concat(list)
                this.loading = false;
                if (stopPullDown) {
                    this.zz.toast("刷新成功", 1000)
                    uni.stopPullDownRefresh();
                }
            });
        },
    }
};
</script>

<style lang="scss" scoped>
.container {
    background-color: #f1f1f1;
}
</style>
