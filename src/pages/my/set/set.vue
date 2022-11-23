<template>
    <!--
	个人设置
	个人信息修改 
 -->
    
    <view>

        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">个人设置</block>
        </cu-custom>
        <!-- :class="modalName?'prevent':''" -->
        <!-- :class="modalName ? 'prevent' : ''" -->
        <view class="container">
            <tui-list-view color="#777">
                <tui-list-cell arrow @click="changeAvatar">
                    <view class="justify-between flex padding-right align-center">
                        <view class="cu-avatar xl round margin-left" :style="{ backgroundImage: 'url(' + userInfo.headImg + ')' }"></view>
                        <text class="text-black">修改头像</text>
                    </view>
                </tui-list-cell>
                <!-- <tui-list-cell>
                    <view class="justify-between flex padding-right align-center">
                        <text class="">用户名</text>
                        <text class="text-black">{{ userInfo.username }}</text>
                    </view>
                </tui-list-cell> -->

                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center" :data-modelId="4" @click="showModal($event, 'nickName')">
                        <text class="">昵称</text>
                        <text class="text-black">{{ userInfo.nickName }}</text>
                    </view>
                </tui-list-cell>

                <tui-list-cell arrow @click="showGender = true">
                    <view class="justify-between flex padding-right align-center">
                        <text class="">性别</text>
                        <text v-if="userInfo.info && userInfo.info.gender > -1" class="text-black">{{ userInfo.info.gender == 0 ? '男' : '女' }}</text>
                        <text v-else>未设置</text>
                    </view>
                </tui-list-cell>
                <!-- <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center" :data-modelId="3" @click="showModal($event)">
                        <text class="">二维码</text>
                        <view class="text-xl"><text class="cuIcon-qr_code"></text></view>
                    </view>
                </tui-list-cell> -->
                <!-- <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center" :data-modelId="4" @click="changeRegion">
                        <text class="">地区</text>
                        <text v-if="userInfo.info && userInfo.info.region" class="text-black">{{ userInfo.info.region ? userInfo.info.region : '未设置' }}</text>
                        <text v-else>未设置</text>
                    </view>
                </tui-list-cell> -->
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center" :data-modelId="5" @click="showModal($event, 'desc')">
                        <text class="">个性签名</text>
                        <text class="text-black" style="word-wrap: break-word; width: 460rpx; text-align: right">{{ userInfo.desc ? userInfo.desc : ' ' }}</text>
                    </view>
                </tui-list-cell>
            </tui-list-view>
            <tui-list-view margin-top="20rpx">
                <tui-list-cell arrow @click="openPage('/pages/my/set/settings/bodyInfo')">
                    <view class="justify-between flex padding-right align-center">
                        <text class="">身体数据</text>
                        <text v-if="userInfo.info && userInfo.info.height > 0" class="text-black">{{ userInfo.info.height }}cm,{{ userInfo.info.weight }}kg</text>
                        <text v-else>未设置</text>
                    </view>
                </tui-list-cell>
            </tui-list-view>
            <!-- <tui-list-view margin-top="20rpx">
                <tui-list-cell arrow @click="openPage('/pages/my/set/settings/saveInfo')">
                    <view class="justify-between flex padding-right align-center">
                        <text class="">设置户外救援信息</text>
                        <text class="text-black">已设置</text>
                    </view>
                </tui-list-cell>
            </tui-list-view> -->
            <tui-list-view margin-top="20rpx">
                <tui-list-cell arrow @click="changePhoneNumber()">
                    <view class="justify-between flex padding-right align-center">
                        <text class="">绑定手机</text>
                        <text class="text-black">{{ userInfo.phone }}</text>
                    </view>
                </tui-list-cell>
            </tui-list-view>
            <!-- <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">领队认证</text>
                        <text class="text-black  ">去认证</text>
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">我的户外履历</text>
                        <text class="text-black  "></text>
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">身份认证</text>
                        <text class="text-black  ">未实名认证</text>
                    </view>
                </tui-list-cell> -->
        </view>
        <view class="cu-modal" :class="modalName == 'modal3' ? 'show' : ''">
            <view class="cu-dialog bg-white" style="width: 500rpx">
                <view class="flex justify-end response padding-lr padding-top-sm" @click="hideModal"><text class="cuIcon-close text-red"></text></view>
                <view class="flex align-center flex-direction">
                    <view class="flex align-center padding response">
                        <view class="cu-avatar round margin-right" :style="{ backgroundImage: 'url(' + userInfo.headImg + ')' }">
                            <view class="cu-tag badge cuIcon-male bg-blue"></view>
                        </view>
                        <view class="text-black margin-right">{{ userInfo.nickName }}</view>
                    </view>
                    <zz-z-qrcode v-if="ifShow" ref="qrcode" cid="qrcode1" :val="val" :size="size" :unit="unit" :background="background" :foreground="foreground" :pdground="pdground" :icon="icon" :iconSize="iconsize" :lv="lv" :onval="onval" :loadMake="loadMake" :usingComponents="true" :showLoading="false" @result="qrComplete"></zz-z-qrcode>
                </view>
                <view class="padding">
                    请用
                    <text class="text-blue light">我的 - 扫一扫</text>
                    扫描本二维码添加好友
                </view>
                <view class="padding-bottom-sm">
                    <view class="cu-bar btn-group">
                        <button class="cu-btn bg-green shadow-blur" @click="shareQr">分享</button>
                        <button class="cu-btn bg-blue shadow-blur" @click="saveQr">保存</button>
                    </view>
                </view>
            </view>
        </view>
        <!-- <view class="response padding margin-top">
            <button class="cu-btn bg-red round lg response" @click="killme">删除账号</button>
        </view> -->

        <!-- 修改昵称 -->
        <zz-cu-modal title="修改昵称" :isLoading="modalLoading" :show="modalName == 'modal4'" targetProp="nickName" @confirm="confirmChangeInfo" @cancel="modalName = ''">
            <tui-textarea v-model="tnickName" isCounter placeholder="请输入昵称" height="60rpx" min-height="60rpx" :maxlength="12"></tui-textarea>
        </zz-cu-modal>
        <!-- 个性签名 -->
        <zz-cu-modal title="修改个性签名" :isLoading="modalLoading" :show="modalName == 'modal5'" targetProp="desc" @confirm="confirmChangeInfo" @cancel="modalName = ''">
            <tui-textarea v-model="tdesc" isCounter placeholder="请输入个性签名" :maxlength="120"></tui-textarea>
        </zz-cu-modal>
        <!-- 选择性别 -->
        <tui-actionsheet :show="showGender" :item-list="genderList" @click="confirmGender" @cancel="showGender = false"></tui-actionsheet>
    </view>
