import { Component, OnInit } from '@angular/core';
// import { MenubarModule } from 'primeng/menubar';
// import { MenuItem } from 'primeng/api';
import { AuthenticationService } from './_services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(
    private autenticateService: AuthenticationService) {

  }

  ngOnInit() {
  }

  isLogged() {
    return this.autenticateService.isAutenticated();
  }

}
