import { Component, OnInit } from "@angular/core";
import { ComboItem } from "../administracion/parametros/parametros-generales/parametros-generales.component";
import { SigaServices } from "../../_services/siga.service";
import { FichaColegialGeneralesItem } from "./../../../app/models/FichaColegialGeneralesItem";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  constructor(private sigaServices: SigaServices) {}
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();

  ngOnInit() {
    this.getLetrado();
    this.getColegiadoLogeado();
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

  getColegiadoLogeado() {
    this.generalBody.searchLoggedUser = true;

    this.sigaServices
      .postPaginado(
        "busquedaColegiados_searchColegiado",
        "?numPagina=1",
        this.generalBody
      )
      .subscribe(
        data => {
          let busqueda = JSON.parse(data["body"]);
          sessionStorage.setItem(
            "personaBody",
            JSON.stringify(busqueda.colegiadoItem[0])
          );
          console.log(JSON.parse(sessionStorage.getItem("personaBody")));
          sessionStorage.setItem("esNuevoNoColegiado", JSON.stringify(false));
          sessionStorage.setItem("esColegiado", "true");
        },
        err => {
          console.log(err);
        },
        () => {}
      );
  }
}
