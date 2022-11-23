<template>

    <view>
        <cu-custom bgColor="bg-dark" :isBack="true">
            <block slot="content">服务协议</block>
        </cu-custom>
        <view class="container">
            <view class="tui-text">
                用户在使用【{{ sys.name }}】APP（以下简称‘本APP’）提供的网络服务前有义务仔细阅读本协议。用户在此不可撤销地承诺，若其使用【{{
                    sys.name
                }}】提供的网络服务，将视为用户同意并接受本协议全部条款的约束，此后用户无权以未阅读本协议或对本协议有任何误解为由，主张本协议无效或要求撤销本协议。
            </view>
            <view class="tui-text">
                【{{
                    sys.name
                }}】APP是一款户外轨迹导航和GPS记录工具，主要用于户外路线和步道相关的轨迹及基础数据采集。为保证本APP的正常使用，需要用户开启手机的持续定位功能及拍照和相册读取权限。
            </view>
            <view class="tui-text">
                第一条、保护用户个人信息是一项基本原则，我们将会采取合理的措施保护用户的个人信息。除法律法规规定的情形外，未经用户许可我们不会向第三方公开、透漏个人信息。
                本APP对相关信息采用专业加密存储与传输方式，保障用户个人信息安全，如果您选择同意使用本APP， 即表示您认可并接受本APP服务条款及其可能随时更新的内容。
            </view>
            <view class="tui-text">
                第二条、为保证本APP的正常使用，本APP会要求您开启并授权位置信息、照片相册、相机摄像头、WIFI网络、蜂窝通信网络的使用，如果您禁止APP使用以上相关服务和功能，您将自行承担不能获得或享用本APP相应服务的后果。
            </view>
            <view class="tui-text">
                第三条、为了提供更好的用户体验，基于技术必要性收集一些有关设备级别事件（例如崩溃）的信息，但这些信息并不能够让我们识别您的 身份。
                为了能够让APP定位服务更精确，可能会收集并处理有关您实际所在位置信息（例如移动设备发送的GPS信号），WI-FI接入点和 基站位置信息。
                我们将对上述信息实施技术保护措施，以最大程度保护这些信息不被第三方非法获得，同时，您可以自行选择拒绝我们基于技术必要性
                收集的这些信息，并自行承担不能获得或享用APP相应服务的后果。
            </view>
            <view class="tui-text">
                第四条、在您使用本APP期间产生的所有数据和记录均会在本地保存，由用户自行决定是否上传本APP服务器。所有上传服务器的数据我们都会妥善保存，并保证所有数据不会包含个人信息。
                在您使用我们的产品或服务的过程中，我们可能：需要您提供个人信息，如姓名、电子邮件地址、电话号码、联系地址等以及注册或申请服务时需要
                的其它类似个人信息；您对我们的产品和服务使用即表明您同意我们对这些信息的收集和合理使用。您可以自行选择拒绝、放弃使用相关产品或服务。
            </view>
            <view class="tui-text">
                第五条、由于您的自身行为或不可抗力等情形，导致上述可能涉及您隐私或您认为是私人信息的内容发生被泄露、批漏，或被第三方获取、使用、转让等情形的，均由您自行承担不利后果，我们对此不承担任何责任。
            </view>
            <view class="tui-text">
                第六条、本APP运行涉及到互联网及移动通讯等诸多客观因素的影响，
                因此任何因不可抗力、计算机（手机）病毒或黑客攻击、用户所在位置、设备关机、未开启相关的系统权限、GSM网络、互联网络、通信线路等其他”{{
                    sys.name
                }}”APP无法预测或控制的第三方原因，可能会造成本APP运营不稳定、中断、取消或终止事件，并可能由此将给您带来的损失，我们一概不承担赔偿责任。
            </view>
            <view class="tui-text">
                第七条、您仅在符合本APP使用目的的前提下被许可浏览和使用本APP，即以个人名义浏览信息。
                其他方式的使用都是被严格禁止的，包括但不限于以下方式：修改、销售、传送、再版、删除、添加、展览、记入或演示本APP的内容或以其他方式部分地或整体地非法使用本APP的内容。
            </view>
            <view class="tui-text">第八条、我们拥有对上述条款的最终解释权。</view>
            <view class="text-left text-sm">本APP的数据存储采用“阿里云”技术</view>
            <view class="text-right text-xs">宁波之之步道技术有限公司</view>
            <view class="text-right text-xs">2021-4-30</view>
        </view>
    </view>
</template>

<script>
// import { sys } from '@/common/dict';
export default {
    data() {
        return {
            sys: {
                name: '环浙步道'
            }
        };
    }
};
</script>

<style lang="scss">
.container {
    width: 100%;
    padding: $uni-spacing-row-lg;
    box-sizing: border-box;
    padding-bottom: 48rpx;
    background: #ffffff;
    .tui-text {
        // font-size: $uni-font-size-sm;
        text-indent: 2em;
        color: $uni-text-color;
        padding-bottom: $uni-spacing-col-sm;
        // tui-text-align: justify;
    }
    .tui-sub {
        padding-left: $uni-spacing-row-sm;
    }
}
</style>
