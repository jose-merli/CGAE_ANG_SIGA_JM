import { Component, OnInit } from "@angular/core";
import { OldSigaServices } from "../../../_services/oldSiga.service";

@Component({
  selector: "app-comunicaciones",
  templateUrl: "./comunicaciones.component.html",
  styleUrls: ["./comunicaciones.component.scss"]
})
export class ComunicacionesComponent implements OnInit {
  url;

  constructor(private sigaServices: OldSigaServices) {
    this.url = JSON.parse(sessionStorage.getItem("url"));
  }

  ngOnInit() {}
}
