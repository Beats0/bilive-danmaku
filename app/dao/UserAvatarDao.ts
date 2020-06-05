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
    return localStorage.getItem(String(uid)) !== null;
  }

  static get(uid: number): UserAvatar {
    const dataStr = localStorage.getItem(String(uid));
    if (!dataStr) {
      return {
        uid,
        avatar: defaultAvatar,
        expires: Date.now()
      };
    }
    const parseData: UserAvatar = JSON.parse(dataStr);
    // 检验expires, 到期自动删除
    if (Date.now() >= parseData.expires) {
      this.delete(uid);
    }
    return parseData;
  }

  static save(uid: number, avatar: string) {
    const avatarData: UserAvatar = {
      uid,
      avatar,
      expires: Date.now() + expires
    };
    localStorage.setItem(String(uid), JSON.stringify(avatarData));
  }

  static delete(uid: number) {
    localStorage.removeItem(String(uid));
  }

  static clear() {
    localStorage.clear();
  }
}
