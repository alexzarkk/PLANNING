<template>
    <page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsgreen" :isBack="true">
            <block slot="content">发布动态</block>
        </cu-custom>
        <view class="container">
            <view class="padding-lr padding-bottom bg-white">
                <tui-textarea class="margin-bottom" isCounter placeholder="说说你的独特见解吧~" :maxlength="140" v-model="content"></tui-textarea>
                <!-- 动态的图片 -->
                <zz-upload-image title="" :imgs="imgs" @add="addImage" @del="delImage"></zz-upload-image>
                <!-- <tui-upload width="200" :value="imageList" :serverUrl="serverUrl" @complete="imageComplete" @remove="imageRemove"></tui-upload> -->
            </view>
            <view class="bg-white margin-top padding-xs">
                <view class="cu-bar bg-white solid-bottom">
                    <view class="action">
                        <text class="cuIcon-title text-blue"></text>
                        标签（多选）
                    </view>
                </view>
                <view class="padding tag-box">
                    <view class="cu-tag lg radius" :class="item.active ? 'bg-' + item.color : 'line-' + item.color" v-for="(item, index) in tagList" :key="index" @click="selectTag(index)">
                        {{ item.label }}
                    </view>
                </view>
            </view>
            <view class="padding response margin-top" @click="sendPush">
                <view class="cu-btn bg-ztsgreen radius response lg">发布</view>
            </view>
            <tui-loading v-show="loading"></tui-loading>
            <!-- 其他内容 -->
            <!-- <view class="option-bar" :style="{ bottom: btnBottom + 'px' }">
                <text class="cuIcon-fork"></text>
                <text class="cuIcon-rankfill"></text>
                <text class="cuIcon-link"></text>
            </view> -->
        </view>
    </view>
</template>

<script>

import xss from 'xss'
export default {
    data() {
        return {
            loading: false,
            content: '', // 文字内容
            localImgList: [], // 图片
            // btnBottom: 0,
            selectedTopic: [
                {
                    title: '一个话题'
                }
            ],
            tagList: [],
            selectedTag: [],
            imageList: [], // 动态的图片列表
            serverUrl: '', //
            imgs: []
        };
    },
    onLoad() {
        this.loadData();
        // uni.onKeyboardHeightChange((res) => {
        //     console.log('键盘弹起', res);
        //     this.btnBottom = res.height;
        // });
    },
    methods: {
        async loadData() {
            let d = uni.getStorageSync('sys_dict')

            this.tagList = this.zz.toArr(d.article).filter(e => e.pub).map((tag, index) => {
                if (tag.label === '动态' && tag.value === 30) {
                    tag.active = true
                } else {
                    tag.active = false
                }

                return tag
            })

            console.log('加载的tagList', this.tagList);
        },
        // 发布
        async sendPush() {
            if (!this.content && this.localImgList.length === 0) {
                return;
            }
            this.loading = true;
            let req1 = {
                $url: '/user/article/add',
                content: xss(this.content),  // 防xss注入攻击
                status: 1,
                imgs: []
            };
            const selectedTag = this.tagList.filter(tag => {
                return tag.active
            }).map(tag => {
                return tag.value
            })
            // console.log("选择的tag", selectedTag)
            if (selectedTag.length > 0) {
                req1.type = selectedTag
            }
            if (this.imgs.length > 0) {
                for (const img of this.imgs) {
                    try {
                        req1.imgs.push(await this.zz.upload(img, true))
                    } catch (error) {
                        console.error("文件上传失败===", error)
                    }
                }
            }
            // console.log("动态参数======", req1)
            this.zz.req(req1).then((res) => {
                let pages = getCurrentPages(); //当前页面栈  
                if (pages.length > 1) {
                    let beforePage = pages[pages.length - 2]; //获取上一个页面实例对象 
                    console.log("上一个页面=========", beforePage)
                    beforePage.$vm.refreshNewsHome(); //触发父页面中的方法change()  
                }
                setTimeout(() => {
                    uni.redirectTo({
                        url: '/pages/my/discover'
                    });
                }, 500)

            }).finally(() => {
                this.loading = false;
            });
        },
        cancelTopic(index) {
            this.selectedTopic.splice(index, 1);
        },
        selectTag(index) {
            let activeNum = this.tagList.reduce((acc, val) => {  // 计算
                if (val.active) {
                    acc = acc + 1
                }
                return acc
            }, 0)
            if (activeNum === 1 && this.tagList[index].active === true) {
                this.zz.toast("至少选择一个标签~")
                return
            }
            this.tagList[index].active = !this.tagList[index].active;
        },
        addImage(e) {
            this.imgs = this.imgs.concat(e)
        },
        delImage(i) {
            this.zz.removeFile(this.imgs[i])
            this.imgs.splice(i, 1)
        },
    }
};
</script>

<style lang="scss" scoped>
.container {
    background-color: #f1f1f1;
}
.message-bar {
    // background-color: #ffffff;
    height: 80rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 20rpx;
}

.topic-scroll-view {
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    width: 520rpx;
}

.tag-box {
    display: flex;
    flex-direction: row;
    column-gap: 20rpx;
}

.option-bar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 750rpx;
    height: 80rpx;
    z-index: 10;
    display: flex;
    flex-direction: row;
    align-items: center;
    // row-gap: 20rpx;
    column-gap: 40rpx;
    background-color: #ffffff;
    padding-left: 30rpx;
    font-size: 36rpx;
}
</style>
