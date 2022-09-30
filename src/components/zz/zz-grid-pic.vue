<template>
    <!-- 
    name: 图片组件
    desc:
    date:
    update:
    author:
 -->
    <view class="img-content">
        <tui-lazyload-img
            v-for="(item, index) in imgList.slice(0,9)" :key="index" class="image" :width="getWidth" height="190rpx"
            radius="20rpx" :src="item" mode="aspectFill" @tap="previewImage(index)"
        >
            <!-- 照片数量大于9张的时候添加角标 -->
            <view v-if="index === imgCount - 1 && imgList.length > 9" class="num-tip">+{{ imgList.length - 9 }}</view>
        </tui-lazyload-img>
    </view>
</template>

<script>
export default {
    props: {
        width: {
            type: [String,Number], 
            default:190
        },
        // 图片列表
        imgList: {
            type: Array,
            default: () => {
                return []
                // let imgList = [];
                // for (let i = 0; i < 9; i++) {
                //     imgList.push('https://fhty.976m.org/bdfh/img/0 (' + (i + 1) + ').JPG');
                // }
                // return imgList;
            }
        },
        // 图片
        imgCount: {
            type: Number,
            default: 9
        }
    },
    data() {
        return {};
    },
    computed:{
        getWidth(){
            return this.width + 'rpx'
        }
    },
    created() {},
    mounted() {
        // console.log("grid img============",this.imgList)
    },
    methods: {
        previewImage(index) {
            this.$emit("isPreview",new Date())
            // console.log('index===', index);
            if (this.imgList.length > 0) {
                uni.previewImage({
                    current: index,
                    urls: this.imgList
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.img-content {
    width:750rpx;
    // position: relative;
    background-color: #ffffff;
    padding: 30rpx 30rpx;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 30rpx;
    column-gap: 30rpx;
    // justify-content: space-around;
    .image {
        z-index: 10;
        overflow: hidden;
    }
    .num-tip {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 10rpx;
        color: #ffffff;
        background-color: rgba($color: #000000, $alpha: 0.5);
    }
}
</style>
