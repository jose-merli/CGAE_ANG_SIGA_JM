import { Component, OnInit, Input, Output, ChangeDetectorRef, ViewChild, EventEmitter } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { GestionTipodocumentoComponent } from "./gestion-tipodocumento/gestion-tipodocumento.component";
import { TranslateService } from './../../../../../commons/translate';
import { SigaServices } from './../../../../../_services/siga.service';
import { DocumentacionEjgItem } from '../../../../../models/sjcs/DocumentacionEjgItem';
import { DocumentacionEjgObject } from '../../../../../models/sjcs/DocumentacionEjgObject';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { GestionDocumentosComponent } from './gestion-documentos/gestion-documentos.component';

@Component({
  selector: 'app-gestion-documentacionejg',
  templateUrl: './gestion-documentacionejg.component.html',
  styleUrls: ['./gestion-documentacionejg.component.scss']
})

export class GestionDocumentacionejgComponent implements OnInit {

  fichasPosibles;
  modoEdicion: boolean;
  dato;
  filtros;
  editMode: boolean = false;
  buscar: boolean = false;
  messageShow: string;
  selectedItem: number = 10;
  selectAll;
  documentos;
  progressSpinner: boolean = false;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  documentacionEjgItem;
  idTipoDoc;

  @ViewChild(GestionDocumentosComponent) tabla;
  @Output() searchHistoricalSend = new EventEmitter<boolean>();
  documentacionEjgObject: any;

  constructor(private location: Location,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    // this.getFichasPosibles();
    this.dato = this.persistenceService.getDatos();
    if (this.dato != undefined || this.dato != null) {
      //De un principio siempre se recarga la tabla sin historico
      this.searchDocumentos(false);
      this.modoEdicion = true;
      if (this.dato.fechabaja != null) {
        this.modoEdicion = true;
        this.persistenceService.setPermisos(false);
      }
    } else {
      this.documentacionEjgItem = new DocumentacionEjgItem();
      this.buscar = false;
      this.modoEdicion = false;

    }
  }

  searchDocumentos(event) {
    let datos = this.persistenceService.getDatos();
    this.idTipoDoc = datos.idTipoDocumento;
    this.filtros = new DocumentacionEjgItem();
    this.filtros.idTipoDocumento = this.idTipoDoc;
    this.filtros.historico = event;

    // this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("busquedaDocumentacionEjg_searchDocumentos", this.filtros).subscribe(
      n => {

        //console.log(JSON.parse(n.body).documentacionejgItems);

        this.documentacionEjgObject = JSON.parse(n.body).documentacionejgItems;


        this.documentos = this.documentacionEjgObject
        this.buscar = true;
        this.progressSpinner = false;
        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
        }

      },
      err => {
        //console.log(err);
      }
    );
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.idTipoDoc = event.idTipoDoc;
  }

  getFichasPosibles() {

    this.fichasPosibles = [
      {
        key: "edicionTipoDocumento",
        activa: true
      },
      {
        key: "tablaDocumentos",
        activa: true
      }

    ];
  }

  backTo() {
    this.location.back();
  }

  searchHistorical() {

    this.selectAll = false;
    this.selectedDatos = [];
    this.selectMultiple = false;
    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.searchHistoricalSend.emit(this.historico);

  }

}
