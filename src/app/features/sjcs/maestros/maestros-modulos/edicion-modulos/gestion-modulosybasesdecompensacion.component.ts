import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { ModulosItem } from "../../../../../models/sjcs/ModulosItem";
import { SigaServices } from "./../../../../../_services/siga.service";
import { TranslateService } from "./../../../../../commons/translate";

@Component({
  selector: "app-gestion-modulosybasesdecompensacion",
  templateUrl: "./gestion-modulosybasesdecompensacion.component.html",
  styleUrls: ["./gestion-modulosybasesdecompensacion.component.scss"],
})
export class GestionModulosYBasesComponent implements OnInit {
  fichasPosibles;
  modoEdicion: boolean;
  idProcedimiento;
  messageShow: string;
  acreditacionesItem;
  modulosItem;
  constructor(private location: Location, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef, private translateService: TranslateService, private sigaServices: SigaServices, private persistenceService: PersistenceService) {}

  ngOnInit() {
    // this.getFichasPosibles();
    this.route.queryParams.subscribe((params) => {
      this.idProcedimiento = params.idProcedimiento;
    });
    if (this.idProcedimiento != undefined) {
      this.searchModulos();
    }
  }

  searchModulos() {
    let filtros: ModulosItem = new ModulosItem();
    filtros.idProcedimiento = this.idProcedimiento;
    filtros.historico = false;
    if (this.persistenceService.getHistorico() != undefined) {
      filtros.historico = this.persistenceService.getHistorico();
    }
    this.sigaServices.post("modulosYBasesDeCompensacion_searchModulos", filtros).subscribe((n) => {
      this.modulosItem = JSON.parse(n.body).modulosItem[0];
      if (this.modulosItem.fechabaja != undefined || this.persistenceService.getPermisos() != true) {
        this.modulosItem.historico = true;
      }
      this.modulosItem.buscar = true;
    });
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.idProcedimiento = event.idProcedimiento;
  }

  backTo() {
    this.location.back();
  }
}
