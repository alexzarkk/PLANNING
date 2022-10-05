<template>
    <view>
        <cu-custom bg-color="bg-ztsblue">
			<block slot="left">
				<button class="cu-btn xs line-white round shadow margin-left-sm" @tap="onCollect">
					<text class="zzIcon-dist margin-right-xs"></text>
					<text class="text-sm">去记录</text>
				</button>
			</block>
            <block slot="content">
				<!-- <view class="search-form round">
				    <text class="cuIcon-search" />
				    <input type="text" placeholder="搜索地名/路线 …" :disabled="true" confirm-type="search" @click="openSearch" v-model="searchKey" />
				</view> -->
				
				行程广场
			</block>     
			   <block slot="left">
			   	<button class="cu-btn xs line-white round shadow margin-right-sm" @tap="mapView">
			   		<text class="zzIcon-maplocation margin-right-xs"></text>
			   		<text class="text-sm">地图</text>
			   	</button>
			   </block>
		</cu-custom>
        <view>
			<zz-line-track v-for="(item,index) in list[0]" :key="index" :details="item" />
			<zz-page-status :loading="loading" :length="list[0].length" :total="page.total" />
        </view>
    </view>
</template>

<script>
import sync from '@/comm/sync'
export default {
    data() {
        return {
            loading: false,
            page: {},
			list:[[]]
        };
    },
    onLoad() {
        console.log('onLoad.planningApp')
		this.loadData('init')
    },
    mounted() { },
    // onShow() { sync.go() },
    methods: {
        loadData(m) {
            if (m == 'init') {
				this.list[0] = []
                this.page = {
                    page: 1,
                    size: 10,
                    total: -1,
                    type: null,
					pub: 1,
                    name: ''
                }
            }
            if (this.loading || this.page.total === this.list[0].length) {
                return;
            }
            this.loading = true
            this.zz.req({ $url: '/public/rec/page', ...this.page }).then(e => {
				this.loading = false
				// console.log(e);
				this.page.total = e.pagination.total
                this.list[0] = this.list[0].concat(e.list)
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
        openSearch() {
            this.cur = index
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
