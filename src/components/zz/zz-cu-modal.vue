<template>
    <view class="cu-modal" :class="show ? 'show' : ''">
        <view class="cu-dialog">
            <view class="cu-bar bg-white justify-end">
                <view class="content">{{ title }}</view>
                <view class="action" @tap="cancel"><text class="cuIcon-close text-red"></text></view>
            </view>
            <!-- <tui-textarea isCounter placeholder="请输入昵称" height="60rpx" min-height="60rpx" :maxlength="12" v-model="tnickName"></tui-textarea> -->
            <slot></slot>
            <view class="cu-bar bg-white solid-top">
                <view class="action margin-0 flex-sub  solid-left" @tap="cancel">取消</view>
                <view class="action margin-0 flex-sub text-green solid-left" :class="disable?'text-gray':''" @tap="confirm">
                    <text v-show="isLoading" class="cuIcon-loading2 cuIconfont-spin"></text> 确定
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        // 
        isLoading: {
            type: Boolean
        },
        // modal是否显示
        show: {
            type: Boolean
        },
        // 弹框名称
        title: {
            type: String,
            default:''
        },
        // 修改的目标属性
        targetProp: {
            type: String,
            default:''
        },
        disable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    watch:{
        show(val){
            if(val === true){
                this.$emit("active")
            }
        }
    },
    created() { },
    mounted() { },
    methods: {
        confirm() {
            if (!this.disable) {
                this.$emit('confirm', this.targetProp);
            }

        },
        cancel() {
            this.$emit('cancel');
        }
    }
};
</script>

<style lang="scss" scoped></style>
