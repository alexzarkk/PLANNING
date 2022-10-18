<template>
<page-meta root-font-size="10px"></page-meta>
    <view class="container">
        <!--header-->
        <!-- <block v-if="!load"> -->
        <zz-header :opacity="opcity" :tabList="tabList" :scrolled="scrolled" :iconOpcity="iconOpcity" @openMenu="openMenu" @moveTo="moveTo"></zz-header>
        <!-- </block> -->
        <!--header-->

        <view id="tabto0">
            <!--banner-->
            <view class="tui-banner-swiper">
                <swiper :autoplay="true" :interval="5000" :duration="150" :circular="true" :style="{ height: WinWidth + 'px' }" @change="bannerChange">
                    <block v-for="(item, index) in item.banner" :key="index">
                        <swiper-item :data-index="index" @tap.stop="bannerView">
                            <image :src="item" class="tui-slide-image" :style="{ height: WinWidth + 'px' }" />
                        </swiper-item>
                    </block>
                </swiper>
                <view class="tui-banner-tag">
                    <tui-tag padding="12rpx 18rpx" type="translucent" shape="circleLeft" :scaleMultiple="0.82" originRight>{{ bannerIndex + 1 }}/{{ item.banner.length }}</tui-tag>
                </view>
            </view>
            <!--banner-->

            <!-- notificationfill -->
            <view class='tui-notice-board' v-if="noticeShow">
                <view class="tui-icon-bg">
                    <text class='cuIcon-notificationfill text-red padding-right-xs'></text>
                </view>
                <view class="tui-scorll-view">
                    <view class="tui-notice tui-animation">{{item.notice}}</view>
                </view>
                <view @tap="closeNotice">
                    <text class='cuIcon-close text-red padding-xs'></text>
                </view>
            </view>
            <!-- notificationfill -->

            <!--限时秒杀-->
            <block v-if="item.promotion.status">
                <view class="padding-sm align-center flex justify-between" :class="'bg-gradual-' + item.color">
                    <view>
                        <text class="text-xxl text-price">{{item.promotion.v * item.promotion.cut}}</text>
                    </view>
                    <view class="text-xs">
                        <view class="text-through">原价￥{{item.promotion.v}}</view>
                        <view>{{item.promotion.name}}</view>
                    </view>
                    <view class="text-right ">
                        <!-- <view class="text-sm">{{item.promotion.title}}</view> -->
                        <view class="text-xs">
                            <!-- <uni-countdown 
								color="#ff015a"
								background-color="#ffffff"
								border-color="#000000"
								splitor-color="#ffffff"
								@timeup="timeup" 
								:prename="item.promotion.timer.prename"
								:day="item.promotion.timer.dd" :hour="item.promotion.timer.hh" :minute="item.promotion.timer.mm" :second="item.promotion.timer.ss"
								></uni-countdown> -->
                        </view>
                    </view>
                </view>
                <view class="">
                    <view class="tui-pro-pricebox tui-padding bg-white">
                        <view class="tui-pro-price margin-top-sm">
                            <block v-for="(item, index) in item.tag" :key="index">
                                <view class='cu-tag sm line-green round'>{{item}}</view>
                                <!-- <tui-tag padding="10rpx 20rpx" size="24rpx" plain type="high-green" shape="circle" :scaleMultiple="0.8">{{item}}</tui-tag> -->
                            </block>
                        </view>
                        <view class="flex flex-direction justify-center" @tap="userEvent(40,30,item)">
                            <view class="">
                                <tui-icon :name="item.isFavor ? 'like-fill' : 'like'" :color="item.isFavor?'#ff582e' : '#333'" :size="20"></tui-icon>
                            </view>
                            <view class="tui-size tui-gray" :class="{'tui-icon-red':item.isFavor}">收藏</view>
                        </view>
                    </view>
                </view>
            </block>

            <view class="tui-pro-detail">
                <view class="tui-product-title tui-border-radius">
                    <view v-if="!item.promotion.status">
                        <view class="tui-pro-pricebox tui-padding">
                            <view class="tui-pro-price">
                                <view>
                                    <text>￥</text>
                                    <text class="tui-price">{{item._price}}</text>
                                    <text class="padding-lr-xs"> - </text>
                                    <text class="tui-price">{{item.price_}}</text>
                                </view>
                                <view class="padding-left">
                                    <block v-for="(item, index) in item.tag" :key="index">
                                        <view class='cu-tag sm line-green round'>{{item}}</view>
                                        <!-- <tui-tag padding="10rpx 20rpx" size="24rpx" plain type="high-green" shape="circle" :scaleMultiple="0.8">{{item}}</tui-tag> -->
                                    </block>
                                </view>
                            </view>
                            <view class="flex flex-direction justify-center" @tap="userEvent(40,30,item)">
                                <view class="">
                                    <tui-icon :name="item.isFavor ? 'like-fill' : 'like'" :color="item.isFavor?'#ff582e' : '#333'" :size="20"></tui-icon>
                                </view>
                                <view class="tui-size tui-gray" :class="{'tui-icon-red':item.isFavor}">收藏</view>
                            </view>
                        </view>
                        <view class="tui-original-price tui-gray">
                            库存
                            <text class="padding-xs">{{item.stock}}</text>
                        </view>
                    </view>
                    <view class="tui-pro-titbox">
                        <view class="tui-pro-title">{{item.title}}</view>
                        <button class="tui-share-btn tui-share-position" @tap="showPopup('share','分享')">
                            <tui-tag type="gray" shape="circleLeft" padding="12rpx 16rpx">
                                <view class="tui-share-box">
                                    <tui-icon name="partake" color="#999" :size="15"></tui-icon>
                                    <text class="tui-share-text tui-gray tui-size">分享返利</text>
                                </view>
                            </tui-tag>
                        </button>
                    </view>
                    <view class="tui-padding">
                        <!-- <view class="tui-sub-title tui-size tui-gray">此商品将于2019-06-28,10点结束闪购特卖，时尚美饰联合专场</view> -->
                        <view class="tui-sale-info tui-size tui-gray">
                            <view>快递：0.00</view>
                            <view>月销2000</view>
                            <view>浙江奉化</view>
                        </view>
                    </view>
                </view>

                <!-- <view class="tui-discount-box tui-radius-all tui-mtop">
					<view class="tui-list-cell" @tap="btnTopMenu(7)">
						<view class="tui-bold tui-cell-title">领券</view>
						<view class="tui-flex-center">
							<tui-tag type="red" shape="circle" padding="12rpx 24rpx" size="24rpx">满99减8</tui-tag>
							<tui-tag margin="0 0 0 20rpx" type="red" padding="12rpx 24rpx" size="24rpx" shape="circle">满59减5</tui-tag>
						</view>
						<view class="tui-ml-auto">
							<tui-icon name="arrowright" :size="20" color="#666"></tui-icon>
						</view>
					</view>
				</view> -->

                <view class="tui-discount-box tui-radius-all tui-mtop">
                    <view class="tui-list-cell tui-last solid-bottom " @tap="showPopup('locmap','产地位置')">
                        <view class="tui-bold tui-cell-title">产地</view>
                        <view>
                            <view class="tui-addr-item">
                                <text>{{item.shop.address}}</text>
                            </view>
                        </view>
                        <view class="tui-right">
                            <tui-icon name="arrowright" :size="20" color="#666"></tui-icon>
                        </view>
                    </view>
                    <view class="tui-list-cell tui-last" @tap="showPopup('ensure','保障承诺')">
                        <view class="tui-bold tui-cell-title">承诺</view>
                        <view class='flex flex-wrap'>
                            <view class="padding-xs" v-for="(ensure, idx) in item.ensure" :key="idx">
                                <view class='cu-tag line-brown'>{{ensure.name}}</view>
                            </view>
                        </view>
                        <view class="tui-right">
                            <tui-icon name="arrowright" :size="20" color="#666"></tui-icon>
                        </view>
                    </view>
                </view>

                <!--选择-->
                <view class="tui-basic-info tui-mtop tui-radius-all" @tap="showPopup('select', '品类规格')">
                    <block v-if="itemIdx==-1">
                        <view class="tui-list-cell">
                            <view class="tui-bold tui-cell-title">选择</view>
                            <view>
                                <view class="tui-selected-box"><text class="text-sm">请选择 品类规格</text></view>
                                <view class="tui-selected-box">
                                    <view class="flex margin-top-xs align-end">
                                        <view class="flex justify-start">
                                            <block v-for="(item, idx) in item.item" v-if="idx<4" :key="idx">
                                                <view class="flex justify-start">
                                                    <view class="cu-avatar radius margin-right-xs" :style="'background-image:url('+item.img+')'"></view>
                                                </view>
                                            </block>
                                        </view>
                                        <view class="text-cut bg-gray padding-xs radius" style="width:120px">
                                            共 {{item.item.length}} 款品类规格可选
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="tui-ml-auto">
                                <tui-icon name="arrowright" :size="20" color="#666"></tui-icon>
                            </view>
                        </view>
                    </block>
                    <block v-else>
                        <view class="tui-list-cell">
                            <view class="tui-bold tui-cell-title">已选</view>
                            <view>
                                <view class="tui-selected-box">
                                    <view class="cu-avatar radius margin-right-xs" :style="'background-image:url('+item.item[itemIdx].img+')'"></view>
                                    <text class="text-sm text-cut">{{item.item[itemIdx].name}} {{count}}件</text>
                                </view>
                            </view>
                            <view class="tui-ml-auto">
                                <tui-icon name="arrowright" :size="20" color="#666"></tui-icon>
                            </view>
                        </view>
                    </block>
                </view>

                <view class="tui-basic-info tui-mtop tui-radius-all">
                    <view class="tui-list-cell" @tap="deliverTo">
                        <view class="tui-bold tui-cell-title">送至</view>
                        <block v-if="user.addr && user.addr.length>0">
                            <view class="tui-addr-box">
                                <view class="tui-addr-item">{{user.addr[userAddrIdx].city}}</view>
                                <view class="tui-addr-item">{{user.addr[userAddrIdx].address}}</view>
                            </view>
                        </block>
                        <block v-else>
                            <view class="tui-addr-box">
                                <view class="tui-addr-item">未获取到您的地址信息</view>
                                <view class="tui-addr-item">请登录后完善您的个人信息</view>
                            </view>
                        </block>
                        <view class="tui-right">
                            <tui-icon name="arrowright" :size="20" color="#666"></tui-icon>
                        </view>
                    </view>
                    <view class="tui-list-cell tui-last">
                        <view class="tui-bold tui-cell-title">运费</view>
                        <view class="tui-selected-box">江浙沪皖地区免运费，其他地区参考</view>
                        <view class=" text-blue" @tap="href('../deliverFee')">【运费标准】</view>
                    </view>
                    <view class="tui-guarantee">
                        <view class="tui-guarantee-item">
                            <tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
                            <text class="tui-pl">顺丰发货</text>
                        </view>
                        <view class="tui-guarantee-item">
                            <tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
                            <text class="tui-pl">长三角地区专供</text>
                        </view>
                        <view class="tui-guarantee-item">
                            <tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
                            <text class="tui-pl">精选鲜果</text>
                        </view>
                        <view class="tui-guarantee-item">
                            <tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
                            <text class="tui-pl">当日发货</text>
                        </view>
                        <view class="tui-guarantee-item">
                            <tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
                            <text class="tui-pl">生鲜食品不退不换</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <view id="tabto1" class="tui-pro-detail">
            <view class="tui-cmt-box tui-mtop tui-radius-all">
                <view class="tui-list-cell tui-last tui-between">
                    <view class="tui-bold tui-cell-title">评价</view>
                    <view class="tui-flex-center" @tap="btnTopMenu(8)">
                        <text class="tui-cmt-all">查看全部</text>
                        <tui-icon name="more-fill" :size="20" color="#ff201f"></tui-icon>
                    </view>
                </view>

                <view class="tui-cmt-content tui-padding">
                    <view class="tui-cmt-user">
                        <image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/deeb53c0-9135-11ea-b997-9918a5dda011.jpg" class="tui-acatar"></image>
                        <view>z***9</view>
                    </view>
                    <view class="tui-cmt">物流很快，很适合我的风格❤</view>
                    <view class="tui-attr">规格包装：12只装</view>
                </view>

                <view class="tui-cmt-btn">
                    <tui-button width="240rpx" height="64rpx" :size="24" type="black" plain shape="circle" @tap="btnTopMenu(8)">查看全部评价</tui-button>
                </view>
            </view>
        </view>

        <!--宝贝详情-->
        <view id="tabto2" class="tui-pro-detail">
            <view class="tui-nomore-box">
                <tui-nomore text="宝贝详情" backgroundColor="#f7f7f7"></tui-nomore>
            </view>
            <block v-for="(img, index) in item.pics" :key="index">
                <view class="padding-xs tui-product-img tui-radius-all">
                    <image :src="img.url" mode="widthFix" @tap="imgView(img.url)"></image>
                </view>
            </block>
        </view>
        <!--宝贝详情-->

        <!-- 关于产地 -->
        <view id="tabto3" class="tui-pro-detail">
            <view class="cu-bar bg-green solid-bottom margin-top">
                <view class="action">
                    <text class="cuIcon-titles text-orange"></text> 关于产地
                </view>
            </view>
            <poi-list :dataList="poi" v-if="poi"></poi-list>
        </view>
        <!-- 关于产地 -->

        <!--顶部下拉菜单-->
        <tui-top-dropdown backgroundColor="rgba(76, 76, 76, 0.95)" :show="menuShow" :height="0" @close="closeMenu">
            <view class="tui-menu-box tui-padding tui-ptop">
                <view class="tui-menu-header" :style="{ paddingTop: CustomBar + 'px' }">功能直达</view>
                <view class="tui-menu-itembox">
                    <block v-for="(item, index) in topMenu" :key="index">
                        <view class="tui-menu-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="btnTopMenu(index)">
                            <view class="tui-badge-box">
                                <tui-icon :name="item.icon" color="#fff" :size="item.size"></tui-icon>
                                <tui-badge type="red" :scaleRatio="0.8" absolute right="-8rpx" v-if="item.badge">{{ item.badge }}</tui-badge>
                            </view>
                            <view class="tui-menu-text">{{ item.text }}</view>
                        </view>
                    </block>
                </view>
                <view class="tui-icon-up_box">
                    <tui-icon name="up" color="#fff" :size="26" @tap="closeMenu"></tui-icon>
                </view>
            </view>
        </tui-top-dropdown>
        <!---顶部下拉菜单-->

        <!--底部操作栏-->
        <view class="cu-bar bg-white tabbar border shop foot">
            <view class="action" @tap="btnTopMenu(3)">
                <view class="cuIcon-cart">
                    <view class="cu-tag badge" v-show="cartCount>0">{{cartCount}}</view>
                </view>
                购物车
            </view>
            <!-- <view class="action">
				<view class="cuIcon-shop"></view> 店铺
			</view> -->

            <view class="action" open-type="contact" @tap="btnTopMenu(4)">
                <view class="cuIcon-phone text-green"></view>
                客服
            </view>
            <!-- <view class="action" @tap="onShare">
				<view class="cuIcon-share">
					<view class="cu-tag badge"></view>
				</view>
				分享
			</view> -->
            <block v-if="!item.exp">
                <block v-if="item.promotion.status">
                    <view class="bg-red submit" @tap="showPopup('buy', '品类规格')">立即下单</view>
                </block>
                <block v-else>
                    <view class="bg-orange submit" @tap="showPopup('add', '添加购物车')">加购物车</view>
                    <view class="bg-red submit" @tap="showPopup('buy', '品类规格')">立即订购</view>
                </block>
            </block>
            <block v-else>
                <view class="bg-grey submit">商品已下架</view>
            </block>
        </view>

        <!--底部选择层-->
        <tui-bottom-popup :show="popupShow" @close="hidePopup">
            <view class="tui-popup-box">
                <view class="cu-dialog solid-bottom">
                    <view class="cu-bar bg-white">
                        <view class="action"><text class="cuIcon-titles text-orange "></text> <text>{{modalTitle}}</text></view>
                    </view>
                </view>
                <!--内容区域-->
                <!-- <scroll-view scroll-y class="tui-popup-scroll"> -->
                <view class=" margin-top-xs" v-if="modalType=='deliver'">
                    <block v-if="user.addr && user.addr.length>0">
                        <view class="cu-list sm-border menu" v-for="(item,index) in user.addr" :key="index">
                            <view class="cu-item">
                                <view class="action">
                                    <text class="text-blue margin-right-xs" :class="userAddrIdx==index?'cuIcon-roundcheckfill':'cuIcon-round'"></text>
                                </view>
                                <view class="content padding-tb-sm" @tap="selectAddr(index)">
                                    <view>
                                        <view class="cu-tag bg-orange light sm">{{["住宅","公司","学校","其它"][item.type]}}</view>
                                        <text class="text-blue margin-right-xs"></text> {{item.name}}
                                    </view>
                                    <view class="text-gray text-sm">
                                        <text class="cuIcon-info margin-right-xs"></text>{{item.city}} {{item.address}}
                                    </view>
                                </view>
                                <view class="action" @tap="editAddr(index)">
                                    <text class="cuIcon-write text-blue margin-right-xs"></text>
                                </view>
                            </view>
                        </view>
                    </block>
                    <block v-else>
                        <view class="cu-list sm-border menu padding-tb-sm">
                            <view class="cu-item">
                                <view class="content padding-tb-sm margin-left">
                                    <view>
                                        <text class="text-grey text-df margin-right-xs">尚未建立地址信息 ... </text>
                                    </view>
                                </view>
                                <view class="action" @tap="editAddr(-1)">
                                    <button class="cu-btn bg-green shadow">
                                        <text class="cuIcon-write"> 新建</text>
                                    </button>
                                </view>
                            </view>
                        </view>
                    </block>
                </view>

                <!-- share -->
                <view class=" margin-top-xs">
                    <view v-if="modalType=='share'">
                        <view class="padding flex justify-around">
                            <view class="bg-white solid padding-top-sm">
                                <button open-type="share" class="bg-white flex justify-center flex-direction">
                                    <view class="bg-white cu-avatar lg margin-left" :style="'background-image:url('+basicdata.imgs.icon_wechat+');'"></view>
                                    <view class="margin-left-xs text-df">转发给好友</view>
                                </button>
                            </view>
                            <view class="bg-white solid padding-top-sm" @tap="getPoster">
                                <button class="bg-white flex justify-center flex-direction">
                                    <view class="bg-white cu-avatar lg margin-left" :style="'background-image:url('+basicdata.imgs.icon_moments+');'"></view>
                                    <view class="text-df">分享朋友圈</view>
                                </button>
                            </view>
                        </view>
                        <view class="cu-list menu shadow-lg radius">
                            <view class="cu-item arrow" @tap="btnTopMenu(9)">
                                <view class="content">
                                    <text class="cuIcon-message text-grey"></text>
                                    <text class="text-grey text-df">可获得本次分享销售额的 3% 分销返利</text>
                                </view>
                                <view class="action">
                                    <text class="text-gray text-sm"></text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- share -->

                <!-- Location -->
                <view class="margin-top-xs" v-if="modalType=='locmap'">
                    <scroll-view scroll-y :style="'height:'+(WinH*0.65)+'px'">
                        <trail-map v-if="item.kml" :listPoint="true" :scale="15" :tagName="'区位图(点击查看)'" :pkml="item.kml" @kmlMap="kmlMap"></trail-map>
                    </scroll-view>
                </view>
                <!-- Location -->

                <!--_承诺-->
                <view class="padding-lr margin-top-xs" v-if="modalType=='ensure'">
                    <scroll-view scroll-y :style="'height:'+(WinH*0.5)+'px'">
                        <block v-for="(ensure, idx) in item.ensure" :key="idx">
                            <view class="text-view text-left">
                                <text class="cuIcon-squarecheck text-red" />
                                <text class="margin-xs text-df text-black">{{ensure.name}}</text>
                            </view>
                            <view class="margin-xs text-left text-list-view">
                                <view class="margin-left text-gray text-df pre-line">{{ensure.desc}}</view>
                            </view>
                        </block>
                    </scroll-view>
                </view>
                <!--承诺_-->

                <!--_商品信息-->
                <view v-if="modalType=='select'||modalType=='add'||modalType=='buy'">
                    <view class="cu-list bg-white solid menu-avatar sticky-box">
                        <view class="" v-if="itemIdx==-1">
                            <view class="flex padding-lr">
                                <view class="flex justify-start align-center margin-xs">
                                    <view class="" :style="['background-image:url('+item.cover.url+');']" @tap="imgView(item.cover.url)"></view>
                                    <view class="text-left margin-left-sm">
                                        <block v-if="item.promotion.status">
                                            <view class="text-price-view">
                                                <text class="text-price text-red margin-right-xs">{{item.promotion.v * item.promotion.cut}}</text>
                                                <text class="text-gray text-through">￥{{item.promotion.v}}</text>
                                                <text class="cu-tag bg-gradual-red sm">
                                                    <text class="cuIcon-hotfill" />
                                                    <text>秒杀中</text>
                                                </text>
                                            </view>
                                        </block>
                                        <block v-else>
                                            <view class=" text-price-view">
                                                <text class="text-price text-red margin-right-xs">{{item._price}} - {{item.price_}}</text>
                                                <text class="text-df text-gray margin-left-sm">库存：{{item.stock}}</text>
                                            </view>
                                        </block>
                                        <view class="margin-top-xs text-black flex">
                                            <view class="text-df text-cut">请选择 …</view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view v-else class="">
                            <view class="flex flex-direction padding-lr">
                                <!-- <view class=" margin-xs"> -->
                                <view class="flex justify-between align-center">

                                    <view class="flex justify-start align-center" @tap="imgView(item.item[itemIdx].img)">
                                        <view class="cu-avatar lg" :style="'background-image:url('+item.item[itemIdx].img+')'"></view>
                                        <view class="text-left margin-left-sm text-cut">
                                            <view class="text-price-view">
                                                <text class=" text-price text-red margin-right-xs">{{item.item[itemIdx].price.v * item.item[itemIdx].price.cut}}</text>
                                                <block v-if="item.item[itemIdx].price.cut<1">
                                                    <text class="text-gray text-through">￥{{item.item[itemIdx].price.v}}</text>
                                                    <text class="margin-left-xs cu-tag bg-gradual-red sm">
                                                        <text class="cuIcon-like" />
                                                        <text>{{item.item[itemIdx].price.name}}</text>
                                                    </text>
                                                </block>
                                            </view>
                                        </view>
                                    </view>

                                    <view class="bg-white flex justify-end align-center flex-sub  margin-xs">
                                        <view @tap="countNum(-1)" class="padding-xs">
                                            <button class="cu-btn cuIcon sm" :disabled="count<=1">
                                                <text class="cuIcon-move"></text>
                                            </button>
                                        </view>
                                        <view class='cu-tag bg-white'>{{count}}</view>
                                        <view @tap="countNum(1)" class="padding-xs">
                                            <button class="cu-btn cuIcon sm" :disabled="count>=item.item[itemIdx].num">
                                                <text class="cuIcon-add"></text>
                                            </button>
                                        </view>
                                    </view>

                                </view>

                                <view class="margin-top-xs text-black">
                                    <view class="text-df text-cut">已选:【 {{item.item[itemIdx].name}}】</view>
                                </view>
                                <!-- </view> -->

                            </view>

                        </view>

                        <!--规格数据-->
                        <scroll-view class="bg-white solid padding-lr" scroll-y :style="'height:'+(WinH*0.5)+'px'">
                            <block v-for="(itm, idx) in item.item" :key="idx">
                                <button class="my-btn margin-tb-sm" :class="itemIdx==idx?'bg-orange light':'bg-gray'" :disabled="itm.num<=0" :data-id="idx" @tap="itemChange">
                                    <view class="flex justify-between">
                                        <view class="line-orange flex justify-start align-center text-cut">
                                            <view class="cu-avatar radius" :style="'background-image:url('+itm.img+')'"></view>
                                            <view class="margin-left-sm text-left text-cut text-orange text-df">{{itm.name}}</view>
                                        </view>
                                        <block v-if="itm.num<=10">
                                            <view v-if="itm.num<=0" class="text-black">已售嚣</view>
                                            <view v-else>
                                                <text class="text-sm text-gray padding-right-xs">库存不足</text>
                                                <text class="text-price text-bold text-red">{{itm.price.v * itm.price.cut}}</text>
                                            </view>
                                        </block>
                                        <block v-else>
                                            <view>
                                                <text class="text-price text-bold text-red">{{itm.price.v * itm.price.cut}}</text>
                                            </view>
                                        </block>
                                    </view>
                                </button>
                            </block>
                        </scroll-view>
                    </view>
                </view>
                <!--商品信息_-->
                <!-- </scroll-view> -->

                <view class="tui-right">
                    <tui-icon name="close-fill" color="#999" :size="20" @tap="hidePopup"></tui-icon>
                </view>
            </view>
            <view class="flex flex-direction">
                <button class="cu-btn rect bg-red bigger" :disabled="modalType=='select'&&itemIdx==-1" @tap="submit">确 定</button>
            </view>
        </tui-bottom-popup>

        <tui-nomore text="已经到最底了" backgroundColor="#f7f7f7"></tui-nomore>
        <zz-footer/>

        <!--底部选择层-->
        <view v-show="!popupShow && !posterShow">
            <tui-scroll-top :scrollTop="scrolled"></tui-scroll-top>
        </view>

        <!-- 分享 -->
        <view class="cu-modal" :class="posterShow?'show':''" @touchmove.stop.prevent>
            <view class="cu-dialog">
                <view class="image bg-gray">
                    <view class="padding-sm flex justify-between" @tap="hideModal">
                        <text class="text-cut text-gray">专属海报已生成，保存后可以发朋友圈了！</text>
                        <text class="cuIcon-close"></text>
                    </view>
                    <image class="solid" :src="poster.postSrc" mode="widthFix" @tap.stop="imgView(poster.postSrc)"></image>
                </view>
                <view class="margin-top-sm flex flex-direction" @tap.prevent.stop="saveImage()">
                    <button class="cu-btn rect bg-red bigger">保 存</button>
                </view>
            </view>
        </view>
        <block v-if="poster.postSrc===''">
            <view class="cu-modal">
                <!-- <zz-poster ref="zzposter"
						:targetId="item._id"
						:sharePath="'/pages/mall/goodsDetail/goodsDetail'"
						:sharePolicy="item.sharePolicy"
						:doDraw="poster.doDraw"
						:imgSrc="poster.imgSrc"
						:Title="poster.Title"
						:TitleColor="poster.TitleColor"
						:PriceTxt="poster.PriceTxt"
						:OriginalTxt="poster.OriginalTxt"
						:OriginalTxtCut="poster.OriginalTxtCut"
						:Referrer="poster.Referrer"
						:pageTitle="poster.pageTitle"
						:shareNum="poster.shareNum"
						@success="postImg"
				></zz-poster> -->
            </view>
        </block>

    </view>

