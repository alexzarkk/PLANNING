<template>

    <!-- 消息推送设置
    msg:{
        veri,  // 好友验证
        like,  // 点赞评论消息
        follow  // 关注消息
    }
 -->
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">消息推送</block>
        </cu-custom>
        <view class="container">
            <!-- 加好友消息 -->
            <tui-list-view>
                <tui-list-cell>
                    <view class="justify-between flex padding-right align-center">
                        <text class="">好友验证信息</text>
                        <view>
                            <switch data-num="veri" :class="cfg.veri ? 'checked' : ''" :checked="cfg.veri ? true : false" color="#39b54a" @change="switchChange"></switch>
                        </view>
                    </view>
                </tui-list-cell>
                <!-- 点赞/评论消息 -->
                <tui-list-cell>
                    <view class="justify-between flex padding-right align-center">
                        <text class="">点赞/评论消息</text>
                        <view>
                            <switch data-num="like" :class="cfg.like ? 'checked' : ''" :checked="cfg.like ? true : false" color="#39b54a" @change="switchChange"></switch>
                        </view>
                    </view>
                </tui-list-cell>
                <!-- 关注消息 -->
                <tui-list-cell>
                    <view class="justify-between flex padding-right align-center">
                        <text class="">关注消息</text>
                        <view>
                            <switch data-num="follow" :class="cfg.follow ? 'checked' : ''" :checked="cfg.follow ? true : false" color="#39b54a" @change="switchChange"></switch>
                        </view>
                    </view>
                </tui-list-cell>
            </tui-list-view>
            <!-- 铃声 & 振动 -->
            <!-- <tui-list-view margin-top="20rpx">
                <tui-list-cell>
                    <view class="justify-between flex padding-right align-center">
                        <text class="">铃声</text>
                        <view>
                            <switch @change="switchChange" data-num="D" :class="switchD ? 'checked' : ''" :checked="switchD ? true : false" class="green" color="#39b54a"></switch>
                        </view>
                    </view>
                </tui-list-cell>
                <tui-list-cell>
                    <view class="justify-between flex padding-right align-center">
                        <text class="">振动</text>
                        <view>
                            <switch @change="switchChange" data-num="E" :class="switchE ? 'checked' : ''" :checked="switchE ? true : false" class="green" color="#39b54a"></switch>
                        </view>
                    </view>
                </tui-list-cell>
            </tui-list-view> -->
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            userInfo: null,
            cfg: {
                veri: false,
                like: false,
                follow: false
            }
        };
    },
    onLoad() {
        this.userInfo = this.zz.getAcc()
        this.loadData();
    },
    methods: {
        async loadData() {
            /** 获取消息设置配置 */
            this.zz.req({
                $url: 'user/person/info',
                _id: this.userInfo._id
            }).then(({ msg }) => {
                const keys = Object.keys(this.cfg)
                if (msg) {
                    for (const k of keys) {
                        if (msg[k] === undefined) {
                            this.cfg[k] = true  // 默认是true
                        } else {
                            this.cfg[k] = msg[k]
                        }
                    }
                } else {
                    for (const k of keys) {
                        this.cfg[k] = true  // 默认true
                    }
                }

            });
        },
        switchChange(event) {
            const field = event.target.dataset.num
            const value= event.detail.value
            this.cfg[field] = value
            let req1 = {
                $url: 'user/person/update',
                _id: this.userInfo._id,
                msg: this.cfg
            }
            this.zz.req(req1)
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    background-color: #f1f1f1;
}
</style>
