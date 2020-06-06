export enum StyledDaoNS {
  UserWrapper = 'UserWrapper',
  ContentWrapper = 'ContentWrapper'
}

export default class StyledDao {
  static has(nameSpace: StyledDaoNS): boolean {
    return localStorage.getItem(nameSpace) !== null;
  }

  static get(nameSpace: StyledDaoNS): string {
    return localStorage.getItem(nameSpace) || '';
  }

  static save(nameSpace: StyledDaoNS, style: string) {
    localStorage.setItem(nameSpace, style);
  }

  static clear() {
    localStorage.removeItem(StyledDaoNS.UserWrapper);
    localStorage.removeItem(StyledDaoNS.ContentWrapper);
  }
}