</template>

<script>
// import zzPoster from "@/components/zzxb/zz-poster.vue"
// import locMap from '@/components/loc-map/loc-map.vue'
// import poiList from '@/components/show-list/poi-list'
// import {product} from '@/common/test_data.js'
// import { DESCINFO } from '@/common/product.js'
// import { PARAGRAPH } from '@/common/util.js'

// import zzHeader from '@components/zz/zz-header.vue'

var thiz
export default {
    // components:{
    // zzHeader,
    // locMap,
    // poiList,
    // zzPoster
    // },
    data() {
        return {
            basicdata: this.bd,
            StatusBar: this.StatusBar,
            CustomBar: this.CustomBar,
            WinWidth: this.WinWidth,
            WinH: this.WinHeight,
            loginTip: false,

            user: {},
            userAddrIdx: 0,

            scrolled: 0,
            cartCount: 0,
            count: 1,
            itemIdx: -1,

            opcity: 0,
            iconOpcity: 0.5,
            bannerIndex: 0,

            topMenu: [{
                icon: 'message',
                text: '消息',
                size: 26,
                badge: 0
            },
            {
                icon: 'home',
                text: '首页',
                size: 23,
                badge: 0
            },
            {
                icon: 'people',
                text: '我的',
                size: 26,
                badge: 0
            },
            {
                icon: 'cart',
                text: '购物车',
                size: 23,
                badge: 0
            },
            {
                icon: 'kefu',
                text: '客服小蜜',
                size: 26,
                badge: 0
            },
            {
                icon: 'feedback',
                text: '我要反馈',
                size: 23,
                badge: 0
            },
            {
                icon: 'share',
                text: '分享',
                size: 26,
                badge: 0
            }
            ],


            modalTitle: '',
            modalType: '',

            menuShow: false,
            popupShow: false,
            noticeShow: true,

            // posterData:{},

            // value: 1,



            load: true,
            tabList: [
                {
                    id: 0, name: "商品", sight: true
                }, {
                    id: 1, name: "评价", sight: false
                }, {
                    id: 2, name: "详情", sight: false
                }, {
                    id: 3, name: "关于", sight: false
                }
            ],

            isTabTap: false,



            posterShow: false,
            poster: {
                doDraw: false,
                postSrc: '',

                pageTitle: '给奉化水蜜桃点赞，为奉化桃农助力',
                imgSrc: '',
                Title: "",	//标题
                TitleColor: '#333333',
                PriceTxt: '',				//价格值
                OriginalTxt: '', 			//原价值
                OriginalTxtCut: true,		//价格删除线
                Referrer: '给你推荐',		//推荐人信息
                shareId: '', 				//生成后在数据库中的share
                shareNum: 1
            },

            item: {
                "banner": [],
                "promotion": {},
                "shop": {},
                cover: {},
                "item": { list: [] },
            },
            poi: null,
            share: '',
            // seller:'',
            rebate: 0,
        };
    },
    onLoad: async function (options) {
        thiz = this
        thiz.share = options.share
        this.share = uni.getStorageSync('seller')

        await this.zz.req({ $url: 'public/zz/mock', tar: 'goods' }, true).then(res => {
            // this.zz.req({$url:'public/zz/mock', tar:'goods'},true).then(res=>{
            // this.zz.request('mall_goods',{action:'getOne',id:options.id},false,true).then(res=>{
            // console.log('mall_goods ------------>', res)
            thiz.item = res
            thiz.poster.imgSrc = thiz.item.cover
            thiz.poster.Title = thiz.item.title
            thiz.poster.shareNum = thiz.item.share + 1
            if (thiz.item.promotion.status) {
                thiz.poster.PriceTxt = '￥' + thiz.item.promotion.v * thiz.item.promotion.cut
                thiz.poster.OriginalTxt = '￥' + thiz.item.promotion.v
            } else {
                thiz.poster.PriceTxt = '￥' + thiz.item._price + '-' + thiz.item.price_
                thiz.poster.OriginalTxt = '月销2000+'
                thiz.poster.OriginalTxtCut = false
            }
            this.zz.req({ $url: 'public/zz/mock', tar: 'goodspoi' }).then(res => {
                // console.log('thiz.res ------------>', res);
                // thiz.zz.request('poi', {action:"getByIds", id:thiz.item.poi}).then((res) => {
                thiz.poi = PARAGRAPH(res, 'poi')

                // console.log('thiz.poi ------------>', thiz.poi);
            })



            // this.zz.userEvent(20,30,this.item)
            // console.error('offselldate ---->',this.zz.timeToDate(this.item.offselldate))
            // console.error('onselldate ---->',this.zz.timeToDate(this.item.onselldate))
            // console.error('onshowdate ---->',this.zz.timeToDate(this.item.onshowdate))
        })
    },
    onShow() {
        this.user = this.zz.getAcc()
        this.cartCount = uni.getStorageSync('cartCount')
        if (this.cartCount === '') {
            // this.zz.request('mall_shopcart',{action:'getCartNum'}).then(res=>{
            // console.log('mall_shopcart ------------>', res);

            thiz.cartCount = 2
            uni.setStorageSync("cart", thiz.cartCount)
            thiz.topMenu[3].badge = thiz.cartCount
            // })
        } else { thiz.topMenu[3].badge = thiz.cartCount }
    },
    onPageScroll(e) {
        this.scrolled = e.scrollTop
        let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;

        if (thiz.load) {
            for (let i = 0; i < thiz.tabList.length; i++) {
                uni.createSelectorQuery().select('#tabto' + i).boundingClientRect(data => {
                    thiz.tabList[i].top = data.top + e.scrollTop;
                    thiz.tabList[i].bottom = data.bottom + e.scrollTop;
                }).exec()
            }
            thiz.load = false
        }



        // console.log("______________scrolled_____________"+thiz.scrolled)
        if (!thiz.isTabTap) {
            let scrollTop = e.scrollTop + (thiz.CustomBar + thiz.stickBarHeight)
            for (let i = 0; i < thiz.tabList.length; i++) {

                thiz.tabList[i].sight = (scrollTop > thiz.tabList[i].top && scrollTop < thiz.tabList[i].bottom)
            }
        }
        let opcity = scroll / this.WinWidth * 1.3;
        this.iconOpcity = 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity);
        // if (this.opcity >= 1 && opcity >= 1) {
        // 	return;
        // }
        this.opcity = opcity;
    },
    methods: {
        // moveTo: function(e) {
        // 	thiz.isTabTap = true
        // 	for (let k = 0; k < thiz.tabList.length; k++) {
        // 		thiz.tabList[k].sight = thiz.tabList[k].id == e.target.id
        // 	}
        // 	const tabheight = thiz.customBar + thiz.stickBarHeight -1 //tab 栏的高度 
        // 	uni.createSelectorQuery().select('#tab'+e.target.id).boundingClientRect(data => {
        // 		uni.pageScrollTo({
        // 			scrollTop: ((data.top + thiz.scrolled) - tabheight),
        // 			duration: 300,
        // 			complete: ()=>{
        // 				setTimeout(function() {
        // 					thiz.isTabTap = false
        // 				}, 500);
        // 			}
        // 		})
        // 	}).exec();
        // },

        moveTo: function (id) {
            thiz.isTabTap = true
            for (let k = 0; k < this.tabList.length; k++) {
                this.tabList[k].sight = this.tabList[k].id == id
            }
            const tabheight = thiz.CustomBar + 50  //tab 栏的高度 
            uni.createSelectorQuery().select('#tabto' + id).boundingClientRect(data => {
                uni.pageScrollTo({
                    scrollTop: (data.top + thiz.scrolled) - tabheight,
                    duration: 0,
                    // duration: 200,
                    complete: () => {
                        setTimeout(function () {
                            thiz.isTabTap = false
                        }, 200);
                    }
                })
            }).exec()
        },

        timeup: function () {
            let t = thiz.event
            if (t.timer.toEnroll || t.timer.toEndEnroll) {
                thiz.event.timer = ONTIME(t.typename, t.startEnroll, t.endEnroll, t.eventDate + " " + t.startTime)
                // console.log(thiz.event.timer)
                return
            }
            if (t.timer.toStart)
                thiz.event.timer.toStart = false
        },
        closeNotice() {
            this.noticeShow = false
        },

        itemChange(e) {
            let idx = e.currentTarget.dataset.id
            thiz.itemIdx = idx === thiz.itemIdx ? -1 : idx
        },
        deliverTo: function () {
            if (!this.zz.isLogin()) return this.loginTip = true
            this.showPopup('deliver', '我的收货地址')
        },

        showPopup: async function (typy, title) {
            if (typy == 'locmap' && !this.item.kml) {
                await this.zz.request('kml', { action: 'getByPid', pid: this.item.shop_id }, false, true).then(res => {
                    this.item.kml = res.data
                })
            }
            this.modalTitle = title
            this.modalType = typy
            this.popupShow = true
        },
        hidePopup: function (e) {
            this.popupShow = false
            this.modalTitle = ''
            this.modalType = ''
        },
        selectAddr(idx) { this.userAddrIdx = idx },
        editAddr(index) {
            if (index != -1) {
                let userAddr = this.user.addr[index]
                userAddr.idx = index
                uni.setStorageSync('userAddr', userAddr)
            }
            uni.navigateTo({
                url: "../editAddress/editAddress"
            })
        },
        submit: function () {
            // console.log(this.modalType)
            if (this.modalType === 'deliver') {
                let addr = this.user.addr[this.userAddrIdx]
                this.user.addr.splice(this.userAddrIdx, 1)
                this.user.addr.unshift(addr)
                this.zz.setUser(this.user)
            }
            if (this.modalType === 'buy') {
                if (!this.zz.isLogin()) return this.loginTip = true
                if (this.itemIdx != -1) {
                    let selected = this.item.item[thiz.itemIdx]
                    //判断是否有促销
                    if (this.item.promotion.status && Date.now() < this.item.promotion.enddate) {
                        selected.price.v = this.item.promotion.v
                        selected.price.cut = this.item.promotion.cut
                    }
                    let shop = {
                        _id: this.item.shop._id,
                        name: this.item.shop.name,
                        logo: this.item.shop.logo,
                        item_id: selected._id,
                        gid: this.item._id,
                        goodsCount: 1,
                        itemCount: this.count,
                        totalFee: this.count * selected.price.v * selected.price.cut,
                        share: this.share,
                        goods: [{
                            goods: { title: this.item.title },
                            item: selected,
                            count: this.count,
                        }]
                    }

                    if (thiz.seller && thiz.seller != '') { shop.seller = thiz.seller }

                    uni.setStorageSync('goods', shop)
                    this.zz.href('../submitOrder/submitOrder?action=goodsToOrder')
                }

            }
            if (this.modalType === 'add') {
                if (!this.zz.isLogin()) return this.loginTip = true
                if (thiz.itemIdx != -1 && thiz.count > 0) {
                    let args = {
                        action: 'add',
                        gid: thiz.item._id,
                        item_id: thiz.item.item[thiz.itemIdx]._id,
                        count: thiz.count
                    }
                    if (thiz.share && thiz.share != '') { args.share = thiz.share }
                    // if(thiz.seller&&thiz.seller!='') {args.seller = thiz.seller}
                    thiz.zz.request('mall_shopcart', args, true, true).then((res) => {
                        thiz.cartCount += thiz.count
                        thiz.topMenu[3].badge = thiz.cartCount
                        uni.setStorageSync("cart", thiz.cartCount)
                        thiz.item.item[thiz.itemIdx].num -= thiz.count
                        thiz.count = 1
                        // console.log('mall_shopcart===>', res)
                    })
                }
            }
            this.hidePopup()
        },

        countNum(num) {
            if ((thiz.count >= thiz.item.item[thiz.itemIdx].num && num == 1) || (thiz.count < 2 && num == -1)) return false
            thiz.count += num
        },




        bannerChange: function (e) {
            this.bannerIndex = e.detail.current
        },
        bannerView: function (e) {
            thiz.zz.viewIMG(this.item.banner, e.currentTarget.dataset.index)
        },
        imgView: function (img) { thiz.zz.viewIMG([img], 0) },

        openMenu: function () {
            this.menuShow = true;
        },
        closeMenu: function () {
            this.menuShow = false;
        },

        btnTopMenu(index) {
            this.closeMenu()
            let url = '', varify = true
            switch (index) {
                case 0:
                    url = '../message/message'
                    break;
                case 1:
                    url = '/pages/index/index'
                    varify = false
                    break;
                case 2:
                    url = '/pages/profile/profile'
                    break;
                case 3:
                    url = '../shopcart/shopcart'
                    break;
                case 4:
                    return uni.makePhoneCall({ phoneNumber: this.item.shop.phone })
                    break;
                case 5:
                    url = '/pages/feedback/feedback?page=mall'
                    varify = false
                    break;
                case 6:
                    return this.showPopup('share', '分享')
                    break;
                case 7:
                    url = '../coupon/coupon'
                    break;
                case 8:
                    varify = false
                    url = '/pages/profile/blog/bloglist'
                    break;
                case 9:
                    url = '/pages/profile/agent/agent'
                    break;
                default:
                    break;
            }
            this.zz.href(url, varify, this)
        },
        href(e) { this.zz.href(e) },



        //  ========================================================  share  ==========================================================
        // onShare() {},
        postImg: function (postSrc, shareId) {
            if (postSrc === -1) {
                thiz.zz.toast('系统繁忙，请重新生成')
                uni.hideLoading()
                this.hideModal()
                this.poster.doDraw = false
            } else {
                this.posterShow = true
                this.poster.postSrc = postSrc
                this.poster.shareId = shareId
                uni.hideLoading()
            }
        },
        getPoster: function (e) {
            if (!this.zz.isLogin()) { this.hidePopup(); return this.loginTip = true }
            if (this.item.exp) { this.hidePopup(); return thiz.zz.toast('商品已下架') }
            if (this.poster.postSrc === '') {
                this.poster.doDraw = true
            } else {
                this.posterShow = true
            }
            this.hidePopup()
        },
        hideModal() {
            this.posterShow = false
        },

        // 保存到系统相册
        saveImage() {
            // #ifndef H5
            uni.saveImageToPhotosAlbum({
                filePath: this.poster.postSrc,
                success(res) {
                    thiz.zz.request('share', { action: 'download', id: thiz.poster.shareId }).then((data) => {
                        thiz.hideModal()
                        // uni.showToast({title:'保存成功！'});
                        thiz.zz.userEvent(50, 30, thiz.item)
                        this.zz.modal('保存成功，是否接收分享后的下单提醒？', (e) => {
                            if (e) {
                                uni.requestSubscribeMessage({
                                    tmplIds: [this.basicdata.sys.msgTemplate.new_order],
                                    complete: (res) => {

                                    }
                                })
                            }
                        }, true)
                    })
                }
            })
            // #endif
            // #ifdef H5
            uni.showToast('保存了');
            // #endif
        },

        userEvent(t, p, o) { this.zz.userEvent(t, p, o) },
        kmlMap: function (id) { uni.navigateTo({ url: '../../map/map?_id=' + id }) }
    },
    onShareAppMessage(res) {
        this.hidePopup()
        return {
            title: this.item.title,
            // path: '/pages/index/index?path=/pages/mall/goodsDetail/goodsDetail&id='+this.item._id
            path: '/pages/share?path=/pages/mall/goodsDetail/goodsDetail&id=' + this.item._id
        }
    }
};
</script>

