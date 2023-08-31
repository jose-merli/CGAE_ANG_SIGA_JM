import { DatePipe, Location } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
// import { DomSanitizer } from '@angular/platform-browser/src/platform-browser';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from "primeng/components/common/api";
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { BusquedaSancionesItem } from '../../../../../models/BusquedaSancionesItem';
import { BusquedaSancionesObject } from '../../../../../models/BusquedaSancionesObject';
import { DatosDireccionesItem } from '../../../../../models/DatosDireccionesItem';
import { DatosDireccionesObject } from '../../../../../models/DatosDireccionesObject';
import { FichaColegialColegialesItem } from '../../../../../models/FichaColegialColegialesItem';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';
import { RevisionAutLetradoItem } from '../../../../../models/RevisionAutLetradoItem';
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { cardService } from "./../../../../../_services/cardSearch.service";

@Component({
  selector: 'app-direcciones-ficha-colegial',
  templateUrl: './direcciones-ficha-colegial.component.html',
  styleUrls: ['./direcciones-ficha-colegial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DireccionesFichaColegialComponent implements OnInit, OnChanges {
  esNewColegiado: boolean = false;
  activacionEditar: boolean = true;
  desactivarVolver: boolean = true;
  emptyLoadFichaColegial: boolean = false;
  activacionTarjeta: boolean = false;
  openFicha: boolean = false;
  selectedDatosDirecciones;
  isColegiadoEjerciente: boolean = false;
  msgs: Message[];
  editar: boolean = false;
  searchDireccionIdPersona = new DatosDireccionesObject();
  DescripcionDatosDireccion;
  datosColegiales: any[] = [];
  // isLetrado: boolean;
  tarjetaDireccionesNum: string;
  selectMultiple: boolean = false;

  fichasPosibles = [
    {
      key: "direcciones",
      activa: false
    },
  ];
  selectAll: boolean = false;
  isCrearColegial: boolean = false;
  camposDesactivados: boolean = false;
  permisos: boolean = true;
  @Input() tarjetaDirecciones: string;

  mostrarDatosDireccion: boolean = false;
  progressSpinner: boolean = false;
  selectedItemSanciones: number = 10;
  colsSanciones;
  selectedDatosSanciones;
  bodySanciones: BusquedaSancionesItem = new BusquedaSancionesItem();
  dataSanciones: any[] = [];
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  checkGeneralBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  bodySearchSanciones: BusquedaSancionesObject = new BusquedaSancionesObject();
  mostrarDatosSanciones: boolean = false;
  DescripcionSanciones;
  rowsPerPage;
  numSelectedCurriculares: number = 0;
  colsDirecciones;
  mostrarNumero:Boolean = false;
  message;
  messageNoContent;
  bodyDirecciones: DatosDireccionesItem;
  @Input() esColegiado: boolean;
  selectMultipleDirecciones: boolean = false;
  numSelectedDirecciones: number = 0;
  selectAllDirecciones: boolean = false;
  datosDirecciones: DatosDireccionesItem[] = [];
  datosDireccionesHist = new DatosDireccionesObject();
  valorResidencia: string = "1";
  valorDespacho: string = "2";
  valorCensoWeb: string = "3";
  valorPublica: string = "4";
  valorGuiaJudicial: string = "5";
  valorGuardia: string = "6";
  valorRevista: string = "7";
  valorFacturacion: string = "8";
  valorTraspaso: string = "9";
  valorPreferenteEmail: string = "10";
  valorPreferenteCorreo: string = "11";
  valorPreferenteSMS: string = "12";
  selectedItemDirecciones: number = 10;
  @ViewChild("tableDirecciones")
  tableDirecciones: DataTable;
  @Input() isLetrado;
  @Input() idPersona;
  @Input() openDirec;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  disabledAction: boolean = false;
  constructor(
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private cardService: cardService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    // private sanitizer: DomSanitizer,
    private router: Router,
    private datepipe: DatePipe,
    private location: Location,
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem("disabledAction") == "true") { // Esto disablea tela de cosas funciona como medio permisos. 
      // Es estado baja colegial (historico?)
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }
    if (sessionStorage.getItem("personaBody") != null && sessionStorage.getItem("personaBody") != undefined
        && sessionStorage.getItem("personaBody") != 'undefined' &&JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true) {
      this.generalBody = new FichaColegialGeneralesItem();
      this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.checkGeneralBody = new FichaColegialGeneralesItem();
      this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));

      if (sessionStorage.getItem("esColegiado")) {
        this.esColegiado = JSON.parse(sessionStorage.getItem("esColegiado"));
      } else {
        this.esColegiado = true;
      }

      sessionStorage.removeItem("historicoDir")

      if (this.esColegiado) {
        if (this.colegialesBody.situacion == "20") {
          this.isColegiadoEjerciente = true;
        } else {
          this.isColegiadoEjerciente = false;
        }
      }
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      // sessionStorage.removeItem("esNuevoNoColegiado");
      // this.onInitGenerales();
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }

    this.getCols();


  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (this.esColegiado != null) {
      if (this.esColegiado) {
        if (this.colegialesBody.situacion == "20") {
          this.isColegiadoEjerciente = true;
        } else {
          this.isColegiadoEjerciente = false;
        }
      }
    }
    if (this.idPersona != undefined) {
      if (this.bodyDirecciones == undefined && (this.tarjetaDirecciones == "3" || this.tarjetaDirecciones == "2")) {
        this.onInitDirecciones();
        
        if(this.tarjetaDirecciones == "3"){
          this.permisos = true;
        }else{
          this.permisos = false;
        }
        this.getLetrado();
      }
    }
    if (this.openDirec == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('direcciones');
      }
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      // sessionStorage.removeItem("esNuevoNoColegiado");
      // this.onInitGenerales();
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }
  }


  getCols() {
    this.colsDirecciones = [
      {
        field: "tipoDireccion",
        header: "censo.datosDireccion.literal.tipo.direccion",
        width: "22%"
      },
      {
        field: "domicilioLista",
        header: "censo.consultaDirecciones.literal.direccion"
      },
      {
        field: "codigoPostal",
        header: "censo.ws.literal.codigopostal"
      },
      {
        field: "nombrePoblacion",
        header: "censo.consultaDirecciones.literal.poblacion"
      },
      {
        field: "nombreProvincia",
        header: "censo.datosDireccion.literal.provincia"
      },
      {
        field: "telefono",
        header: "censo.ws.literal.telefono"
      },
      {
        field: "movil",
        header: "censo.datosDireccion.literal.movil"
      },
      {
        field: "correoElectronico",
        header: "censo.datosDireccion.literal.correo"
      }
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

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);

    if (
      key == "generales" &&
      !this.activacionTarjeta &&
      !this.emptyLoadFichaColegial
    ) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }
  onInitDirecciones() {
    this.bodyDirecciones = new DatosDireccionesItem();
    this.bodyDirecciones.idPersona = this.idPersona;
    this.bodyDirecciones.historico = false;
    this.searchDirecciones();
  }

  ocultarHistoricoDatosDirecciones(){
    this.progressSpinner = true;
    this.onInitDirecciones();
  }

  isSelectMultipleDirecciones() {
    this.selectMultipleDirecciones = !this.selectMultipleDirecciones;
    if (!this.selectMultipleDirecciones) {
      this.numSelectedDirecciones = 0;
      this.selectedDatosDirecciones = [];
    } else {
      this.selectAllDirecciones = false;
      this.selectedDatosDirecciones = [];
      this.numSelectedDirecciones = 0;
    }
  }

  onChangeSelectAllDirecciones() {
    if (this.selectAllDirecciones === true) {
      if (this.bodyDirecciones.historico == true) {
        this.selectMultipleDirecciones = false;
        this.selectedDatosDirecciones = this.datosDirecciones.filter(dato => dato.fechaBaja != undefined);
        this.numSelectedCurriculares = this.selectedDatosDirecciones.length;
      } else {
        this.numSelectedDirecciones = this.datosDirecciones.length;
        this.selectMultipleDirecciones = false;
        this.selectedDatosDirecciones = this.datosDirecciones;
      }

    } else {
      this.selectedDatosDirecciones = [];
      this.numSelectedDirecciones = 0;
    }
  }

  borrarSelectedDatos(selectedItem) {
    this.progressSpinner = true;
    let deleteDirecciones = new DatosDireccionesObject();
    deleteDirecciones.datosDireccionesItem = selectedItem;
    let datosDelete = [];
    // selectedItem.forEach((value: DatosDireccionesItem, key: number) => {
    //   value.idPersona = this.idPersona;
    //   datosDelete.push(value);
    // if (value.idTipoDireccion.includes("2")) {
    //   if (JSON.parse(sessionStorage.getItem("numDespacho")) > 1) {
    //     if (!(value.idTipoDireccion.includes("3") || value.idTipoDireccion.includes("9") || value.idTipoDireccion.includes("8") || value.idTipoDireccion.includes("6"))) {
    //       datosDelete.push(value);
    //     }
    //   }
    // } else {
    //   if (!(value.idTipoDireccion.includes("3") || value.idTipoDireccion.includes("9") || value.idTipoDireccion.includes("8") || value.idTipoDireccion.includes("6"))) {
    //     datosDelete.push(value);
    //   }
    // }

    // });

    this.borrarDireccion(selectedItem);


  }

  borrarDireccion(datosDelete) {

    if (this.esColegiado) {
      let dirDelete = JSON.parse(JSON.stringify(datosDelete));

      for (const key in datosDelete) {

        let flag = false;
        datosDelete[key].idTipoDireccion.forEach(element => {

          if (!flag) {

            if (element == this.valorCensoWeb
              || element == this.valorTraspaso
              || element == this.valorFacturacion
              || element == this.valorGuardia
              || element == this.valorGuiaJudicial
              || element == this.valorPreferenteCorreo
              || element == this.valorPreferenteEmail
              || element == this.valorPreferenteSMS) {

              dirDelete.splice(key, 1);
              flag = true;
            }

            if (this.isColegiadoEjerciente) {
              let cont = 0;

              if (element == this.valorDespacho) {

                this.datosDirecciones.forEach(dir => {
                  let idFindDespacho = dir.idTipoDireccion.findIndex(x => x == element);

                  if (idFindDespacho != -1) {
                    cont = cont + 1;
                  }

                });

                if (cont == 1) {
                  dirDelete.splice(key, 1);
                  flag = true;
                }

              }

            }
          }
        });
      }

      if (dirDelete.length != datosDelete.length && dirDelete.length > 0) {
        datosDelete = dirDelete;
        this.serviceDeleteDirection(datosDelete, false);

      } else if (dirDelete.length == 0) {
        this.showInfo("No se puede borrar la dirección porque tiene tipos de dirección obligatorios");

        this.selectMultipleDirecciones = false;
        this.selectAllDirecciones = false;
        this.numSelectedDirecciones = 0;
        this.progressSpinner = false;

      } else {
        this.serviceDeleteDirection(datosDelete, true);

      }
    } else {
      this.serviceDeleteDirection(datosDelete, true);
    }

  }

  serviceDeleteDirection(datosDelete, all) {
    this.sigaServices.post("direcciones_remove", datosDelete).subscribe(
      data => {
        //IMPORTANTE: LLAMADA PARA REVISION SUSCRIPCIONES (COLASUSCRIPCIONES)
        let peticion = new RevisionAutLetradoItem();
        peticion.idPersona = this.generalBody.idPersona.toString();
        peticion.fechaProcesamiento = new Date();
        this.sigaServices.post("PyS_actualizacionColaSuscripcionesPersona", peticion).subscribe();
        this.progressSpinner = false;
        this.showSuccess();

        if (!all) {
          this.showInfo("No se ha podido borrar todas las direcciones seleccionadas porque tienen tipos de dirección obligatorios");

        }
      },
      err => {
        this.progressSpinner = false;
        this.showInfo("No se puede eliminar una dirección con tipo CensoWeb, Traspaso, Facturación, Guardia o Despacho");
        this.selectMultipleDirecciones = false;
        this.selectAllDirecciones = false;
        this.numSelectedDirecciones = 0;
        //console.log(err);
      },
      () => {
        this.progressSpinner = false;
        this.editar = false;
        // this.dniCorrecto = null;
        // this.disabledRadio = false;
        this.selectMultipleDirecciones = false;
        this.numSelectedDirecciones = 0;
        this.selectAllDirecciones = false;
        this.searchDirecciones();
      }
    );
  }

  actualizaSeleccionadosDirecciones(selectedDatos) {
    this.numSelectedDirecciones = selectedDatos.length;
  }

  actualizaSeleccionadosCurriculares(selectedDatos) {
    this.numSelectedCurriculares = selectedDatos.length;
  }

  searchDirecciones() {
    this.selectAllDirecciones = false;
    this.selectMultipleDirecciones = false;
    this.selectedDatosDirecciones = [];
    this.mostrarNumero = false;
    this.selectedDatosDirecciones = "";
    //this.progressSpinner = true;
    this.selectAll = false;
    if (this.idPersona != undefined && this.idPersona != null) {
      this.sigaServices
        .postPaginado(
          "fichaDatosDirecciones_datosDireccionesSearch",
          "?numPagina=1",
          this.bodyDirecciones
        )
        .subscribe(
          data => {
            this.searchDireccionIdPersona = JSON.parse(data["body"]);
            this.datosDirecciones = this.searchDireccionIdPersona.datosDireccionesItem;
            let contador = 0;
            this.datosDirecciones.forEach(element => {
              let numDespacho = element.idTipoDireccion.find(
                item => item == '2'
              );

              if (numDespacho != undefined) {
                contador = contador + 1;
              }
            });
            sessionStorage.setItem("numDespacho", JSON.stringify(contador));
            sessionStorage.setItem("datosDireccionesAlterMutua", JSON.stringify(this.datosDirecciones))

            this.progressSpinner = false;
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
            this.mostrarNumero = true;
          },
          () => {
            this.progressSpinner = false;
            if (this.datosDirecciones.length > 0) {
              this.mostrarDatosDireccion = true;
              this.DescripcionDatosDireccion = this.datosDirecciones[0];
              
            }
            if (this.datosDirecciones.length == 0) {
              this.message = this.datosDirecciones.length.toString();
              this.messageNoContent = this.translateService.instant(
                "general.message.no.registros"
              );
              this.mostrarNumero = true;
  
            } else {
              this.message = this.datosDirecciones.length.toString();
              this.mostrarNumero = true;
  
            }
          }
        );
    }
  }

  searchDireccionesHistoric() {
    this.progressSpinner = true;
    this.bodyDirecciones.historico = true;
    this.searchDirecciones();
  }

  nuevaDireccion() {
    let newDireccion = new DatosDireccionesItem();
    sessionStorage.setItem("permisoTarjeta", "3");
    sessionStorage.removeItem("direccion");
    sessionStorage.removeItem("editarDireccion");
    sessionStorage.setItem("fichaColegial", "true");
    sessionStorage.setItem(
      "usuarioBody",
      JSON.stringify(this.generalBody.idPersona)
    );
    sessionStorage.setItem("editarDireccion", "false");
    sessionStorage.setItem(
      "direcciones",
      JSON.stringify(this.datosDirecciones)
    );
    this.datosColegiales = JSON.parse(sessionStorage.getItem("datosColDir"));

    if (this.datosColegiales.length != 0) {
      if (this.isCrearColegial) {
        sessionStorage.setItem(
          "situacionColegialesBody",
          JSON.stringify(this.datosColegiales[1].idEstado)
        );
      } else {
        sessionStorage.setItem(
          "situacionColegialesBody",
          JSON.stringify(this.datosColegiales[0].idEstado)
        );
      }
    }

    let migaPan = "";

    if (this.esColegiado) {
      migaPan = this.translateService.instant("menu.censo.fichaColegial");
    } else {
      migaPan = this.translateService.instant("menu.censo.fichaNoColegial");
    }

    sessionStorage.setItem("migaPan", migaPan);

    // CAMBIO INCIDENCIA DIRECCIONES
    //sessionStorage.setItem("numDirecciones", JSON.stringify(this.datosDirecciones.length));
    this.router.navigate(["/consultarDatosDirecciones"]);
  }

  redireccionarDireccion(dato) {
    if (this.camposDesactivados != true) {
      this.datosColegiales = JSON.parse(sessionStorage.getItem("datosColDir"));

      if (!this.selectMultipleDirecciones) {
        if (dato[0].fechaBaja != null) {
          sessionStorage.setItem("historicoDir", "true");
        } else sessionStorage.setItem("historicoDir", "false");

        var enviarDatos = null;
        if (dato && dato.length > 0) {
          enviarDatos = dato[0];
          sessionStorage.setItem("idDireccion", enviarDatos.idDireccion);
          sessionStorage.setItem("direccion", JSON.stringify(enviarDatos));
          sessionStorage.setItem("permisos", JSON.stringify(this.permisos));
          sessionStorage.setItem("fichaColegial", "true");
          sessionStorage.removeItem("editarDireccion");

          sessionStorage.setItem("editarDireccion", "true");

          sessionStorage.setItem("usuarioBody", JSON.stringify(dato));
          sessionStorage.setItem(
            "esColegiado",
            sessionStorage.getItem("esColegiado")
          );
        } else {
          sessionStorage.setItem("editar", "false");
        }
        sessionStorage.setItem(
          "direcciones",
          JSON.stringify(this.datosDirecciones)
        );
        sessionStorage.setItem("permisoTarjeta", this.tarjetaDirecciones);

        if (this.datosColegiales.length != 0) {
          if (this.isCrearColegial) {
            sessionStorage.setItem(
              "situacionColegialesBody",
              JSON.stringify(this.datosColegiales[1].idEstado)
            );
          } else {
            sessionStorage.setItem(
              "situacionColegialesBody",
              JSON.stringify(this.datosColegiales[0].idEstado)
            );
          }
        }


        let migaPan = "";

        if (this.esColegiado) {
          migaPan = this.translateService.instant("menu.censo.fichaColegial");
        } else {
          migaPan = this.translateService.instant("menu.censo.fichaNoColegial");
        }

        sessionStorage.setItem("migaPan", migaPan);
        this.router.navigate(["/consultarDatosDirecciones"]);

      } else {
        this.numSelectedDirecciones = this.selectedDatosDirecciones.length;
      }
    }
  }

  showFailDetalle(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: mensaje
    });
  }

  showSuccessDetalle(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: this.translateService.instant("general.message.correct"), detail: mensaje });
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
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

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  getLetrado() {
    if (JSON.parse(sessionStorage.getItem("isLetrado")) == true) {
      this.isLetrado = true;
    } else {
      this.isLetrado = !this.permisos;
    }
  }
  activarPaginacionDireciones() {
    if (!this.datosDirecciones || this.datosDirecciones.length == 0)
      return false;
    else return true;
  }
  clear() {
    this.msgs = [];
  }
  onChangeRowsPerPagesDirecciones(event) {
    this.selectedItemDirecciones = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableDirecciones.reset();
  }
  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }
  searchHistoricoDatosDirecciones() {
    this.selectAllDirecciones = false;
    this.selectMultipleDirecciones = false;
    this.selectedDatosDirecciones = [];
    this.bodyDirecciones.historico = true;
    this.progressSpinner = true;
    // this.historico = true;
    let searchObject = new DatosDireccionesItem();
    searchObject.idPersona = this.idPersona;
    searchObject.historico = true;
    // this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatosDirecciones = "";
    this.selectAllDirecciones = false;
    this.sigaServices
      .postPaginado("direcciones_search", "?numPagina=1", searchObject)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.datosDireccionesHist = JSON.parse(data["body"]);
          this.datosDirecciones = this.datosDireccionesHist.datosDireccionesItem;
          this.tableDirecciones.paginator = true;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {

        }
      );
  }
  isOpenReceive(event) {
    let fichaPosible = this.esFichaActiva(event);
    if (fichaPosible == false) {
      this.abreCierraFicha(event);
    }
    // window.scrollTo(0,0);
  }
  clickFilaDirecciones(event) {
    if (event.data && !event.data.fechaBaja && this.bodyDirecciones.historico) {
      this.selectedDatosDirecciones.pop();
    }
  }

}
