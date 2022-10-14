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
<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="backText"></block>
            <block slot="content">排行榜</block>
        </cu-custom>
        <scroll-view scroll-x class="bg-white nav text-center fixed" :style="[{ top: CustomBar + 'px' }]">
            <view
                v-for="(item, index) in tabNav" :key="index" class="cu-item" :class="index == TabCur ? 'text-orange text-bold cur' : ''" :data-id="index"
                @tap="tabSelect"
            >
                <text class="margin-right-xs" :class="'cuIcon-' + item[1]"></text>
                <text>{{ item[0] }}</text>
            </view>
        </scroll-view>
        <view class="cu-bar"></view>
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
                        <view class="cu-avatar round margin-right" :style="{ backgroundImage: 'url(/static/avatar/avatar22.jpg)' }"></view>
                        <view>晴天</view>
                    </view>
                </tui-td>
                <tui-td :span="7" textAlign="center" alignItems="center" padding="20rpx 8rpx" border-width="0">233</tui-td>
                <tui-td :span="7" textAlign="center" alignItems="center" padding="20rpx 8rpx" border-width="0">--</tui-td>
            </tui-tr>
        </tui-table>
        <view class="cu-bar bg-white">
            <view class="action response" style="justify-content: space-between">
                <view>
                    <text class="cuIcon-titles text-green"></text>
                    <text class="text-xl text-bold">当前排行榜</text>
                </view>
                <view style="margin-right: 100rpx">
                    当年
                    <uni-icons type="bottom" size="16"></uni-icons>
                </view>
            </view>
        </view>
        <tui-table border-right>
            <tui-tr>
                <tui-td
                    v-for="(item, index) in header" :key="index" textAlign="center" alignItems="center" padding="20rpx 8rpx"
                    border-width="0" bold :span="index < 1 ? 10 : 7"
                >
                    {{ item.title }}
                </tui-td>
                <!-- v-for="(item, index) in header" :key="index"  -->
                <!-- <tui-td textAlign="center" alignItems="center" padding="20rpx 8rpx" border-width="0" bold :span="12">用户</tui-td> -->
            </tui-tr>
            <tui-tr v-for="(item, index) in listData" :key="index" :backgroundColor="index % 2 != 0 ? '#FAFAFA' : '#fff'">
                <!-- <image class="avatar" src="/static/avatar/avatar1.jpg"></image> -->
                <!--  -->
                <tui-td
                    v-for="(obj, idx) in header"
                    :key="idx"
                    padding="20rpx 8rpx"
                    border-width="0"
                    :alignItems="idx < 1 ? '' : 'center'"
                    backgroundColor="transparent"
                    :span="idx < 1 ? 10 : 7"
                >
                    <view v-if="obj.key === 'rank'">
                        <view v-if="item[obj.key] === 1">
                            <image class="rank-image" src="/static/rank/1.png" mode=""></image>
                        </view>
                        <view v-if="item[obj.key] === 2">
                            <image class="rank-image" src="/static/rank/2.png" mode=""></image>
                        </view>
                        <view v-if="item[obj.key] === 3">
                            <image class="rank-image" src="/static/rank/3.png" mode=""></image>
                        </view>
                        <view v-if="item[obj.key] > 3">{{ item[obj.key] }}</view>
                    </view>
                    <view v-else>
                        <view v-if="obj.key === 'name'" class="flex align-center padding-left">
                            <view class="cu-avatar round margin-right" :style="{ backgroundImage: 'url(/static/avatar/avatar' + item.id + '.jpg)' }"></view>
                            <view>{{ item[obj.key] }}</view>
                            <!-- <view>{{ item.id }}</view> -->
                        </view>
                        <view v-else>{{ item[obj.key] }}</view>
                    </view>
                </tui-td>

                <!-- <tui-td padding="20rpx 8rpx" border-width="0" textAlign="center" alignItems="center" backgroundColor="transparent" :span="12">
                    <view>{{ listData[0].name }}</view>
                </tui-td> -->
            </tui-tr>
        </tui-table>
        <!-- 选择器 -->
        <!-- <tui-picker :show="pickerShow" :pickerData="pickerData" @hide="pickerHide" @change="pickerChange"> -->
    </view>
</template>

<script>
export default {
    data() {
        return {
            pickerData: [
                {
                    text: '中国',
                    value: '1001'
                },
                {
                    text: '美国',
                    value: '1002'
                },
                {
                    text: '俄罗斯',
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
            listData: [
                {
                    id: 1,
                    name: '张三',
                    num: '2332',
                    rank: 1
                },
                {
                    id: 2,
                    name: '李四',
                    num: '1932',
                    rank: 2
                },
                {
                    id: 3,
                    name: '王五',
                    num: '1704',
                    rank: 3
                },
                {
                    id: 4,
                    name: '赵六',
                    num: '1230',
                    rank: 4
                },
                {
                    id: 5,
                    name: '钱七',
                    num: '1115',
                    rank: 5
                },
                {
                    id: 6,
                    name: '昕月',
                    num: '1113',
                    rank: 6
                },
                {
                    id: 7,
                    name: '无妄景中',
                    num: '1078',
                    rank: 7
                },
                {
                    id: 8,
                    name: '弘厚',
                    num: '1056',
                    rank: 8
                },
                {
                    id: 9,
                    name: '通幽',
                    num: '1039',
                    rank: 9
                },
                {
                    id: 10,
                    name: '初芹',
                    num: '1032',
                    rank: 10
                },
                {
                    id: 11,
                    name: '一只平心呀',
                    num: '967',
                    rank: 11
                },
                {
                    id: 12,
                    name: '璃月又蓝',
                    num: '933',
                    rank: 12
                },
                {
                    id: 13,
                    name: '青衫不改',
                    num: '852',
                    rank: 13
                },
                {
                    id: 14,
                    name: '八十秒心动',
                    num: '815',
                    rank: 14
                },
                {
                    id: 15,
                    name: '可怜到底',
                    num: '799',
                    rank: 15
                },
                {
                    id: 16,
                    name: '不浪费时光',
                    num: '783',
                    rank: 16
                },
                {
                    id: 17,
                    name: '最初的梦想',
                    num: '731',
                    rank: 17
                },
                {
                    id: 18,
                    name: '打拼才会赢',
                    num: '694',
                    rank: 18
                },
                {
                    id: 19,
                    name: '无关痛痒',
                    num: '674',
                    rank: 19
                },
                {
                    id: 20,
                    name: '太阳花',
                    num: '578',
                    rank: 20
                }
            ]
        };
    },
    methods: {
        pickerChange(event) {
            // console.log('选择的', event);
        },
        tabSelect(e) {
            this.TabCur = e.currentTarget.dataset.id;
            this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
        }
    }
};
</script>

<style lang="scss" scoped>
.rank-image {
    width: 50rpx;
    height: 50rpx;
}
</style>
