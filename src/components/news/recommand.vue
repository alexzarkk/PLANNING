<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-19 15:50:33
 * @FilePath: \sport-planing\src\components\news\recommand.vue
 * @Description:   资讯 - 推荐
 * 
 * 
-->
<template>
    <!-- 推荐动态模块 -->
    <view class="moment-box bg-white">
        <view class="header-bar padding">
            <view class="avatar-box">
                <view class="cu-avatar round df margin-right-xs" :style="[{ backgroundImage: 'url(' + 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg' + ')' }]">
                    <view class="cu-tag badge cuIcon-male bg-blue" />
                </view>
                <view class="avatar-name-time">
                    <text class="text-df text-black">
                        花开花落
                    </text>
                    <text class="text-grey text-xs">
                        8小时前
                    </text>
                </view>
            </view>
            <view class="like-box">
                <button class="cu-btn sm line-blue">
                    <text class="cuIcon-add" />
                    关注
                </button>
            </view>
        </view>

        <view class="content-box padding">
            <!-- <view v-if="details" class="text-box text-cut-2 padding-left">{{details.content}}</view> -->
            <view class="text-box text-cut-2 padding-left">
                今天天气不错~
            </view>
            <view class="image-box padding">
                <image v-for="(item, idx) in 9" :key="idx" mode="aspectFill" style="width: 33%; height: 200rpx" :src="'https://fhty.976m.org/bdfh/img/0 (' + (idx + 1) + ').JPG'" />
            </view>
        </view>
        <!-- <zz-grid-pic v-if="details &&details.imgs&& details.imgs.length>0" :width="210" :imgList="details.imgs"></zz-grid-pic> -->
        <view class="info-bar padding">
            <view class="location-box cu-tag round">
                <text class="cuIcon-locationfill" />
                地点 
            </view>
            <text class="text-grey text-xs">
                拍摄于：2022-04-04
            </text>
        </view>

        <view class="footer-bar padding">
            <view class="tag-box">
                <view class="cu-tag line-yellow margin-right-xs sm">
                    动态
                </view>
                <view class="cu-tag line-yellow sm">
                    精选
                </view>
            </view>
            <!-- <view class="padding-lr tag-box" v-if="details && details.tagList && details.tagList.length > 0">
                <view class="cu-tag radius" :class="'bg-' + tag.color" v-for="(tag, index) in details.tagList">
                    {{ tag.label }}
                </view>
            </view> -->
            <!-- <view class="text-gray text-sm" v-if="details">
                <text class="cuIcon-attentionfill margin-lr-xs"></text>
                {{details.view || 0}}
                <text class="cuIcon-appreciatefill margin-lr-xs"></text>
                {{details.like || 0}}
                <text class="cuIcon-messagefill margin-lr-xs"></text>
                {{details.comment || 0}}
            </view> -->
            <view v-if="details" class="text-gray text-sm">
                <text class="cuIcon-attentionfill margin-lr-xs" />
                1798
                <text class="cuIcon-appreciatefill margin-lr-xs" />
                612
                <text class="cuIcon-messagefill margin-lr-xs" />
                51
            </view>
        </view>
    </view>
</template>

<script>
// import zzGridPic from '../zz/zz-grid-pic.vue';
export default {
    // components: { zzGridPic },
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
        };
    },
    created() {
    },
    mounted() {
        // console.log('动态详情', JSON.parse(JSON.stringify(this.details)));
        // this.details.tagList.forEach(res=>{

        // })
    },

    methods: {

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
            height: 606rpx;
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