<style>
.tui-notice-board {
    /* margin-top: 10rpx; */
    width: 100%;
    padding-right: 20rpx;
    box-sizing: border-box;
    font-size: 1.4rem;
    height: 60rpx;
    background: #fff8d5;
    display: flex;
    align-items: center;
    /* position: fixed; */
    top: 0;
    /* #ifdef H5 */
    top: 44px;
    /* #endif */
    /* z-index: 999; */
}

.my-btn {
    width: 100%;
    padding: 0 10px 0 10px;

    // border-Radius:0px;
}

.my-btn[disabled] {
    opacity: 0.5;
    color: #000000;
}

.my-btn.button-hover {
    transform: translate(1rpx, 1rpx);
}

.tui-icon-bg {
    background: #fff8d5;
    padding-left: 30rpx;
    position: relative;
    z-index: 10;
}

// .tui-icon-class {
// 	margin-right: 12rpx;
// }

.tui-scorll-view {
    flex: 1;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    color: #f54f46;
}

.tui-notice {
    transform: translateX(100%);
}

.tui-animation {
    -webkit-animation: tui-rolling 20s linear infinite;
    animation: tui-rolling 20s linear infinite;
}

@-webkit-keyframes tui-rolling {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(-170%);
    }
}

@keyframes tui-rolling {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(-170%);
    }
}

