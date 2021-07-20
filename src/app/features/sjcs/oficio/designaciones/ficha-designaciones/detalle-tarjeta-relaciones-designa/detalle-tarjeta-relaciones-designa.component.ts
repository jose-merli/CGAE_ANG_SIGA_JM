import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output, OnChanges } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { Message } from 'primeng/primeng';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { ConfirmationService } from 'primeng/api';
import { RelacionesItem } from '../../../../../../models/sjcs/RelacionesItem';

@Component({
  selector: 'app-detalle-tarjeta-relaciones-designa',
  templateUrl: './detalle-tarjeta-relaciones-designa.component.html',
  styleUrls: ['./detalle-tarjeta-relaciones-designa.component.scss']
})
export class DetalleTarjetaRelacionesDesignaComponent implements OnInit, OnChanges {

  msgs: Message[] = [];

  @Input() relaciones;

  @Output() searchRelaciones = new EventEmitter<boolean>();
  @Output() relacion = new EventEmitter<any>();

  selectedItem: number = 10;
  datos;
  cols;
  rowsPerPage;
  selectMultiple: boolean = false;
  selectionMode: string = "single";
  numSelected = 0;
  body;
  selectedDatos: any[] = [];

  selectAll: boolean = false;
  progressSpinner: boolean = false;

  @ViewChild("table") tabla;
  disabled: boolean = false;
  nuevo: boolean;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private datepipe: DatePipe,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) { }


  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }

  ngOnInit() {

    if (this.datos) {

      this.datos.forEach(element => {
        if (element.sjcs.charAt(0) == 'E') {
          if (element.impugnacion != null) {
            element.resolucion = element.impugnacion;
          }
        }
        element.fechaasunto = this.formatDate(element.fechaasunto);
      });
      this.body = sessionStorage.getItem("designaItemLink");
    }

    this.getCols();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const inputName in changes) {
      if (changes.hasOwnProperty(inputName)) {
        let change = changes[inputName];
        switch (inputName) {
          case 'relaciones': {
            this.datos = change.currentValue;
          }
        }
      }
    }
  }

  getCols() {
    this.cols = [
      { field: "sjcs", header: "justiciaGratuita.oficio.designas.interesados.identificador", width: '6%' },
      { field: "fechaasunto", header: "dato.jgr.guardia.saltcomp.fecha", width: '6%' },
      { field: "descturno", header: "justiciaGratuita.justiciables.literal.turnoGuardia" },
      { field: "letrado", header: "justiciaGratuita.sjcs.designas.colegiado" },
      { field: "interesado", header: "justiciaGratuita.sjcs.designas.datosInteresados" },
      { field: "dilnigproc", header: "sjcs.oficio.designaciones.relaciones.numDiligNigNproc" },
      { field: "resolucion", header: "justiciaGratuita.maestros.fundamentosResolucion.resolucion" }

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


  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  actualizaSeleccionados() {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = [];
      this.disabled = true;
    }
    if (this.selectedDatos != undefined) {
      this.disabled = false;
      if (this.selectedDatos.length == undefined) this.numSelected = 1;
      else this.numSelected = this.selectedDatos.length;
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


  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  clear() {
    this.msgs = [];
  }


  isAnySelected() {

    return this.selectedDatos.length != 0 ? true : false;

  }

  confirmDelete() {
    let mess = this.translateService.instant(
      "justiciaGratuita.ejg.message.eliminarRelacion"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: "delRelacionDes",
      message: mess,
      icon: icon,
      accept: () => {
        this.eliminarRelacion()
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancelar",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  eliminarRelacion() {
    /* this.progressSpinner = true;

    this.sigaServices.post("designaciones_eliminarRelacion", this.selectedDatos).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.relacion.emit();
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    ); */
    for (let dato of this.selectedDatos) {

      let identificador = dato.sjcs.charAt(0);

      switch (identificador) {
        case 'A':
          let relacion: RelacionesItem = new RelacionesItem();

          relacion.idinstitucion = dato.idinstitucion;
          relacion.numero = dato.numero;
          relacion.anio = dato.anio;

          this.sigaServices.post("designaciones_eliminarRelacionAsistenciaDes", relacion).subscribe(
            n => {
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              this.progressSpinner = false;
              this.selectedDatos = [];
              this.relacion.emit();
            },
            err => {
              console.log(err);
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
              this.selectedDatos = [];
              this.progressSpinner = false;
            }
          );
          break;
        case 'E':
          let relacionEjg: RelacionesItem = new RelacionesItem();

          relacionEjg.idinstitucion = dato.idinstitucion;
          relacionEjg.numero = dato.numero;
          relacionEjg.anio = dato.anio;
          relacionEjg.idturno = dato.idturno;

          this.sigaServices.post("designaciones_eliminarRelacion", relacionEjg).subscribe(
            n => {
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              this.progressSpinner = false;
              this.selectedDatos = [];
              this.relacion.emit();
            },
            err => {
              console.log(err);
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
              this.selectedDatos = [];
              this.progressSpinner = false;
            }
          );

          break;

        default:
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No se puede realizar la accion de eliminar. Tipo de Asunto incorrecto.");
          break;
      }
    }
  }

  porhacer() {
    this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
  }

  /*  checkPermisosAsociarSOJ() {
     // let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
      //if (msg != undefined) {
        //this.msgs = msg;
      //} else {
        this.asociarSOJ();
      //}
    }
 
   asociarSOJ() {
     //this.persistenceService.clearDatos();
     sessionStorage.setItem("radioTajertaValue", 'soj');
     let desItem = JSON.stringify(this.body);
     sessionStorage.setItem("Designacion", desItem);
     this.router.navigate(["/busquedaAsuntos"]);
 
   } */
  checkPermisosAsociarEJG() {
    // let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    //if (msg != undefined) {
    //this.msgs = msg;
    //} else {
    this.asociarEJG();
    //}
  }
  asociarEJG() {
    //this.persistenceService.clearDatos();
    sessionStorage.setItem("radioTajertaValue", 'ejg');
    //let desItem = JSON.stringify(this.body);
    sessionStorage.setItem("Designacion", this.body);
    this.router.navigate(["/busquedaAsuntos"]);

  }
  checkPermisosAsociarAsistencia() {
    // let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    //if (msg != undefined) {
    //this.msgs = msg;
    //} else {
    this.asociarAsistencia();
    //}
  }
  asociarAsistencia() {
    //this.persistenceService.clearDatos();
    sessionStorage.setItem("radioTajertaValue", 'asi');
    //let desItem = JSON.stringify(this.body);
    sessionStorage.setItem("Designacion", this.body);
    this.router.navigate(["/busquedaAsuntos"]);
  }
  checkPermisosCrearEJG() {
    // let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    //if (msg != undefined) {
    //this.msgs = msg;
    //} else {
    this.crearEJG();
    //}
  }
  crearEJG() {

    /*  this.progressSpinner = true;
     //Recogemos los datos de nuevo de la capa de persistencia para captar posibles cambios realizados en el resto de tarjetas
     this.body = this.persistenceService.getDatos();
     this.bodyInicial = JSON.parse(JSON.stringify(this.body));
     //Utilizamos el bodyInicial para no tener en cuenta cambios que no se hayan guardado.
     sessionStorage.setItem("EJG", JSON.stringify(this.bodyInicial));
     sessionStorage.setItem("nuevaDesigna", "true");
     if (this.art27) sessionStorage.setItem("Art27", "true");
     this.progressSpinner = false; */
    this.router.navigate(["/gestionEjg"]);
  }
}
