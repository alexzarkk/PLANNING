<template>
	<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bg-color="bg-ztsblue" :is-back="true">
            <block slot="content">
                我的轨迹
            </block>
        </cu-custom>
		<zz-search :areaPick="false" @search="search"></zz-search>
        <view class="container">
            <view class="padding bg-white">
                <tui-segmented-control :values="titleList" active-color="#8fc42f" @click="modeChange"></tui-segmented-control>
            </view>
            <view v-show="cur === 0">
                <zz-line-track v-for="(item,index) in list[0]" :key="index" :details="item"></zz-line-track>
                <zz-page-status :loading="loading" :length="list[0].length" :total="page.total"></zz-page-status>
            </view>
            <view v-show="cur === 1">
                <zz-line-track v-for="(item,index) in list[1]" :key="index" :details="item"></zz-line-track>
                <zz-page-status :length="list[1].length" :total="list[1].length"></zz-page-status>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            cur: 0, // 1 本地 0 云端
            loading: false,
            titleList: ['云端', '本地'],
            list: [[], []],  // 
            page: { total:-1, size:10, ui:1 }
        };
    },
    onLoad() {
        // this.loadData('init')
    },
    mounted() { },
    methods: {
        loadData(type) {
            const cur = this.cur
			if(cur==0) {
				if (type === 'init') {
					this.list[0] = []
					Object.assign(this.page, { page: 1, total: -1 })
				}
				if (this.loading || this.page.total === this.list[0].length) { return }
				this.loading = true
				this.zz.req({ $url: '/user/rec/page', ...this.page }).then(e => {
					this.loading = false
					this.page.total = e.pagination.total
				    this.list[0] = this.list[0].concat(e.list)
				    this.page.page++
				})
			}
        },
        modeChange({ index }) {
            this.cur = index
			if(index==1) {this.list[1] = uni.getStorageSync('nav_local_rec') || []}
        },
		search(e) {
			if(e.keyWord != this.page.keyWord) {
				this.page.keyWord = e.keyWord
				this.loadData('init')
			}
		}
    },
    onReachBottom() {
        this.loadData('add')
    }
};
</script>

<style lang="scss" scoped>
</style>
