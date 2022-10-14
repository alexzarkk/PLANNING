<template>
<page-meta root-font-size="10px"></page-meta>
	<view>
		<!-- #ifndef APP-PLUS -->
		<view class="fixed text-white" :style="'opacity:' + (1 - headOpacity)">
			<cu-custom :isBack="true">
				<block slot="backText"></block>
				<block slot="content"></block>
			</cu-custom>
		</view>
		<view class="fixed" :style="'opacity:' + headOpacity">
			<cu-custom :isBack="true" :bgColor="'bg-gradual-' + event.color">
				<block slot="backText"></block>
				<block slot="content">详情信息</block>
			</cu-custom>
		</view>
		<!-- #endif -->

		<view>
			<view
				class="bg-img bg-mask flex align-center"
				:style="'background-image: url(' + event.cover.url + ');height: ' + WinWidth * 0.7 + 'px;'"
				@tap="imgView(event.cover.url)"
			>
				<view class="padding-xl text-white">
					<view class="margin-top padding-xs text-xl text-bold">{{ event.name }}</view>
					<view class="padding-xs text-lg">{{ event.slogan }}</view>
				</view>
			</view>
			<!-- 地区/活动类型 标签 -->
			<block>
				<view class="solid-bottom flex align-start bg-white">
					<view v-for="(item, index) in event.region" :key="index">
						<view class="bg-blue mybadge-left" :style="'left:' + index * 90 + 'rpx'">{{ item.value }}</view>
					</view>
				</view>
				<view class="solid-bottom flex align-start bg-white">
					<view v-for="(item, index) in event.type" :key="index">
						<view class="mybadge" :class="'bg-' + item.color" :style="'right:' + index * 90 + 'rpx'">{{ item.value }}</view>
					</view>
				</view>
			</block>

			<!-- 背景介绍 -->
			<block>
				<view class="cu-bar" :class="'bg-gradual-' + event.color">
					<view class="action">
						<text class="cuIcon-titles"></text>
						<text class="text-bold">背景介绍</text>
					</view>
				</view>
				<view class="margin-top-xs padding-lr">
					<view class="pre-line text-content padding-top-xs" v-for="(text, idx) in event.desc" :key="idx">{{ text }}</view>
				</view>
			</block>

			<!-- 进度信息 -->
			<block>
				<view class="margin-top-sm padding" :class="'bg-gradual-' + event.color">
					<view class=" bg-grey">
						<view class="margin-left-xs">
							<!-- <uni-countdown
								color="#ff015a"
								background-color="#ffffff"
								border-color="#000000"
								splitor-color="#ffffff"
								@timeup="timeup"
								:prename="event.timer.prename"
								:day="event.timer.dd"
								:hour="event.timer.hh"
								:minute="event.timer.mm"
								:second="event.timer.ss"
							></uni-countdown> -->
						</view>
					</view>
					<view class="padding flex text-center bg-orange light shadow">
						<view class="flex flex-sub flex-direction">
							<view class="text-xxl text-orange"><text class="cuIcon-time" :class="event.timer.toEnroll ? 'text-green' : 'text-gray'"></text></view>
							<text class="text-bold" :class="event.timer.toEnroll ? 'text-green' : 'text-gray'">报名开始</text>

							<view class="padding-top-xs">
								<text :class="event.timer.toEnroll ? 'text-green' : 'text-gray'">{{ event.startEnroll }}</text>
							</view>
						</view>
						<text class="cuIcon-right text-gray padding-top-xs"></text>
						<view class="flex flex-sub flex-direction">
							<view class="text-xxl text-orange"><text class="cuIcon-roundclose" :class="event.timer.toEndEnroll ? 'text-green' : 'text-gray'"></text></view>
							<text class="text-bold" :class="event.timer.toEndEnroll ? 'text-green' : 'text-gray'">报名结束</text>
							<view class="padding-top-xs">
								<text :class="event.timer.toEndEnroll ? 'text-green' : 'text-gray'">{{ event.endEnroll }}</text>
							</view>
						</view>
						<text class="cuIcon-right text-gray padding-top-xs"></text>
						<view class="flex flex-sub flex-direction">
							<view class="text-xxl text-orange"><text class="cuIcon-activity" :class="event.timer.toStart ? 'text-red' : 'text-gray'"></text></view>
							<text class="text-bold" :class="event.timer.toStart ? 'text-red' : 'text-gray'">{{ event.type[0].value }}日期</text>
							<view class="padding-top-xs">
								<text :class="event.timer.toStart ? 'text-red' : 'text-gray'">{{ event.eventDate }}</text>
							</view>
						</view>
					</view>
				</view>
			</block>

			<!-- 进度信息 -->
			<block>
				<view id="tvideo">
					<view class="cu-card case no-card" v-for="(item, index) in event.video" :key="index">
						<view class="padding-top-xs shadow">
							<view class="bg-video flex align-center" style="height: 422rpx;">
								<video
									id="myVideo"
									autoplay
									:src="item.url"
									:muted="ismute"
									:show-fullscreen-btn="true"
									:show-mute-btn="true"
									:show-play-btn="true"
									object-fit="cover"
								></video>
							</view>
						</view>
						<view class="padding-xs text-cut bg-white text-grey text-right" v-if="item.desc">{{ item.desc }}</view>
					</view>
				</view>
			</block>

			<view class="sticky-box margin-top light" :class="'bg-' + event.color" :style="[{ top: (customBar) + 'px' }]">
				<scroll-view class="nav text-center" scroll-x scroll-with-animation>
					<view class="cu-item" :class="item.sight ? 'cur text-bold text-red' : ''" v-for="(item, index) in tabList" :key="index" :id="item.id" @tap="moveTo">
						{{ item.name }}
					</view>
				</scroll-view>
			</view>

			<!-- 基本信息 -->
			<view id="tabto0">
				<view class="cu-bar" :class="'bg-gradual-' + event.color">
					<view class="action">
						<text class="cuIcon-titles"></text>
						<text class="text-bold">基本信息</text>
					</view>
				</view>
				<view class="cu-list menu sm-border">
					<view class="flex padding-sm justify-center align-center">
						<view class="action padding-lr">
							<text class="cuIcon-title" :class="'text-' + event.color"></text>
							<text class="text-black text-bold">{{ event.type[0].value }}名称</text>
						</view>
						<view class="flex-twice content">
							<text class="text-black">{{ event.name }}{{ event.name }}</text>
						</view>
					</view>
					<view class="flex padding-sm justify-center align-center">
						<view class="action padding-lr">
							<text class="cuIcon-title" :class="'text-' + event.color"></text>
							<text class="text-black text-bold">{{ event.type[0].value }}日期</text>
						</view>
						<view class="flex-twice content">
							<text class="text-black">{{ event.eventDate }}</text>
						</view>
					</view>
					<view class="flex padding-sm justify-center align-center">
						<view class="action padding-lr">
							<text class="cuIcon-title" :class="'text-' + event.color"></text>
							<text class="text-black text-bold">{{ event.type[0].value }}地点</text>
						</view>
						<view class="flex-twice content">
							<text class="text-black">{{ event.location.name }}</text>
						</view>
						<view class="action">
							<view class="text-orange text-sm" @tap="goLocation()">
								<button class="cu-btn round bg-orange shadow sm">
									<text class="cuIcon-forward margin-right-xs"></text>
									地图
								</button>
							</view>
						</view>
					</view>
					<view class="flex padding-sm justify-center align-center">
						<view class="action padding-lr">
							<text class="cuIcon-title" :class="'text-' + event.color"></text>
							<text class="text-black text-bold">人数规模</text>
						</view>
						<view class="flex-twice content">
							<text class="text-black">{{ event.total }}人</text>
						</view>
					</view>
				</view>

				<view class="cu-bar" :class="'bg-gradual-' + event.color">
					<view class="action">
						<text class="cuIcon-titles"></text>
						<text class="text-bold">组织机构</text>
					</view>
				</view>
				<view class="cu-list menu solid">
					<view class="flex padding-sm justify-center align-center" v-for="(o, idx) in event.org" :key="idx">
						<view class="action padding-lr">
							<text class="cuIcon-title" :class="'text-' + event.color"></text>
							<text class="text-black text-bold">{{ o.title }}</text>
						</view>
						<view class="content flex-twice flex flex-direction">
							<block v-for="(name, idx) in o.item" :key="idx">
								<text class="text-black">{{ name }}</text>
							</block>
						</view>
					</view>
				</view>
			</view>

			<!-- 地图数据 -->
			<view id="tabto1">
				<view class="cu-bar" :class="'bg-gradual-' + event.color">
					<view class="action">
						<text class="cuIcon-titles"></text>
						<text class="text-bold">线路地图</text>
					</view>
				</view>
				<zz-kml-map v-if="event.kml" :kml="event.kml" @kmlMap="kmlMap"></zz-kml-map>

				<view class="grid text-center col-1">
					<view class="bg-white">
						<!-- 线路数据 -->
						<view class="cu-list padding-lr">
							<view class="margin-top" v-for="(item, idx) in event.item" :key="idx">
								<view class="radius shadow shadow-blur light" :class="'bg-' + event.color">
									<view class="flex justify-start align-center padding-sm">
										<text class="cuIcon-title" :class="'text-' + event.color"></text>
										<text class="text-bold">线路数据</text>
									</view>
									<block>
										<view class="bg-white padding-xs left5" v-if="event.item.length > 1">
											<view class="flex solid-bottom  justify-center">
												<view class="text-bold text-underline" :class="'text-' + event.color">{{ item.name }}</view>
											</view>
										</view>
										<view class="cu-list grid col-3 radius padding-xs left5">
											<view>
												<view>
													<view>{{ item.dist / 1000 }}km</view>
													<view class="cuIcon-refresh"></view>
												</view>
												<text>距离长度</text>
											</view>
											<view>
												<view>
													<view>{{ item.upper }}m</view>
													<view class="cuIcon-top"></view>
												</view>
												<text>累计上升</text>
											</view>
											<view>
												<view>
													<view>{{ item.lower }}m</view>
													<view class="cuIcon-down"></view>
												</view>
												<text>累计下降</text>
											</view>
										</view>
									</block>
								</view>
							</view>
						</view>
						<view class="cu-list padding-lr">
							<view class="margin-bottom">
								<view class="radius shadow shadow-blur light" :class="'bg-' + event.color">
									<view class="flex justify-start align-center padding-sm">
										<text class="cuIcon-title" :class="'text-' + event.color"></text>
										<text class="text-bold">景观元素</text>
									</view>
									<view class="bg-white padding-xs left5">
										<view class="flex flex-wrap solid-bottom">
											<view class="padding-xs" v-for="(item, index) in event.element" :key="index">
												<view class="padding-sm cu-tag round" :class="'bg-' + item.color">{{ item.value }}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 组别信息 -->
			<view id="tabto2">
				<view class="cu-bar" :class="'bg-gradual-' + event.color">
					<view class="action">
						<text class="cuIcon-titles"></text>
						<text class="text-bold">组别信息</text>
					</view>
				</view>
				<view class="cu-list padding-lr">
					<view class="margin-top" v-for="(item, idx) in event.item" :key="idx">
						<view class="radius shadow shadow-blur light" :class="'bg-' + event.color">
							<view class="flex justify-between padding-tb-sm padding-lr">
								<view class="content flex-twice">
									<view>
										<text class="cuIcon-title margin-right-xs text-underline" :class="'text-' + event.color"></text>
										{{ item.name }}
									</view>
									<view class="text-gray text-sm">
										<text class="cuIcon-info margin-right-xs" :class="'text-' + event.color"></text>
										{{ item.comment }}
									</view>
								</view>
								<view class="action">
									<view>
										<text class="">报名费：</text>
										<text class="text-bold" :class="[item.price.cut > 0 ? 'text-gray text-through' : 'text-red', item.price.v > 0 ? 'text-price' : '']">
											{{ item.price.v }}
										</text>
									</view>
									<view v-if="item.price.cut > 0">
										<text class="text-red">{{ item.price.name }}：</text>
										<text class="text-price text-bold text-red">{{ item.price.cut }}</text>
									</view>
									<view class="text-gray text-sm" v-else>
										<text class=""></text>
										限{{ item.limit }}人
									</view>
								</view>
							</view>
							<block>
								<tui-collapse :index="idx" :current="item.current" @tap="change">
									<template v-slot:title>
										<view class="light padding-xs" :class="'bg-' + event.color">
											<tui-list-cell :hover="true">
												<view class="flex solid-bottom justify-center">
													<view class="content radius">
														<text class="cuIcon-upstage margin-right-xs" :class="'text-' + event.color"></text>
														<text class="text-bold" :class="'text-' + event.color">名次奖励</text>
													</view>
												</view>
											</tui-list-cell>
										</view>
									</template>
									<template v-slot:content>
										<view class="tui-content">
											<block v-if="item.reward.length > 0">
												<view class="cu-list menu sm-border radius left5">
													<view class="light padding-xs margin-top-xs solid" :class="'bg-' + event.color">
														<view class="flex justify-center p-xs mb-sm">
															<view class="flex-sub bg-gray padding-xs margin-xs radius"><view class="text-center">名次</view></view>
															<view class="flex-twice bg-gray padding-xs margin-xs radius"><view class="text-center">奖金</view></view>
															<view class="flex-treble bg-gray padding-xs margin-xs radius"><view class="text-center">奖励</view></view>
														</view>

														<view class="flex justify-center align-center p-xs mb-sm" v-for="(item, index) in item.reward" :key="index">
															<view class="flex-sub bg-white padding-xs margin-xs solid ">
																<view class="text-center text-bold ">{{ item.num }}</view>
															</view>
															<view class="flex-twice bg-white padding-xs margin-xs solid">
																<view class="text-center text-bold">{{ item.money }}</view>
															</view>
															<view class="flex-treble bg-white padding-xs margin-xs solid">
																<view class="text-center">{{ item.other }}</view>
															</view>
														</view>
													</view>
												</view>
											</block>
											<block v-else>
												<view class="cu-list menu sm-border radius left5">
													<view class="light padding-xs margin-top-xs solid" :class="'bg-' + event.color">
														<view class="flex justify-center p-xs mb-sm">
															<view class="flex-sub bg-white padding-xs margin-xs radius"><view class="text-center">未设置</view></view>
														</view>
													</view>
												</view>
											</block>
										</view>
									</template>
								</tui-collapse>
							</block>
						</view>
					</view>
				</view>
				<view class="margin-top"></view>
			</view>

			<!-- 纪念/宣传品 -->
			<view id="tabto3"><event-section :dataList="event.gift" :color="event.color" :title="'纪念/宣传品'"></event-section></view>

			<!-- 规程说明 -->
			<view id="tabto4"><event-section :dataList="event.rules" :color="event.color" :title="'规程说明'"></event-section></view>

			<!-- 提示信息 -->
			<view id="tabto5"><event-section :dataList="event.tips" :color="event.color" :title="'提示信息'"></event-section></view>

			<!-- 线路风景 -->
			<view id="tabto6"><event-section :dataList="event.pics" :color="event.color" :title="'线路照片'"></event-section></view>

			<view id="tabto7">
				<view class="cu-bar bg-gray solid-bottom margin-top">
					<view class="action">
						<text class="cuIcon-explore text-orange"></text>
						途径/周边 兴趣点介绍
					</view>
				</view>
				<!-- <poi-list :scrollY="scrolled" :dataList="poi" v-if="poi"></poi-list> -->
			</view>

			<view id="tabto8">
				<view class="cu-bar" :class="'bg-gradual-' + event.color">
					<view class="action">
						<text class="cuIcon-explore"></text>
						评论/留言
					</view>
				</view>
				<view class="cu-card dynamic no-card">
					<view class="cu-item shadow">
						<view class="cu-list menu-avatar">
							<view class="cu-item">
								<view class="cu-avatar round lg" :style="'background-image:url(' + basicdata.sys.logo + ');'" @tap="imgView(basicdata.sys.logo)"></view>
								<view class="content flex-sub">
									<view>小步</view>
									<view class="text-gray text-sm flex justify-between">2019年12月3日</view>
								</view>
							</view>
						</view>
						<view class="text-content">很好的一条线路，适合周末家庭出行！</view>
						<view class="text-gray text-sm text-right padding-sm">
							<text class="cuIcon-attentionfill margin-lr-xs"></text>
							10
							<text class="cuIcon-appreciatefill margin-lr-xs"></text>
							20
							<text class="cuIcon-messagefill margin-lr-xs"></text>
							30
						</view>

						<view class="cu-list menu-avatar comment solids-top">
							<view class="cu-item">
								<view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/img/champion/Morgana.png);"></view>
								<view class="content">
									<view class="text-grey">莫甘娜</view>
									<view class="text-gray text-content text-df">有烧烤地方吗？</view>
									<view class="bg-grey padding-sm radius margin-top-sm  text-sm">
										<view class="flex">
											<view>小步：</view>
											<view class="flex-sub">山下溪谷旁环境不错，记得FB后将垃圾带出山</view>
										</view>
									</view>
									<view class="margin-top-sm flex justify-between">
										<view class="text-gray text-df">2020年2月4日</view>
										<view>
											<text class="cuIcon-appreciatefill text-red"></text>
											<text class="cuIcon-messagefill text-gray margin-left-sm"></text>
										</view>
									</view>
								</view>
							</view>

							<view class="cu-item">
								<view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);"></view>
								<view class="content">
									<view class="text-grey">凯尔</view>
									<view class="text-gray text-content text-df">妹妹，你想多了！</view>
									<view class="bg-grey padding-sm radius margin-top-sm  text-sm">
										<view class="flex">
											<view>莫甘娜：</view>
											<view class="flex-sub">吃也是一种乐趣，哥哥是你不懂情调！</view>
										</view>
									</view>
									<view class="margin-top-sm flex justify-between">
										<view class="text-gray text-df">2020年2月5日</view>
										<view>
											<text class="cuIcon-appreciate text-gray"></text>
											<text class="cuIcon-messagefill text-gray margin-left-sm"></text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="cu-progress round margin-top xs"><view class="bg-red" style="width:0"></view></view>
			<view v-show="!enrolleOpen"><tui-scroll-top :scrollTop="scrolled"></tui-scroll-top></view>

			<tui-footer :copyright="basicdata.sys.footer.content" :fixed="false" :navigate="basicdata.sys.footer.navigate" tui-footer-class="tui-custom"></tui-footer>

			<block v-if="event.timer.toEndEnroll">
				<view class="cu-bar bg-white tabbar border shop foot">
					<button class="action" open-type="contact">
						<view class="cuIcon-service text-green"><view class="cu-tag badge"></view></view>
						咨询
					</button>
					<view class="action text-orange">
						<view class="cuIcon-favorfill"></view>
						已收藏
					</view>
					<view class="action">
						<view class="cuIcon-share"><view class="cu-tag badge"></view></view>
						分享
					</view>
					<view class="bg-red submit" @tap="showModal" data-target="enroll">一键报名</view>
				</view>

				<view class="cu-modal bottom-modal" :class="modalName == 'enroll' ? 'show' : ''" @touchmove.prevent="moveHandle" @tap="hideModal">
					<view class="cu-dialog">
						<view class="cu-bar bg-white">
							<view class="action">请选择报名组别</view>
							<view class="action" @tap="hideModal"><text class="cuIcon-close text-gray"></text></view>
						</view>

						<scroll-view scroll-y :style="'height:' + winHeight * 0.5 + 'px'">
							<view class="cu-list padding bg-blue light">
								<view class="bg-blue light" v-for="(item, idx) in event.item" :key="idx">
									<view class="line-orange" :class="idx == item.ecur ? 'solid' : ''">
										<tui-collapse :hdBgColor="'#cce6ff'" :arrow="false" :disabled="idx == 1" :index="idx" :current="item.ecur" @tap="enItemChange">
											<template v-slot:title>
												<button class="my-btn rect margin-tb-sm" :class="itemIdx == idx ? 'bg-orange light' : 'bg-gray'" :disabled="idx == 1">
													<view class="flex justify-between">
														<view class="line-orange flex justify-start align-center">
															<text class="cuIcon-title text-xs"></text>
															<view class="text-orange text-lg">{{ item.name }}</view>
														</view>
														<view v-if="item.enrolled >= item.limit" class="text-black">已 满</view>
														<view class="">
															<text class="text-red text-sm">{{ item.price.name }}：</text>
															<text class="text-price text-bold text-red">{{ item.price.cut }}</text>
														</view>
													</view>
												</button>
											</template>
											<template v-slot:content>
												<view class="flex justify-between padding-lr margin-bottom-sm">
													<view class="flex flex-direction">
														<!-- <view class="flex justify-start align-center">
												<text class="cuIcon-title margin-right-xs text-underline"></text>{{item.name}}
											</view> -->
														<view class="flex justify-start align-center text-gray text-sm">
															<text class="cuIcon-info margin-right-xs padding-top-xs">{{ item.comment }}</text>
														</view>
													</view>
													<view class="flex flex-direction">
														<!-- <view class="flex justify-end align-center">
												<text class="text-bold"
													:class="[item.price.cut>0?'text-gray text-through':'text-red', item.price.v>0?'text-price':'']">
													{{item.price.v}}
												</text>
											</view> -->
														<!-- <view class="padding-top-xs flex justify-end align-center" v-if="item.price.cut>0">
												<text class="text-red">{{item.price.name}}：</text>
												<text class="text-price text-bold text-red">{{item.price.cut}}</text>
											</view> -->
														<view class="flex justify-end align-center padding-top-xs text-gray text-sm">
															<text class="">限{{ item.limit }}人</text>
															<text class="margin-left-xs">已报{{ item.enrolled }}人</text>
														</view>
													</view>
												</view>
											</template>
										</tui-collapse>
									</view>
								</view>
							</view>
						</scroll-view>
						<view class="flex p-xs margin-bottom-sm mb-sm  bg-blue light">
							<view class="flex-sub bg-grey radius">
								<view class="flex flex-direction">
									<button class="cu-btn bg-green lg"><text class="text-sm text-white">邀请码报名</text></button>
								</view>
							</view>
							<view class="flex-twice bg-grey margin-left-xs radius">
								<view class="flex flex-direction"><button class="cu-btn bg-red lg" :disabled="itemIdx == -1 ? true : false" @tap="goEnroll">报 名</button></view>
							</view>
						</view>
					</view>
				</view>
				<view class="cu-tabbar-height"></view>
			</block>
		</view>
	</view>