page {
    background-color: #f7f7f7;
    font-size: 30rpx !important;
}

.container {
    padding-bottom: 110rpx;
}

.tui-header-box {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 111;
}

.tui-header {
    width: 100%;
    font-size: 1.8rem;
    line-height: 18px;
    font-weight: 500;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tui-header-icon {
    /* position: fixed; */
    top: 0;
    left: 10px;
    display: flex;
    align-items: flex-start;
    justify-items: center;
    justify-content: space-between;
    height: 32px;
    transform: translateZ(0);
    z-index: 9999;
}

.tui-header-icon .tui-badge {
    background: #e41f19 !important;
    position: absolute;
    right: -4px;
}

.tui-icon-ml {
    margin-left: 20rpx;
}

.tui-icon-box {
    position: relative;
    height: 20px !important;
    width: 20px !important;
    padding: 6px !important;

    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tui-banner-swiper {
    position: relative;
}

.tui-banner-tag {
    position: absolute;
    color: #fff;
    bottom: 30rpx;
    right: 0;
}

.tui-slide-image {
    width: 100%;
    display: block;
}

/*顶部菜单*/

.tui-menu-box {
    box-sizing: border-box;
}

.tui-menu-header {
    font-size: 1.7rem;
    color: #fff;
    height: 32px;
    display: flex;
    align-items: center;
}

.tui-menu-itembox {
    color: #fff;
    padding: 40rpx 10rpx 0 10rpx;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    font-size: 1.3rem;
}

.tui-menu-item {
    width: 22%;
    height: 160rpx;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background: rgba(0, 0, 0, 0.4);
    margin-right: 4%;
    margin-bottom: 4%;
}

.tui-menu-item:nth-of-type(4n) {
    margin-right: 0;
}

.tui-badge-box {
    position: relative;
}

.tui-badge-box .tui-badge-class {
    position: absolute;
    top: -8px;
    right: -8px;
}

.tui-msg-badge {
    top: -10px;
}

.tui-icon-up_box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tui-menu-text {
    padding-top: 12rpx;
}

.tui-opcity .tui-menu-text,
.tui-opcity .tui-badge-box {
    opacity: 0.5;
    transition: opacity 0.2s ease-in-out;
}

/*顶部菜单*/

/*内容 部分*/

.tui-padding {
    padding: 0 30rpx;
    box-sizing: border-box;
}

.tui-ml-auto {
    margin-left: auto;
}

/* #ifdef H5 */
.tui-ptop {
    padding-top: 44px;
}

/* #endif */

.tui-size {
    font-size: 1.2rem;
    line-height: 24rpx;
}

.tui-gray {
    color: #999;
}

.tui-icon-red {
    color: #ff201f;
}

.tui-border-radius {
    border-bottom-left-radius: 24rpx;
    border-bottom-right-radius: 24rpx;
    overflow: hidden;
}

.tui-radius-all {
    border-radius: 24rpx;
    overflow: hidden;
}

.tui-mtop {
    margin-top: 26rpx;
}

.tui-pro-detail {
    box-sizing: border-box;
    color: #333;
}

.tui-product-title {
    background: #fff;
    padding: 26rpx 0rpx 26rpx 0rpx;
}

.tui-pro-pricebox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ff201f;
    font-size: 1.8rem;
    font-weight: bold;
    line-height: 44rpx;
}

.tui-pro-price {
    display: flex;
    align-items: center;
}

.tui-price {
    font-size: 58rpx;
}

.tui-original-price {
    font-size: 1.3rem;
    line-height: 26rpx;
    padding: 10rpx 30rpx;
    box-sizing: border-box;
}

.tui-line-through {
    text-decoration: line-through;
}

.tui-collection {
    color: #333;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 44rpx;
}

.tui-scale-collection {
    transform: scale(0.7);
    transform-origin: center center;
    line-height: 24rpx;
    font-weight: normal;
    padding-top: 4rpx;
}

.tui-pro-titbox {
    font-size: 1.6rem;
    font-weight: 500;
    position: relative;
    padding: 0 150rpx 0 30rpx;
    box-sizing: border-box;
}

.tui-pro-title {
    padding-top: 20rpx;
}

.tui-share-btn {
    display: block;
    background: transparent;
    margin: 0;
    padding: 0;
    border-radius: 0;
    border: 0;
}

.tui-share-btn::after {
    border: 0;
}

.tui-share-box {
    display: flex;
    align-items: center;
}

.tui-share-position {
    position: absolute;
    right: 0;
    top: 30rpx;
}

.tui-share-text {
    padding-left: 8rpx;
}

.tui-sub-title {
    padding: 20rpx 0;
    line-height: 32rpx;
}

.tui-sale-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 30rpx;
}

