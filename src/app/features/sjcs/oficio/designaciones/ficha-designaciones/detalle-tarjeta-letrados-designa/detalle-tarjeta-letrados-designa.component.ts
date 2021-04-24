import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { JusticiableBusquedaItem } from '../../../../../../models/sjcs/JusticiableBusquedaItem';
import { Message } from 'primeng/components/common/api';


@Component({
  selector: 'app-detalle-tarjeta-letrados-designa',
  templateUrl: './detalle-tarjeta-letrados-designa.component.html',
  styleUrls: ['./detalle-tarjeta-letrados-designa.component.scss']
})
export class DetalleTarjetaLetradosDesignaComponent implements OnInit {


  msgs: Message[] = [];
  selectedItem: number = 10;
  datos;
  cols;
  rowsPerPage;
  selectMultiple: boolean = false;
  selectionMode: string = "single";
  numSelected = 0;
  art27: String;

  selectedDatos: any = [];

  selectAll: boolean = false;
  progressSpinner: boolean = false;

  @ViewChild("table") tabla;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getCols();
    //this.datos=this.interesados;
    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
    let datos: DesignaItem = designa;
    this.progressSpinner = true;
    let request = [designa.ano,  designa.idTurno, designa.numero];

    //Buscamos la designacion en la que estamos para extraer la informacion que falta
    this.sigaServices.post("designaciones_busquedaDesignacion", request).subscribe(
      data => {
        this.art27 = JSON.parse(data.body).art27;
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );

    this.progressSpinner = true;

    //Buscamos los letrados asociados a la designacion
    this.sigaServices.post("designaciones_busquedaLetradosDesignacion", request).subscribe(
      data => {
        let letrados = JSON.parse(data.body);
        if(letrados!=[]){
          this.datos = letrados;
          /* this.datos.fecharenunciasolicita;
          this.datos.fecharenuncia;
          this.datos.motivosrenuncia; */
        }
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  /* apellido1Colegiado: "DGZAWNY"
  apellido1Interesado: "VEUNX"
  apellido2Colegiado: "ZYGUHDV"
  apellido2Interesado: "IBOTJ"
  codigo: "10591"
  descripcionTipoDesigna: "Civil Automático"
  estado: "Activo"
  -factConvenio: 2013
  fechaAlta: "05/12/2013"
  fechaEntradaInicio: "05/12/2013"
  fechaEstado: "05/12/2013"
  -idInstitucion: 2035
  idInstitucion_juzg: 0
  idInstitucion_procur: 0
  idJuzgado: 26
  idModulo: "12"
  idPretension: 422
  idProcedimiento: 422
  idProcurador: 0
  idRol: 0
  idTipoDesignaColegio: 2
  -idTurno: 1023
  modulo: "CI03 - Proceso Verbal"
  nig: "2305042c20130004881"
  nombreColegiado: "DGZAWNY ZYGUHDV, BLAS"
  nombreInteresado: "VEUNX IBOTJ, PEDRO JOSE"
  nombreJuzgado: "JAEIC1 - Juzgado Instancia nº 1"
  nombreProcedimiento: "Juicio verbal (Desahucio Falta pago - 250.1.1)"
  nombreTurno: "CIJAE - CIVIL JAEN"
  numColegiado: "2048"
  numProcedimiento: "1048"
  -numero: 1003
  observaciones: "DESAHUCIO POR FALTA DE PAGO Y RECLAMACIÓN RENTAS" */

  ngOnChanges(changes: SimpleChanges): void {
    //this.datos=this.interesados;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  actualizaSeleccionados() {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (this.selectedDatos != undefined) {
      if (this.selectedDatos.length == undefined) this.numSelected = 1;
      else this.numSelected = this.selectedDatos.length;
    }
  }

  getCols() {

    /* 
•	Motivo de la renuncia. Icono con un tooltip para mostrar el campo de observaciones. */
    this.cols = [
      { field: "fechaDesignacion", header: "justiciaGratuita.oficio.designaciones.fechaDesignacion" },
      { field: "nColegiado", header: "censo.resultadosSolicitudesModificacion.literal.nColegiado" },
      { field: "apellidosNombre", header: "justiciaGratuita.oficio.designas.interesados.apellidosnombre" },
      { field: "fechaSolRenuncia", header: "justiciaGratuita.oficio.designas.letrados.fechaSolicitudRenuncia" },
      { field: "fechaEfecRenuncia", header: "justiciaGratuita.oficio.designas.letrados.fechaRenunciaEfectiva" },
      { field: "motivoRenuncia", header: "justiciaGratuita.oficio.designas.letrados.motivoRenuncia" }
    ];

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


  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      /* if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
        this.selectMultiple = true;
        this.selectionMode = "single";
      } else { */
      this.selectedDatos = this.datos;
      /* this.selectMultiple = false;
      this.selectionMode = "single";
    }
    this.selectionMode = "multiple"; */
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      /*  if (this.historico)
         this.selectMultiple = true;
       this.selectionMode = "multiple"; */
    }
  }

}
