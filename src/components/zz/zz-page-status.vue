<template>
    <!-- 
    name: 分页组件
    desc:  分页加载的当前的页面状态
    date:
    update:
    author:
    <zz-page-status :loading="loading" :length="momentList.length" :total="total" msg="当前没有发布动态~" btn="去发布"></zz-page-status>
    
 -->
    <view class="padding-bottom-sm">
        <view v-if="total === 0" class="flex flex-direction align-center" style="padding-top:50rpx;">
            <tui-no-data  :imgWidth="300"  :imgHeight="300" :fixed="isCenter" :imgUrl="bd.imgs.nodata" :btnText="btnText" @click="openPage">
                <!-- <text class="tui-color__black">{{ msg }}</text> -->
            </tui-no-data>
            <!-- <tui-lazyload-img width="500rpx" height="500rpx" backgroundColor="#ffffff" :src="bd.imgs.nodata"></tui-lazyload-img> -->
        </view>
        <view v-if="needStatus">
            <tui-loadmore v-if="loading" :index="2"></tui-loadmore>
            <tui-divider v-if="length < total && total > 0 && !loading"><view class="tui-nomore-text">上滑或点击加载</view></tui-divider>
            <tui-nomore v-if="length === total && total > 0" text="没有更多了"></tui-nomore>
        </view>
    </view>
</template>

<script>


export default {
    props: {
        // empty 是否居中
        isCenter:{
            type:Boolean,
            default:false
        },
        // 是否需要分页加载状态
        needStatus:{
            type:Boolean,
            default:true
        },
        // 加载状态
        loading: {
            type: Boolean,
            default: false
        },
        // 服务器返回的总数
        total: {
            type: Number,
            required: true
        },
        // 当前列表的length
        length: {
            type: Number
        },
        // 按钮内容
        btnText: {
            type: String,
            default: ''
        },
        // 为空提示文本
        msg: {
            type: String,
            default: '暂无数据'
        }
    },
    data() {
        return {
        };
    },
    mounted() {},
    methods: {
        // 空数据操作
        openPage() {
            this.$emit("open")
        }
    }
};
</script>

<style lang="scss" scoped></style>
