<template>
<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bg-color="bg-ztsblue" :is-back="true">
            <block slot="backText" />
            <block slot="content">
                奉化健身步道
            </block>
        </cu-custom>
        <!--搜索框-->
        <view id="searchBar" class="cu-bar bg-ztsblue search fixed" :style="[{top:customBar + 'px'}]">
            <view class="search-form round">
                <text class="cuIcon-search" /> 
                <input v-model="searchKey" type="text" placeholder="搜索地名/路线 …" confirm-type="search"></input>
            </view>
            <view class="action text-white" @click="doSearch">
                <text class="cuIcon-search" />
                <view class="margin-left-xs">
                    搜索
                </view>
            </view>
        </view>
        <view class="cu-bar" />
        <block v-if="list.length>0">
            <zz-trail-list :data-list="list" @detail="detail" @userEvent="userEvent" />
        </block>
        <block v-else>
            <view class="cu-tabbar-height" />
            <tui-nomore :text="'无匹配数据...'" />
        </block>
        <tui-scroll-top ref="top" :scroll-top="scrolled" />
    </view>
</template>
<script>
export default {
    data() {
        return {
            bd: this.bd,
            td: {},
            list: [],
            customBar: this.CustomBar,
            searchKey: '',
            scrolled: 0,
        }
    },
    onLoad(qr) {
        this.td = uni.getStorageSync('trailData')
        let k = decodeURI(qr.key)
        if (k != 1) this.searchKey = k
        this.doSearch(k)
    },
    methods: {
        doSearch: function (e) {
            let key = e ? e : this.searchKey
            if (key == ''){
                this.list = this.td
                return;
            }
            try { this.$refs.top.goTop() } catch (e) { }
            this.list = []
            let td = []
            if (key == 1) {
                this.td.trailData.sort(this.zz.compare('ip', true, true))
                for (var i = 0; i < this.td.trailData.length && i < 20; i++) {
                    td.push(this.td.trailData[i])
                }
            } else {
                for (let s of this.td.trailData) {
                    if (s.name.includes(this.searchKey) || s.path.includes(this.searchKey))
                        td.push(s)
                }
            }
            td.sort(this.zz.compare('ip', true, true))
            this.list = td
            console.log(td)
        },
        detail(id) {
            this.zz.href('/pages/planning/detail?id=' + id)
        },
        userEvent(e) {
            // let o = this.trailData.regionData[this.currentTab].list[e.idx]
            // this.zz.userEvent(e.t, e.tt, o)
        },
    },
    onReachBottom: function () {
    },
    onPageScroll: function (e) {
        this.scrolled = e.scrollTop
    }
}
</script>

<style>
</style>
