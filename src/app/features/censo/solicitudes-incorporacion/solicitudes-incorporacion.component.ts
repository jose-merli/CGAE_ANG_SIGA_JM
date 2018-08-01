import { Component, OnInit } from "@angular/core";
import { OldSigaServices } from "../../../_services/oldSiga.service";

@Component({
  selector: "app-solicitudes-incorporacion",
  templateUrl: "./solicitudes-incorporacion.component.html",
  styleUrls: ["./solicitudes-incorporacion.component.scss"]
})
export class SolicitudesIncorporacionComponent {
  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("solicitudesIncorporacion");
  }

  ngOnInit() {}
}
