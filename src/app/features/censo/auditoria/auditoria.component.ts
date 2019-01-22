import { Component, OnInit } from "@angular/core";
import { OldSigaServices } from "../../../_services/oldSiga.service";

@Component({
  selector: "app-auditoria",
  templateUrl: "./auditoria.component.html",
  styleUrls: ["./auditoria.component.scss"]
})
export class AuditoriaComponent implements OnInit {
  url;

  constructor(private sigaServices: OldSigaServices) {
    this.url = JSON.parse(sessionStorage.getItem("url"));
  }

  ngOnInit() {}
}
