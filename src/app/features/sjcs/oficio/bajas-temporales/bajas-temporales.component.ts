import { Component, OnInit } from "@angular/core";
import { OldSigaServices } from "../../../../_services/oldSiga.service";

@Component({
  selector: "app-bajas-temporales",
  templateUrl: "./bajas-temporales.component.html",
  styleUrls: ["./bajas-temporales.component.scss"]
})
export class BajasTemporalesComponent implements OnInit {
  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("bajasTemporales");
  }

  ngOnInit() {}
}
