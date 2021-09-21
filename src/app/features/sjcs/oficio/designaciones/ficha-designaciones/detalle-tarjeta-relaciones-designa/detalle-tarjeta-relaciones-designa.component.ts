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
import { EJGItem } from '../../../../../../models/sjcs/EJGItem';

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
  body: DesignaItem;
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
      this.body = JSON.parse(sessionStorage.getItem("designaItemLink"));
    } else {
      this.relacion.emit();
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
      { field: "dilnigproc", header: 'justiciaGratuita.ejg.busquedaAsuntos.nigNumProc' },
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
              this.selectedDatos = [];
              this.relacion.emit();
              this.progressSpinner = false;
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
          let anio = this.body.ano.toString().substr(1, 4);
          let request = [
            dato.idinstitucion, dato.numero, dato.anio, dato.idtipo, anio, this.body.numero, this.body.idTurno
          ]

          this.sigaServices.post("designaciones_eliminarRelacion", request).subscribe(
            n => {
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              this.selectedDatos = [];
              this.relacion.emit();
              this.progressSpinner = false;
            },
            err => {
              console.log(err);
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
              this.selectedDatos = [];
              this.progressSpinner = false;
            }
          );

          break;

      }
    }
  }

  porhacer() {
    this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
  }

  checkPermisosAsociarEJG() {
    this.asociarEJG();
  }
  asociarEJG() {
    sessionStorage.setItem("radioTajertaValue", 'ejg');
    sessionStorage.setItem("Designacion", JSON.stringify(this.body));
    this.router.navigate(["/busquedaAsuntos"]);

  }
  checkPermisosAsociarAsistencia() {
    this.asociarAsistencia();
  }
  asociarAsistencia() {
    sessionStorage.setItem("radioTajertaValue", 'asi');
    sessionStorage.setItem("Designacion", JSON.stringify(this.body));
    this.router.navigate(["/busquedaAsuntos"]);
  }
  checkPermisosCrearEJG() {
    this.crearEJG();
  }
  crearEJG() {

    sessionStorage.setItem("EJGItemDesigna", "nuevo");

    sessionStorage.setItem("Designacion", JSON.stringify(this.body));

    this.router.navigate(["/gestionEjg"]);
  }

  checkPermisosEditar(dato) {
    this.consultarEditar(dato);
  }
  consultarEditar(dato) {

    let identificador = dato.sjcs.charAt(0);

    switch (identificador) {
      case 'A':
        /**
       * TODO: enlazar una vez este creada la pagina.
       */
        this.porhacer();
        break;
      case 'E':
        this.progressSpinner = true;
        let ejgItem = new EJGItem();
        ejgItem.annio = dato.anio;
        // ejgItem.numero = dato.numero;
        ejgItem.numero = dato.codigo;
        ejgItem.idInstitucion = dato.idinstitucion;
        ejgItem.tipoEJG = dato.idtipo;

        let result;
        // al no poder obtener todos los datos del EJG necesarios para obtener su informacion
        //se hace una llamada a al base de datos pasando las claves primarias y obteniendo los datos necesarios
        this.sigaServices.post("filtrosejg_busquedaEJG", ejgItem).subscribe(
          n => {
            result = JSON.parse(n.body).ejgItems;
            sessionStorage.setItem("EJGItemDesigna", JSON.stringify(result[0]));
            let error = JSON.parse(n.body).error;

            this.progressSpinner = false;
            if (error != null && error.description != null) {
              this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
            }
          },
          err => {
            this.progressSpinner = false;
            console.log(err);
          },
          () => {
            this.router.navigate(["/gestionEjg"]);
          }
        );
        break;
    }
  }
}