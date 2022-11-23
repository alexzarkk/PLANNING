<!--
 * @name:   科普
-->
<template>
    <view class="moment-box bg-white" @click="openDetails">
        <view class="header-bar padding">
            <view class="avatar-box" @click.stop="openProfile()">
                <view class="cu-avatar round df margin-right-xs" :style="[{ backgroundImage: 'url(' + details.userInfo.headImg + ')' }]">
                    <!-- <view class="cu-tag badge cuIcon-male bg-blue"></view> -->
                </view>
                <view class="avatar-name-time">
                    <text class="text-df text-black">
                        {{ details.author || details.origin || details.userInfo.nickName }}
                    </text>
                    <text class="text-grey text-xs">
                        {{ article_time }}
                    </text>
                </view>
            </view>
            <!-- <view class="like-box" @click.stop="followUser">
                <button class="cu-btn sm line-blue">
                    <text class="cuIcon-add"></text>
                    关注
                </button>
            </view> -->
        </view>

        <view class="content-box padding">
            <!-- <view v-if="details" class="text-box text-cut-2 padding-left">{{details.content}}</view> -->
            <view class="text-box text-cut-2 padding-left">
                {{ details.title || details.content }}
            </view>
            <view class="image-box padding">
                <!-- <tui-lazyload-img v-if="details && details.cover" mode="aspectFill" width="100%" radius="20rpx" :src="details.cover.url || 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-699d1eb1-ee53-4c66-bddd-06cda80d1231/01acf825-4f59-4592-8034-295d16e69c7e.png'"></tui-lazyload-img> -->
                <tui-lazyload-img v-if="details && details.imgs.length > 0" mode="aspectFill" width="100%" radius="20rpx" :src="details.imgs[0]"></tui-lazyload-img>
            </view>
        </view>
        <!-- 照片拍摄时间 -->
        <!-- <view class="info-bar padding">
            <text class="text-grey text-xs">拍摄于：2022-04-04</text>
        </view> -->

        <view class="footer-bar padding">
            <view v-if="details && details.tagList && details.tagList.length > 0" class="padding-lr tag-box">
                <view v-for="(tag, index) in details.tagList" :key="index" class="cu-tag radius" :class="'bg-' + tag.color || 'ztsblue'">
                    {{ tag.label }}
                </view>
            </view>
            <view v-if="details" class="text-gray text-sm">
                <text class="cuIcon-attentionfill  margin-lr-xs"></text>
                {{ details.view }}
                <text class="cuIcon-appreciatefill margin-lr-xs"></text>
                {{ details.like }}
                <text class="cuIcon-favorfill margin-lr-xs"></text>
                {{ details.favor }}
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        details: {
            type: Object,
            default: () => {
                return null
            }
        }
    },
    data() {
        return {
            article_time: ''
        }
    },
    mounted() {
        // console.log("动态详情=========", this.details)
        // console.log('动态详情================', JSON.parse(JSON.stringify(this.details)));
        const timestamp = this.zz.date2Time(this.details.createTime)
        this.article_time = this.zz.timeFrom(timestamp)  // 个性化显示时间
    },
    methods: {
        openProfile() {
            this.zz.profile(this.details.userInfo._id)
        },
        openDetails() {
            // console.log("打开详情===========", this.details)
            if (!this.details.title) {
                this.zz.href('/pages/my/social/pushDetails', { _id: this.details._id });
            } else {
                this.zz.href(`/pages/planning/article?id=${this.details._id}`)
            }

        },
        followUser() {
            this.zz.toast("功能暂未开启", 1000)
        }
    }
};
</script>

<style lang="scss" scoped>
.header-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .avatar-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        .avatar-name-time {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-around;
        }
    }
}

.watch-box {
    align-items: center;
    font-size: 20rpx;
    display: flex;
    flex-direction: row;
    column-gap: 20rpx;
}

.moment-box {
    border-bottom: 1px solid #e2e2e2;
    padding-bottom: 30rpx;
    .content-box {
        padding: 20rpx 0;

        .text-box {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .image-box {
            height: auto;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-around;
        }
    }
    .info-bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        .location-box {
            margin-right: 20rpx;
            display: flex;
            flex-direction: row;
            align-items: center;
        }
    }

    .footer-bar {
        padding-top: 20rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
