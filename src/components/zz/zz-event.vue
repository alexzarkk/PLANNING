<template>
	<view>
		<!-- <view class="padding-xs"></view> -->
		<!-- v-if="recordList.length>0" -->
<view>
	<block v-for="(item, idx) in kml" :key="idx">
		<view class="cu-card radius solid padding-tb-xs padding-lr">
			<!-- <view class="padding-lr bg-img shadow-blur" :style="[{backgroundImage:'url('+item.pic+')'}]" @tap="detail(item)"> -->
			<view class="padding-lr bg-img shadow-blur" :style="[{ backgroundImage: 'url(' + (item.uploaded?bg['green']:bg[pic]) + ')' }]" @tap="detail(item)">
				<view v-if="mine" class="mybadge-l" :class="getColor(item.status)">{{getName(item.status)}}</view>
				<view v-else class="mybadge-l bg-grey">已完成：{{ zz.math(Math.random()*1233,0) }}</view>
				
				<block v-if="tag=='phone'"><view class="mybadge bg-56blue" v-if="item.collectortel">{{ item.collectortel }}</view></block>
				<block v-if="tag=='status'"><view class="mybadge bg-56blue">{{ item.uploaded?'已上传':'未上传' }}</view></block>
				
				<view class="cardTitle">{{ item.name }}</view>
				<view class="padding-lr-xs">
					<text class="text-df text-black">采集时间：{{ item.createTime}}</text>
				</view>
				<view class="padding-xs">
					<text class="text-df text-black">说明：{{ item.desc }}</text>
				</view>
			</view>
			<view class="solid" :class="current == idx ? 'bg-white' : ''">
				<tui-collapse :hdBgColor="'none'" :index="idx" :current="current" @click="change3">
					<template v-slot:title>
						<tui-list-cell :backgroundColor="'none'" :hover="true">
							<view class="text-grey text-cut flex justify-between" style="width: 90%;">
								<view class="flex flex--direction">
									<view>
										<text class="">长度：</text>
										<text class="text-orange">{{ item.kml.lineNum }}</text>
									</view>
									<view class="padding-left-sm">
										<text class="">打卡点：</text>
										<text class="text-orange">{{ item.kml.pointNum }}</text>
									</view>
									<view class="padding-left-sm">
										<text class="">照片：</text>
										<text class="text-orange">{{ item.imgs.length }}</text>
									</view>
								</view>
								<view>...详情</view>
							</view>
						</tui-list-cell>
					</template>
					<template v-slot:content>
						<block v-if="!mdone">
							<view class="cu-bar"><tui-loadmore :fixed="false" :index="3" type="green"></tui-loadmore></view>
						</block>
						<zz-map v-if="current == idx" 
							@onMap="onMap"
							@mapDone="mapDone"
							:line="item.kml.lines"
							:point="item.kml.points"
							:winH="240"></zz-map>
						
						<block v-if="mdone">
							<view class="cu-bar">
								<view class="action">
									<text class="cuIcon-fork text-blue"></text>
									路线
								</view>
								<view class="action" v-if="downloadble">
									<button class="cu-btn bg-green shadow round" @tap="download(item)">
										轨迹下载
									</button>
								</view>
								<!-- <view class="action" v-if="item.imgs.length > 0">
									<button class="cu-btn bg-green shadow round" @tap="imgView([idx, 0])">
										<text class="text-white padding-lr-xs">{{ item.imgs.length }}</text>
										照片
									</button>
								</view> -->
							</view>
	
							<view class="cu-list ">
								<!-- <block v-for="(line, idxx) in item.children[0].children" :key="idxx"> -->
									<view class="cu-item solid">
										<view class="content margin-left padding-tb-xs">
											<view>
												<text class="cuIcon-link margin-lr-sm"></text>
												{{ item.kml.name }}
											</view>
											<view class="text-gray text-sm">
												<text class="cuIcon-infofill "></text>
												长度
												<text class="text-orange">{{ item.kml.len }}</text>
												<text class="margin-right-xs">m</text>
												海拔
												<text class="cuIcon-top text-orange">{{ item.kml.top }}</text>
												<text class="cuIcon-down text-orange">{{ item.kml.bottom }}</text>
												<text class="margin-right-xs">m</text>
												累计 ↑
												<text class="text-orange">{{ item.kml.up }}</text>
												↓
												<text class="text-orange">{{ item.kml.down }}</text>
												<text class="margin-right-xs">m</text>
											</view>
											<view class="text-gray text-sm">
												上坡距离
												<text class="text-orange">{{ item.kml.upLen }}</text>
												<text class="margin-right-xs">m</text>
												<text class="cuIcon-usefull"></text>
												<text class="text-orange">{{ item.kml.upSlop }}</text>
												% 下坡距离
												<text class="text-orange">{{ item.kml.downLen }}</text>
												<text class="margin-right-xs">m</text>
												<text class="cuIcon-usefull"></text>
												<text class="text-orange">{{ item.kml.downSlop }}</text>
												%
											</view>
										</view>
									</view>
								<!-- </block> -->
							</view>
	
							<view class="cu-bar bg-white">
								<view class="action">
									<text class="cuIcon-location text-blue"></text>
									打卡点
								</view>
								<!-- <view class="action" v-if="item.imgs.length > 0">
									<button class="cu-btn bg-green shadow round" @tap="imgView([idx, 1])">
										<text class="text-white padding-lr-xs">{{ item.imgs.length }}</text>
										照片
									</button>
								</view> -->
							</view>
	
							<view class="cu-list menu-avatar">
								<block v-for="(pm, idxx) in item.kml.points" :key="idxx">
									<block v-if="pm.t1==2">
										<view class="cu-item" @click="pointInfo(item, pm)">
											<view class="cu-avatar lg" :style="'background-image:url(' + ('../.'+dict.prop[pm.t2].icon.iconUrl) + ');'"></view>
											<view class="content">
												<view class="text-dark">{{ dict.prop[pm.t2].name }}</view>
												<view class="text-gray text-sm flex">
													<view class="text-cut">
														<text class="cuIcon-infofill text-red  margin-right-xs"></text>
														{{ (pm.name == '' ? '未命名坐标' : pm.name) + ' ' + (!pm.desc ? '' : pm.desc) }}
													</view>
												</view>
											</view>
											<view class="action">
												<block v-if="pm.imgs.length > 0">
													<text class="cuIcon-pic text-grey">{{ pm.imgs.length }}</text>
												</block>
												<text class="cuIcon-right text-grey"></text>
											</view>
										</view>
									</block>
								</block>
							</view>
						</block>
					</template>
				</tui-collapse>
			</view>
		</view>
	</block>
