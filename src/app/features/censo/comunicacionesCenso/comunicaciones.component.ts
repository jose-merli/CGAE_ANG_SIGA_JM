import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { OldSigaServices } from "../../../_services/oldSiga.service";

@Component({
  selector: "app-comunicaciones-censo",
  templateUrl: "./comunicaciones-censo.component.html",
  styleUrls: ["./comunicaciones-censo.component.scss"]
})
export class ComunicacionesCensoComponent implements OnInit {
  url;

  constructor(private sigaServices: OldSigaServices, private activatedRoute: ActivatedRoute) {
    this.url = JSON.parse(sessionStorage.getItem("url"));
  }

  ngOnInit() {
    this.activatedRoute.snapshot.params["id"];
  }
}
