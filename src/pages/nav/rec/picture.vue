<template>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">我的相册</block>
        </cu-custom>
        <view class="container">
            <view v-for="(item,index) in pageList" :key="index">
                <view class="cu-bar bg-white solid-bottom solid-top">
                    <view class="action sub-title">
                        <text class="text-xl text-bold text-green">{{ item.name }}</text>
                        <text class="bg-green" style="width: 2rem"></text>
                    </view>
                    <view class="padding-right text-blue">{{ item.imgList.length }}张</view>
                </view>
                <zz-upload-image :readOnly="true" :imgs="item.imgList"></zz-upload-image>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            // titleList: ['本地', '云端']
            loading: false,  // 数据加载状态
            total: -1,  // 服务器 分页 total
            pageList: [], // 分页列表
            pageNum: 1,  // 页码
            pageSize: 5,  // 数量
            isCard: true,
            dict: uni.getStorageSync('sys_dict'),
        };
    },
    onLoad() {
        this.loadData();
    },
    methods: {
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
                $url: '/user/rec/pagePoint',
                page: this.pageNum,
                size: this.pageSize
            }
            this.zz.req(req1).then(({ pagination, list }) => {
                this.total = pagination.total; // 赋值total
                this.pageNum++;
                for (const item of list) {
                    const imgList = []
                    imgList = imgList.concat(item.imgs)
                    for (const point of item.point) {
                        imgList = imgList.concat(point.imgs)
                    }
                    item.imgList = imgList
                    console.log("图片列表", item.imgList)
                }
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
</style>
