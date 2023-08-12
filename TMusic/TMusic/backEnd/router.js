// 在这里对指定的请求路径添加单独的中间件函数

// 后端接口代理
// 原理为
// 先使用express搭建一个中间服务器，监听端口为9002
// 然后开启vite的server.port进行请求的代理
// 将本地的localhost:5173路径上的请求转到localhost:9002
// 改为使用中间服务器对QQ音乐后台服务器中资源的请求
// 请求完毕后，将数据返回给中间服务器，中间服务器返回给浏览器

// 主要需要掌握
// 1.代码书写的规范
// 2.请求前所需请求参数,请求体的确定和生成,以便能够正常进行请求
// 3.请求后对请求到的数据的处理,用于向浏览器中发送处理后的规范的数据

const axios = require("axios");

// 用于获取签名
const getSecuritySign = require("./sign.js");

const pinyin = require("pinyin");
const ERR_OK = 0;
const token = 5381;
// 歌曲图片加载失败时使用的默认图片
const fallbackPicUrl =
  "https://y.gtimg.cn/mediastyle/music_v11/extra/default_300x300.jpg?max_age=31536000";

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
// 封装POST
// 对 axios post 请求的封装
// 修改请求的 headers 值
function post(url, params) {
  return axios.post(url, params, {
    headers: {
      referer: "https://y.qq.com/",
      origin: "https://y.qq.com/",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

// 注册后端路由
function registerRouter(app) {
  // 注册推荐页面中请求的路由
  registerRecommend(app);
  // 注册歌手页面中请求的路由
  registerSingerList(app);
  // 注册歌手详情页面中请求的路由
  registerSingerDetail(app);
  // 注册歌手详情页面中歌曲详情中请求的路由
  registerSongsUrl(app);
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

// 用于注册歌手页面中请求的路由
function registerSingerList(app) {
  app.get("/api/getSingerList", (req, res) => {
    const url = "https://u.y.qq.com/cgi-bin/musics.fcg";
    const HOT_NAME = "热";

    const data = JSON.stringify({
      comm: { ct: 24, cv: 0 },
      singerList: {
        module: "Music.SingerListServer",
        method: "get_singer_list",
        param: {
          area: -100,
          sex: -100,
          genre: -100,
          index: -100,
          sin: 0,
          cur_page: 1,
        },
      },
    });

    const randomKey = getRandomVal("getUCGI");
    const sign = getSecuritySign(data);

    get(url, {
      sign,
      "-": randomKey,
      data,
    }).then((response) => {
      const data = response.data;
      if (data.code === ERR_OK) {
        // 处理歌手列表数据
        const singerList = data.singerList.data.singerlist;

        // 构造歌手 Map 数据结构
        const singerMap = {
          hot: {
            title: HOT_NAME,
            list: map(singerList.slice(0, 10)),
          },
        };

        singerList.forEach((item) => {
          // 把歌手名转成拼音
          const p = pinyin(item.singer_name);
          if (!p || !p.length) {
            return;
          }
          // 获取歌手名拼音的首字母
          const key = p[0][0].slice(0, 1).toUpperCase();
          if (key) {
            if (!singerMap[key]) {
              singerMap[key] = {
                title: key,
                list: [],
              };
            }
            // 每个字母下面会有多名歌手
            singerMap[key].list.push(map([item])[0]);
          }
        });

        // 热门歌手
        const hot = [];
        // 字母歌手
        const letter = [];

        // 遍历处理 singerMap，让结果有序
        for (const key in singerMap) {
          const item = singerMap[key];
          if (item.title.match(/[a-zA-Z]/)) {
            letter.push(item);
          } else if (item.title === HOT_NAME) {
            hot.push(item);
          }
        }
        // 按字母顺序排序
        letter.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });

        res.json({
          code: ERR_OK,
          result: {
            singers: hot.concat(letter),
          },
        });
      } else {
        res.json(data);
      }
    });
  });

  // 做一层数据映射，构造单个 singer 数据结构
  function map(singerList) {
    return singerList.map((item) => {
      return {
        id: item.singer_id,
        mid: item.singer_mid,
        name: item.singer_name,
        pic: item.singer_pic
          .replace(/\.webp$/, ".jpg")
          .replace("150x150", "800x800"),
      };
    });
  }
}

// 用于注册歌手详情页面中请求的路由
function registerSingerDetail(app) {
  app.get("/api/getSingerDetail", (req, res) => {
    const url = "https://u.y.qq.com/cgi-bin/musics.fcg";

    const data = JSON.stringify({
      comm: { ct: 24, cv: 0 },
      singerSongList: {
        method: "GetSingerSongList",
        param: { order: 1, singerMid: req.query.mid, begin: 0, num: 100 },
        module: "musichall.song_list_server",
      },
    });

    const randomKey = getRandomVal("getSingerSong");
    const sign = getSecuritySign(data);

    get(url, {
      sign,
      "-": randomKey,
      data,
    }).then((response) => {
      const data = response.data;
      if (data.code === ERR_OK) {
        const list = data.singerSongList.data.songList;
        // 歌单详情、榜单详情接口都有类似处理逻辑，固封装成函数
        const songList = handleSongList(list);

        res.json({
          code: ERR_OK,
          result: {
            songs: songList,
          },
        });
      } else {
        res.json(data);
      }
    });
  });
}
// 处理歌曲列表
function handleSongList(list) {
  const songList = [];

  list.forEach((item) => {
    const info = item.songInfo || item;
    if (info.pay.pay_play !== 0 || !info.interval) {
      // 过滤付费歌曲和获取不到时长的歌曲
      return;
    }

    // 构造歌曲的数据结构
    const song = {
      id: info.id,
      mid: info.mid,
      name: info.name,
      singer: mergeSinger(info.singer),
      url: "", // 在另一个接口获取
      duration: info.interval,
      pic: info.album.mid
        ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${info.album.mid}.jpg?max_age=2592000`
        : fallbackPicUrl,
      album: info.album.name,
    };

    songList.push(song);
  });

  return songList;
}
function mergeSinger(singer) {
  const ret = [];
  if (!singer) {
    return "";
  }
  singer.forEach((s) => {
    ret.push(s.name);
  });
  return ret.join("/");
}

// 用于注册歌曲url,获取歌手详情页面中的歌曲
// 因为歌曲的url每天都在变化,故在此处创建单独的接口根据歌手的mid对歌曲的url进行获取
function registerSongsUrl(app) {
  app.get("/api/getSongsUrl", (req, res) => {
    const mid = req.query.mid;

    let midGroup = [];
    // 第三方接口只支持最多处理 100 条数据，所以如果超过 100 条数据，我们要把数据按每组 100 条切割，发送多个请求
    if (mid.length > 100) {
      const groupLen = Math.ceil(mid.length / 100);
      for (let i = 0; i < groupLen; i++) {
        midGroup.push(mid.slice(i * 100, 100 * (i + 1)));
      }
    } else {
      midGroup = [mid];
    }

    // 以歌曲的 mid 为 key，存储歌曲 URL
    const urlMap = {};

    // 处理返回的 mid
    function process(mid) {
      const data = {
        req_0: {
          module: "vkey.GetVkeyServer",
          method: "CgiGetVkey",
          param: {
            guid: getUid(),
            songmid: mid,
            songtype: new Array(mid.length).fill(0),
            uin: "0",
            loginflag: 0,
            platform: "23",
            h5to: "speed",
          },
        },
        comm: {
          g_tk: token,
          uin: "0",
          format: "json",
          platform: "h5",
        },
      };

      const sign = getSecuritySign(JSON.stringify(data));
      debugger
      const url = `https://u.y.qq.com/cgi-bin/musics.fcg?_=${getRandomVal()}&sign=${sign}`;

      // 发送 post 请求
      return post(url, data).then((response) => {
        const data = response.data;

        if (data.code === ERR_OK) {
          const midInfo = data.req_0.data.midurlinfo;
          const sip = data.req_0.data.sip;
          const domain = sip[sip.length - 1];
          midInfo.forEach((info) => {
            // 获取歌曲的真实播放 URL
            urlMap[info.songmid] = domain + info.purl;
          });
        }
      });
    }

    // 构造多个 Promise 请求
    const requests = midGroup.map((mid) => {
      return process(mid);
    });

    // 并行发送多个请求
    return Promise.all(requests).then(() => {
      // 所有请求响应完毕，urlMap 也就构造完毕了
      res.json({
        code: ERR_OK,
        result: {
          map: urlMap,
        },
      });
    });
  });
}
// 获取一个随机 uid
function getUid() {
  const t = new Date().getUTCMilliseconds();
  return "" + ((Math.round(2147483647 * Math.random()) * t) % 1e10);
}

module.exports = registerRouter;
// export default registerRouter;