</template>

<script>
import UniCountdown from '@/components/uni-countdown/uni-countdown';
// import poiList from '@/components/show-list/poi-list'
import eventSection from '@/components/zzxb/event-section.vue';
import { DESCEVENTINFO, ONTIME } from './event.js';
import { PARAGRAPH } from '@/comm/test/util.js';

const eventList = require('./datalist.js');

var thiz;
export default {
	components: {
		// tuiListCell,
		// tuiCollapse,
		// trailMap,
		UniCountdown,
		eventSection
		// poiList
	},
	data() {
		return {
			basicdata: this.bd,
			// #ifndef APP-PLUS
			customBar: this.CustomBar,
			// #endif
			// #ifdef APP-PLUS
			customBar: this.CustomBar - 7,
			// #endif
			
			statusBar: this.StatusBar,
			winHeight: this.WinHeight,
			WinWidth: this.WinWidth,
			headOpacity: 0,
			scrolled: 0,
			videoContext: null,
			videoBottom: 0,
			videoTop: 0,

			// #ifndef APP-PLUS
			ismute: true,
			// #endif
			// #ifdef APP-PLUS
			ismute: true,
			// #endif

			stickBarHeight: -1,
			load: true,

			event: {},
			poi: undefined,

			tabList: [
				{ id: 0, name: '背景', sight: true },
				{ id: 1, name: '路线', sight: true },
				{ id: 2, name: '组别', sight: true },
				{ id: 3, name: '福利', sight: true },
				{ id: 4, name: '规程', sight: true },
				{ id: 5, name: '提示', sight: true }
			],
			curTab: 0,
			isTabTap: false,
			enrolleOpen: false,

			modalName: '',
			itemIdx: -1,
			lastIdx: 0
		};
	},
	onLoad: async function(option) {
		// console.log("获取到的子窗体",nav)

		thiz = this;
		thiz.event = eventList.templist[0];

		this.event.kml = await this.zz.req({ $url: 'public/kml/info', "_id": this.event.kmlId, plain: true, trans: 'gcj02' });
		// console.log(thiz.event, this.event.kml);

		this.loadPoi();
	},
	beforeDestroy() {
		// console.log('eventDetail beforeDestroy-------------------------------');
	},

	onReady: function() {},
	mounted() {
		uni.createSelectorQuery()
			.select('.sticky-box')
			.boundingClientRect(data => {
				if(data.height){
									thiz.stickBarHeight = data.height;
				}

			})
			.exec();
		thiz.videoContext = uni.createVideoContext('myVideo');
	},

	methods: {
		async loadPoi() {
			let poi = await this.zz.req({ $url: 'public/poi/list', ids: this.event.poi });
			// console.log('poipoipoipoi ---------------------------', poi);
			// PARAGRAPH(poi, 'poi');
			this.poi = poi;
		},

		//获取文字信息
		moveTo: function(e) {
			thiz.isTabTap = true;
			for (let k = 0; k < thiz.tabList.length; k++) {
				thiz.tabList[k].sight = thiz.tabList[k].id == e.target.id;
			}
			const tabheight = thiz.customBar + thiz.stickBarHeight - 1; //tab 栏的高度
			// console.log(tabheight+'|'+i+"|______________current_____________"+thiz.scrolled) //验证输出一下当前的滚动高度
			uni.createSelectorQuery()
				.select('#tabto' + e.target.id)
				.boundingClientRect(data => {
					uni.pageScrollTo({
						scrollTop: data.top + thiz.scrolled - tabheight,
						duration: 300,
						complete: () => {
							setTimeout(function() {
								thiz.isTabTap = false;
								// console.log(thiz.isTabTap)
							}, 500);
						}
					});
				})
				.exec();
		},

		timeup: function() {
			let t = thiz.event;
			if (t.timer.toEnroll || t.timer.toEndEnroll) {
				thiz.event.timer = ONTIME(t.typename, t.startEnroll, t.endEnroll, t.eventDate + ' ' + t.startTime);
				// console.log(thiz.event.timer);
				return;
			}
			if (t.timer.toStart) thiz.event.timer.toStart = false;
		},

		preview(src, e) {
			// do something
		},
		navigate(href, e) {
			// do something
		},

		kmlMap: function(id) {
			uni.navigateTo({ url: '../../map/map?_id=' + id });
		},
		goLocation: function(e) {
			uni.openLocation({
				longitude: thiz.event.location.coord[0],
				latitude: thiz.event.location.coord[1],
				name: thiz.event.location.name
				// address: t.location.address
			});
		},

		//cllapase
		change(e) {
			let index = e.index;
			let item = thiz.event.item[index];
			item.current = item.current == index ? -1 : index;
		},
		openEnroll: function(e) {
			thiz.enrolleOpen = e;
		},
		goEnroll: function(i) {
			// console.log(this.item);
			// console.log('goEnroll');
		},

		showModal(e) {
			thiz.modalName = e.currentTarget.dataset.target;
			thiz.openEnroll(true);
		},
		hideModal(e) {
			thiz.modalName = null;
			thiz.openEnroll(false);
		},
		enItemChange(e) {
			let index = e.index;
			let item = thiz.event.item[index];

			// console.log(index);
			// console.log(item);

			if (index == thiz.itemIdx) {
				thiz.itemIdx = -1;
				thiz.event.item[index].ecur = -1;
			} else {
				thiz.event.item[thiz.lastIdx].ecur = -1;
				thiz.itemIdx = index;
				item.ecur = index;
			}
			thiz.lastIdx = index;
		},

		imgView: function(img) {
			this.zz.viewIMG([img], 0);
		}
	},
	//监听滚动信息，并保存页面的滚动高度 thiz.scrolled
	onPageScroll: function(e) {
		thiz.scrolled = e.scrollTop;
		if (e.scrollTop <= 150) {
			let num = e.scrollTop / 150;
			thiz.headOpacity = num;
		} else if (e.scrollTop > 150) {
			thiz.headOpacity = 1;
		}
		if (e.scrollTop >= thiz.videoBottom) {
			this.videoContext.pause();
		} else if (e.scrollTop <= thiz.videoTop) {
			this.videoContext.play();
		}

		if (thiz.load) {
			for (let i = 0; i < thiz.tabList.length; i++) {
				uni.createSelectorQuery()
					.select('#tabto' + i)
					.boundingClientRect(data => {
						thiz.tabList[i].top = data.top + e.scrollTop;
						thiz.tabList[i].bottom = data.bottom + e.scrollTop;
						// console.log(i+"="+thiz.tabList[i].name+" top:"+thiz.tabList[i].top+" || bottom:"+thiz.tabList[i].bottom)
					})
					.exec();
			}
			uni.createSelectorQuery()
				.select('#tvideo')
				.boundingClientRect(data => {
					thiz.videoBottom = data.bottom + e.scrollTop - thiz.customBar;
					thiz.videoTop = data.top + e.scrollTop - thiz.customBar;
					// console.log(data.top + "+++++++++++++++++" +data.bottom)
				})
				.exec();
			thiz.load = false;
		}
		// console.log("______________scrolled_____________"+thiz.scrolled)

		if (!thiz.isTabTap) {
			let scrollTop = e.scrollTop + (thiz.customBar + thiz.stickBarHeight);
			for (let i = 0; i < thiz.tabList.length; i++) {
				thiz.tabList[i].sight = scrollTop > thiz.tabList[i].top && scrollTop < thiz.tabList[i].bottom;
			}
		}
	},
	onShareAppMessage(res) {
		return {
			title: this.event.name,
			path: '/pages/share?path=/pages/event/detail/detail&id=' + event._id
		};
	}
};
</script>

<style>
.fixed {
	filter: alpha(Opacity=60);
	-moz-opacity: 1;
	position: absolute;
	z-index: 999;
}

.mybadge {
	/* border-radius: 200rpx; */
	position: absolute;
	top: -50rpx;
	right: -0rpx;
	font-size: 1.3rem;
	padding: 0rpx 10rpx;
	height: 38rpx;
	color: #ffffff;
}

.mybadge-left {
	/* border-radius: 200rpx; */
	position: absolute;
	top: -50rpx;
	left: -10rpx;
	font-size: 1.3rem;
	padding: 0rpx 10rpx;
	height: 38rpx;
	color: #ffffff;
}
.left5 {
	margin-left: 5rpx;
}

.my-btn {
	width: 100%;
	/* border-Radius:0px; */
}

.my-btn[disabled] {
	opacity: 0.8;
	/* color: #ffffff; */
}

.my-btn.button-hover {
	transform: translate(1rpx, 1rpx);
}
/* */
</style>
