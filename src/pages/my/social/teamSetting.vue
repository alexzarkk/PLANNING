<!-- 队伍设置 -->
<template>
<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true"><block slot="content">队伍信息</block></cu-custom>
        <view class="container">
            <view class="cu-list menu-avatar">
                <view class="cu-item">
                    <view class="cu-avatar round lg" style="background-image: url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)"></view>
                    <!-- class="content" -->
                    <view class="content">
                        <view class="text-black">
                            <!-- padding-tb -->
                            <view class="flex flex-direction justify-betweeen align-start">
                                <text class="text-xl text-bold">sweet</text>
                                <!-- <text class="text-df">
                                    当前有
                                    <text class="text-red">0</text>
                                    人在线
                                </text> -->
                                <text class="text-df">队伍序号:341235</text>
                            </view>
                        </view>
                    </view>
                    <!-- <view class="action"> -->
                    <view class="flex align-center padding-right">
                        <view>二维码</view>
                        <text class="cuIcon-right"></text>
                        <!-- </view> -->
                    </view>
                </view>
            </view>
            <tui-list-view marginTop="20rpx" color="#777">
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class="text-xl">队长</text>
                        <text class="text-gray">InsHomePgup</text>
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class="text-xl">队员</text>
                        <text class="text-gray">1</text>
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class="text-xl">我在队伍中的昵称</text>
                        <text class="text-gray">InsHomePgup</text>
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class="text-xl">队长管理</text>
                        <!-- 设置管理员，允许队伍直播 -->
                        <!-- <text class="text-gray">InsHomePgup</text> -->
                    </view>
                </tui-list-cell>
            </tui-list-view>
            <tui-list-view marginTop="20rpx" color="#777">
                <tui-list-cell>
                    <view class="justify-between flex padding-right-xs align-center">
                        <text class="text-xl">加载到地图上</text>
                        <tui-switch :color="switchColor" checked></tui-switch>
                        <!-- <text class="text-gray">InsHomePgup</text> -->
                    </view>
                </tui-list-cell>
                <tui-list-cell>
                    <view class="justify-between flex padding-right-xs align-center">
                        <view class="flex flex-direction align-start">
                            <text class="text-xl">共享我的位置</text>
                            <text class="text-df text-gray">开启后可通过设备的gps分享我的位置</text>
                        </view>
                        <tui-switch color="#8fc42f" checked></tui-switch>
                        <!-- <text class="text-gray">InsHomePgup</text> -->
                    </view>
                </tui-list-cell>
            </tui-list-view>
            <tui-list-view marginTop="20rpx" color="#777">
                <tui-list-cell>
                    <view class="justify-between flex padding-right-xs align-center">
                        <text class="text-xl">消息免打扰</text>
                        <tui-switch :color="switchColor" checked></tui-switch>
                        <!-- <text class="text-gray">InsHomePgup</text> -->
                    </view>
                </tui-list-cell>
            </tui-list-view>
            <tui-list-view marginTop="20rpx" color="#777">
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class="text-xl">队员位置分享设置</text>
                        <text class="text-gray">5秒/20米</text>
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class="text-xl">队伍直播</text>
                    </view>
                </tui-list-cell>
            </tui-list-view>
            <tui-list-view marginTop="20rpx" color="#777">
                <tui-list-cell :unlined="true" arrow>
                    <view class="justify-between flex flex-direction padding-right align-start">
                        <text class="text-xl">队伍描述：</text>
                    </view>
                </tui-list-cell>
                <tui-list-cell>
                    <view class="text-df text-gray">一个热爱骑行与跑步的队伍~</view>
                </tui-list-cell>
            </tui-list-view>
        </view>


        <view class="flex flex-direction align-center padding">
            <button class="cu-btn round bg-green margin-tb lg response">发消息</button>
            <button class="cu-btn round bg-red response lg">解散并退出</button>
            <!-- <tui-button width=" 690rpx" margin="20rpx" type="green">发消息</tui-button> -->
            <!-- <tui-button width="690rpx" margin="20rpx" type="danger">解散并退出</tui-button> -->
        </view>

        		<!-- 确认框 -->
        <view class="cu-modal" :class="modalName == 'tips' ? 'show' : ''">
            <view class="cu-dialog">
                <view class="cu-bar bg-white justify-end">
                    <view class="content">提示</view>
                    <view class="action" @tap="modalName = ''"><text class="cuIcon-close text-red"></text></view>
                </view>
                <view class="padding-xl bg-white">本功能仅为演示，暂未启用。</view>
                <view class="cu-bar bg-white solid-top">
                    <view class="action margin-0 flex-sub  solid-left text-green" @tap="modalName = ''">确定</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            modalName:'',
            switchColor: '#8fc42f'
        };
    },
    methods: {
        async loadData() {}
    },
    onLoad() {
        this.loadData();
        this.modalName = 'tips'
    },
    onReady() {}
};
</script>

<style lang="scss" scoped>
page {
    background: #f1f1f1;
}

body {
    background: #f1f1f1;
}

.container {
    background-color: #f1f1f1;
}
</style>
