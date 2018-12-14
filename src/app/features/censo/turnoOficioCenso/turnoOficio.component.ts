import { Component, OnInit } from "@angular/core";
import { OldSigaServices } from "../../../_services/oldSiga.service";

@Component({
  selector: "app-turnoOficio",
  templateUrl: "./turnoOficio.component.html",
  styleUrls: ["./turnoOficio.component.scss"]
})
export class TurnoOficioComponent implements OnInit {
  url;

  constructor(private sigaServices: OldSigaServices) {
    this.url = JSON.parse(sessionStorage.getItem("url"));
  }

  ngOnInit() {}
}
