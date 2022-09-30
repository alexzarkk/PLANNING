<template>
	<view>
		<cu-custom bgColor="bg-ztsgreen" :isBack="true"><block slot="content">路人甲</block></cu-custom>
		<view class="cu-chat">
			<!-- 我：文本消息 -->
			<view class="cu-item self">
				<view class="main">
					<view class="content shadow">
						<text>你好</text>
					</view>
				</view>
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
				<view class="date">13:23</view>
			</view>
			<!-- 撤回了一条消息 -->
			<view class="cu-info round">对方撤回一条消息!</view>
			<!-- 对方的消息 -->
			<view class="cu-item">
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view>
				<view class="main">
					<view class="content shadow">
						<text>你好</text>
					</view>
				</view>
				<view class="date "> 13:23</view>
			</view>
			<!-- 拉黑名单的消息 -->
			<!-- <view class="cu-info">
				<text class="cuIcon-roundclosefill text-red "></text> 对方拒绝了你的消息
			</view> -->
			<!-- 还没添加好友的消息 -->
			<!-- <view class="cu-info">
				对方开启了好友验证，你还不是他(她)的好友。请先发送好友验证请求，对方验证通过后，才能聊天。
				<text class="text-blue">发送好友验证</text>
			</view> -->
			<!-- 我发的图片消息 -->
			<view class="cu-item self">
				<view class="main">
					<image src="https://fhty.976m.org/bdfh/img/0%20(5).JPG" class="radius" mode="widthFix"></image>
				</view>
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
				<view class="date"> 13:23</view>
			</view>
			<!-- 我发的语音消息 -->
			<view class="cu-item self">
				<view class="main">
					<view class="action text-bold text-grey">
						3"
					</view>
					<view class="content shadow">
						<text class="cuIcon-sound text-xxl padding-right-xl"> </text>
					</view>
				</view>
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
				<view class="date">13:23</view>
			</view>
			<!-- 我发的定位消息 -->
			<view class="cu-item self">
				<view class="main">
					<view class="action">
						<text class="cuIcon-locationfill text-orange text-xxl"></text>
					</view>
					<view class="content shadow">
						我在这里
					</view>
				</view>
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
				<view class="date">13:23</view>
			</view>
			<!-- 我发的文本消息 -->
			<view class="cu-item self">
				<view class="main">
					<view class="content  shadow">
						<text>有空可以过来玩</text>
					</view>
				</view>
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
				<view class="date">13:23</view>
			</view>
			<!-- 对方的文本消息 -->
			<view class="cu-item"> 
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view>
				<view class="main">
					<view class="content shadow">
						你那风景真好
					</view>
					<!-- <view class="action text-grey">
						<text class="cuIcon-warnfill text-red text-xxl"></text> <text class="text-sm margin-left-sm">翻译错误</text>
					</view> -->
				</view>
				<view class="date">13:23</view>
			</view>
			<!-- 我发的文本消息 -->
			<view class="cu-item self">
				<view class="main">
					<view class="content  shadow">
						<text>是的，还有很多好吃的</text>
					</view>
				</view>
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
				<view class="date">13:23</view>
			</view>
			<!-- 对方的文本消息 -->
			<view class="cu-item">
				<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view>
				<view class="main">
					<view class="content shadow">
						好的，下次就过来玩
					</view>
					<!-- <view class="action text-grey">
						<text class="cuIcon-warnfill text-red text-xxl"></text> <text class="text-sm margin-left-sm">翻译错误</text>
					</view> -->
				</view>
				<view class="date">13:23</view>
			</view>
		</view>

		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view class="action">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
			 @focus="InputFocus" @blur="InputBlur"></input>
			<view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button class="cu-btn bg-green shadow">发送</button>
		</view>

	</view>
</template>

<script>
export default {
    data() {
        return {
            InputBottom: 0
        };
    },
    onLoad() {
        let _this = this;
        uni.onKeyboardHeightChange((res) => {
            _this.InputBottom = res.height;
        });
    },
    methods: {
        InputFocus(e) {
        	// this.InputBottom = e.detail.height
        },
        InputBlur(e) {
            this.InputBottom = 0;
        }
    },
	onUnload(){
		uni.offKeyboardHeightChange((event)=>{
			// console.log("移除键盘监听===",event)
		})
	}
};
</script>

<style>
page {
    padding-bottom: 100upx;
}
</style>
