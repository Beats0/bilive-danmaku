import { useTranslation } from 'react-i18next';
import StyledDao, { StyledDaoNS } from '../../../dao/StyledDao';

// user 样式
const UserWrapperStr = StyledDao.get(StyledDaoNS.UserWrapper);

// content 样式
const ContentWrapperStr = StyledDao.get(StyledDaoNS.ContentWrapper);

export default function CustomStyledPanel() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className="title title-sub">{t('CustomStyleTitle')}</h1>
      <div className="danmaku-adjust-row flex">
        <span className="danmaku-adjust-label v-middle dp-i-block">
          {t('CustomStyledUserName')}
        </span>
        <input
          type="text"
          defaultValue={UserWrapperStr}
          onBlur={(e) =>
            StyledDao.save(StyledDaoNS.UserWrapper, e.target.value)
          }
          className="link-input t-center v-middle border-box level-input custom-style"
        />
      </div>
      <div className="danmaku-adjust-row flex">
        <span className="danmaku-adjust-label v-middle dp-i-block">
          {t('CustomStyledDanmakuContent')}
        </span>
        <input
          type="text"
          defaultValue={ContentWrapperStr}
          onBlur={(e) =>
            StyledDao.save(StyledDaoNS.ContentWrapper, e.target.value)
          }
          className="link-input t-center v-middle border-box level-input custom-style"
        />
      </div>
    </>
  );
}
