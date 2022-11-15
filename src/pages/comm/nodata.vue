<template>
    <page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-dark" :isBack="true">
            <block slot="backText"></block>
            <block slot="content">{{title}}</block>
        </cu-custom>

        <view class="cu-bar"></view>
        <tui-no-data :imgWidth="300" :imgHeight="300" :fixed="true" :imgUrl="bd.imgs.nodata" />
    </view>
</template>

<script>
export default {
    data() {
        return {
            bd: this.bd,
            title: ''

        }
    },
    onLoad(option) {
        this.title = option.title || ''
        ZWJSBridge.setTitle({
            "title": this.title
        }).then(res => {
            console.log("修改当前页面的标题成功---", res)
        }).catch(err => {
            console.error("修改当前页面的标题失败---", err)
        })
    },
    methods: {

    }
}
</script>

<style>
page {
    background-color: #ffffff;
}
</style>
