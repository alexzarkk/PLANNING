<template>
    <!-- 
    name:  生成海报的组件
    配置化生成海报图片
 -->
    <view>
        <lPainter isRenderImage type="2d" :board="base" ref="painter" custom-style="position: fixed; left: 200%"></lPainter>
    </view>
</template>
<script>
import lPainter from '@/uni_modules/lime-painter/components/lime-painter/';

import { config1 } from './poster_conf'
console.log("获取到的配置", config1)
export default {
    components: {
        lPainter
    },
    props: {
        posterObj: {
            type: Object,
            default: () => {
                return {

                }
            }
        }
    },
    data() {
        return {
            base: {
                // 海报配置
                width: '750rpx',
                height: '1033rpx'
            },
            poster: ''  // 生成以后的临时图片
        };
    },
    mounted() {
        // this.loadData();
    },
    methods: {
        async loadData() {
            console.log("loadData=================")
            this.base = {
                "width": "750rpx",
                "height": "953rpx",
                "views": [{  // 背景图
                    "type": "image",
                    "src": "https://s1.ax1x.com/2022/08/26/v2qRwq.jpg",
                    // "src": "https://zzxb.oss-cn-shanghai.aliyuncs.com/fhty/edef1439-12bc-4674-a538-48b9410ff150.jpg",
                    "css": { "left": "0rpx", "top": "0rpx", "width": "750rpx", "height": "953rpx" }
                }]
            }
            console.log("config1===============", config1)
            config1.forEach((item, index) => {
                let baseItem = null
                if (item.type === 'text') {
                    baseItem = {
                        css: {
                            top: item.top * 2 + 'rpx',
                            left: item.left * 2 + 'rpx',
                            height: item.height * 2 + 'rpx',
                            width: item.width * 2 + 'rpx',
                            color: item.color,
                            fontSize: item.fontSize * 2 + 'rpx',
                            fontWeight: item.fontWeight,
                            textAlign: item.textAlign
                        },
                        text: item.content,
                        // text: item[fieldMap.get(item.elementField)] || '',
                        type: 'text'
                    }
                }
                if (item.type === 'image') {
                    baseItem = {
                        css: {
                            top: item.top * 2 + 'rpx',
                            left: item.left * 2 + 'rpx',
                            height: item.height * 2 + 'rpx',
                            width: item.width * 2 + 'rpx',
                            radius: '20rpx'
                        },
                        src: item.src || 'https://s1.ax1x.com/2022/06/24/jircW9.jpg',
                        // text: item[fieldMap.get(item.elementField)] || '',
                        type: 'image'
                    }
                }

                if (item.type === 'qrCode') {
                    baseItem = {
                        css: {
                            top: item.top * 2 + 'rpx',
                            left: item.left * 2 + 'rpx',
                            height: item.height * 2 + 'rpx',
                            width: item.width * 2 + 'rpx',
                            color: '#1989fa',
                            backgroundColor: 'rgba(25,137,250,.1)',
                            border: '20rpx solid rgba(25,137,250,.1)'
                        },
                        text: '二维码',
                        // text: item[fieldMap.get(item.elementField)] || '',
                        type: 'qrcode'
                    }
                }
                this.base.views[index + 1] = baseItem;
            })


            console.log("添加配置到base", this.base)
        },
        progress(event) {
            console.log("进度=======", event)
        },
        delay(time = 200) {
            return new Promise(function (resolve, reject) {
                const timer = setTimeout(() => {
                    clearTimeout(timer);
                    resolve();
                }, time);
            })
        },
        async getCanvas() {
            uni.showLoading({ title: '生成海报中...' });
            try {
                const painter = this.$refs.painter;
                await painter.render({});
                await this.delay(100);
                await painter.render(this.base);
                console.log("配置", this.base)
                await this.delay(800);
                // 支持通过调用canvasToTempFilePath方法传入参数 调取生成图片
                const res = await painter.canvasToTempFilePath();
                uni.hideLoading();
                this.poster = res.tempFilePath
                this.$emit("complete", this.poster)
                // await uni.previewImage({
                //     urls: [res.tempFilePath],
                //     current: 0,
                //     success: res => {
                //     },
                //     fail: err => {
                //     }
                // });
            } catch (error) {
                uni.showToast({ title: '证书下载错误！', icon: 'none' });
                console.log('证书下载出错：', error);
            }
            uni.hideLoading();
        },
        async previewImage() {
            await uni.previewImage({
                urls: [this.poster],
                current: 0,
                success: res => {
                },
                fail: err => {
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
