import { Component } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  user: User;
  constructor(private accountService: AccountService) { 
    this.user = this.accountService.userValue;
  }
}
