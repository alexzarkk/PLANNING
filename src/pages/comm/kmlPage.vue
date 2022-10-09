<template>
    <view>
        <cu-custom bg-color="bg-ztsblue" :isBack="true">
            <block slot="content">轨迹</block>
		</cu-custom>
		<zz-search @search="search"></zz-search>
		<zz-line-track v-for="(item,index) in list" :key="index" :details="item" />
		<zz-page-status :loading="loading" :length="list.length" :total="page.total" />
    </view>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            page: {total:-1, size: 6, ui:1, ue:1, plain:1, chart:1, filter:1},
			list: []
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
            this.zz.req({ $url: '/public/kml/page', ...this.page }).then(e => {
				this.loading = false
				this.page.total = e.pagination.total
                this.page.page++
				this.list = this.list.concat(e.list)
            })
        },
		search(e) {
			if(e.keyWord != this.page.keyWord || !this.zz.isSame(e.deptId, this.page.deptId)) {
				this.page.keyWord = e.keyWord
				this.page.deptId = e.deptId
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
