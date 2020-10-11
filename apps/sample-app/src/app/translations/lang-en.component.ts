import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppText } from '@sample-app/shared/models/app-text.model';

@Component({
  selector: 'app-lang-en',
  template: '<div>LANG EN!!!!</div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LangEnComponent {
  language = 'English';
  text: AppText = {
    language: {
      name: 'english',
      code: 'en'
    },
    general: {
      email: 'Email',
      password: 'Password',
      buttons: {
        cancel: 'Cancel',
        add: 'Add',
        update: 'Update'
      },
      columns: {
        id: 'ID',
        edit: 'Edit',
        delete: 'Delete'
      }
    },
    errors: {
      editFormNotChanged: 'There are no changes to update',
      loginFailed: 'incorrect user/password',
      cannotOperateOnHigherRole: 'You cannot operate on a role higher than yours',
      itemDoesNotExist: '{item} does not exist',
      alreadyUsedEmail: 'The email address is already being used',
    },
    success: {
      itemWasAdded: '{entity} {id} was added successfully',
      itemWasUpdated: '{entity} {id} was update successfully',
      itemWasDeleted: '{entity} {id} was deleted successfully'
    },
    navbar: {
      logo: 'Logo',
      header: 'Header',
      logout: 'Logout'
    },
    pages: {
      login: {
        title: 'Login'
      },
      dashboard: {
        title: 'Dashboard'
      },
      users: {
        title: 'Users',
        addUser: {
          title: 'Add User',
          firstName: 'First Name',
          lastName: 'Last Name',
          role: 'Role',
          status: 'Status',
          email: 'Email',
          password: 'Password',
        },
        list: {
          title: 'Users',
          lastLoginTime: 'Last Login Time'
        }
      }
    }
  }
}
