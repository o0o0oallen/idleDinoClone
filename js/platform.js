var wx = {}
class WxgamePlatform {
  isLocal() { return false; }
  openLogin() { return true; }
  login(cb) {
    return new Promise((a1536, reject) => {
      var playerId = FBInstant.player.getID();
      var playerName = FBInstant.player.getName();
      var playerPic = FBInstant.player.getPhoto();
      console.log("玩家信息<<<<", playerId, playerName, playerPic);
      // var playerId = "111"
      if (cb) {
        cb(playerId, 1);
        platform.createShortcut();
      }
    })
  }

  //谷歌分析事件发送
  logEvent(eventName, param) {
    console.log("[platform] logEvent:", eventName, param);
    if (typeof(window["gtag"]) === "undefined") {
      console.log("gtag not init");
      return;
    }
    var gtag = window["gtag"];
    gtag("event", eventName, param);
  }

  //创建快捷⽅式
  createShortcut() {
    FBInstant.canCreateShortcutAsync()
      .then(function (canCreateShortcut) {
        console.log("[platform] 快捷方式 canCreateShortcut", canCreateShortcut)
        if (canCreateShortcut) {
          FBInstant.createShortcutAsync()
            .then(function () {
              // Shortcut created
              platform.subscribeBot();
              console.log("[platform] 快捷方式创建成功")
            }).catch(function () {
              // Shortcut not created
              platform.subscribeBot();
              console.log("[platform] 快捷方式创建失败")
            });
        } else {
          platform.subscribeBot();
        }
      });
  }

  //消息订阅
  subscribeBot() {
    //判断不是第一次进入游戏
    FBInstant.player.getDataAsync(["firstPlay"]).then(function(data){
      if (!data["firstPlay"]) {
        FBInstant.player.setDataAsync({firstPlay:1}).then(function(){
          console.log("[platform] subscribeBot() is firstPlay, set data");
          return;
        });
      }
    })
    FBInstant.player.canSubscribeBotAsync().then(function (can_subscribe) {
      console.log("[platform] 消息订阅 can_subscribe", can_subscribe);
      if (can_subscribe) {
        FBInstant.player.subscribeBotAsync().then(function () {
          // Player is subscribed to the bot
          console.log("[platform] 消息订阅成功");
        }).catch(function (e) {
          // Handle subscription failure
          console.log("[platform] 消息订阅失败");
        });
      }
    });
  }

  //匹配群聊
  playerMatch() {
    FBInstant.checkCanPlayerMatchAsync().then(canMatch => {
      console.log("[platform] 匹配群聊 canMatch", canMatch);
      if (canMatch) {
        FBInstant.matchPlayerAsync().then(function () {
          console.log("[platform] 匹配群聊成功");
        });
      }
    });
  }

  showMoreBtn(view){
    var self = view;
    var group = new eui.Group();
    group.width = 90;
    group.height = 101;
    var newMoreBtn = new eui.Image("yxqicon_png");
    newMoreBtn.x = -1;
    newMoreBtn.y = 14;
    newMoreBtn.scaleX = 1.1;
    newMoreBtn.scaleY = 1.1;
    newMoreBtn.width = 84;
    newMoreBtn.height = 72;
    group.addChild(newMoreBtn);
    self.moreGroup2.addChild(group);
    newMoreBtn.addEventListener("touchEnd", function(){
        newMoreBtn.scaleX = 1.3;
        newMoreBtn.scaleY = 1.3;
        egret.Tween.get(newMoreBtn).to({scaleX:1.1, scaleY:1.1}, 200, egret.Ease.backOut);
        platform.playerMatch();
    }, self);
  }
  
