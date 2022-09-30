<template>
    <view class="form-section">
        <view v-if="title && !readOnly" class="cu-bar bg-white">
            <view class="action">{{ title }}</view>
            <view class="action"></view>
        </view>
        <view class="cu-form-group solid-bottom " :class="readOnly?'padding-top':''">
            <view class="  grid grid-square flex-sub" :class="'col-' + grid">
                <view v-for="(item, index) in imgs.slice(0,9)" :key="index" class="bg-img img-box" @tap="viewIMG(index)">
                    <image :src="imgs[index]" mode="aspectFill">
                    </image>
                    <view v-if="index === 8 && imgs.length > 9" class="num-tip">+{{ imgs.length - 9 }}</view>
                    <view v-if="!readOnly" class="cu-tag bg-red" @tap.stop="deleteimg(index)"><text class="cuIcon-close"></text></view>
                </view>
                <view v-if="imgs.length < count && !readOnly" class="solids" @tap="uploadImage"><text class="cuIcon-cameraadd"></text></view>
            </view>
        </view>
        <view v-if="!readOnly" class="cu-bar bg-white">
            <view class="action"></view>
            <view class="action">{{ imgs.length }}/{{ count }}</view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        // 最大可上传数量
        count: {
            type: Number,
            default: 9
        },
        title: {
            type: String,
            default: '照片'
        },
        //每行显示数
        grid: {
            type: Number,
            default: 3
        },
        //保存本地,手动上传
        local: {
            type: Boolean,
            default: true
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        imgs: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {}
    },
    methods: {
        // 上传图片
        async uploadImage() {
            let img = await this.zz.chooseImage({ count: this.count - this.imgs.length }, !this.local)
            if (img) this.$emit('add', img)
        },
        // 图片预览
        viewIMG(i) { this.zz.viewIMG(this.imgs, i) },
        // 删除图片
        deleteimg(e) {
            this.$emit('del', e)
        }
    }
};
</script>

<style lang="scss" scoped>
.img-box {
    position: relative;
    .num-tip {
        position: absolute;
        bottom: 0;
        right: 0;
        z-index:10;
        padding: 10rpx;
        color: #ffffff;
        background-color: rgba($color: #000000, $alpha: 0.5);
    }
}
</style>
