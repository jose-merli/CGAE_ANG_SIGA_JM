import { Component, OnInit } from '@angular/core';
import { TestService } from '../../_services/test.service';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {
  respuestaServidor: string = "";
  name: string = "";
  url;  
  constructor(
    private _testService: TestService,
    private autenticateService: AuthenticationService
  ) {

  }

  ngOnInit() {        
  }

  canShowMenu(){
    return this.autenticateService.isAutenticated();
  }

}
