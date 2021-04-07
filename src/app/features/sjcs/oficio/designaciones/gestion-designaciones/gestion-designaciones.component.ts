import { Component, OnInit,Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';


@Component({
  selector: 'app-gestion-designaciones',
  templateUrl: './gestion-designaciones.component.html',
  styleUrls: ['./gestion-designaciones.component.scss']
})
export class GestionDesignacionesComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  buscadores = [];
  selectedItem: number = 10;
  initDatos;
  datosInicial = [];
  selectedDatos: any[] = [];
  isLetrado:boolean = false;
  first = 0;
  progressSpinner: boolean = false;
  comboTipoDesigna: any[];
  //Resultados de la busqueda
  @Input() datos;

  @Output() searchPartidas = new EventEmitter<boolean>();

  @ViewChild("table") tabla: Table;

  constructor(private persistenceService: PersistenceService, private router: Router,  public sigaServices: SigaServices) { }

  ngOnInit() {
    this.getComboTipoDesignas();
    if (
      sessionStorage.getItem("isLetrado") != null &&
      sessionStorage.getItem("isLetrado") != undefined
    ) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }
    this.selectedDatos = [];
    // this.datos.fechaActual = new Date();
    this.getCols();
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
    // if (this.persistenceService.getPaginacion() != undefined) {
    //   let paginacion = this.persistenceService.getPaginacion();
    //   this.first = paginacion.paginacion;
    //   this.selectedItem = paginacion.selectedItem;
    // }
    this.progressSpinner = false;
  }

  getCols(){

    this.cols = [
      { field: "nombreTurno", header: "justiciaGratuita.sjcs.designas.DatosIden.turno" },
      { field: "ano", header: "justiciaGratuita.ejg.datosGenerales.annioNum" },
      { field: "fechaEstado", header: "censo.resultadosSolicitudesModificacion.literal.fecha" },
      { field: "art27", header: "censo.nuevaSolicitud.estado" },
      { field: "numColegiado", header: "facturacionSJCS.facturacionesYPagos.numColegiado" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre.apellidos" },
      { field: "interesados", header: "justiciaGratuita.justiciables.literal.interesados" },
      { field: "validada", header: "general.boton.validar" },
    ];
    this.cols.forEach(element => {
      this.buscadores.push("");
    });

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }

  openTab(dato){
    if(dato.idTipoDesignaColegio != null && dato.idTipoDesignaColegio != undefined){
      this.comboTipoDesigna.forEach(element => {
       if(element.value == dato.idTipoDesignaColegio){
        dato.descripcionTipoDesigna = element.label;
       }
       });
      }
    sessionStorage.setItem("designaItemLink",  JSON.stringify(dato));
    this.router.navigate(["/fichaDesignaciones"]);
  }

  getComboTipoDesignas() {
    this.progressSpinner=true;

    this.sigaServices.get("designas_tipoDesignas").subscribe(
      n => {
        this.comboTipoDesigna = n.combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }, () => {
        this.arregloTildesCombo(this.comboTipoDesigna);
      }
    );
  }

arregloTildesCombo(combo) {
    if (combo != undefined)
      combo.map(e => {
        let accents =
          "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
        let accentsOut =
          "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        let i;
        let x;
        for (i = 0; i < e.label.length; i++) {
          if ((x = accents.indexOf(e.label[i])) != -1) {
            e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
            return e.labelSinTilde;
          }
        }
      });
  }


}
