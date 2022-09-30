<template>
    <!-- 
			@name:新闻资讯横向swiper 
			@desc：用于新建组件
			@import:
			import xxx from "@/components/ab-components/xxx.vue"
			@date：2020-11-01
			@author: 
	 -->
    <view class="padding-lr bg-white solid-bottom">
        <view class="text-lg text-bold">赏花踏青|如何预防花粉过敏？</view>
        <!-- <swiper class="card-swiper" :indicator-dots="false" :circular="true" :autoplay="false" interval="5000" duration="500" @change="cardSwiper" indicator-color="#8799a3" indicator-active-color="#0081ff">
            <swiper-item v-for="(item, index) in swiperList" :key="index">
                <view class="swiper-item swiper-wrapper">
                    <view class="cu-tag bg-red block-tag">最热话题</view>
                    <view class="title text-black text-df text-bold margin-bottom">春季如何预防花粉过敏</view>
                    <view class="sub-title text-cut-2">
                        每年的3月到5月，是人们欣赏花的高峰。每年的3月到5月，是人们欣赏花的高峰。每年的3月到5月，是人们欣赏花的高峰。每年的3月到5月，是人们欣赏花的高峰。
                    </view>
                </view>
            </swiper-item>
        </swiper> -->
        <swiper class="card-swiper" :circular="true" @change="cardSwiper">
            <swiper-item v-for="(item, index) in 3" :key="index" :class="cardCur == index ? 'cur' : ''">
                <view class="swiper-item swiper-wrapper">
                    <view class="cu-tag bg-red block-tag">最热话题</view>
                    <view class="title text-black text-df text-bold margin-bottom">春季如何预防花粉过敏</view>
                    <view class="sub-title text-cut-2">
                        每年的3月到5月，是人们欣赏花的高峰。每年的3月到5月，是人们欣赏花的高峰。
                    </view>
                </view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            cardCur: 0,
            swiperList: [ 
                {
                    id: 0,
                    type: 'image',
                    url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
                },
                {
                    id: 1,
                    type: 'image',
                    url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg'
                },
                {
                    id: 2,
                    type: 'image',
                    url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
                },
                {
                    id: 3,
                    type: 'image',
                    url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
                },
                {
                    id: 4,
                    type: 'image',
                    url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
                },
                {
                    id: 5,
                    type: 'image',
                    url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
                },
                {
                    id: 6,
                    type: 'image',
                    url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
                }
            ]
        };
    },
    created() { },
    mounted() { },
    methods: {
        cardSwiper(e) {
            this.cardCur = e.detail.current;
        },
    }
};
</script>

<style lang="scss" scoped>
.swiper-wrapper {
    border: 1px solid rgb(211, 211, 211);
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    row-gap: 20rpx;
    padding: 70rpx 20rpx 0rpx;
    .block-tag {
        position: absolute;
        top: 0rpx;
        left: 0;
    }
}
</style>
