import { openLink, userAvatarFilter } from '../../../utils/common';

const defaultAvatar = 'https://static.hdslb.com/images/member/noface.gif';

export default function MsgUserAvatar(uid: number, avatar: string) {
  const face = userAvatarFilter(avatar);
  return (
    <img
      src={face || defaultAvatar}
      onClick={() => openLink(`https://space.bilibili.com/${uid}`)}
      className="pointer user-avatar"
    />
  );
}
