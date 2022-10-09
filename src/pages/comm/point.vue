<template>
	<!-- 指引柱详情 -->
	<view>
		<!-- #ifndef APP-PLUS -->
		<page-meta :enable-pull-down-refresh="!modal" :page-style="'overflow:'+(modal?'hidden':'visible')"></page-meta>
		<!-- #endif -->
		
		<cu-custom :isBack="true" bgColor="bg-gradual-blue">
			<block slot="content">{{ dict.prop[pm.t2].text +'详情' }}</block>
			<!-- <block slot="right">
				<button class="cu-btn xs line-white round shadow" @tap="log">
					<text class="cuIcon-search"></text>
					<text class="text-sm">日志</text>
				</button>
			</block> -->
		</cu-custom>

		<block v-if="cur">
			<zz-map :cur="cur" :line="kml.t1" :winH="380" @mapDone="mapDone"></zz-map>
			<zz-kml-nav :kml="{place: pm.coord}" :refKml="refKml"></zz-kml-nav>
			
			<template v-if="kml.t2.length>1">
				<scroll-view scroll-x class="solid padding-tb-sm" scroll-with-animation :scroll-left="scrollLeft">
					<view class="flex ">
						<block v-for="(t2, i) in kml.t2" :key="i">
							<view class="cu-item padding-xs solid light" :class="(idx==i?'bg-blue':'')" :data-id="i" @tap="active">
								<view class="cu-avatar avt" :style="'background-color:'+(idx==i?'#66b8ff':'#fcfcfc')+';background-image:url('+icon[t2.t2]+')'"></view>
								<view class="text-center text-df">
									<view class="text-dark" :class="'text-'+(idx==i?'bold':'')">{{t2.sn||t2.name}}</view>
									<view class="text-grey text-xs">{{dict.prop[t2.t2].text}}</view>
									<text class="cuIcon-pic text-grey" v-if="t2.imgs.length">{{ t2.imgs.length }}</text>
									<text class="cuIcon-record text-grey" v-if="t2.video"></text>
								</view>
							</view>
						</block>
					</view>
				</scroll-view>
			</template>

			<view class="cu-form-group solid-top" v-if="pm.sn">
				<view class="title text-grey">编号</view>
				<input disabled :value="pm.sn"/>
			</view>
			<view class="cu-form-group" v-if="pm.name">
				<view class="title text-grey">名称</view>
				<input disabled :value="pm.name||'未命名'"/>
			</view>

			<view class="cu-form-group">
				<view class="title text-grey">创建时间</view>
				<input disabled :value="pm.curTime||pm.createTime||pm.time"/>
			</view>

			<view class="cu-form-group flex justify-start" v-if="pm.desc">
				<view class="title text-grey">备注说明</view>
				<view>{{ pm.desc }}</view>
			</view>
			
			<block v-if="pm.weather">
				<view class="flex flex-direction align-center margin-top text-sm">
					<text class="text-center text-ftorange">
						当前气象：{{pm.weather.weather+' '+ pm.weather.temperature+'° 湿度'+pm.weather.humidity+'% ' + pm.weather.winddirection+'风 '+ pm.weather.windpower+'级'}}
					</text>
					<text class="text-center text-gray margin-top-xs">
						更新时间：{{pm.weather.reporttime}}
					</text>
				</view>
			</block>
			
			
			<block v-if="pm.draw">
				<!-- <view class="cu-form-group">
					<view class="title text-grey">设计稿</view>
				</view> -->
				<view class="flex justify-center bg-white" @tap="viewImage(0, [pm.draw])"><image :src="pm.draw" mode="widthFix" /></view>
			</block>
			<block v-else>
				<block v-if="pm.curDrect">
					<zz-direction :targets="pm.direction" :cur="pm.curDrect"></zz-direction></block>
				</block>
			</block>
			
			<block v-if="pm.imgs&&pm.imgs.length">
				<!-- <view class="cu-form-group">
					<view class="title text-grey">照片</view>
					<input v-if="pm.imgs.length == 0" disabled :value="'无...'"/>
				</view> -->
				<view v-for="(url, i) in pm.imgs" :key="i">
					<view class="cu-card case no-card">
						<view class="cu-item shadow">
							<view class="image" @tap="viewImage(i, pm.imgs)"><image :src="url" mode="widthFix" /></view>
						</view>
					</view>
				</view>
			</block>
			<zz-video v-if="pm.video" :video="pm.video"></zz-video>
			
			<view v-if="log40">
				<view class="cu-form-group">
					<view class="title text-grey">安装位照片</view>
					<input/>
				</view>
				<view v-for="(url, i) in log40.imgs" :key="9999+i">
					<view class="cu-card case no-card">
						<view class="cu-item shadow">
							<view class="image" @tap="viewImage(i, log40.imgs)"><image :src="url" mode="widthFix" /></view>
						</view>
					</view>
				</view>
			</view>
			
		</block>
		
		<block v-if="pm.logs">
			<view class="padding-sm flex flex-wrap justify-center">
				<view class="basis-sm radius">
					<button class="cu-btn block line-orange lg" @click="log">日 志</button>
				</view>
			</view>
		</block>
		<view class="padding-tb-sm"></view>
		
		<!-- 日志 -->
		<view class="cu-modal" :class="modal? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">日志</view>
					<view class="action" @tap="modal = false">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<block v-if="pm.logs">
					<view class="padding-xl">
						<zz-log :list="pm.logs" :title="false"></zz-log>
					</view>
				</block>
				<block v-else>
					<tui-loadmore :index="3" type="green"></tui-loadmore>
				</block>
			</view>
		</view>
		
		<tui-scroll-top :scrollTop="scrolled"></tui-scroll-top>
		
		<tui-footer class="solid-top" :copyright="bd.sys.footer.content" :fixed="false" :navigate="bd.sys.footer.navigate"></tui-footer>
	</view>
