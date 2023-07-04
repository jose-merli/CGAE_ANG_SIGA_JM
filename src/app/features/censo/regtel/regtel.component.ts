import { Component, OnInit } from "@angular/core";
import { OldSigaServices } from "../../../_services/oldSiga.service";

@Component({
  selector: "app-regtel",
  templateUrl: "./regtel.component.html",
  styleUrls: ["./regtel.component.scss"]
})
export class RegtelComponent implements OnInit {
  url;

  constructor(private sigaServices: OldSigaServices) {
    this.url = JSON.parse(sessionStorage.getItem("url"));
  }

  ngOnInit() { }
}
