import { Component } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {

  user: User;
  constructor(private accountService: AccountService) { 
    this.user = this.accountService.userValue;
  }

}
