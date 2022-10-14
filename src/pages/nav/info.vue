<template>
<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsblue">
            <block slot="content">数据统计</block>
            <block slot="right">
                <view class="padding-right">
                    <button class="cu-btn bg-gray text-xl" @click="close"><text>地图</text></button>
                </view>
            </block>
        </cu-custom>
		<block v-if="rec">
			<data-swiper :dataList="dataList1"></data-swiper>
			<data-swiper :dataList="dataList2"></data-swiper>
			<data-swiper :dataList="dataList3"></data-swiper>
			<data-swiper :dataList="dataList4"></data-swiper>
		</block>
    </view>
</template>

<script>
import { trans } from '@/comm/geotools'
import dataSwiper from './components/dataSwiper'

export default {
    components: { dataSwiper },
    data() {
        return {
            tim: {},
            rec: null
        };
    },
	computed: {
		dataList1() {
			let r = this.rec
			return [
		        {
		            title: '里程',  // 当前的距离
		            item: (r.info.len / 1000).toFixed(2),
		            unit: 'km'
		        },
		        {
		            title: '均速',
		            item: (r.info.len / ((this.zz.now() - r.startTime - r.stopTime) % (1000 * 60 * 60)) / (1000 * 60)).toFixed(2),
		            unit: 'km/h'
		        }
		    ]
		},
		dataList2() {
			let r = this.rec
			return [
                {
                    title: '当前海拔',
                    item: r.coord[r.coord.length-1][2],
                    unit: 'm'
                },
                {
                    title: '累计海拔',
                    item: `⇡${r.info.up}⇣${r.info.down}`,
                    unit: 'm'
                },
                {
                    title: '最高最低',
                    item: `⩑${r.info.top}⩒${r.info.bottom}`,
                    unit: 'm'
                }
            ]
		},
		dataList3(){
			let t = this.tim
			return [
				{
				    title: '运动时长',
				    item: (t.H > 9 ? t.H : '0' + t.H) + ':' + (t.M > 9 ? t.M : '0' + t.M) + ':' + (t.S > 9 ? t.S : '0' + t.S),
				},
				{
				    title: '暂停时间',
				    item: this.zz.formatDuring(this.rec.stopTime)
				}
			]
		},
		dataList4(){
			if(this.rec.coord.length) {
				let c = this.rec.coord[this.rec.coord.length-1],
					g = trans(c, 'gcj02towgs84')
				return [
					{
					    title: '兴趣点',
					    item: `${this.rec.point.length}`,
						unit: '个'
					},
					{
					    title: '当前位置',
					    item: `${g[0]},${g[1]}`,
						unit: 'gcj02',
						copy: true
					},
					{
					    title: '当前位置',
					    item: `${c[0]},${c[1]}`,
						unit: 'wgs84',
						copy: true
					}
				]
			} else {
				return []
			}
		}
	},
    onLoad() {
        let pages = getCurrentPages(); //获取所有页面栈实例列表
        let prevPage = pages[pages.length - 2]; //上一页页面实例
		this.rec = prevPage.$vm.rec
		this.tim = prevPage.$vm.tim
    },
    methods: {
        close() { uni.navigateBack() }
    }
};
</script>
