<template>
    <view>
        <cu-custom bg-color="bg-ztsblue" :is-back="true">
            <block slot="content">
                我的轨迹
            </block>
        </cu-custom>
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

            <!-- <tui-no-data :fixed="true" :imgUrl="bd.imgs.nodata">暂无数据</tui-no-data> -->
        </view>
    </view>
</template>

<script>
import sync from '@/comm/sync'
export default {
    data() {
        return {
            cur: 0, // 1 本地 0 云端
            loading: false,
            titleList: ['云端', '本地'],
            list: [[], []],  // 
            page: {
                page: 1,
                size: 10,
                total: -1,
                type: null,
				ui: 1,
                name: ''
            }
        };
    },
    async onLoad({ v }) {
        console.log('onLoad');
        // if (v) {
        //     uni.showLoading({ mask: true })
        //     await sync.go()
        //     uni.hideLoading()

        //     let { kml } = this.zz.getParam(v)
        //     console.log(kml);
        // }
        this.loadData('init')
    },
    mounted() { },
    onShow() { 
		console.log(this.list);
		
	},
    methods: {
        loadData(type) {
            const cur = this.cur
            if (cur === 0 && type === 'init') {
                this.list[1] = uni.getStorageSync('nav_local_rec') || []
            }
            if (cur === 1 && type === 'add') {  // 本地列表无需分页加载
                return;
            }
            if (cur === 0 && type === 'init') {
                this.page = {
                    page: 1,
                    size: 10,
                    total: -1,
                    type: null,
                    name: ''
                }
				this.list[0] = []
            }
            if (this.loading || this.page.total === this.list[0].length) {
                return;
            }
            this.loading = true
            this.zz.req({ $url: '/user/rec/page', ...this.page }).then(e => {
				this.loading = false
				this.page.total = e.pagination.total
                this.list[0] = this.list[0].concat(e.list)
                this.page.page++
            })
        },
        modeChange({ index }) {
            this.cur = index
        }
    },
    onReachBottom() {
        this.loadData('add')
    }
};
</script>

<style lang="scss" scoped>
</style>
