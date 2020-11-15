export interface AppText {
  language: {
    name: string;
    code: string;
  },
  general: {
    email: 'Email'
    password: 'Password'
    buttons: {
      cancel: string;
      add: string;
      update: string;
    },
    columns: {
      id: string;
      edit: string;
      delete: string;

    }
  },
  errors: {
    editFormNotChanged: string;
    loginFailed: string;
    cannotOperateOnHigherRole: string;
    itemDoesNotExist: string;
    alreadyUsedEmail: string;
    noInternetConnection: string;
  },
  success: {
    itemWasAdded: string;
    itemWasUpdated: string;
    itemWasDeleted: string;
  },
  navbar: {
    logo: string;
    header: string;
    logout: string;
  },
  pages: {
    login: {
      title: string;
    }
    dashboard: {
      title: string;
    },
    users: {
      title: string;
      addUser: {
        title: string;
        firstName: string;
        lastName: string;
        role: string;
        status: string;
        email: string;
        password: string;
      },
      list: {
        title: 'Users',
        lastLoginTime: string;
      }
    }
  }
}