  getUserInfo(cb) {
    var playerName = FBInstant.player.getName();
    //var playerPic = FBInstant.player.getPhoto();
    if (cb) {
      cb({
        userInfo: {
          nickName: playerName,
          avatarUrl: "",
        }
      })
    }
    if (!wx.getUserInfo) return;
    return new Promise((a1536, reject) => {
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          var userInfo = res.userInfo;
          if (cb) {
            cb(res)
          }
          a1536(res);
        }
      })
    })
  }

  getSetting(w, h, x, y, cb) {
    platform.getUserInfo(cb);
  }

  getSetting2(cb) {
    if (!wx.getSetting) return;
    return new Promise((a1536, reject) => {
      wx.getSetting({
        withCredentials: true,
        success: function (res) {
          if (cb) {
            cb(res);
          }
          a1536(res);
        }
      })
    })
  }

  requestSubscribeSystemMessage(id, cb) {
    if (!wx.requestSubscribeSystemMessage) return;
    wx.requestSubscribeSystemMessage({
      msgTypeList: ['SYS_MSG_TYPE_INTERACTIVE', 'SYS_MSG_TYPE_RANK'],
      success(res) {
      },
      fail(res) {
      },
      complete(res) {
      }
    })
  }

  requestSubscribeMessage(id, cb) {
    if (!wx.requestSubscribeMessage) return;
    wx.requestSubscribeMessage({
      tmplIds: ['C4OQzHKekFl7kct_5rRHXCHozbVDJc1VGCHggjJe9Sw', '49xpcFHQzK-1BMheb5C2jiK2GIKEgyWhajt_HnW-hf4'],
      success(res) {
        if (cb) {
          cb(res["C4OQzHKekFl7kct_5rRHXCHozbVDJc1VGCHggjJe9Sw"] == "accept", res["49xpcFHQzK-1BMheb5C2jiK2GIKEgyWhajt_HnW-hf4"] == "accept");
          cb = null;
        }
      },
      fail(res) {
      },
      complete(res) {
      }
    })
  }
  createthisshouquanButton(width, height, x, y, cb) {
  }
  removethisshouquanButton() {
  }
  gameLoadResult(code) {
    hg.gameLoadResult && hg.gameLoadResult({ code: code || 0 })
  }
  getFriendCloudStorage(cb) {
    if (!wx.getFriendCloudStorage) return;
    wx.getFriendCloudStorage({
      keyList: ["value"],
      success: function (res) {
        console.log(JSON.stringify(res));
        if (cb) {
          cb(res);
        }
      },
      fail: function (res) {
        if (cb) {
          cb([]);
        }
        console.log('fail');
      }
    })
  }
  clearAllAssets() {
  }
  checkIsEmpty() {
    return true;
  }
  createRewardedVideoAd(callback) {
    if (callback) {
      callback(1);
    }
    return;
    if (!wx.createRewardedVideoAd) return;
    if (this.videoFlag) return;
    this.videoFlag = true;
    let iid = setTimeout(() => {
      this.videoFlag = false;
    }, 10000)
    if (egret) {
      egret.lifecycle.onPause()
    }
    var rewardedVideoAd = wx.createRewardedVideoAd(
      { adUnitId: 10396 }//传入广告id
    );
    rewardedVideoAd.show().then(() => {
      //
    }).catch(err => console.log(err.errMsg))
    rewardedVideoAd.onError = (err => {
      if (callback) {
        callback(-1);
        if (egret) {
          egret.lifecycle.onResume(-1)
        }
      }
      callback = null;
      this.videoFlag = false;
      if (iid) {
        clearTimeout(iid);
        iid = null;
      }
    });
    rewardedVideoAd.onClose = (res => {
      if (callback) {
        callback(res && res.isEnded || res === undefined);
        if (egret) {
          egret.lifecycle.onResume(-1)
        }
      }
      callback = null;
      this.videoFlag = false;
      if (iid) {
        clearTimeout(iid);
        iid = null;
      }
    });
  }
  setPreferredFramesPerSecond(fps) {
    if (wx.setPreferredFramesPerSecond) {
      wx.setPreferredFramesPerSecond(fps)
    }
  }
  openBanner(ischange) {
    // this.bannerAd = wx.showBannerAd({
    //   adUnitId: 10396,
    //   callback:function(res) {
    //   }
    // })
  }
  closeBanner() {
    // if (!!this.bannerAd) {
    //   hg.hideBannerAd(this.bannerAd)
    //   this.bannerAd = null;
    // }
  }

  //显示插屏广告
  getInterstitialAd(cb) {
  }

  openCustomerServiceConversation() {
    if (wx.openCustomerServiceConversation) {
      wx.openCustomerServiceConversation();
    }
  }

  getUpdateManager() {
    if (!wx.getUpdateManager) return;
    return wx.getUpdateManager();
  }
  showModal(obj) {
    if (!wx.showModal) return;
    wx.showModal(obj);
  }

  //震动····························· vibrateLong 400ms  vibrateShort 15ms
  vibrateShort() {
  }

  setUserCloudStorage(KVDataList) {
    if (!wx.setUserCloudStorage) return;
    return new Promise((a1536, reject) => {
      wx.setUserCloudStorage({
        KVDataList: KVDataList,
        success: res => {
          console.log('success--1', res);
          a1536(res);
        },
        fail: res => {
          console.log('fail--1', res);
        }
      })
    })
  }

  //复制
  copyText(text) {
    if (!wx.setClipboardData) return;
    wx.showToast({
      title: '复制成功',
    })
    wx.setClipboardData({
      data: text,
      success: function (res) {
        wx.getClipboardData({
          //这个api是把拿到的数据放到电脑系统中的
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }

  //分享
  shareAppMessage(base64Str, func) {
    FBInstant.shareAsync({
      intent: 'SHARE',
      image: base64Str,
      text: 'My dinosaur is stronger',
      data: { myReplayData: '...' },
    }).then(function () {
      // continue with the game.
      console.log("---------share success");
      if (func) {
        func();
      }
    });
  }

  //转发
  showShareMenu(imageUrl, imageUrlId, title, cb, userId) {
    if (!wx.showShareMenu || !wx.onShareAppMessage) return;
    return new Promise((a1536, reject) => {
      wx.showShareMenu({
        withShareTicket: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      wx.onShareAppMessage(function () {
        //用户点击了转发按钮
        return {
          title: title,
          imageUrlId: imageUrlId,
          imageUrl: imageUrl,
          query: userId && ("userId=" + userId) || "",//附带唯一参数
          success: (res) => {
            // console.log("转发成功", res);
            if (cb) {
              cb();
            }
          },
          fail: (res) => {
            // console.log("转发失败", res)
          },
        }
      })
    })
  }

  //游戏圈
  createGameClubButton(scaleX, scaleY, width, height, num) {
    if (!wx.createGameClubButton) return;
    let xAdd = 0;
    let yAdd = 0;
    wx.getSystemInfo({
      success: res => {
        // console.log('设备型号', res);
        if (res.model == "iPhone X" || res.model == "iPhone XR" || res.model == "iPhone XS Max") {
          xAdd = -33;
          yAdd = num;
        } else {
          xAdd = 0;
          yAdd = 0;
        }
        let windowWidth = res.windowWidth;
        let windowHeight = res.windowHeight;
        return new Promise((a1536, reject) => {
          let button = wx.createGameClubButton({
            type: 'text',
            text: '',
            style: {
              left: windowWidth * scaleX,
              top: windowHeight * scaleY + xAdd + yAdd,
              width: windowWidth * width,
              height: windowHeight * height,
              borderRadius: 50,
              backgroundColor: '#fff',
            }
          })
          this.gameclubButton = button;
        })
      }
    })
  }

  //反馈
  createFeedbackButton(scaleX, scaleY, width, height, num) {
    if (!wx.createFeedbackButton) return;
    let xAdd = 0;
    let yAdd = 0;
    wx.getSystemInfo({
      success: res => {
        if (res.model == "iPhone X" || res.model == "iPhone XR" || res.model == "iPhone XS Max") {
          xAdd = -33;
          yAdd = num;
        } else {
          xAdd = 0;
          yAdd = 0;
        }
        let windowWidth = res.windowWidth;
        let windowHeight = res.windowHeight;
        return new Promise((a1536, reject) => {
          let button = wx.createFeedbackButton({
            type: 'text',
            text: '',
            style: {
              left: windowWidth * scaleX,
              top: windowHeight * scaleY + xAdd + yAdd,
              width: windowWidth * width,
              height: windowHeight * height,
              backgroundColor: '#fff', //#fff透明覆盖
              borderRadius: 50
            }
          })
          this.feedbackButton = button;
          button.onTap((res) => {
            console.log("用户反馈:", res);
          });
        })
      }

    })
  }

  shouCustomAd(isChange, y) {
  }

  hideCustomAd() {
  }

  triggerGC(cb) {
    if (wx.triggerGC) {
      wx.triggerGC()
    }
  }
  getNetworkType(cb) {
  }

  navigateToMiniProgram(data, cb, failCB) {
  }

  removethisGameclubButton() {
    if (this.gameclubButton) {
      // this.gameclubButton.destroy();
    }
  }

  removethisFeedbackButton() {
    if (this.feedbackButton) {
      this.feedbackButton.destroy();
    }
  }

  getOpenDataContext() {
    if (!wx.getOpenDataContext) return;
    return wx.getOpenDataContext();
  }

  getLaunchOptionsSync() {
    if (!wx.getLaunchOptionsSync) return;
    return wx.getLaunchOptionsSync();
  }

  getSystemInfoSync() {
    if (!wx.getSystemInfoSync) return;
    return wx.getSystemInfoSync();
  }

  getAccountInfoSync() {
    return wx.getAccountInfoSync && wx.getAccountInfoSync() || null;
  }

  onShow(cb) {
    if (!wx.onShow) return;
    return wx.onShow(cb);
  }
}

window.platform = new WxgamePlatform();
window.platform.gversion = "1.0.50"
window.platform.bChangeList = false;
window.platform.adChannelId = 0;
window.platform.taskState = false
window.platform.taskInfo = null;
window.platform.gameID = 3;
window.platform.ap = 3;
window.platform.shortcut = false;