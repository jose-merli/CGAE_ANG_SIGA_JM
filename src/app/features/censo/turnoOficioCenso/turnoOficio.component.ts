import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { OldSigaServices } from "../../../_services/oldSiga.service";
import { Router } from "@angular/router";
import { DOCUMENT } from "@angular/platform-browser";

@Component({
  selector: "app-turnoOficio",
  templateUrl: "./turnoOficio.component.html",
  styleUrls: ["./turnoOficio.component.scss"]
})
export class TurnoOficioComponent implements OnInit {
  @ViewChild("con")
  con: HTMLTableCaptionElement;
  url;
  progressSpinner: boolean = false;
  constructor(
    private sigaServices: OldSigaServices,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.progressSpinner = true;
    if (sessionStorage.getItem("reload") == "si") {
      this.url = sigaServices.getOldSigaUrl("soj");
      sessionStorage.removeItem("reload");
      sessionStorage.setItem("reload", "no");
      setTimeout(() => {
        debugger;
        this.url = JSON.parse(sessionStorage.getItem("url"));
        document.getElementById("noViewContent").className =
          "mainFrameWrapper2";
        document.getElementById("noViewContent").className =
          "mainFrameWrapper2";
        this.router.navigate(["/turnoOficioCenso"]);
      }, 2000);
    } else {
      debugger;
      this.url = JSON.parse(sessionStorage.getItem("url"));
      sessionStorage.removeItem("url");
      setTimeout(() => {
        debugger;
        this.url = JSON.parse(sessionStorage.getItem("url"));
        document.getElementById("noViewContent").className = "mainFrameWrapper";
        this.progressSpinner = false;
      }, 2000);
    }
  }

  ngOnInit() {}
}
