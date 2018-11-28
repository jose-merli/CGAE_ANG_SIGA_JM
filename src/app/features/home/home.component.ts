import { Component, OnInit } from "@angular/core";
import { ComboItem } from "../administracion/parametros/parametros-generales/parametros-generales.component";
import { SigaServices } from "../../_services/siga.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  constructor(private sigaServices: SigaServices) {}

  ngOnInit() {
    this.getLetrado();
  }
  getLetrado() {
    let isLetrado: ComboItem;
    this.sigaServices.get("getLetrado").subscribe(
      data => {
        isLetrado = data;
        if (isLetrado.value == "S") {
          sessionStorage.setItem("isLetrado", "true");
        } else {
          sessionStorage.setItem("isLetrado", "false");
        }
      },
      err => {
        sessionStorage.setItem("isLetrado", "true");
        console.log(err);
      }
    );
  }
}
