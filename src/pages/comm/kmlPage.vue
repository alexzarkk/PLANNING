<template>
    <view>
        <cu-custom bg-color="bg-ztsblue" :isBack="true">
            <block slot="content">轨迹</block>
		</cu-custom>
		 <view class="cu-bar bg-ztsblue search fixed align-center" style="height:100rpx;" id="searchBar">
		 	<view class="fixed align-center text-white padding-xs" @click="show = true">
		 		<text class="text-sm text-grey">范围</text>
		 		<text class="margin-left-xs">{{dict.deps[deptId[0]].name}}</text>
		 		<text class="margin-left-xxs cuIcon-triangledownfill"></text>
		 	</view>
		 	<view class="search-form round">
		 		<text class="cuIcon-search" />
		 		<input type="text" placeholder="搜索路线 …" maxlength="20" v-model="keyWord" confirm-type="search" @blur="search" />
		 	</view>
		 </view>
		<view class="cu-tabbar-height"></view>
        <view>
			<zz-line-track v-for="(item,index) in list[0]" :key="index" :details="item" />
			<zz-page-status :loading="loading" :length="list[0].length" :total="page.total" />
        </view>
		
		<tui-picker :show="show" :pickerData="area" @hide="hide" @change="change"/>
    </view>
</template>

<script>
import sync from '@/comm/sync'
export default {
    data() {
        return {
			dict: uni.getStorageSync('sys_dict'),
			customBar: this.CustomBar,
            loading: false,
			show: false,
			area: [{text: "浙江省", value: "330000"}],
			deptId: ['330000'],
			keyWord: '',
            page: { ui:1, ue:1, plain: 1, chart: 1, filter:1 },
			
			list:[[]]
        };
    },
    onLoad() {
		let { deptId } = this.zz.getDept(),
			d = this.dict.deps,
			cur = d[deptId],
			pd = d[d.pid]
		
		for (let k in d) {
			if(d[k].pid == 330000){
				this.area.push({text: d[k].name, value: d[k].id+''})
			}
		}
		this.area.push({text:cur.name, value:deptId})
		
		this.deptId = [deptId]
		this.loadData('init')
    },
    mounted() { },
    methods: {
        loadData(m) {
            if (m == 'init') {
				this.list[0] = []
				Object.assign(this.page, {
					page: 1,
					size: 6,
					total: -1,
					deptId: this.deptId,
					keyWord: this.keyWord
				})
            }
            if (this.loading || this.page.total === this.list[0].length) {
                return;
            }
            this.loading = true
            this.zz.req({ $url: '/public/kml/page', ...this.page }).then(e => {
				this.loading = false
				this.page.total = e.pagination.total
                this.page.page++
				this.list[0] = this.list[0].concat(e.list)
            })
        },
		hide(){ this.show = false },
		change(e){
			this.deptId = [e.value]
			if(e.value!='330000') {
				let d = this.dict.deps
				for (let k in d) {
					if(d[k].pid == e.value){
						this.deptId.push(k+'')
					}
				}
			}
			this.loadData('init')
		},
		search(){
			if(this.keyWord != this.page.keyWord) {
				this.page.keyWord = this.keyWord
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
