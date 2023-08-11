// 在这里对指定的请求路径添加单独的中间件函数

// 后端接口代理
// 原理为
// 先使用express搭建一个中间服务器，监听端口为9002
// 然后开启vite的server.port进行请求的代理
// 将本地的localhost:5173路径上的请求转到localhost:9002
// 改为使用中间服务器对QQ音乐后台服务器中资源的请求
// 请求完毕后，将数据返回给中间服务器，中间服务器返回给浏览器

const axios = require("axios");

// 用于获取签名
const getSecuritySign = require("./sign.js");

const ERR_OK = 0;
const token = 5381;

// 请求时所需的公共参数
// 所需哪些参数可以在进行请求时在调试工具-网络中查看
// https://zhuanlan.zhihu.com/p/32687188
// https://blog.csdn.net/qq_23594799/article/details/111477320
// https://blog.csdn.net/weixin_44159306/article/details/106292092
const commonParams = {
  g_tk: token,
  loginUin: 0,
  hostUin: 0,
  inCharset: "utf8",
  outCharset: "utf-8",
  notice: 0,
  needNewCode: 0,
  format: "json",
  platform: "yqq.json",
};

// 用于生成一个随机数值
// 返回prefix+随机数值组成的字符串
function getRandomVal(prefix = "") {
  return prefix + (Math.random() + "").replace("0.", "");
}

// 封装Get
function get(url, params) {
  return axios.get(url, {
    headers: {
      referer: "https://y.qq.com/",
      origin: "https://y.qq.com/",
    },
    // 拼接请求QQ音乐后端服务器时需要的参数
    params: Object.assign({}, commonParams, params),
  });
}

// 注册后端路由
function registerRouter(app) {
  // 注册推荐页面中请求的路由
  registerRecommend(app);
}

// 用于注册推荐页面中的请求路由
function registerRecommend(app) {
  app.get("/api/recommend", (req, res) => {
    // 第三方服务接口 url
    // 实际获取后端数据的baseURL
    // 由中间服务器进行请求
    const url = "https://u.y.qq.com/cgi-bin/musics.fcg";

    // 构造请求 data 参数
    // 结合上面的url以及data,对QQ音乐中的精彩推荐接口进行请求
    // 不是对精彩推荐中的某个图片进行请求,而是请求整个精彩推荐
    // 一来可以跟随QQ音乐后台接口的更新而更新
    // 二来可以同时请求到除图片之外的所需资源
    const data = JSON.stringify({
      comm: { ct: 24 },
      recomPlaylist: {
        method: "get_hot_recommend",
        param: { async: 1, cmd: 2 },
        module: "playlist.HotRecommendServer",
      },
      focus: {
        module: "music.musicHall.MusicHallPlatform",
        method: "GetFocus",
        param: {},
      },
    });

    // 随机数值
    const randomVal = getRandomVal("recom");
    // 计算签名值
    const sign = getSecuritySign(data);

    // 发送 get 请求
    // 需要sign, - 和data三个参数
    get(url, {
      sign,
      "-": randomVal,
      data,
    }).then((response) => {
      const data = response.data;
      if (data.code === ERR_OK) {
        // 处理轮播图数据
        const focusList = data.focus.data.shelf.v_niche[0].v_card;
        const sliders = [];
        const jumpPrefixMap = {
          10002: "https://y.qq.com/n/yqq/album/",
          10014: "https://y.qq.com/n/yqq/playlist/",
          10012: "https://y.qq.com/n/yqq/mv/v/",
        };
        // 最多获取 10 条数据
        const len = Math.min(focusList.length, 10);
        for (let i = 0; i < len; i++) {
          const item = focusList[i];
          const sliderItem = {};
          // 单个轮播图数据包括 id、pic、link 等字段
          sliderItem.id = item.id;
          sliderItem.pic = item.cover;
          if (jumpPrefixMap[item.jumptype]) {
            sliderItem.link =
              jumpPrefixMap[item.jumptype] + (item.subid || item.id) + ".html";
          } else if (item.jumptype === 3001) {
            sliderItem.link = item.id;
          }

          sliders.push(sliderItem);
        }

        // 处理推荐歌单数据
        const albumList = data.recomPlaylist.data.v_hot;
        const albums = [];
        for (let i = 0; i < albumList.length; i++) {
          const item = albumList[i];
          const albumItem = {};
          // 推荐歌单数据包括 id、username、title、pic 等字段
          albumItem.id = item.content_id;
          albumItem.username = item.username;
          albumItem.title = item.title;
          albumItem.pic = item.cover;

          albums.push(albumItem);
        }

        // 往前端发送一个标准格式的响应数据，包括成功错误码和数据
        res.json({
          code: ERR_OK,
          result: {
            sliders,
            albums,
          },
        });
      } else {
        res.json(data);
      }
    });
  });
}

module.exports = registerRouter;
// export default registerRouter;
