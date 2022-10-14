<template>
<page-meta root-font-size="10px"></page-meta>
    <view class="container">
        <cu-custom :isBack="true" bgColor="bg-dark"><block slot="content">隐私保护声明</block></cu-custom>
        <view>
            <!-- <web-view :webview-styles="webviewStyles" src="https://zts.5618.co/repo/about/privacy.html"></web-view> -->
            <view class="padding">
                <view class="text-xxl text-center"></view>
                <view class="pre-line">
                    开发者承诺遵守本隐私保护声明，并确保用户个人信息及个人隐私不被泄露。本隐私保护声明旨在披露【{{
                        sys.name
                    }}】应用的隐私政策，并解释用户个人信息收集和使用的有关情况。
                </view>
                <ol>
                    <li>
                        <view class="text-xl">我们对个人信息的收集</view>
                        <p>
                            <!-- 我们的产品基于DCloud uni-app(5+ App/Wap2App)开发， -->
                            【{{ sys.name }}】运行期间需要收集您的设备唯一识别码（IMEI/android ID/DEVICE_ID/IDFA、SIM 卡 IMSI
                            信息）以提供统计分析服务，并通过应用启动数据及异常错误日志分析改进性能和用户体验，为用户提供更好的服务。
                        </p>
                        <p>
                            【{{ sys.name }}】收集信息是为了向所有用户提供更好的服务，这包括获取一些基本的信息，也包括在您注册、使用【{{
                                sys.name
                            }}】及旗下相关产品时，与个人有关的账号信息。此类信息包括：
                        </p>
                        <view class="text-bold">1.1 设备信息</view>
                        <p>
                            【{{ sys.name }}】会收集与设备相关的信息，比如手机类型、系统平台、软件版本等。这些信息都能够帮助我们优化应用的使用体验，并确保用户获得最新的版本功能。
                        </p>
                        <view class="text-bold">1.2 位置信息</view>
                        <p>当您访问我们的网站或使用相关应用时，我们可能会进行地理位置定位，这会帮助我们帮您提供本地文章等相关资讯。</p>
                        <view class="text-bold">1.3 日志信息</view>
                        <p>当您使用【{{ sys.name }}】相关应用时，我们可能会自动收集某些信息并存储在服务器日志中。此类信息包括：</p>
                        <view class="ol">
                            <p>① 使用了应用的哪些功能及访问的顺序、阅读文章的类型及频率、搜索订阅的频道等信息；</p>
                            <p>② IP地址；</p>
                            <p>③ 您的网络请求、手机类型、及提出请求的日期和时间；</p>
                            <p>④ 收集应用的闪退等崩溃事件信息，用于我们跟进并修复问题。</p>
                        </view>
                    </li>
                    <li>
                        <view class="text-xl">信息的披露</view>
                        <p>【{{ sys.name }}】相关应用未经允许不会向第三方披露您的个人信息，除非出现下述情形之一：</p>
                        <p>① 根据法律规定或有权部门的要求提供您的个人信息；</p>
                        <p>② 在紧急情况下，为了保护【{{ sys.name }}】及其用户的合法权益或公共安全及利益的；</p>
                        <p>③ 您授权或同意【{{ sys.name }}】披露的；</p>
                        <p>④ 符合【{{ sys.name }}】相关服务条款、软件使用许可协议的约定；</p>
                        <p>
                            用户提供给【{{ sys.name }}】的信息，我们会收集、整理并妥善保管。然而为了给用户提供更好的服务，我们可能会向【{{
                                sys.name
                            }}】的合作伙伴或公司共享用户信息，但会监督合作公司遵循隐私保护声明里的规定以保护用户隐私。
                        </p>
                    </li>
                    <li>
                        <view class="text-xl">更新与公开信息</view>
                        <p>【{{ sys.name }}】鼓励用户更新和修改个人信息来使其有效。用户可自行决定修改相关资料，如昵称、头像等。</p>
                        <p>
                            请注意，当您自愿披露个人信息（如，您在某篇文章下的留言板处公布）时， 信息可能被他人收集及使用，因此造成您的个人信息泄露，【{{
                                sys.name
                            }}】不承担责任。此外，我们提醒您，您是唯一对您的账号和密码信息负有保密责任的人，请注意妥善保管。
                        </p>
                    </li>
                    <li>
                        <view class="text-xl">未成年人信息及使用</view>
                        <p>
                            【{{ sys.name }}】非常重视对未成年人个人信息的保护。若您是18周岁以下的未成年人，在使用【{{
                                sys.name
                            }}】的服务前，应事先取得您家长或法定监护人的书面同意。【{{ sys.name }}】将根据国家相关法律法规的规定保护未成年人的相关信息。
                        </p>
                    </li>
                    <li>
                        <view class="text-xl">隐私保护声明的修订</view>
                        <p>
                            随着【{{
                                sys.name
                            }}】相关产品的发展，我们会不时更新或修改本隐私保护声明。当个人信息政策方面有修改时，我们会在产品或官方网页显著位置发布对隐私声明所做的变更。
                        </p>
                    </li>
                    <li>
                        <view class="text-xl">免责</view>
                        <p>除上述第5条规定属免责外，发生下列情形时，【{{ sys.name }}】也无需承担任何法律责任：</p>
                        <p>① 由于您将账号、密码告知他人或与他人共享注册账号，导致个人信息泄露的；</p>
                        <p>② 由于黑客行为、计算机病毒入侵或因政府管制而造成的暂时性关闭等影响网络正常运行之不可抗力而造成的个人信息泄露、丢失、被盗用或被篡改等；</p>
                        <p>③ 由于与【{{ sys.name }}】链接的其它网站所造成之个人资料泄露及由此而导致的任何法律争议和后果。</p>
                    </li>
                    <li>
                        <view class="text-xl">联系我们</view>
                        <p>
                            若您对【{{ sys.name }}】相关服务，或对本声明中所涉及到的隐私措施有疑问，请邮件至【{{ sys.name }}】的用户反馈邮箱：86698736@qq.com
                            或电话联系我们：13216685888
                        </p>
                    </li>
                </ol>
            </view>
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

<style>

.container{
    background: #ffffff;
}

.pre-line {
    white-space: pre-line;
    text-indent: 1em;
}
</style>
