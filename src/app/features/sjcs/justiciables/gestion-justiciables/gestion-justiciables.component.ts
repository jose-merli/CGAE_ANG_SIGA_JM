import { Location } from "@angular/common";
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DatosGeneralesComponent } from './datos-generales/datos-generales.component';
// import { TablaMateriasComponent } from "./gestion-materias/tabla-materias.component";
import { TranslateService } from './../../../../commons/translate';
import { SigaServices } from './../../../../_services/siga.service';
import { ModulosItem } from "../../../../models/sjcs/ModulosItem";
import { PersistenceService } from '../../../../_services/persistence.service';

@Component({
  selector: 'app-gestion-justiciables',
  templateUrl: './gestion-justiciables.component.html',
  styleUrls: ['./gestion-justiciables.component.scss']
})
export class GestionJusticiablesComponent implements OnInit {

  fichasPosibles;
  modoEdicion: boolean;
  idProcedimiento;
  messageShow: string;
  acreditacionesItem;
  modulosItem;
  constructor(private location: Location,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService) { }

  ngOnInit() {

    if (this.persistenceService.getFichasPosibles() != null && this.persistenceService.getFichasPosibles() != undefined) {
      this.fichasPosibles = this.persistenceService.getFichasPosibles();
    }
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.idProcedimiento = event.idProcedimiento
  }

  backTo() {
    this.location.back();
  }
}
