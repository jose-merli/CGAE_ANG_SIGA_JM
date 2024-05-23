import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonsService } from "../../../../../_services/commons.service";
import { ModulosItem } from "../../../../../models/sjcs/ModulosItem";
import { procesos_maestros } from "../../../../../permisos/procesos_maestros";
import { SigaServices } from "./../../../../../_services/siga.service";

@Component({
  selector: "app-gestion-modulosybasesdecompensacion",
  templateUrl: "./gestion-modulosybasesdecompensacion.component.html",
  styleUrls: ["./gestion-modulosybasesdecompensacion.component.scss"],
})
export class GestionModulosYBasesComponent implements OnInit {
  fichasPosibles;
  modoEdicion: boolean;
  permisoEscritura: boolean = false;
  idProcedimiento;
  messageShow: string;
  acreditacionesItem;
  modulosItem: any;

  constructor(private location: Location, private route: ActivatedRoute, private sigaServices: SigaServices, private commonsService: CommonsService) {}

  ngOnInit() {
    this.getPermisos();
    this.route.queryParams.subscribe((params) => {
      this.idProcedimiento = params.idProcedimiento;
    });
    if (this.idProcedimiento != undefined) {
      this.searchModulos();
    }
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.idProcedimiento = event.idProcedimiento;
  }

  backTo() {
    this.location.back();
  }

  private getPermisos() {
    this.commonsService
      .checkAcceso(procesos_maestros.modulo)
      .then((respuesta) => {
        this.permisoEscritura = respuesta;
      })
      .catch((error) => console.error(error));
  }

  private searchModulos() {
    let filtros: ModulosItem = new ModulosItem();
    filtros.idProcedimiento = this.idProcedimiento;
    filtros.historico = true;
    this.sigaServices.post("modulosYBasesDeCompensacion_searchModulos", filtros).subscribe((n) => {
      this.modulosItem = JSON.parse(n.body).modulosItem[0];
      if (this.modulosItem.fechadesdevigor != null) {
        this.modulosItem.fechadesdevigor = new Date(this.modulosItem.fechadesdevigor);
      }
      if (this.modulosItem.fechahastavigor != null) {
        this.modulosItem.fechahastavigor = new Date(this.modulosItem.fechahastavigor);
      }
      if (this.modulosItem.fechabaja != undefined) {
        this.modulosItem.historico = true;
      }
    });
  }
}
