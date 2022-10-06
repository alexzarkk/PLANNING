<template>
    <!-- 信息列表 -->
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true"><block slot="content">我的消息</block></cu-custom>
        <view class="container">
            <view class="cu-list menu-avatar">
                <!-- 系统信息 -->
                <tui-no-data :imgWidth="300" :imgHeight="300" :fixed="true" :imgUrl="bd.imgs.nodata">
                <!-- <view class="cu-item">
                    <view class="cu-avatar round lg" style="background-image: url(https://s1.ax1x.com/2022/07/05/jtxg2t.png)">
                        <view class="cu-tag badge"></view>
                    </view>
                    <view class="content">
                        <view class="text-grey">系统信息</view>
                        <view class="text-gray text-sm flex">
                            <view class="text-cut">
                                <text class="cuIcon-infofill text-red margin-right-xs"></text>
                                <text>系统信息</text>
                            </view>
                        </view>
                    </view>
                    <view class="action">
                        <view class="text-grey text-xs">2月13日</view>
                        <view class="cu-tag round bg-grey sm">5</view>
                    </view>
                </view> -->
                <!-- 队伍信息 -->
                <!-- <view class="cu-item">
                    <view class="cu-avatar round lg" style="background-image: url(https://s1.ax1x.com/2022/07/05/jtzSIJ.png)">
                        <view class="cu-tag badge">99+</view>
                    </view>
                    <view class="content">
                        <view class="text-grey">
                            <view class="text-cut">Sweet</view>
                            <view class="cu-tag round bg-orange sm">队伍</view>
                        </view>
                        <view class="text-gray text-sm flex">
                            <view class="text-cut">有空了一起出去玩</view>
                        </view>
                    </view>
                    <view class="action">
                        <view class="text-grey text-xs">22:20</view>
                        <view class="cuIcon-notice_forbid_fill text-gray"></view>
                    </view>
                </view> -->
                <!-- 私人信息 -->
                <!-- <view class="cu-item" @click="openChat">
                    <view class="cu-avatar lg round" style="background-image: url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);">
                        <view class="cu-tag badge"></view>
                    </view>
                    <view class="content">
                        <view class="text-pink"><view class="text-cut">路人甲</view></view>
                        <view class="text-gray text-sm flex"><view class="text-cut">好的，下次就过来玩</view></view>
                    </view>
                    <view class="action">
                        <view class="text-grey text-xs">14:20</view>
                        <view class="cu-tag round bg-red sm">1</view>
                    </view>
                </view> -->
                <!-- <view class="cu-item grayscale">
                    <view class="cu-avatar radius lg" style="background-image: url(https://ossweb-img.qq.com/images/lol/web201310/skin/big81007.jpg)"></view>
                    <view class="content">
                        <view>
                            <view class="text-cut">伊泽瑞尔</view>
                            <view class="cu-tag round bg-orange sm">断开连接...</view>
                        </view>
                        <view class="text-gray text-sm flex"><view class="text-cut">等我回来一个打十个</view></view>
                    </view>
                    <view class="action">
                        <view class="text-grey text-xs">22:20</view>
                        <view class="cu-tag round bg-red sm">5</view>
                    </view>
                </view> -->
                <!-- <view class="cu-item cur">
                    <view class="cu-avatar radius lg" style="background-image: url(https://ossweb-img.qq.com/images/lol/web201310/skin/big81020.jpg)">
                        <view class="cu-tag badge"></view>
                    </view>
                    <view class="content">
                        <view>
                            <view class="text-cut">瓦罗兰大陆-睡衣守护者-新手保护营</view>
                            <view class="cu-tag round bg-orange sm">6人</view>
                        </view>
                        <view class="text-gray text-sm flex">
                            <view class="text-cut">
                                伊泽瑞尔：
                                <text class="cuIcon-locationfill text-orange margin-right-xs"></text>
                                传送中...
                            </view>
                        </view>
                    </view>
                    <view class="action">
                        <view class="text-grey text-xs">22:20</view>
                        <view class="cuIcon-notice_forbid_fill text-gray"></view>
                    </view>
                </view> -->
                </tui-no-data>
            </view>
            <!-- 其他信息 -->
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
        };
    },
    onLoad() {
        this.loadData();
    },
    methods: {
        async loadData() {},
        openChat() {
            this.zz.href('/pages/my/social/message/chat');
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    background-color: #f1f1f1;
}
</style>
