<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-14 08:06:15
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-06-14 10:59:02
 * @FilePath: \sport-planing\src\pages\event\tounament.vue
 * @Description: 
 * 
 * 
-->
<template>

    <view>
        <cu-custom bg-color="bg-ztsblue" :is-back="true">
            <block slot="backText" />
            <block slot="content">自助打卡赛</block>
        </cu-custom>
        <block v-if="loading"><tui-loadmore :fixed="true" :index="3" type="green" /></block>
        <block v-else>
            <block v-if="list.length">
                <!-- <zz-event :pic="'blue'" :kml="list" @click="onClick"></zz-event> -->

                <!-- style="margin-top: 55rpx" -->
                <!-- #ifdef H5 -->
                <view style="margin-top: 55rpx" class="padding"><zz-toun v-for="(item, index) in list" :key="index" :toun-data="item" /></view>
                <!-- #endif -->
                <!-- #ifndef H5 -->
                <view class="padding"><zz-toun v-for="(item, index) in list" :key="index" :toun-data="item" /></view>
                <!-- #endif -->
                <tui-nomore />
            </block>
            <block v-else><tui-no-data :fixed="true">无数据~</tui-no-data></block>
        </block>

        <view class="cu-modal" :class="show ? 'show' : ''">
            <view class="cu-dialog">
                <view class="cu-bar bg-white justify-end">
                    <view class="content">{{ cur.name }}</view>
                    <view class="action" @tap="hideModal"><text class="cuIcon-close text-red" /></view>
                </view>
                <zz-map v-if="cur._id" :line="cur.lines" :point="cur.points" :win-h="winH / 1.5" />
                <view class="cu-bar bg-white justify-between">
                    <view class="action"><button class="cu-btn bg-green" @tap="download">下载</button></view>
                    <!-- 	<view v-if="status === 10" class="action"><button class="cu-btn bg-blue"
							@tap="share(cur)">分享</button></view> -->
                    <block v-if="cur.userId == user._id && cur.status < 10">
                        <view class="action"><button class="cu-btn bg-blue">更新</button></view>
                    </block>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            user: {},
            CustomBar: this.CustomBar,
            title: '', // 当前页面的title
            show: false, // 模态框的显示
            cur: {}, // 当前模态框里的对象
            loading: true,
            TabCur: 0,
            list: []
        };
    },
    onLoad() {},
    onReady() {},
    async mounted() {
        let trailData = uni.getStorageSync('trailData'),
            dict = uni.getStorageSync('sys_dict')
        let tounList = uni.getStorageSync('tounamentList');
        // console.log('缓存数据', tounList.length);
        if (tounList && tounList.length > 0) {
            this.list = tounList;
            // console.log('使用了缓存数据');
        } else {
            for (let s of trailData.hotList) {
                let pms = await this.zz.req({ $url: 'public/kml/info', _id: s.kmlId ?? s.kml, plain: false, trans: 'gcj02' });
                s.kml.lines = pms.children.filter((e) => e.t1 == 1);
                s.kml.points = pms.children.filter((e) => e.t1 == 2);
            }
            this.list = trailData.hotList;
            uni.setStorageSync('tounamentList', this.list);
        }
        this.loading = false;
    },
    methods: {
        kmlInfo(idx) {},
        onClick(item) {
            this.cur = item;
            this.show = true;
            // console.log('onClick   ..............', item);
        },
        hideModal() {
            this.show = false;
        },
        download() {},
        detail: function () {
            this.zz.href('/pages/event/detail/detail');
        }
    }
};
</script>

<style></style>
