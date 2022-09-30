<template>
	<view>
		<!-- 线路 -->
		<view class="cu-card dynamic no-card">
			<view class="cu-item shadow">
				<block v-for="(obj,idx) in blog" :key="idx">
					<view class="solid">
						<view class="cu-list menu-avatar">
							<view class="cu-item">
								<view class="cu-avatar round lg" :style="'background-image:url('+obj.avatar+');'" @tap="imgView([obj.avatar])"></view>
								<view class="content flex-sub">
									<view>{{obj.uname}}</view>
									<view class="text-gray text-sm flex justify-between">
										{{zz.time2Date(obj.create_time,'Y-M-D h:m')}}
									</view>
								</view>
							</view>
						</view>
						<view class="text-content pre-line padding-sm">
							{{obj.content}}
						</view>
						<view class="padding-lr" v-if="obj.pics&&obj.pics.length>0">
							<view class="grid grid-square flex-sub" :class="obj.pics.length>3?'col-3':'col-'+obj.pics.length">
								<view class="bg-img" v-for="(p,index) in obj.pics" :key="index" @tap="imgView(obj.pics,index)">
									<image :src="p" mode="aspectFill"></image>
								</view>
							</view>
						</view>
						<view class="padding-sm flex justify-end align-center text-gray">
							<view class="padding-lr-xs flex justify-end align-center">
								<view class="padding-lr" @tap="userEvent(30,2,obj)">
									<text class="cuIcon-appreciatefill margin-lr-xs" :class="obj.isLike?'text-red':''"></text>
									<text class="text-sm text-gray">{{obj.like}}</text>
								</view>
								<view @tap="href('/pages/profile/blog/edit?tid='+obj.tid+'&pid='+obj._id+'&ttype=2')">
									<text class="cuIcon-messagefill  margin-lr-xs"></text>
								</view>
							</view>
						</view>
					</view>
					<view class="solid-left margin-left-sm">
						<view class="cu-list menu-avatar comment solid-top">
						<view class="cu-item" v-for="(c,index) in obj.child" :key="index">
							<view class="cu-avatar round" :style="'background-image:url('+c.avatar+');'" @tap="imgView([c.avatar])"></view>
							<view class="content">
								<view class="flex">
									<view class="basis-lg text-cut">
										{{c.uname}}
									</view>
									<view class="margin-top-xs basis-sm text-gray text-right text-sm">
										{{zz.time2Date(c.create_time,'M-D h:m')}}
									</view>
								</view>
								<view class="text-gray text-content text-df">
									{{c.content}}
								</view>
								<block v-if="c.reply" v-for="(r,idxx) in c.reply" :key="idxx">
									<view class="bg-grey light padding-sm radius margin-top-sm text-sm">
										<view class="flex">
											<text>{{r.uname}}：</text>
											<view class="flex-sub">{{r.content}}</view>
										</view>
										<view class="flex justify-end">
											<text>{{zz.time2Date(r.create_time,'M-D h:m')}}</text>
										</view>
									</view>
								</block>
								<view class="margin-top-xs flex justify-end align-center">
									<view class=" flex justify-end align-center text-gray">
										<view class="padding-lr-xs flex justify-end align-center">
											<view class="padding-lr" @tap="userEvent(30,2,c)">
												<text class="cuIcon-appreciatefill margin-lr-xs" :class="c.isLike?'text-red':''"></text>
												<text class="text-sm text-gray">{{c.like}}</text>
											</view>
											<view @tap="href('/pages/profile/blog/edit?tid='+obj.tid+'&pid='+c._id+'&ttype=2&reply=1')">
												<text class="cuIcon-messagefill  margin-lr-xs"></text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						
					</view>	
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'zzxbBlog',
	data() {
		return {
			
		}
	},

	props: {
		blog: {
			type: Array,
			default:()=>{return []}
		}
	},
	methods: {
		
		href(h){this.zz.href(h)},
		userEvent(t,p,o){this.zz.userEvent(t,p,o)},
		imgView: function(img,idx){this.zz.viewIMG(img, idx?idx:0)}
	}
	

};
</script>

<style>
</style>