</template>

<script>
import icon from '@/comm/libs/icon.js'

export default {
	data() {
		return {
			icon,
			dict: uni.getStorageSync('sys_dict'),
			modal:false,
			scrolled: 0,
			
			log40:null,
			
			idx: -1,
			cur: null,
			pm: {},
			kml: {},
			refKml: {},
			
			scrollLeft: 0
		};
	},
	onLoad({v}) {
		let { kml, refKml, idx } = this.zz.getParam(v)
		this.kml = kml
		this.idx = idx
		this.scrollLeft = (idx - 1) * 60
		this.init()
		
		if(refKml) setTimeout(()=> {this.refKml = refKml}, 4000)
	},
	methods: {
		async init() {
			let kml = this.kml,
				pm = this.kml.t2[this.idx]
			
			this.cur = this.zz.clone(pm)
			this.pm = pm
			
			let code = kml.deptId||kml.departmentId
			if(!code) {
				await this.zz.reGeo(pm.coord).then(e=>{
					code = e.addressComponent.adcode
					this.$set(pm, 'addr', e.formatted_address)
				})
			}
			if(!pm.weather) {
				this.zz.weatherInfo(code,'').then(x=>{
					this.$set(pm, 'weather', x.lives[0])
				})
			}
			
			if(kml.type==99&&pm.sn&&!pm.logs) {
				// this.log32 = null
				this.log40 = null
				this.zz.req({ $url: 'public/layLog/list', pmId: pm._id }).then(list=>{
					pm.logs = list
					// this.log32 = list.find(e=>e.status==32)
					this.log40 = list.find(e=>e.status==40)
				})
			}
		},
		active(e) {
			this.idx = e.currentTarget.dataset.id
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			this.init()
		},
		
		mapDone(){ setTimeout(()=>{ this.init() }, 4444) },
		viewImage(i,p) { this.zz.viewIMG(p,i) },
		log(){ this.modal = true }
	},
	onPageScroll: function(e) {
		this.scrolled = e.scrollTop
	}
};
</script>

<style>
.cu-form-group {
	background-color: #fcfcfc;
	padding: 1rpx 30rpx;
	display: flex;
	align-items: center;
	min-height: 80rpx;
	justify-content: flex-start;
}
.cu-form-group .title {
	min-width: calc(4em + 15px);
}
.avt {
	width: 100rpx;
	height: 100rpx;
	
	background-size: contain;
	background-repeat: no-repeat;
}
</style>
