<template>
    <!-- 隐私设置 
        privacy:{
            friendVeri, //  friend veri  加好友是否需要验证
            mobile,  // 是否通过手机号添加好友
            showPush  // 个人主页是否显示动态
        }
    -->

    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">隐私设置</block>
        </cu-custom>
        <view class="container">
            <tui-list-view>
                <tui-list-cell>
                    <view class="justify-between flex   align-center">
                        <text class="">加好友是否需要验证</text>
                        <view>
                            <switch data-num="friendVeri" :class="cfg.friendVeri ? 'checked' : ''" :checked="cfg.friendVeri ? true : false" color="#39b54a" @change="switchChange"></switch>
                        </view>
                    </view>
                </tui-list-cell>
                <tui-list-cell>
                    <view class="justify-between flex   align-center">
                        <text class="">是否可通过手机号添加好友</text>
                        <view>
                            <switch data-num="mobile" :class="cfg.mobile ? 'checked' : ''" :checked="cfg.mobile ? true : false" color="#39b54a" @change="switchChange"></switch>
                        </view>
                    </view>
                </tui-list-cell>
                <tui-list-cell>
                    <view class="justify-between flex   align-center">
                        <text class="">个人主页是否显示动态</text>
                        <view>
                            <switch data-num="showPush" :class="cfg.showPush ? 'checked' : ''" :checked="cfg.showPush ? true : false" color="#39b54a" @change="switchChange"></switch>
                        </view>
                    </view>
                </tui-list-cell>
            </tui-list-view>

            <!-- <tui-list-view margin-top="20rpx">
                <tui-list-cell>
                    <view class="justify-between flex   align-center">
                        <text class="">接收陌生人信息</text>
                        <view>
                            <switch @change="switchChange" data-num="D" :class="switchD ? 'checked' : ''" :checked="switchD ? true : false" class="green" color="#39b54a"></switch>
                        </view>
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex   align-center">
                        <text class="">黑名单</text>
                    </view>
                </tui-list-cell>
            </tui-list-view> -->
            <!-- 加好友设置 -->
            <!-- 陌生人对话设置 -->
            <!-- 手机号是否可以搜索 -->
            <!-- 黑名单列表 -->
            <!-- 账号注销 -->
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            userInfo: null,
            cfg: {
                friendVeri: false, //  friend veri  加好友是否需要验证
                mobile: false,  // 是否通过手机号添加好友
                showPush: false  // 个人主页是否显示动态
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
            }).then(({ privacy }) => {
                console.log('cfg=======', privacy);
                const keys = Object.keys(this.cfg)
                if (privacy) {
                    for (const k of keys) {
                        if (privacy[k] === undefined) {
                            this.cfg[k] = true  // 默认是true
                        } else {
                            this.cfg[k] = privacy[k]
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
            const value = event.detail.value
            this.cfg[field] = value
            let req1 = {
                $url: 'user/person/update',
                _id: this.userInfo._id,
                privacy: this.cfg
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