</view>
	</view>
</template>

<script>
import png from '@/comm/libs/png';
export default {
	name: 'zzEvent',
	props: {
		kml: {
			type: Array,
			default() {
				return [];
			}
		},
		//背景照片
		pic: {
			type: String,
			default: 'green'
		},
		//轨迹下载
		downloadble: {
			type: Boolean,
			default: true
		},
		//右上角
		tag: {
			type: String,
			default: 'phone'
		},
		mine:{
			type:Boolean,
			default:false
		}
	},
	data() {
		return {
			mdone: true,
			current: -1,
			dict: uni.getStorageSync('sys_dict'),
			bg: {
				dark: png.bgDark,
				blue: png.bgBlue,
				green: png.bgGreen
			},
			recordList:[],
			statusMap:null
		};
	},
	watch:{
		// kml(oldValue){
		// 	this.recordList = oldValue
		// 	this.recordList.forEach(res=>{
		// 		res.mineObj = this.statusMap.get(res.status)
		// 	})
		// }
	},
	created(){
		
	},
	mounted() {
		// let map = new Map()
		// map.set(2,{colorClass:'bg-el-info',statusName:'待复核'})
		// map.set(6,{colorClass:'bg-el-warning',statusName:'待审核'})
		// map.set(10,{colorClass:'bg-el-success',statusName:'已审核'})
		// this.statusMap = map
		// this.recordList = this.kml
		// this.recordList.forEach(res=>{
		// 	res.mineObj = this.statusMap.get(res.status)
		// })
		// console.log(this.recordList[0].mineObj)
	},
	methods: {
		getColor(status){
			if(status === 2){ return 'bg-el-info'}
			if(status === 6){ return 'bg-el-warning'}
			if(status === 10){ return 'bg-el-success'}
		},
		getName(status){
			if(status === 2){ return '待复核'}
			if(status === 6){ return '待审核'}
			if(status === 10){ return '已审核'}
		},
		change3(e) {
			this.mdone = false
			this.current = this.current == e.index ? -1 : e.index;
		},
		imgView(i) {
			uni.previewImage({
				urls: this.kml[i].imgs,
				current: 0
			});
		},
		pointInfo(kml, pm) {
			uni.setStorageSync('kml', kml);
			//未上传记录再次编辑
			if (!kml._id) return this.$emit('edit', pm);
			// 更新指引柱
			// if(pm.t2==29) { }
			uni.setStorageSync('placemark', pm);
			this.zz.href('/pages/mine/record/detail');
		},
		onMap(e) {
			// console.log('onMap -------------------', e);
		},
		mapDone(e) {
			// console.log('mapDone -------------------', e);
			this.mdone = e
		},
		detail(e) {
			this.current = -1;
			setTimeout(() => {
				this.$emit('click', e);
			}, 50);
		},
		download(kml) {
			this.zz.download(kml._id)
		}
	}
};
</script>

<style>
.cardTitle {
	color: #282828;
	padding: 56upx 20upx 10upx 20upx;
	font-size: 36upx;
	font-weight: 500;
	transform: skew(-10deg, 0deg);
	position: relative;
	text-shadow: 0px 0px 6upx rgba(255, 255, 255, 0.3);
}

.mybadge-l {
	/* border-radius: 200upx; */
	position: absolute;
	top: 0upx;
	left: -0upx;
	font-size: 26upx;
	padding: 0upx 10upx;
	height: 38upx;
	color: #ffffff;
}

.mybadge {
	/* border-radius: 200upx; */
	position: absolute;
	top: 0upx;
	right: -0upx;
	font-size: 26upx;
	padding: 0upx 10upx;
	height: 38upx;
	color: #ffffff;
}
</style>
