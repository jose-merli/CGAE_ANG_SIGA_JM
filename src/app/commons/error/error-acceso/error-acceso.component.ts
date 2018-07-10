import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-error-acceso",
  templateUrl: "./error-acceso.component.html",
  styleUrls: ["./error-acceso.component.scss"]
})
export class ErrorAccesoComponent implements OnInit {
  codError: number;
  descError: string;

  constructor() {}

  ngOnInit() {
    this.codError = JSON.parse(sessionStorage.getItem("codError")) as number;
    this.descError = sessionStorage.getItem("descError");
  }
}
