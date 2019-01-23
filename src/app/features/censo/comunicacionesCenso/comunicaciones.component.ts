import { Component, OnInit } from "@angular/core";
import { OldSigaServices } from "../../../_services/oldSiga.service";

@Component({
  selector: "app-comunicaciones-censo",
  templateUrl: "./comunicaciones-censo.component.html",
  styleUrls: ["./comunicaciones-censo.component.scss"]
})
export class ComunicacionesCensoComponent implements OnInit {
  url;

  constructor(private sigaServices: OldSigaServices) {
    this.url = JSON.parse(sessionStorage.getItem("url"));
  }

  ngOnInit() { }
}
