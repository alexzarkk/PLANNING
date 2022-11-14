<template name="basics">
<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ftblue" :isBack="true">
            <block slot="backText"></block>
            <block slot="content">TEST</block>
        </cu-custom>

        <view class="bg-white" style="margin: 20rpx; padding: 20rpx; border-radius: 8rpx">
            <view class="text-df text-gray padding-tb-xs">常用功能</view>

            <view class="cu-list grid col-4 solid-top solid-left solid-right">
                <view v-for="(e, idx) in serve" :key="idx" class="cu-item" @tap="href(e.url)">
                    <view class="text-grey"></view>
                    <text>{{ e.name }}</text>
                </view>
            </view>
        </view>
		<zz-upload-image :imgs="[]" @add="addImage" @del="delImage"></zz-upload-image>
        <view @click="showShare">APP分享</view>
        <view class="flex flex-direction padding" style="row-gap: 20rpx">
            <button class="cu-btn round" @click="list_rec">list_rec</button>
            <button class="cu-btn round" @click="del_rec('631ea8c9a874f0000167ecd7')">删除rec</button>
            <button class="cu-btn round" @click="reset('631ea8c9a874f0000167ecd7')">test</button>
            <button class="cu-btn round" @click="delredis">清理redis</button>
            <button class="cu-btn round" @click="clear">清理缓存</button>
            <button class="cu-btn round bg-ztsgreen" @click="openLogin">登录</button>
            <button class="cu-btn round bg-ztsgreen" @click="openShareDetail">Share</button>
            <button class="cu-btn round bg-ztsgreen" @click="openNewShareDetail">new Share</button>
            <button class="cu-btn round bg-ztsgreen" @click="openPage('/pages/my/set/feedback')">意见反馈</button>
            <!-- <button @click="openNews" class="cu-btn round">资讯</button> -->
            <button class="cu-btn round bg-ztsgreen" @click="openPage('/pages/my/profile/profile')">个人主页</button>
            <button class="cu-btn round bg-ztsgreen" @click="apiTest1">接口调用</button> 
            <button class="cu-btn round bg-ztsgreen" @click="openPage('/pages/nav/pointType')">兴趣点类型选择</button>
            <button class="cu-btn round bg-ztsgreen" @click="openPage('/pages/nav/savePoint')">保存兴趣点</button>
            <!-- <button @click="openPage('/pages/my/set/version')" class="cu-btn round">APP版本页面</button> -->
        </view>
        <!-- <view>注册</view> -->
        <!-- <button @click="setIcon" class="cu-btn round">二维码添加图标</button> -->
        <!-- <zz-z-qrcode
            v-if="ifShow"
            cid="qrcode1"
            ref="qrcode"
            :val="val"
            :size="size"
            :unit="unit"
            :background="background"
            :foreground="foreground"
            :pdground="pdground"
            :icon="icon"
            :iconSize="iconsize"
            :lv="lv"
            :onval="onval"
            :loadMake="loadMake"
            :usingComponents="true"
            @result="qrComplete"
        ></zz-z-qrcode> -->
    </view>
</template>

<script>
import appShare, { closeShare } from '@/uni_modules/zhouWei-APPshare/js_sdk/appShare';

