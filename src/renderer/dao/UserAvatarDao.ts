const defaultAvatar = 'https://static.hdslb.com/images/member/noface.gif';
// expires： 单位毫秒, 默认10天
const expires = 1000 * 60 * 60 * 24 * 10;

interface UserAvatar {
  uid: number;
  avatar: string;
  expires: number;
}

interface UserAvatarData {
  [key: number]: UserAvatar
}

// 放缓存里面更快些
let userAvatarData:UserAvatarData = {}

export default class UserAvatarDao {
  // 初始化 检验expires, 到期自动删除
  static init() {
    const keyArr = Object.keys(localStorage);
    for (let i = 0; i < keyArr.length; i++) {
      if (keyArr[i].indexOf(`uid_`) !== -1) {
        const uid = Number(keyArr[i].replace('uid_', ''));
        const dataStr = localStorage.getItem(keyArr[i])
        if(dataStr) {
          const parseData: UserAvatar = JSON.parse(dataStr);
          if (Date.now() >= parseData.expires) {
            this.delete(uid);
          } else {
            userAvatarData[uid] = parseData
          }
        }
      }
    }
  }

  static has(uid: number): boolean {
    return userAvatarData.hasOwnProperty(uid);
  }

  static get(uid: number): UserAvatar {
    const data = userAvatarData[uid];
    if (!data) {
      return {
        uid,
        avatar: defaultAvatar,
        expires: Date.now(),
      };
    }
    return data;
  }

  static save(uid: number, avatar: string) {
    if(!uid || !avatar) return

    const avatarData: UserAvatar = {
      uid,
      avatar,
      expires: Date.now() + expires
    };
    userAvatarData[uid] = avatarData;
    localStorage.setItem(`uid_${uid}`, JSON.stringify(avatarData));
  }

  static delete(uid: number) {
    delete userAvatarData[uid]
    localStorage.removeItem(`uid_${uid}`);
  }
}

UserAvatarDao.init();
