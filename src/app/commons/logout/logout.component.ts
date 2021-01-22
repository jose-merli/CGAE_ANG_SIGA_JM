import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.scss"]
})
export class LogoutComponent implements OnInit {
  codError: number;
  descError: string;

  constructor() {}

  ngOnInit() {
    setTimeout(function() {
      window.open('', '_self').close();
      //debugger; 
      //window.open('','_parent',''); 
      //window.close();  
      }, 5000);
  }
}
