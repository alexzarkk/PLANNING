export default {
    state: {
        navList: [{
            iconPath: "/static/bar/discover_.png",
            selectedIconPath: "/static/bar/discover.png",
            text: '首页',
            customIcon: false,
            pagePath: '/pages/index/index',
        },
        {
            iconPath: "/static/bar/nav_.png",
            selectedIconPath: "/static/bar/nav.png",
            text: '行程',
            customIcon: false,
            pagePath: '/pages/index/planning',
        },
        {
            iconPath: "/static/bar/event_.png",
            selectedIconPath: "/static/bar/event.png",
            text: '活动',
            customIcon: false,
            pagePath: '/pages/index/event',
        },
        {
            iconPath: "/static/bar/me_.png",
            selectedIconPath: "/static/bar/me.png",
            text: '我的',
            customIcon: false,
            pagePath: '/pages/index/me',
        },
        ],
    }
}