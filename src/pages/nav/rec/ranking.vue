<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-14 08:06:15
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-26 08:54:08
 * @FilePath: \sport-planing\src\pages\event\ranking.vue
 * @Description: 
 * 
 * 
-->
<template>

    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="backText"></block>
            <block slot="content">排行榜</block>
        </cu-custom>
        <scroll-view scroll-x class="bg-white nav text-center fixed" :style="[{ top: CustomBar + 'px' }]">
            <view v-for="(item, index) in tabNav" :key="index" class="cu-item" :class="index == TabCur ? 'text-orange text-bold cur' : ''" :data-id="index" @tap="tabSelect">
                <text class="margin-right-xs" :class="'cuIcon-' + item[1]"></text>
                <text>{{ item[0] }}</text>
            </view>
        </scroll-view>
        <view class="cu-bar"></view>
        <view v-show="TabCur===0">
            <view v-if="userInfo">
                <view class="cu-bar bg-white">
                    <view class="action">
                        <text class="cuIcon-titles text-green"></text>
                        <text class="text-xl text-bold">我的排行榜</text>
                    </view>
                </view>
                <tui-table>
                    <tui-tr>
                        <tui-td :span="10" padding="20rpx 8rpx" border-width="0">
                            <view class="flex align-center padding-left">
                                <view class="cu-avatar round margin-right" :style="{ backgroundImage: 'url('+userInfo.headImg+')' }"></view>
                                <view>{{userInfo.nickName}}</view>
                            </view>
                        </tui-td>
                        <tui-td v-if="myRank" :span="7" textAlign="center" alignItems="center" padding="20rpx 8rpx" border-width="0">{{myRank.scan}}</tui-td>
                        <tui-td v-if="myRank" :span="7" textAlign="center" alignItems="center" padding="20rpx 8rpx" border-width="0">{{myRank.rank}}</tui-td>
                    </tui-tr>
                </tui-table>
            </view>
            <view class="cu-bar bg-white">
                <view class="action response" style="justify-content: space-between">
                    <view>
                        <text class="cuIcon-titles text-green"></text>
                        <text class="text-xl text-bold">当前排行榜</text>
                    </view>
                    <!-- <view style="margin-right: 100rpx">
                        当年
                        <uni-icons type="bottom" size="16"></uni-icons>
                    </view> -->
                </view>
            </view>
            <tui-table border-right>
                <tui-tr>
                    <tui-td v-for="(item, index) in header" :key="index" textAlign="center" alignItems="center" padding="20rpx 8rpx" border-width="0" bold :span="index < 1 ? 10 : 7">
                        {{ item.title }}
                    </tui-td>
                </tui-tr>
                <tui-tr v-for="(item, index) in listData" :key="index" :backgroundColor="index % 2 != 0 ? '#FAFAFA' : '#fff'">
                    <tui-td v-for="(obj, idx) in header" :key="idx" padding="20rpx 8rpx" border-width="0" :alignItems="idx < 1 ? '' : 'center'" backgroundColor="transparent" :span="idx < 1 ? 10 : 7">
                        <view v-if="obj.key === 'rank'">
                            <view v-if="index === 0">
                                <image class="rank-image" src="/static/rank/1.png" mode=""></image>
                            </view>
                            <view v-if="index === 1">
                                <image class="rank-image" src="/static/rank/2.png" mode=""></image>
                            </view>
                            <view v-if="index === 2">
                                <image class="rank-image" src="/static/rank/3.png" mode=""></image>
                            </view>
                            <!-- <view v-if="index > 3">{{ index }}</view> -->
                            <view v-if="index >= 3">{{ index + 1 }}</view>
                        </view>
                        <view v-else>
                            <view v-if="obj.key === 'name'" class="flex align-center padding-left">
                                <!-- <view class="cu-avatar round margin-right" :style="{ backgroundImage: 'url(/static/avatar/avatar' + item.id + '.jpg)' }"></view>
                                <view>{{ item[obj.key] }}</view> -->
                                <view class="cu-avatar round margin-right" :style="{ backgroundImage: 'url('+item.userInfo.headImg+')' }"></view>
                                <view>{{ item.userInfo.nickName }}</view>
                            </view>
                            <view v-if="obj.key === 'num'">{{ item.scan || 0  }}</view>
                        </view>
                        <!-- <view v-else>
                            <view v-if="obj.key === 'name'" class="flex align-center padding-left">
                                <view class="cu-avatar round margin-right" :style="{ backgroundImage: 'url(/static/avatar/avatar' + item.id + '.jpg)' }"></view>
                                <view>{{ item[obj.key] }}</view>
                            </view>
                            <view v-else>{{ item[obj.key] }}</view>
                        </view> -->
                    </tui-td>
                </tui-tr>
            </tui-table>
            <zz-page-status :loading="loading" :length="listData.length" :total="page.total" />
        </view>
        <view v-show="TabCur">
            <view class="cu-bar"></view>
            <tui-no-data :imgWidth="300" :imgHeight="300" :fixed="true" :imgUrl="bd.imgs.nodata" />
        </view>
        <!-- 选择器 -->
        <!-- <tui-picker :show="pickerShow" :pickerData="pickerData" @hide="pickerHide" @change="pickerChange"> -->
    </view>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            bd: this.bd,
            userInfo: null,
            myNums: 0, // 我的打卡 数量
            myRank: null,
            pickerData: [
                {
                    text: '年',
                    value: '1001'
                },
                {
                    text: '月',
                    value: '1002'
                },
                {
                    text: '日',
                    value: '1003'
                }
            ],
            pickerShow: false,
            TabCur: 0,
            tabNav: [
                ['足迹', 'rank'],
                ['完赛', 'upstage'],
                ['成就', 'activity']
            ],
            data: [
                ['总榜', 'rank'],
                ['年榜', 'upstage'],
                ['月榜', 'activity']
            ],
            header: [
                {
                    title: '用户',
                    key: 'name'
                },
                {
                    title: '打卡数量',
                    key: 'num'
                },
                {
                    title: '排名',
                    key: 'rank'
                }
            ],
            listData: [],
            page: {
                page: 1,
                size: 20,
                total: -1,
                order: 'scan',
                scan: true // scan 排序
            }
        };
    },
    onLoad() {
        this.userInfo = this.zz.getAcc()
        if (this.userInfo) {
            this.zz.req({ $url: '/user/scan/ranking' }).then(e => {
                console.log("获取到的排行榜====", e);
                this.myRank = e
                // this.myNums = e
            })
        }
        // console.log("用户信息===", this.userInfo)

        this.loadData('init')
    },
    methods: {
        async loadData(type) {
            if (type === 'init') {
                this.listData = []
                this.loading = false
            }
            if (this.loading || ((this.listData.length >= this.page.total) && this.page.total > 0)) {
                return;
            }
            this.loading = true
            try {
                let e = await this.zz.req({ $url: '/public/person/page', ...this.page })
                this.listData = this.listData.concat(e.list)
                e.pagination.page++
                Object.assign(this.page, e.pagination)
                // this.page.total = 100
            } catch (error) {
                console.log("排行榜加载失败===", error)
            }
            this.loading = false
        },
        pickerChange(event) {
            // console.log('选择的', event);
        },
        tabSelect(e) {
            this.TabCur = e.currentTarget.dataset.id;
            this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
        }
    },
    onReachBottom() {
        this.loadData('add')

    }
};
</script>

<style lang="scss" scoped>
.rank-image {
    width: 50rpx;
    height: 50rpx;
}
</style>
