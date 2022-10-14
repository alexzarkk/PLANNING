<template>
    <!-- 身体信息   身高体重 
        https://ext.dcloud.net.cn/plugin?id=1322
    -->
    <page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">身体数据</block>
        </cu-custom>
        <view class="container">
            <!-- <view>
                <text>身高：</text>
            </view> -->
            <!-- <view>体重：</view> -->
            <view class="cu-bar bg-white margin-top response">
                <view class="action response">
                    <text class="cuIcon-title text-green"></text>
                    <view class="flex justify-between align-center response">
                        <text>身高</text>
                        <text>{{ height }}cm</text>
                    </view>
                </view>
            </view>
            <view class="bg-white">
                <tui-scale-horizontal :value="defaultHeight" :interval="10" :min="0" :max="250" @change="heightChange"></tui-scale-horizontal>
            </view>

            <view class="cu-bar bg-white margin-top response">
                <view class="action response">
                    <text class="cuIcon-title text-green"></text>
                    <view class="flex justify-between align-center response">
                        <text>体重</text>
                        <text>{{ weight }}kg</text>
                    </view>
                </view>
            </view>
            <view class="bg-white">
                <tui-scale-horizontal :value="defaultWeight" :interval="10" :min="0" :max="200" @change="widthChange"></tui-scale-horizontal>
            </view>
        </view>
        <view class="padding flex flex-direction justify-between">
            <button class="cu-btn bg-ztsgreen lg" @click="confirm">
                <text v-show="isLoading" class="cuIcon-loading2 cuIconfont-spin"></text>提交
            </button>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            isLoading: false,
            userInfo: null,
            defaultHeight: 170,
            defaultWeight: 50,
            height: 170,
            weight: 50,

        };
    },
    onLoad() {
        this.loadData();
        this.userInfo = this.zz.getAcc();
        if (this.userInfo.info && this.userInfo.info.height) {
            this.defaultHeight = this.userInfo.info.height
            this.defaultWeight = this.userInfo.info.weight
        }
    },
    methods: {
        async loadData() { },
        chooseChange() { },
        heightChange(event) {
            this.height = Math.round(event.value);
        },
        widthChange(event) {
            this.weight = Math.round(event.value);
        },
        async confirm() {
            this.isLoading = true
            await this.zz.req({
                $url: 'user/user/update',
                _id: this.userInfo._id,
                info: {
                    height: this.height,
                    weight: this.weight
                }
            }).then((res) => {
                if (!this.userInfo.info) {
                    this.userInfo.info = {};
                }
                this.userInfo.info.height = this.height;
                this.userInfo.info.weight = this.weight;
                this.zz.setAcc(this.userInfo)
                this.zz.toast("更新成功",500)
                setTimeout(() => {
                    uni.navigateBack()
                }, 500)
            });
            this.isLoading = false
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    background-color: #f1f1f1;
}
</style>
