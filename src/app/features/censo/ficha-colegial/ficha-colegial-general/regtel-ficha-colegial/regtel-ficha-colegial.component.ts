import { Component, OnInit, Input, Output, ViewChild, OnChanges, ViewEncapsulation, SimpleChanges, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { SigaServices } from '../../../../../_services/siga.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';
import { DocushareObject } from '../../../../../models/DocushareObject';
import { TranslateService } from '../../../../../commons/translate';
import { BusquedaSancionesItem } from '../../../../../models/BusquedaSancionesItem';
import { BusquedaSancionesObject } from '../../../../../models/BusquedaSancionesObject';
import { DocushareItem } from '../../../../../models/DocushareItem';
import { FichaColegialColegialesItem } from '../../../../../models/FichaColegialColegialesItem';
import { saveAs } from 'file-saver/FileSaver';
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { ConfirmationService } from '../../../../../../../node_modules/primeng/api';

@Component({
  selector: 'app-regtel-ficha-colegial',
  templateUrl: './regtel-ficha-colegial.component.html',
  styleUrls: ['./regtel-ficha-colegial.component.scss']
})
export class RegtelFichaColegialComponent implements OnInit {

  messageRegtel: String;
  
  @ViewChild('tableRegTel') tableRegTel: DataTable;
  numSelectedDatosRegtel: number = 0;
  rowsPerPage: any;
  dataSanciones: any[] = [];
  bodySearchSanciones: BusquedaSancionesObject = new BusquedaSancionesObject();
  @Input() tarjetaRegtel: string;
  selectedDatosRegtel: DocushareItem;
  progressSpinner: boolean = false;
  bodyRegTel: any[] = [];
  @Input() esColegiado: boolean;
  idPersona: any;
  mostrarDatosSanciones: boolean = false;
  checkRegTel: boolean = false;
  selectedItemRegtel: number = 10;
  DescripcionSanciones;
  generalBody: FichaColegialGeneralesItem;
  bodySearchRegTel: DocushareObject = new DocushareObject();
  atrasRegTel: String = '';
  bodySanciones: BusquedaSancionesItem = new BusquedaSancionesItem();
  esRegtel: boolean;
  messageNoContentRegTel: String = '';
  buttonVisibleRegtelCarpeta: boolean = true;
  buttonVisibleRegtelDescargar: boolean = true;
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  situacionPersona: String;
  buttonVisibleRegtelAtras: boolean = true;
  activacionEditar: boolean = true;
  ficha = {
    key: 'generales',
    activa: false
  };
  openFicha: boolean = false;
  icon;
  msgs = [];
  colsRegtel;
  @Input() openRegtel;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService
    ) {}

  ngOnInit() {
    this.getCols();
    if (
      sessionStorage.getItem('personaBody') != null &&
      sessionStorage.getItem('personaBody') != undefined &&
      JSON.parse(sessionStorage.getItem('esNuevoNoColegiado')) != true
    ) {
      this.generalBody = new FichaColegialGeneralesItem();
      this.generalBody = JSON.parse(sessionStorage.getItem('personaBody'));
      this.idPersona = this.generalBody.idPersona;
    }

    if (sessionStorage.getItem('esColegiado')) {
      let colegiadosession = sessionStorage.getItem('esColegiado');
      if(colegiadosession == 'true'){
        this.esColegiado = true;
      }else{
        this.esColegiado = false;
      }

    } else {
      this.esColegiado = false;
    }
       
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (this.esColegiado && (this.tarjetaRegtel == "3" || this.tarjetaRegtel == "2")) {
    //   this.sigaServices
    //     .postPaginado(
    //       "fichaColegialRegTel_searchListDoc",
    //       "?numPagina=1",
    //       this.idPersona
    //     )
    //     .subscribe(
    //       data => {
    //         this.bodySearchRegTel = JSON.parse(data["body"]);
    //         this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
    //         this.generalBody.identificadords = this.bodySearchRegTel.identificadorDS;
    //         // this.bodyRegTel.forEach(element => {
    //         //   element.fechaModificacion = this.arreglarFechaRegtel(
    //         //     JSON.stringify(new Date(element.fechaModificacion))
    //         //   );
    //         // });
    //         if (this.bodyRegTel.length != 0) {
    //           this.messageRegtel = this.bodyRegTel.length + "";
    //         } else {
    //           this.messageRegtel = this.translateService.instant(
    //             "general.message.no.registros"
    //           );
    //         }
    //         if (this.bodyRegTel.length > 0) {
    //           this.atrasRegTel = this.bodyRegTel[0].parent;
    //         }
    //       },
    //       err => {
    //         this.messageRegtel = this.translateService.instant(
    //           "general.message.no.registros"
    //         );
    //       },
    //   );
    // } else {
    //   this.sigaServices
    //     .postPaginado(
    //       "fichaColegialRegTel_searchListDocNoCol",
    //       "?numPagina=1",
    //       this.idPersona
    //     )
    //     .subscribe(
    //       data => {
    //         this.bodySearchRegTel = JSON.parse(data["body"]);
    //         this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
    //         // this.bodyRegTel.forEach(element => {
    //         //   element.fechaModificacion = this.arreglarFechaRegtel(
    //         //     JSON.stringify(new Date(element.fechaModificacion))
    //         //   );

    //         // });
    //         if (this.bodyRegTel.length != 0) {
    //           this.messageRegtel = this.bodyRegTel.length + "";
    //         } else {
    //           this.messageRegtel = this.translateService.instant(
    //             "general.message.no.registros"
    //           );
    //         }
    //         if (this.bodyRegTel.length > 0) {
    //           this.atrasRegTel = this.bodyRegTel[0].parent;
    //         }
    //       },
    //       err => {
    //         this.messageRegtel = this.translateService.instant(
    //           "general.message.no.registros"
    //         );
    //       }
    //     );
    // }
    if ((this.tarjetaRegtel == '3' || this.tarjetaRegtel == '2') && !this.checkRegTel) {
      this.comprobarREGTEL();
    }

  }

  /* ngOnChanges(changes: SimpleChanges) {

    if (this.openRegtel == true) {
      if (this.openFicha == false) {
        this.abreCierraRegtel('regtel');
      }
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.activacionEditar = false;
      // sessionStorage.removeItem("esNuevoNoColegiado");
      // this.onInitGenerales();
    } else {
      this.activacionEditar = true;
    }
  } */

  getCols() {
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
		this.colsRegtel = [
			{
				field: 'title',
				header: 'censo.resultadosSolicitudesModificacion.literal.Nombre'
			},
			{
				field: 'summary',
				header: 'censo.regtel.literal.resumen'
			},
			{
				field: 'fechaModificacion',
				header: 'censo.datosDireccion.literal.fechaModificacion'
			},
			{
				field: 'sizeKB',
				header: 'censo.regtel.literal.tamanno'
			}
		];
	}

  activarPaginacionRegTel() {
    if (!this.bodyRegTel || this.bodyRegTel.length == 0) return false;
    else return true;
  }

  actualizaSeleccionadosRegTel(selectedDatos) {
    this.numSelectedDatosRegtel = selectedDatos.length;
  }

  // Métodos gestionar tabla
  enablePagination() {
    if (!this.dataSanciones || this.dataSanciones.length == 0) return false;
    else return true;
  }
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }
  getFichaPosibleByKey(key): any {
    return this.ficha;
  }

  comprobarREGTEL() {
    this.esRegtel = false;
    this.checkRegTel = true;
    this.messageNoContentRegTel = this.translateService.instant('aplicacion.cargando');

    this.messageRegtel = this.messageNoContentRegTel;
    this.sigaServices.get('fichaColegialRegTel_permisos').subscribe(
      data => {
        let value = data;
        if (value) {
          this.esRegtel = true;
          this.onInitRegTel();
        } else {
          this.esRegtel = false;
        }
      },
      err => {
        this.messageRegtel = this.translateService.instant(
          'general.message.no.registros'
        );
        this.progressSpinner = false;
      }
    );
  }
  onInitRegTel() {
    if (this.esColegiado) {
      this.sigaServices
        .postPaginado(
          'fichaColegialRegTel_searchListDoc',
          '?numPagina=1',
          this.idPersona
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data['body']);
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            this.generalBody.identificadords = this.bodySearchRegTel.identificadorDS;
            // this.bodyRegTel.forEach(element => {
            //   element.fechaModificacion = this.arreglarFechaRegtel(
            //     JSON.stringify(new Date(element.fechaModificacion))
            //   );
            // });
            if (this.bodyRegTel.length != 0) {
              this.messageRegtel = this.bodyRegTel.length + '';
            } else {
              this.messageRegtel = this.translateService.instant(
                'general.message.no.registros'
              );
            }
            if (this.bodyRegTel.length > 0) {
              this.atrasRegTel = this.bodyRegTel[0].parent;
            }
          },
          err => {
            this.messageRegtel = this.translateService.instant(
              "general.message.no.registros"
            );
          },
      );
    } else {
      this.sigaServices
        .postPaginado(
          "fichaColegialRegTel_searchListDocNoCol",
          "?numPagina=1",
          this.idPersona
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            // this.bodyRegTel.forEach(element => {
            //   element.fechaModificacion = this.arreglarFechaRegtel(
            //     JSON.stringify(new Date(element.fechaModificacion))
            //   );

            // });
            if (this.bodyRegTel.length != 0) {
              this.messageRegtel = this.bodyRegTel.length + "";
            } else {
              this.messageRegtel = this.translateService.instant(
                "general.message.no.registros"
              );
            }
            if (this.bodyRegTel.length > 0) {
              this.atrasRegTel = this.bodyRegTel[0].parent;
            }
          },
          err => {
            this.messageRegtel = this.translateService.instant(
              "general.message.no.registros"
            );
          }
        );
    }
  }
  onRowSelectedRegTel(selectedDatosRegtel) {
    if (this.tarjetaRegtel == '3') {
      this.selectedDatosRegtel = selectedDatosRegtel;
      if (this.selectedDatosRegtel.tipo == "0") {
        this.buttonVisibleRegtelCarpeta = false;
        this.buttonVisibleRegtelDescargar = true;
      } else {
        this.buttonVisibleRegtelCarpeta = true;
        this.buttonVisibleRegtelDescargar = false;
      }
    }
  }

  getSituacionPersona() {
    // •	Situación:
    // o	‘Fallecido’ si está marcado como tal.
    // o	‘No colegiado’ en caso de no estar colegiado en ningún colegio.
    // o	‘Activo’ en caso de estar colegiado en algún colegio con estado ‘Ejerciente’ o ‘No ejerciente’.
    // o	‘De baja’ en cualquier otro caso.

    //     0: {label: "Baja Colegial", value: "30"}
    // 1: {label: "Baja Por Deceso", value: "60"}
    // 2: {label: "Ejerciente", value: "20"}
    // 3: {label: "Inhabilitación", value: "40"}
    // 4: {label: "No Ejerciente", value: "10"}
    // 5: {label: "Suspensión Ejercicio", value: "50"
    if (this.colegialesBody.situacion == "60") {
      this.situacionPersona = "Fallecido";
    } else if (
      this.colegialesBody.situacion == "20" ||
      this.colegialesBody.situacion == "10"
    ) {
      if (this.colegialesBody.comunitario == "1") {
        this.situacionPersona = "Abogado Inscrito";
      } else {
        this.situacionPersona = "Activo";
      }
    } else if (this.colegialesBody.situacion != undefined) {
      this.situacionPersona = "De baja";
    } else {
      this.situacionPersona = "No Colegiado";
    }
  }

  onRowDesselectedRegTel() {
    this.buttonVisibleRegtelCarpeta = true;
    this.buttonVisibleRegtelDescargar = true;
  }
  onClickAtrasRegtel() {
    this.progressSpinner = true;
    this.selectedDatosRegtel.idPersona = this.idPersona;
    this.selectedDatosRegtel.id = this.selectedDatosRegtel.parent;
    let selectedRegtel = JSON.parse(JSON.stringify(this.selectedDatosRegtel));
    selectedRegtel.fechaModificacion = undefined;
    if (this.esColegiado) {
      this.sigaServices
        .postPaginado(
          "fichaColegialRegTel_searchListDir",
          "?numPagina=1",
          selectedRegtel
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            // this.bodyRegTel.forEach(element => {
            //   element.fechaModificacion = this.arreglarFechaRegtel(
            //     JSON.stringify(new Date(element.fechaModificacion))
            //   );
            // });

            if (this.atrasRegTel != "") {
              this.buttonVisibleRegtelAtras = true;
            }
            this.buttonVisibleRegtelCarpeta = true;
            this.buttonVisibleRegtelDescargar = true;
            if (this.bodyRegTel.length != 0) {
              this.messageRegtel = this.bodyRegTel.length + "";
            } else {
              this.messageRegtel = this.translateService.instant(
                "general.message.no.registros"
              );
            }
            this.progressSpinner = false;
          },
          err => {
            this.messageRegtel = this.translateService.instant(
              "general.message.no.registros"
            );
            this.progressSpinner = false;
          }
        );
    } else {
      this.sigaServices
        .postPaginado(
          "fichaColegialRegTel_searchListDirNoCol",
          "?numPagina=1",
          selectedRegtel
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            // this.bodyRegTel.forEach(element => {
            //   element.fechaModificacion = this.arreglarFechaRegtel(
            //     JSON.stringify(new Date(element.fechaModificacion))
            //   );
            // });

            if (this.atrasRegTel != "") {
              this.buttonVisibleRegtelAtras = true;
            }
            this.buttonVisibleRegtelCarpeta = true;
            this.buttonVisibleRegtelDescargar = true;
            this.progressSpinner = false;
          },
          err => {
            this.progressSpinner = false;
          }
        );
    }
  }

  onClickCarpetaRegTel() {
    this.progressSpinner = true;
    if (this.atrasRegTel != this.selectedDatosRegtel.parent) {
      this.atrasRegTel = this.selectedDatosRegtel.parent;
    }
    this.selectedDatosRegtel.idPersona = this.idPersona;
    let selectedRegtel = JSON.parse(JSON.stringify(this.selectedDatosRegtel));
    selectedRegtel.fechaModificacion = undefined;
    if (this.esColegiado) {
      this.sigaServices
        .postPaginado(
          "fichaColegialRegTel_searchListDir",
          "?numPagina=1",
          selectedRegtel
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            //  this.bodyRegTel.forEach(element => {
            //   element.fechaModificacion = this.arreglarFechaRegtel(
            //     JSON.stringify(new Date(element.fechaModificacion))
            //   );
            // });

            if (this.atrasRegTel != "") {
              this.buttonVisibleRegtelAtras = false;
            } else {
              this.buttonVisibleRegtelAtras = true;
            }
            this.buttonVisibleRegtelCarpeta = true;
            this.buttonVisibleRegtelDescargar = true;
            this.progressSpinner = false;
            if (this.bodyRegTel.length != 0) {
              this.messageRegtel = this.bodyRegTel.length + "";
            } else {
              this.messageRegtel = this.translateService.instant(
                "general.message.no.registros"
              );
            }

          },
          err => {
            this.messageRegtel = this.translateService.instant(
              "general.message.no.registros"
            );
            this.progressSpinner = false;
          }
        );
    } else {
      this.sigaServices
        .postPaginado(
          "fichaColegialRegTel_searchListDirNoCol",
          "?numPagina=1",
          selectedRegtel
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            //  this.bodyRegTel.forEach(element => {
            //   element.fechaModificacion = this.arreglarFechaRegtel(
            //     JSON.stringify(new Date(element.fechaModificacion))
            //   );
            // });
            if (this.atrasRegTel != "") {
              this.buttonVisibleRegtelAtras = false;
            } else {
              this.buttonVisibleRegtelAtras = true;
            }
            this.buttonVisibleRegtelCarpeta = true;
            this.buttonVisibleRegtelDescargar = true;
            this.progressSpinner = false;
            if (this.bodyRegTel.length != 0) {
              this.messageRegtel = this.bodyRegTel.length + "";
            } else {
              this.messageRegtel = this.translateService.instant(
                "general.message.no.registros"
              );
            }

          },
          err => {
            this.messageRegtel = this.translateService.instant(
              "general.message.no.registros"
            );
            this.progressSpinner = false;
          }
        );
    }
  }
  onClickDescargarRegTel() {
    this.progressSpinner = true;
    this.selectedDatosRegtel.idPersona = this.idPersona;
    let selectedRegtel = JSON.parse(JSON.stringify(this.selectedDatosRegtel));
    selectedRegtel.fechaModificacion = undefined;
    this.sigaServices
      .postDownloadFiles(
        "fichaColegialRegTel_downloadDoc",

        selectedRegtel
      )
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "application/octet-stream" });
          saveAs(blob, this.selectedDatosRegtel.originalFilename);
          //this.selectedDatosRegtel.fechaModificacion = fechaModificacionRegtel;
          this.progressSpinner = false;
        },
        err => {
          //this.selectedDatosRegtel.fechaModificacion = fechaModificacionRegtel;
          this.progressSpinner = false;
        }
      );
  }

  abreCierraRegtel(key) {
    if (
      key == "regtel"
    ) {

      if (this.generalBody.identificadords != null || (this.bodyRegTel != null && this.bodyRegTel.length > 0)) {
        this.activacionEditar = true;
      } else {
        this.activacionEditar = false;
        this.callConfirmationServiceRegtel();
      }
      if (this.activacionEditar) {
        this.ficha.activa = !this.ficha.activa;
        this.openFicha = !this.openFicha;
      }
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }
  callConfirmationServiceRegtel() {
    let mess = this.translateService.instant("messages.creaCollection");
    this.icon = "fa fa-edit";
    let keyConfirmation = "regtelFicha";

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: mess,
      icon: this.icon,
      accept: () => {
        this.addCollectionRegtel();
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }
  clear() {
    this.msgs = [];
  }

  addCollectionRegtel() {
    let url = "";

    if (this.esColegiado) {
      url = "fichaColegialRegTel_insertCollection";
    } else {
      url = "fichaColegialRegTel_insertCollectionNoCol";
    }

    this.sigaServices
      .post(url, this.generalBody.idPersona)
      .subscribe(
        data => {
          this.generalBody.identificadords = data.body;
          let mess = this.translateService.instant("messages.collectionCreated");
          this.showSuccessDetalle(mess + this.generalBody.identificadords);
        },
        err => {
          this.showFail();
        }
      );
  }

  showSuccessDetalle(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: this.translateService.instant("general.message.correct"), detail: mensaje });
  }


  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  setItalicRegtel(datoH) {
		if (datoH.tipo == 1) return false;
		else return true;
	}

  onChangeRowsPerPagesRegtel(event) {
    this.selectedItemRegtel = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableRegTel.reset();
  }
}