.tui-discount-box {
    background: #fff;
}

.tui-list-cell {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    font-size: 1.3rem;
    line-height: 26rpx;
    padding: 36rpx 30rpx;
    box-sizing: border-box;
}

.tui-right {
    position: absolute;
    right: 30rpx;
    top: 30rpx;
}

.tui-top40 {
    top: 40rpx !important;
}

.tui-bold {
    font-weight: bold;
}

.tui-list-cell::after {
    content: '';
    position: absolute;
    border-bottom: 1rpx solid #eaeef1;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    bottom: 0;
    right: 0;
    left: 126rpx;
}

.tui-last::after {
    border-bottom: 0 !important;
}

.tui-flex-center {
    display: flex;
    align-items: center;
}

.tui-cell-title {
    white-space: nowrap;

    width: 86rpx;
    padding-right: 30rpx;
    flex-shrink: 0;
}

.tui-promotion-box {
    display: flex;
    align-items: center;
    padding: 10rpx 0;
    width: 80%;
}

.tui-promotion-box text {
    width: 70%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tui-basic-info {
    background: #fff;
}

.tui-addr-box {
    width: 76%;
}

.tui-addr-item {
    padding: 10rpx;
    line-height: 34rpx;
}

.tui-guarantee {
    background: #fdfdfd;
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx 30rpx 30rpx 30rpx;
    font-size: 1.2rem;
}

.tui-guarantee-item {
    color: #999;
    padding-right: 30rpx;
    padding-top: 10rpx;
}

.tui-pl {
    padding-left: 4rpx;
}

.tui-cmt-box {
    background: #fff;
}

.tui-between {
    justify-content: space-between !important;
}

.tui-cmt-all {
    color: #ff201f;
    padding-right: 8rpx;
}

.tui-cmt-content {
    font-size: 1.3rem;
}

.tui-cmt-user {
    display: flex;
    align-items: center;
}

.tui-acatar {
    width: 60rpx;
    height: 60rpx;
    border-radius: 30rpx;
    display: block;
    margin-right: 16rpx;
}

.tui-cmt {
    padding: 14rpx 0;
}

.tui-attr {
    font-size: 1.2rem;
    color: #999;
    padding: 6rpx 0;
}

.tui-cmt-btn {
    padding: 50rpx 0 30rpx 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tui-nomore-box {
    padding-top: 10rpx;
}

.tui-product-img {
    display: flex;
    flex-direction: column;
    transform: translateZ(0);
}

.tui-product-img image {
    width: 100%;
    display: block;
}

/*底部操作栏*/

.tui-col-7 {
    width: 58.33333333%;
}

.tui-col-5 {
    width: 41.66666667%;
}

.tui-operation {
    width: 100%;
    height: 100rpx;
    background: rgba(255, 255, 255, 0.98);
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    bottom: 0;
    left: 0;
    padding-bottom: env(safe-area-inset-bottom);
}

.tui-safearea-bottom {
    width: 100%;
    height: env(safe-area-inset-bottom);
}

.tui-operation::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    border-top: 1rpx solid #eaeef1;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
}

.tui-operation-left {
    display: flex;
    align-items: center;
}

.tui-operation-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
}

