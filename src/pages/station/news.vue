<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-06-24 08:59:22
 * @FilePath: \sport-planing\src\pages\station\news.vue
 * @Description: 
 * 资讯  swiper + scroll-view
 * 
-->
<template>
    <page-meta root-font-size="10px"></page-meta>
    <view class="container">
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">资讯</block>
        </cu-custom>
        <news-home ref="news" :tab="tab" :scrollTop="scrollTop" :showMore="false"></news-home>
    </view>
</template>

<script>
import newsHome from '@/components/news/news-home.vue'
export default {
    components: {
        newsHome
    },
    data() {
        return {
            scrollTop: 0,
            customBar: this.CustomBar,
            statusBar: this.StatusBar,
            tab: 0
        };
    },
    onLoad({ v }) {
        if (v) {
            const { tab } = this.zz.getParam(v)  // 查看更多点进来跳转到指定tab
            this.tab = tab
        }

    },
    onReady() {
        // console.log(this.$refs.news)
        // this.$refs.news.loadData()
    },
    methods: {
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    },
    onReachBottom() {
        this.$refs.news.loadData('add')
    }
};
</script>

<style lang="scss" scoped>
.container {
    height: 100vh;
}
.news-sticky-box {
    position: sticky;
    z-index: 10;
}

.news-swiper {
    height: calc(100vh - 180rpx);
}
</style>
`
