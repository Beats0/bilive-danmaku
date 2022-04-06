const defaultAvatar = 'https://static.hdslb.com/images/member/noface.gif';
// expires： 单位毫秒, 默认7天
const expires = 1000 * 60 * 60 * 24 * 7;

interface UserAvatar {
  uid: number;
  avatar: string;
  expires: number;
}

export default class UserAvatarDao {
  static has(uid: number): boolean {
    return localStorage.getItem(`uid_${uid}`) !== null;
  }

  static get(uid: number): UserAvatar {
    const dataStr = localStorage.getItem(`uid_${uid}`);
    if (!dataStr) {
      return {
        uid,
        avatar: defaultAvatar,
        expires: Date.now(),
      };
    }
    const parseData: UserAvatar = JSON.parse(dataStr);
    return parseData;
  }

  static save(uid: number, avatar: string) {
    const avatarData: UserAvatar = {
      uid,
      avatar,
      expires: Date.now() + expires
    };
    localStorage.setItem(`uid_${uid}`, JSON.stringify(avatarData));
  }

  static delete(uid: number) {
    localStorage.removeItem(`uid_${uid}`);
  }

  // 检验expires, 到期自动删除
  static clearExpiresData() {
    const keyArr = Object.keys(localStorage);
    for (let i = 0; i < keyArr.length; i++) {
      if (keyArr[i].indexOf(`uid_`) !== -1) {
        const uid = Number(keyArr[i].replace('uid_', ''));
        const parseData: UserAvatar = this.get(uid);
        if (Date.now() >= parseData.expires) {
          this.delete(uid);
        }
      }
    }
  }
}

UserAvatarDao.clearExpiresData();