.tui-operation-text {
    font-size: 1.1rem;
    color: #333;
}

.tui-opacity {
    opacity: 0.5;
}

.tui-scale-small {
    transform: scale(0.9);
    transform-origin: center center;
}

.tui-operation-right {
    height: 100rpx;
    padding-top: 0;
}

.tui-right-flex {
    display: flex;
    align-items: center;
    justify-content: center;
}

.tui-flex-1 {
    flex: 1;
    padding: 16rpx;
}

/*底部操作栏*/

/*底部选择弹层*/

.tui-popup-class {
    border-top-left-radius: 24rpx;
    border-top-right-radius: 24rpx;
    padding-bottom: env(safe-area-inset-bottom);
}

.tui-popup-box {
    position: relative;
    padding: 30rpx 0 0 0;
}

.tui-popup-btn {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
}

/* .tui-popup-btn .tui-btn-class {
		width: 90% !important;
		display: block !important;
		font-size: 1.4rem !important;
	} */

/* .tui-icon-close {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
	} */

.tui-product-box {
    display: flex;
    align-items: flex-end;
    font-size: 1.2rem;
    padding-bottom: 30rpx;
}

.tui-popup-img {
    height: 200rpx;
    width: 200rpx;
    border-radius: 24rpx;
    display: block;
}

