<template>

    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">删除账户</block>
        </cu-custom>
        <view class="container padding">
            <view class="padding-tb-sm text-bold">
                很遗憾看见您离开:(
            </view>
            <view>
                通过删除您的"{{userInfo.nickName}}"账户,我们将从系统删除您的所有个人数据和信息。
            </view>
            <view class="padding-tb-sm text-bold">
                删除后将发生以下情况，
                这是永久的，无法撤销：
            </view>
            <view class="action">
                <text class="cuIcon-title text-green margin-right-xs"></text>
                <text>您的个人信息将不再可用。你的环浙步道名称、电子邮件、密码、位置和账户中可能存在的所有其他个人信息将被删除。此操作会立即发生，因此，删除账户后您将无法再次登录。</text>
            </view>
            <view class="action">
                <text class="cuIcon-title text-green margin-right-xs"></text>
                <text>将删除上传到您的账户的所有内容（路线、照片、视频、路径点、描述等）。还会删除您的统计数据和用户排名。这可能需要几分钟完成。</text>
            </view>
            <view class="action">
                <text class="cuIcon-title text-green margin-right-xs"></text>
                <text>
                    您的账户上传的足迹、照片、视频、兴趣点、描述和内容将被删除。统计信息和用户排名也将被删除。
                    您的账户将从所有列表（包括关注者列表）中删除。
                </text>
            </view>
            <view class="padding-tb-sm text-bold">
                在删除账户之前，您应该了解：
            </view>
            <view class="action">
                <text class="cuIcon-title text-green margin-right-xs"></text>
                <text>您无需删除账户即可更改用户名和电子邮件地址，您可以随时在个人设置中进行更改。</text>
            </view>
            <view style="height:100rpx;"></view>
            <view class="text-xl text-center text-red" @click="isDeleteShow = true"><text class="margin-right-xs">删除账户</text>{{userInfo.nickName}}</view>
            <zz-cu-modal
                :disable="valid!=='删除账户'" :isLoading="loading" :show="isDeleteShow" title="提示" @confirm="confirmDelete"
                @cancel="isDeleteShow = false"
            >
                <view class="padding bg-white">
                    <view class="text-bold" style="color:#000000;">
                        请输入<text>"删除账户"</text>以继续删除您的账户
                    </view>
                    <tui-input v-model="valid" :focus="isDeleteShow"></tui-input>
                </view>
            </zz-cu-modal>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            isDeleteShow: false,
            valid: '',
            userInfo:null
        };
    },
    onLoad() {
        this.loadData();
        this.userInfo = this.zz.getAcc()
        console.log('个人信息',this.userInfo);
    },
    methods: {
        async loadData() { },
        async confirmDelete() {
            // console.log('确认删除');
            if (this.loading) {
                return;
            }
            this.loading = true
            await this.zz.req({ $url: '/admin/comm/logout', killme: true }).then(e => {
                this.zz.logOut()
                this.loading = false
                this.isDeleteShow = false
                this.zz.toast("账户已删除,正在为您跳转")
                setTimeout(() => {
                    this.zz.href('/pages/index/index')
                }, 1000)
            })
        }
    }
};
</script>

<style>
page {
    background-color: #ffffff;
}
body {
    background-color: #ffffff;
}
</style>

<style lang="scss" scoped>
</style>
