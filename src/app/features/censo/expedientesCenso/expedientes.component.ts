import { Component, OnInit } from "@angular/core";
import { OldSigaServices } from "../../../_services/oldSiga.service";

@Component({
  selector: "app-expedientes",
  templateUrl: "./expedientes.component.html",
  styleUrls: ["./expedientes.component.scss"]
})
export class ExpedientesComponent implements OnInit {
  url;

  constructor(private sigaServices: OldSigaServices) {
    this.url = JSON.parse(sessionStorage.getItem("url"));
  }

  ngOnInit() {}
}
