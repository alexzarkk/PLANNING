<template>
    <page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">设置</block>
        </cu-custom>
        <view class="container">
            <tui-list-view margin-top="20rpx">
                <tui-list-cell arrow @click="openPage('/pages/comm/about')">
                    <view class="justify-between flex padding-right align-center"><text class="">关于环浙步道</text></view>
                </tui-list-cell>
            </tui-list-view>
        </view>
    </view>
</template>

<script>
import comm from '@/comm/comm'
export default {
    data() {
        return {
            user: null,
            isLogoutShow: false,
            fileSizeString: ''
        };
    },
    async onLoad() {
        this.user = this.zz.getAcc()
        this.formatSize()
    },
    methods: {
        goDelAccount() {
            uni.navigateTo({
                url: '/pages/comm/account/deleteAccount',
                animationType: 'slide-in-bottom',
                animationDuration: 300
            })
        },
        openPage(url) {
            this.zz.href(url);
        },
        // 退出登录
        logout() {
            this.isLogoutShow = false
            this.zz.req({ $url: '/admin/comm/logout' }).then(e => {
                this.zz.logOut()
                this.zz.href('/pages/index/index')
            })
        },
        // 计算缓存
        formatSize() {
            const res = uni.getStorageInfoSync()
            let size = res.currentSize
            if (size < 1048576) {
                this.fileSizeString = size + "KB";
            } else if (size < 1073741824) {
                this.fileSizeString = (size / 1048576).toFixed(2) + "MB"
            } else {
                this.fileSizeString = (size / 1073741824).toFixed(2) + "GB"
            }
        },
        async clear() {
            const res = uni.getStorageInfoSync()

            //系统保留缓存
            let keep = [
                '__LAST_DCLOUD_APPID', '__ETAG__CNA__ID__', '__DC_STAT_UUID', '__package_info__',
                'getui_appid', 'getui_cid', 'getui_session', 'getui_api_time', 'getui_regid', 'getui_deviceid',
                '210B33A_token', '210B33A_acc', 'sysInfo', 'clientInfo', 'mbStyle', 'cur_deptId', 'sys_dept', 'sys_dict', 'trailData',

                'sys_nav_cps', 'user_scan_log', 'sync_task', 'sync_files', 'tempfiles', 'nav_local_rec'
            ]

            for (let k of res.keys) {
                if (!keep.includes(k)) {
                    console.log('removeStorageSync:', k)
                    uni.removeStorageSync(k)
                }
            }
            this.formatSize()

            // #ifdef APP-PLUS
            comm.on()
            // #endif

            // #ifndef APP-PLUS
            comm.on([121, 29])
            // #endif
            // this.zz.req({ $url: 'public/trail/list', deptId: ['330213'], status: 10, type: 60 }).then(list => {
            //     uni.setStorageSync('trailData', { trailData: list })
            // })
        },
        // 清除缓存
        clearCache() {
            let that = this;
            let os = plus.os.name;
            if (os == 'Android') {
                let main = plus.android.runtimeMainActivity();
                let sdRoot = main.getCacheDir();
                let files = plus.android.invoke(sdRoot, "listFiles");
                let len = files.length;
                for (let i = 0; i < len; i++) {
                    let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
                    plus.io.resolveLocalFileSystemURL(filePath, function (entry) {
                        if (entry.isDirectory) {
                            entry.removeRecursively(function (entry) { //递归删除其下的所有文件及子目录  
                                uni.showToast({
                                    title: '缓存清理完成',
                                    duration: 2000
                                });
                                that.formatSize(); // 重新计算缓存  
                            }, function (e) {
                                console.log(e.message)
                            });
                        } else {
                            entry.remove();
                        }
                    }, function (e) {
                        console.log('文件路径读取失败')
                    });
                }
            } else { // ios暂时未找到清理缓存的方法，以下是官方提供的方法，但是无效，会报错  
                plus.cache.clear(function () {
                    uni.showToast({
                        title: '缓存清理完成',
                        duration: 2000
                    });
                    that.formatSize();
                });
            }
        }

    }
};
</script>

<style lang="scss" scoped></style>
