<template>

	<view >
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">美食特产</block>
		</cu-custom>
		<scroll-view id="searchBar" scroll-x class="bg-white nav text-center fixed" :style="[{ top: CustomBar + 'px' }]">
			<view class="cu-item" :class="index == TabCur ? 'text-orange text-bold cur' : ''" v-for="(item, index) in tabNav" :key="index" @tap="tabSelect" :data-id="index">
				<text class="margin-right-xs" :class="'cuIcon-' + item[1]"></text>
				<text>{{ item[0] }}</text>
			</view>
		</scroll-view>
		
		<view :style="[{ paddingTop: (barHeight) + 'px' }]">
			
		<view v-if="TabCur==0">
			
			<block v-if="list[TabCur].length>0" v-for="(item,idx) in list[TabCur]" :key="idx">
				
				<view class="cu-card article no-card padding-top-sm shadow-blur bg-white ">
					<view class="cu-item shadow solid-bottom">
						<view class="title">
							<view class="text-cut">{{item.title}}</view>
						</view>
						<view class="content">
							<image :src="item.cover.url" mode="aspectFill" @tap="detail(item._id)"></image>
							<view class="desc">
								<view class="text-content cell-title" @tap="detail(item._id)">
									{{item.desc}}
								</view>
								<view class=" text-gray text-sm flex justify-between align-center">
									<text class="">{{item.cdate}}</text>
									
									<view class=" flex justify-end align-center">
										<view>
											<text class="cuIcon-attention margin-right-xs"></text>
											<text class="text-sm text-gray">{{item.view}}</text>
										</view>
										<view @tap="userEvent(30,10,item)">
											<text class="cuIcon-appreciatefill margin-lr-xs" :class="item.isLike?'text-red':''"></text>
											<text class="text-sm text-gray">{{item.like}}</text>
										</view>
										<view @tap="userEvent(40,10,item)">
											<text class="cuIcon-favorfill margin-lr-xs" :class="item.isFavor?'text-red':''"></text>
											<text class="text-sm text-gray">{{item.favor}}</text>
										</view>
										
										<view>
											<button open-type="share" class="cu-btn xs " :data-id="item._id" :data-title="item.title">
												<text class="cuIcon-share"></text>
												<text class="text-sm text-green"></text>
											</button>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
			</block>
		</view>
		
		
		<view v-if="TabCur==1">
			
			<block v-if="list[TabCur].length>0" v-for="(item,idx) in list[TabCur]" :key="idx">
			<view class="cu-card article no-card padding-top-sm shadow-blur">
				<view class="cu-item shadow">
					<view class="title">
						<view class="text-cut">{{item.title}}</view>
					</view>
					<view class="content">
						<image :src="item.cover.url" mode="aspectFill" @tap="detail(item._id)"></image>
						<view class="desc">
							<view class="text-content cell-title" @tap="detail(item._id)">
								{{item.desc}}
							</view>
							<view class="text-gray text-sm flex justify-between align-center">
								<text class="">{{item.cdate}}</text>
								
								<view class=" flex justify-end align-center">
									<view>
										<text class="cuIcon-attention margin-right-xs"></text>
										<text class="text-sm text-gray">{{item.view}}</text>
									</view>
									<view @tap="userEvent(30,10,item)">
										<text class="cuIcon-appreciatefill margin-lr-xs" :class="item.isLike?'text-red':''"></text>
										<text class="text-sm text-gray">{{item.like}}</text>
									</view>
									<view @tap="userEvent(40,10,item)">
										<text class="cuIcon-favorfill margin-lr-xs" :class="item.isFavor?'text-red':''"></text>
										<text class="text-sm text-gray">{{item.favor}}</text>
									</view>
									
									<view>
										<button open-type="share" class="cu-btn xs bg-white" :data-id="item._id" :data-title="item.title">
											<text class="cuIcon-share"></text>
											<text class="text-sm text-green"></text>
										</button>
									</view>
								</view>
								
							</view>
						</view>
					</view>
				</view>
			</view>
			</block>
		</view>
		<!-- <tui-nomore></tui-nomore> -->
		<tui-no-data :fixed="true" :imgUrl="bd.imgs.nodata">暂无数据</tui-no-data>
		<tui-scroll-top :scrollTop="scrolled"></tui-scroll-top>
		</view>
	</view>
</template>

<script>

export default {
	data() {
		return {
			CustomBar: this.CustomBar,
			nomore:false,
			scrolled: 0,
			barHeight: 0,
			
			TabCur: -1,
			tabNav: [['美食', 'appreciate '],['农特产', 'goodsfavor ']],
			list:[[],[]]
		};
	},
	async onLoad(option) {
		this.loading = true
		// let list = await this.zz.req({$url: 'public/article/list', deptId: this.bd.sys.code, type: 22 })
		// for (let s of list) {
		// 	this.list[0].push(s)
		// 	this.list[1].push(s)
		// }
		this.TabCur = 0
		this.loading = false
	},
	onPageScroll: function(e){
		this.scrolled = e.scrollTop
	},
	mounted() {
		let thiz = this
		uni.createSelectorQuery().select('#searchBar').boundingClientRect(function(res) {
			 thiz.barHeight = res.height
			 console.log(thiz.barHeight)
		}).exec()
	},
	methods: {
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id
		},
		
		detail:function(id) {
			this.zz.href('../../../article/article?id='+id)
		},
		
		userEvent(t,p,o){this.zz.userEvent(t,p,o)}
	},
	onShareAppMessage(res) {
		if(res.target){
			let id = res.target.dataset.id
			let title = res.target.dataset.title
			return {
			    title: title,
			    path: '/pages/share?path=/pages/article/article&id='+id
			}
		} else {
			return {
				title: '了解奉化-美食特产',
				path: '/pages/share?path=/pages/about/city/food/food',
			}
		}
	}
};
</script>

<style>
	

</style>
