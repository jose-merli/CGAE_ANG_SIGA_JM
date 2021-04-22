import { Component, OnInit,Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';
import { TranslateService } from '../../../../../commons/translate';
import { Message } from 'primeng/components/common/api';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';


@Component({
  selector: 'app-gestion-designaciones',
  templateUrl: './gestion-designaciones.component.html',
  styleUrls: ['./gestion-designaciones.component.scss']
})
export class GestionDesignacionesComponent implements OnInit {
  msgs: Message[] = [];
  selectMultiple: boolean = false;
  selectAll: boolean = false;
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

  @Output() busquedaDesignaciones = new EventEmitter<boolean>();

  @ViewChild("table") tabla: Table;

  constructor(private persistenceService: PersistenceService, private router: Router,  public sigaServices: SigaServices, private translateService: TranslateService) { }

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
    console.log(this.datos);
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
      { field: "fechaEntradaInicio", header: "censo.resultadosSolicitudesModificacion.literal.fecha" },
      { field: "estado", header: "censo.nuevaSolicitud.estado" },
      { field: "numColegiado", header: "facturacionSJCS.facturacionesYPagos.numColegiado" },
      { field: "nombreColegiado", header: "administracion.parametrosGenerales.literal.nombre.apellidos" },
      { field: "nombreInteresado", header: "justiciaGratuita.justiciables.literal.interesados" },
      { field: "validada", header: "Validada" },
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
    let idProcedimiento = dato.idProcedimiento;;
    let datosProcedimiento;
    let datosModulo;
    if(dato.idTipoDesignaColegio != null && dato.idTipoDesignaColegio != undefined){
      this.comboTipoDesigna.forEach(element => {
       if(element.value == dato.idTipoDesignaColegio){
        dato.descripcionTipoDesigna = element.label;
       }
       });
      }
      let designaProcedimiento = new DesignaItem();
      let data = sessionStorage.getItem("designaItem");
      let dataProcedimiento = JSON.parse(data);
      dataProcedimiento.idPretension = dato.idPretension;
      dataProcedimiento.idTurno = dato.idTurno;
      dataProcedimiento.ano = dato.factConvenio;
      dataProcedimiento.numero = dato.numero
      this.sigaServices.post("designaciones_busquedaProcedimiento", dataProcedimiento).subscribe(
        n => {
          datosProcedimiento = JSON.parse(n.body);
          if(datosProcedimiento.length == 0){
            dato.nombreProcedimiento = "";
            dato.idProcedimiento = "";
          }else{
            dato.nombreProcedimiento = datosProcedimiento[0].nombreProcedimiento;
            dato.idProcedimiento = dataProcedimiento.idPretension;
          }
          
          let designaModulo = new DesignaItem();
          let dataModulo = JSON.parse(data);
          dataModulo.idProcedimiento = idProcedimiento;
          dataModulo.idTurno = dato.idTurno;
          dataModulo.ano = dato.factConvenio;
          dataModulo.numero = dato.numero
          this.sigaServices.post("designaciones_busquedaModulo", dataModulo).subscribe(
            n => {
              datosModulo = JSON.parse(n.body);
              if(datosModulo.length == 0){
                dato.modulo = "";
                dato.idModulo = "";
              }else{
                dato.modulo = datosModulo[0].modulo;
                dato.idModulo = datosModulo[0].idModulo;
              }
              
              sessionStorage.setItem("nuevaDesigna",  "false");
              sessionStorage.setItem("designaItemLink",  JSON.stringify(dato));
              this.router.navigate(["/fichaDesignaciones"]);
            },
            err => {
              this.progressSpinner = false;
      
              console.log(err);
            },() => {
              this.progressSpinner = false;
            });;
      
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        },() => {
          this.progressSpinner = false;
        });;
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

    checkAcceso() {
        this.progressSpinner = true;
        let controlAcceso = new ControlAccesoDto();
        controlAcceso.idProceso = procesos_oficio.designa;
    
        this.sigaServices.post("acces_control", controlAcceso).subscribe(
          data => {
            const permisos = JSON.parse(data.body);
            const permisosArray = permisos.permisoItems;
            const derechoAcceso = permisosArray[0].derechoacceso;
    
            if (derechoAcceso == 3) {// es un colegio
    //           this.activacionEditar = true;
            } else if (derechoAcceso == 2) { //es un colegiado
    //           this.activacionEditar = false;
            } else {
              sessionStorage.setItem("codError", "403");
              sessionStorage.setItem(
                "descError",
                this.translateService.instant("generico.error.permiso.denegado")
              );
              this.router.navigate(["/errorAcceso"]);
            }
          },
          err => {
            this.progressSpinner = false;
            console.log(err);
          },
          () => {
            this.progressSpinner = false;
          }
        );
    
      } 
  actualizaSeleccionados(selectedDatos) {

  }

  clickFila(event) {
    if (event.data) { //} && !event.data.fechaBaja) {
      this.selectedDatos.pop();
    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

  delete(){

  }

  comunicar(){
    
  }

}
