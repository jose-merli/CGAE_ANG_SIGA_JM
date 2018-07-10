import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";

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

  constructor(private router: Router) {}

  ngOnInit() {}

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
}
