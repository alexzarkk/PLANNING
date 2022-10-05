<template>
    <view>
        <cu-custom bg-color="bg-ztsblue">
			<block slot="left">
				<button class="cu-btn xs line-white round shadow margin-left-sm" @tap="onCollect">
					<text class="zzIcon-dist margin-right-xs"></text>
					<text class="text-sm">去记录</text>
				</button>
			</block>
            <block slot="content">行程广场</block>     
			<block slot="left">
			   	<button class="cu-btn xs line-white round shadow margin-right-sm" @tap="mapView">
			   		<text class="zzIcon-maplocation margin-right-xs"></text>
			   		<text class="text-sm">地图</text>
			   	</button>
			</block>
		</cu-custom>
        <zz-search :areaPick="false" @search="search"></zz-search>
		<zz-line-track v-for="(item,index) in list" :key="index" :details="item" />
		<zz-page-status :loading="loading" :length="list.length" :total="page.total" />
    </view>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            page: {total:-1, size: 10, pub:1, ui:1, ue:1, keyWord:null},
			list:[]
        };
    },
    onLoad() { },
    mounted() { },
    methods: {
        loadData(m) {
            if (m == 'init') {
				this.list = []
				Object.assign(this.page, { page: 1, total: -1 })
            }
            if (this.loading || this.page.total === this.list.length) {
                return
            }
            this.loading = true
            this.zz.req({ $url: '/public/rec/page', ...this.page }).then(e => {
				this.loading = false
				// console.log(e);
				this.page.total = e.pagination.total
                this.list = this.list.concat(e.list)
                this.page.page++
            })
        },
		onCollect() {
			// #ifdef APP-PLUS
			this.zz.href('/pages/nav/navApp',0,1,'slide-in-bottom')
			// #endif
		},
		mapView(){
			this.zz.href('/pages/planning/z')
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
    },
	async onPullDownRefresh() {
		uni.showLoading({ title:'正在刷新' })
		await this.loadData('init')
		uni.hideLoading()
		uni.stopPullDownRefresh()
	}
};
</script>

<style lang="scss" scoped>
</style>
