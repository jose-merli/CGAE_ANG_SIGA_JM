import { Component, OnInit } from '@angular/core';
import { TestService } from './_services/test.service';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  respuestaServidor: string = "";
  name: string = "";
  url;  
  constructor(
    private _testService: TestService) {

  }

  ngOnInit() {        
  }

}