.tui-popup-price {
    padding-left: 20rpx;
    padding-bottom: 8rpx;
}

.tui-amount {
    color: #ff201f;
    font-size: 1.8rem;
}

.tui-number {
    font-size: 1.2rem;
    line-height: 24rpx;
    padding-top: 12rpx;
    color: #999;
}

.tui-popup-scroll {
    height: 600rpx;
    font-size: 1.3rem;
}

.tui-scrollview-box {
    padding: 0 30rpx 60rpx 30rpx;
    box-sizing: border-box;
}

.tui-attr-title {
    padding: 10rpx 0;
    color: #333;
}

.tui-attr-box {
    font-size: 0;
    padding: 20rpx 0;
}

.tui-attr-item {
    max-width: 100%;
    min-width: 200rpx;
    height: 64rpx;
    display: -webkit-inline-flex;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #f7f7f7;
    padding: 0 26rpx;
    box-sizing: border-box;
    border-radius: 32rpx;
    margin-right: 20rpx;
    margin-bottom: 20rpx;
    font-size: 1.3rem;
}

.tui-attr-active {
    background: #fcedea !important;
    color: #e41f19;
    font-weight: bold;
    position: relative;
}

.tui-attr-active::after {
    content: '';
    position: absolute;
    border: 1rpx solid #e41f19;
    width: 100%;
    height: 100%;
    border-radius: 40rpx;
    left: 0;
    top: 0;
}

.tui-number-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0 30rpx 0;
    box-sizing: border-box;
}

/*底部选择弹层*/
</style>
