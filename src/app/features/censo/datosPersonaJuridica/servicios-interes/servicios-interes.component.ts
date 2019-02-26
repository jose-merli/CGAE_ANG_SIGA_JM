import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ControlAccesoDto } from "../../../../models/ControlAccesoDto";
import { SigaServices } from "../../../../_services/siga.service";

@Component({
  selector: "app-servicios-interes",
  templateUrl: "./servicios-interes.component.html",
  styleUrls: ["./servicios-interes.component.scss"]
})
export class ServiciosInteresComponent implements OnInit {
  @ViewChild(ServiciosInteresComponent)
  serviciosInteresComponent: ServiciosInteresComponent;
  msgs: any[];
  @ViewChild("table") table;

  tarjeta: string;

  constructor(private router: Router, private sigaServices: SigaServices) {}

  ngOnInit() {
    this.checkAcceso();
  }

  irFacturacion() {
    this.router.navigate(["/facturas"]);
  }
  irAuditoria() {
    this.router.navigate(["/auditoriaUsuarios"]);
    sessionStorage.setItem("tarjeta", "/fichaPersonaJuridica");
  }
  irComunicaciones() {
    this.router.navigate(["/informesGenericos"]);
  }

  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "234";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjeta = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {}
    );
  }
}