export default {
    data() {
        return {
            serve: [
                {
                    name: '高德',
                    url: '/pages/test/amap'
                },
                {
                    name: 'appMap',
                    url: '/pages/test/mapView'
                },
                {
                    name: 'mapbox',
                    url: '/pages/test/mapbox'
                },
                {
                    name: '轨迹/组网',
                    url: '/pages/share?path=/pages/comm/kml&_id=15'
                },
                {
                    name: '台州市域',
                    url: '/pages/share?path=/pages/comm/kml&_id=62b9409268cebc00011fdb23'
                },
                {
                    name: '推荐路线',
                    url: '/pages/share?path=/pages/planning/detail&id=627911aac2b3040001747310'
                },
                {
                    name: '有视频',
                    url: '/pages/share?path=/pages/comm/kml&_id=62fdc4288a31b90001c7db0b'
                },
                {
                    name: '首页',
                    url: '/pages/share?path=/pages/index/index'
                },
				
				
            ],
            ifShow: true,
            val: 'https://www.baidu.com', // 要生成的二维码值
            size: 350, // 二维码大小
            unit: 'rpx', // 单位
            background: '#b4e9e2', // 背景色
            foreground: '#309286', // 前景色
            pdground: '#32dbc6', // 角标色
            icon: '', // 二维码图标
            iconsize: 40, // 二维码图标大小
            lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
            onval: false, // val值变化时自动重新生成二维码
            loadMake: true, // 组件加载完成后自动生成二维码
            src: '' // 二维码生成后的图片地址或base64
        };
    },
    onLoad() {
        console.log('serve=======', this.serve);
    },
    methods: {
        async apiTest1() {
            const userInfo = this.zz.getAcc();
            console.log('用户信息', userInfo);
            // const res = await this.zz.req({
            //     $url:'admin/sys/user/delSign',
            //     _id:'6107f7c5cd84d60001274129'
            // })

            const res = await this.zz.req({
                $url: 'admin/social/moment/page'
            });

            // const res = await this.zz.req({
            //     $url: 'admin/social/moment/list'
            // });

            // const res = await this.zz.req({
            //     $url: 'admin/social/moment/delete',
            //     ids: ['62d0d80dc988150001b1f7c8']
            // });

            // const res = await this.zz.req({
            //     $url: 'admin/social/moment/update',
            //     _id: '62d0d8a3d320910001ec0eb8',
            //     name: 'zhangsan',
            //     age: 24,
            //     grade: 10
            // });
        },
        qrComplete() {},
        openPage(url) {
            uni.navigateTo({
                url,
                fail: (err) => {
                    console.error('跳转失败===', err);
                }
            });
        },
        openShareDetail() {
            //三都 622c331943315700013877e7
            //笔架山 628a3dd2c9881500011de64b
            //笔架山安装 60cda51ff183a00001e4399f
            // 金峨 15
            // '62b12abd9d207000014b03cc', departmentId: '330300', name: '温州市县域支线规划'

            // 62b7fa05fd3e320001e9debd  台州市域
			//path=/pages/planning/detail&id=627911aac2b3040001747310

            uni.navigateTo({ url: '/pages/share?path=/pages/comm/kml&_id=62b9409268cebc00011fdb23' });
            // uni.navigateTo({ url: '/pages/share?path=/pages/planning/detail&id=627911aac2b3040001747310' });
        },
        openLogin() {
            this.zz.href('/pages/comm/account/login');
        },
        showShare() {
            // let shareData = {
            //     shareUrl: 'https://kemean.com/',
            //     shareTitle: '分享的标题',
            //     shareContent: '分享的描述',
            //     shareImg: 'http://qn.kemean.cn//upload/202004/18/1587189024467w6xj18b1.jpg',
            //     appId: 'wxd0e0881530ee4444', // 默认不传type的时候，必须传appId和appPath才会显示小程序图标
            //     appPath: 'pages/home/home',
            //     appWebUrl: 'https://kemean.com/'
            // };
            let shareData = {}
            // 调用
            let shareObj = appShare(shareData, (res) => {
                console.log('分享成功回调', res);
                // 分享成功后关闭弹窗
                // 第一种关闭弹窗的方式
                closeShare();
            });
            setTimeout(() => {
                // 第二种关闭弹窗的方式
                shareObj.close();
            }, 5000);
        },
        // 打开新的分享详情页面
        openNewShareDetail() {
            uni.navigateTo({
                // url:"/pages/planning/share"
                url: '/pages/comm/kmlDetails',
                fail: (err) => {
                    console.log('跳转失败==', err);
                }
            });
        },
        openNews() {
            uni.navigateTo({
                url: '/pages/station/news',
                fail: (err) => {
                    console.log('跳转失败==', err);
                }
            });
        },
        href(url) {
            this.zz.href(url);
        },
		clear(){
			const res = uni.getStorageInfoSync()
			console.log(res.keys);
			console.log(res.currentSize);
			console.log(res.limitSize);
			
			let keep = [
				'__LAST_DCLOUD_APPID', '__ETAG__CNA__ID__', '__DC_STAT_UUID', '__package_info__',
				'getui_appid', 'getui_cid', 'getui_session', 'getui_api_time', 'getui_regid', 'getui_deviceid',
				'210B33A_token', '210B33A_acc', 'sysInfo', 'clientInfo', 'cur_deptId', 'sys_dept', 'mbStyle',
				'sys_nav_cps', 'user_scan_log', 'sync_task', 'sync_files', 'tempfiles', 'nav_local_rec'
				]
			
			for (let k of res.keys) {
				if(!keep.includes(k)) {
					console.log('removeStorageSync:',k);
					uni.removeStorageSync(k)
				}
			}
			this.zz.init()
		},
        creatQrcode() {
            this.$refs.qrcode._makeCode();
        },
		
		
		async list_rec(){
			let list = await this.zz.req({$url:'/user/rec/list'})
			for (let s of list) {
				// if(s.stopTime<0) s.stopTime -= s.stopTime
				// delete s.duration
				// await this.zz.req({$url:'/user/rec/set',...s}) 
			}
		},
		async del_rec(_id){
			let e = await this.zz.req({$url:'/user/rec/delete', _id})
			console.log(e);
		},
		async reset(){
			let res = await this.zz.req({$url:'/public/zz/test'})
			console.log(res);
		},
		async delredis(){
			let res = await this.zz.req({$url:'/public/zz/removeRedis'})
			console.log(res);
		},
		addImage(e) {
			console.log('addImage',e);
			
			this.zz.upload(e[0])
		},
		
		
		delImage(i) {
			console.log('addImage',i);
		},
		
        // 添加图标
        setIcon() {
            let that = this;
            uni.chooseImage({
                count: 1, //默认9
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album'], //从相册选择
                success: function (res) {
                    that.icon = res.tempFilePaths[0];
                    console.log(res.tempFilePaths[0]);
                    setTimeout(() => {
                        that.creatQrcode();
                    }, 100);
                    // console.log(res.tempFilePaths);
                }
            });
        }
    }
};
</script>
<style>
</style>