</template>

<script>
import xss from 'xss';
import { pathToBase64, base64ToPath } from '../../../js_sdk/mmmm-image-tools/index.js';
export default {
    data() {
        return {
            modalLoading: false, // 修改信息的modal框是否loading
            accountInfo: null,
            userInfo: {
                avatar: '',
                grade: 0,
                weight: 0,
                height: 0,
                nickName: '',
                region: '',
                desc: '',
                info: {
                    gender: ''
                }
            },
            avatar: 'https://s1.ax1x.com/2022/05/27/XmKBMq.jpg', // 头像
            gender: '0',
            genderList: [
                {
                    text: '男',
                    color: '#2B2B2B'
                },
                {
                    text: '女',
                    color: '#2B2B2B'
                }
            ],
            showGender: false, // 显示性别选择框
            tnickName: '', // 临时昵称，修改用
            tdesc: '', // 临时个性签名
            sign: '不断挑战，不断成长', // 个性签名
            modalName: '', // 弹框名称
            nickName: 'InsHomePgup', // 昵称
            myQrCode: 'https://s1.ax1x.com/2022/07/06/jUKQnU.png', // 二维码缩略图
            qrCodeTemp: '', // 下载的二维码中间的图
            ifShow: true,
            val: '加好友', // 要生成的二维码值
            size: 350, // 二维码大小
            unit: 'rpx', // 单位
            background: '#b4e9e2', // 背景色
            foreground: '#309286', // 前景色
            pdground: '#32dbc6', // 角标色
            icon: '', // 二维码图标  需下载到本地以后引入
            iconsize: 40, // 二维码图标大小
            lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
            onval: false, // val值变化时自动重新生成二维码
            loadMake: true, // 组件加载完成后自动生成二维码
            qrCardImage: '' // 二维码生成后的图片地址或base64
        };
    },
    onLoad() {
        this.loadData();
    },
    async onShow() {
        this.userInfo = this.zz.getAcc();
        let avatar = uni.getStorageSync('tempAvatar');
        if (avatar) {
            this.avatar = avatar;
            let tempImg = '';
            // #ifdef APP-PLUS
            tempImg = avatar;
            // #endif
            // #ifdef H5
            await base64ToPath(avatar).then((img) => {
                tempImg = img;
            });
            // #endif
            // console.log('上传图片==========', tempImg);
            // 上传图片
            // const imgs = await this.zz.uploadImg([tempImg]);
            let imgs = ''
            try {
                imgs = await this.zz.upload(tempImg);
            } catch (error) {
                console.error("头像上传失败=====================", error)
            }
            this.zz.req({
                $url: 'user/user/update',
                _id: this.userInfo._id,
                headImg: imgs
            }).then((res) => {
                this.userInfo.headImg = imgs;
                this.zz.setAcc(this.userInfo);
                this.zz.toast('修改成功', 1000);
            }).catch((err) => {
                console.error('上传失败', err);
            });
            uni.setStorageSync('tempAvatar', null);
        }
        this.userInfo = this.zz.getAcc();
    },
    methods: {
        shareQr() { },
        // 把二维码保存到本地相册
        saveQr() {
            let _this = this;
            uni.saveImageToPhotosAlbum({
                filePath: this.qrCardImage,
                success: (res) => {
                    // console.log("图片保存到相册",res)
                    _this.zz.toast("已保存至相册")
                },
                fail: (err) => {
                    _this.zz.toast("保存失败，请稍后重试")
                    console.error("图片保存失败===", err)
                }
            })
        },
        qrComplete(event) {
            // console.log('二维码路径================', event);
            this.qrCardImage = event
        },
        // 初始化
        async loadData() {
            // uni.showLoading({ title: '加载中...' });
            // const userInfo = this.zz.getAcc();
            // this.accountInfo = userInfo;
            // const res = await this.zz.req({
            //     $url: 'admin/sys/person/info',
            // });
            // console.log('获取到的个人信息', res);
            // this.userInfo = res;
            // uni.hideLoading();
        },
        // 修改头像
        changeAvatar() {
            uni.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album'], // 直接跳转到相册选图片
                success: (res) => {
                    const tempFilePaths = res.tempFilePaths[0];
                    this.zz.href('/pages/my/set/avatarCropper?src=' + tempFilePaths);
                    // this.tui.href('../cropper-default/cropper-default?src=' + tempFilePaths);
                }
            });
        },
        // 修改地区
        changeRegion() {
            this.zz.toast('修改地区', 500);
        },
        openPage(url) {
            // console.log('openPage');
            this.zz.href(url);
        },
        // 打开modal弹框
        showModal(event, modify) {
            // console.log('modify===', modify);
            if (event.currentTarget.dataset.modelid === 3 && !this.icon) {
                // 查看二维码
                // 1. 头像改成本地图片
                let _this = this;
                uni.downloadFile({
                    url: this.userInfo.headImg,
                    success: (res) => {
                        // console.log('下载成功=======', res.tempFilePath);
                        _this.icon = res.tempFilePath;
                        setTimeout(() => {
                            _this.creatQrcode();
                        }, 100);
                    }
                });
                // 2. 添加到二维码
                // 3. 重绘二维码
            }
            this.modalName = 'modal' + event.currentTarget.dataset.modelid;
            this.$data['t' + modify] = this.userInfo[modify];
        },
        creatQrcode() {
            // console.log('重绘二维码');
            this.$refs.qrcode._makeCode();
        },
        // 确认修改相关信息 modify:修改的项
        async confirmChangeInfo(modify) {
            this.modalLoading = true;
            let requestParams = {
                // $url: 'admin/sys/person/update',
                $url: 'user/user/update',
                _id: this.userInfo._id
            };
            requestParams[modify] = xss(this.$data['t' + modify])
            try {
                const res = await this.zz.req(requestParams);
                // console.log('修改的返回值===', res);
                this.userInfo[modify] = this.$data['t' + modify];
                this.zz.setAcc(this.userInfo);
                // this.zz.toast('修改成功', 1000);
            } catch (error) {
                console.error('修改信息失败===', error);
                // this.zz.toast(error.message)
                this.zz.toast('修改失败，请稍后重试');
            }
            this.modalName = '';
            this.modalLoading = false;
        },
        // 确认性别
        async confirmGender(event) {
            // console.log('event====', event);
            this.showGender = false; // 隐藏
            try {
                uni.showLoading({
                    title: '提交中...'
                });
                const res = await this.zz.req({
                    $url: 'user/user/update',
                    _id: this.userInfo._id,
                    // userId: this.accountInfo._id,
                    info: {
                        gender: event.index
                    }
                });

                if (!this.userInfo.info) {
                    this.userInfo.info = {};
                }
                this.userInfo.info.gender = event.index; // 修改本地的userInfo
                this.zz.setAcc(this.userInfo);
                uni.hideLoading();
                this.zz.toast('修改成功', 1000);
            } catch (error) {
                this.showGender = false;
                this.zz.toast('修改失败，请稍后重试');
                // this.zz.toast('网络错误，修改失败', 1000);
            }
        },
        // 确认个性签名
        confirmSign() {
            this.modalName = '';
        },
        hideModal() {
            this.modalName = '';
        },
        // 跳转到修改绑定的手机号
        changePhoneNumber() {
            this.zz.href('/pages/comm/account/changePhone');
        },
        killme() {
            this.zz.modal('删除账号操作将会同时删除您在本APP所保存的所有个人数据', (e) => {
                if (e) {
                    this.zz.req({ $url: '/admin/comm/logout', killme: true }).then(e => {
                        this.zz.logOut()
                        this.zz.href('/pages/index/index')
                    })
                }
            }, true, '高风险提示')
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    background-color: #f1f1f1;
}

.prevent {
    width: 100%;
    height: 100%;
    position: fixed;
    // top: 0;
    left: 0;
    overflow: hidden;
}
</style>
