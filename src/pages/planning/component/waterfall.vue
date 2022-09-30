<template>
    <view class="container">
        <tui-waterfall :list-data="listData" :type="2" :page-size="10">
            <!-- #ifndef APP-PLUS || H5 -->
            <template slot="left" slot-scope="{ entity }">
                <zz-trail-item :entity="entity" />
            </template>
            <template slot="right" slot-scope="{ entity }">
                <zz-trail-item :entity="entity" />
            </template>
            <!-- #endif -->

            <!-- #ifdef APP-PLUS || H5 -->
            <template #left="slotProps">
                <zz-trail-item :entity="slotProps.entity" />
            </template>
            <template #right="sp">
                <zz-trail-item :entity="sp.entity" />
            </template>
            <!-- #endif -->
        </tui-waterfall>
        <!--加载loadding-->
        <tui-loadmore v-if="loadding" :index="3" type="red" />
        <!-- <tui-nomore v-if="!pullUpOn" backgroundColor="#f7f7f7"></tui-nomore> -->
        <!--加载loadding-->
    </view>
</template>

<script>
export default {
    data() {
        return {
            pageIndex: 1,
            loadding: false,
            pullUpOn: true,
            listData: [{
                img: 'https://thorui.cn/images/mall/product/1.jpg',
                name: '欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜 30ml（欧莱雅彩妆 BB霜 粉BB 遮瑕疵 隔离）',
                sale: 599,
                factory: 899,
                payNum: 2342
            },
            {
                img: 'https://thorui.cn/images/mall/product/2.jpg',
                name: '德国DMK进口牛奶',
                sale: 29,
                factory: 69,
                payNum: 999
            },
            {
                img: 'https://thorui.cn/images/mall/product/3.jpg',
                name: '【第2支1元】柔色尽情丝柔口红唇膏女士不易掉色保湿滋润防水 珊瑚红',
                sale: 299,
                factory: 699,
                payNum: 666
            },
            {
                img: 'https://thorui.cn/images/mall/product/4.jpg',
                name: '百雀羚套装女补水保湿护肤品',
                sale: 1599,
                factory: 2899,
                payNum: 236
            },
            {
                img: 'https://thorui.cn/images/mall/product/5.jpg',
                name: '百草味 肉干肉脯 休闲零食 靖江精制猪肉脯200g/袋',
                sale: 599,
                factory: 899,
                payNum: 2399
            },
            {
                img: 'https://thorui.cn/images/mall/product/6.jpg',
                name: '短袖睡衣女夏季薄款休闲家居服短裤套装女可爱韩版清新学生两件套 短袖粉色长颈鹿 M码75-95斤',
                sale: 599,
                factory: 899,
                payNum: 2399
            },
            {
                img: 'https://thorui.cn/images/mall/product/1.jpg',
                name: '欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜',
                sale: 599,
                factory: 899,
                payNum: 2342
            },
            {
                img: 'https://thorui.cn/images/mall/product/2.jpg',
                name: '德国DMK进口牛奶',
                sale: 29,
                factory: 69,
                payNum: 999
            },
            {
                img: 'https://thorui.cn/images/mall/product/3.jpg',
                name: '【第2支1元】柔色尽情丝柔口红唇膏女士不易掉色保湿滋润防水 珊瑚红',
                sale: 299,
                factory: 699,
                payNum: 666
            },
            {
                img: 'https://thorui.cn/images/mall/product/4.jpg',
                name: '百雀羚套装女补水保湿护肤品',
                sale: 1599,
                factory: 2899,
                payNum: 236
            }
            ]
        };
    },
    methods: {

    },
    onReachBottom: function () {
        if (!this.pullUpOn) return;
        this.loadding = true;
        if (this.pageIndex == 4) {
            this.loadding = false;
            this.pullUpOn = false;
        } else {
            let loadData = JSON.parse(JSON.stringify(this.listData));
            loadData = loadData.splice(0, 10);
            if (this.pageIndex == 1) {
                loadData = loadData.reverse();
            }
            this.listData = this.listData.concat(loadData);
            this.pageIndex = this.pageIndex + 1;
            this.loadding = false;
        }
    }
};
</script>

<style>
.container {
    padding-bottom: 40rpx;
}
</style>
