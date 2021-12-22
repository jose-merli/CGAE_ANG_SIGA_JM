import { Component, OnInit, ViewChild, Input, OnChanges, ChangeDetectorRef, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { DataTable, ConfirmationService } from '../../../../../../../node_modules/primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FichaDatosCurricularesObject } from '../../../../../models/FichaDatosCurricularesObject';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';
import { FichaColegialColegialesItem } from '../../../../../models/FichaColegialColegialesItem';
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { Table } from 'primeng/table';
import { EdicionCurricularesComponent } from '../../edicionDatosCurriculares/edicionCurriculares.component';
import { RevisionAutLetradoItem } from '../../../../../models/RevisionAutLetradoItem';

@Component({
  selector: 'app-datos-curriculares-ficha-colegial',
  templateUrl: './datos-curriculares-ficha-colegial.component.html',
  styleUrls: ['./datos-curriculares-ficha-colegial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatosCurricularesFichaColegialComponent implements OnInit, OnChanges {

  selectAllCurriculares: boolean = false;
  openFicha: boolean = false;
  tarjetaCurricularesNum: string;

  datosCurriculares: any[] = [];
  sortF: any;
  sortO: any;
  icon: string;
  msgs = [];
  selectedDatosCurriculares;
  selectMultipleCurriculares: boolean = false;
  datosCurricularesRemove: FichaDatosCurricularesObject = new FichaDatosCurricularesObject();
  progressSpinner: boolean = false;
  editar: boolean = false;
  numSelectedCurriculares: number = 0;
  @Input() tarjetaCurriculares: string;
  historicoCV: boolean = false;
  mostrarDatosCurriculares: boolean = false;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  DescripcionDatosCurriculares;
  fichasPosibles = [
    {
      key: "curriculares",
      activa: false
    },
  ];
  mostrarNumero: Boolean = false;
  message;
  messageNoContent;
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  checkGeneralBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  checkColegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  @Input() esColegiado: boolean = null;
  isColegiadoEjerciente: boolean = false;
  esNewColegiado: boolean = false;
  activacionEditar: boolean = true;
  activacionTarjeta: boolean = false;
  emptyLoadFichaColegial: boolean = false;
  desactivarVolver: boolean = true;
  colsCurriculares;
  selectedItemCurriculares: number = 10;
  rowsPerPage;
  permisos: boolean = true;
  isLetrado: boolean;

  disabledAction: boolean = false;

  @ViewChild("tableCurriculares")
  tableCurriculares: Table;
  @Input() idPersona;
  @Input() openCurricu;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  constructor(private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    if (sessionStorage.getItem("disabledAction") == "true") { // Esto disablea tela de cosas funciona como medio permisos. 
      // Es estado baja colegial (historico?)
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }
    this.colsCurriculares = [
      {
        field: "dateFechaInicio",
        header: "facturacion.seriesFacturacion.literal.fInicio"
      },
      {
        field: "dateFechaFin",
        header: "censo.consultaDatos.literal.fechaFin"
      },
      {
        field: "categoriaCurricular",
        header: "censo.busquedaClientesAvanzada.literal.categoriaCV"
      },
      {
        field: "tipoSubtipo",
        header: "censo.busquedaClientesAvanzada.literal.subtiposCV"
      },
      {
        field: "descripcion",
        header: "general.description"
      }
    ];

    if (
      sessionStorage.getItem("personaBody") != null &&
      sessionStorage.getItem("personaBody") != undefined &&
      JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true
    ) {
      // sessionStorage.removeItem("esNuevoNoColegiado");
      this.generalBody = new FichaColegialGeneralesItem();
      this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.checkGeneralBody = new FichaColegialGeneralesItem();
      this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
      if (this.colegialesBody.situacionResidente == "0") this.colegialesBody.situacionResidente = "No";
      if (this.colegialesBody.situacionResidente == "1") this.colegialesBody.situacionResidente = "Si";

      this.checkColegialesBody = JSON.parse(JSON.stringify(this.colegialesBody));
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      // sessionStorage.removeItem("esNuevoNoColegiado");
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }
    this.getCols();
  }

  ngOnChanges() {

    if (this.esColegiado != null) {
      if (this.esColegiado) {
        if (this.colegialesBody.situacion == "20") {
          this.isColegiadoEjerciente = true;
        } else {
          this.isColegiadoEjerciente = false;
        }
      }

      let migaPan = "";

      if (this.esColegiado) {
        migaPan = this.translateService.instant("menu.censo.fichaColegial");
      } else {
        migaPan = this.translateService.instant("menu.censo.fichaNoColegial");
      }
    }
    if (this.idPersona != undefined) {
      if ((this.datosCurriculares == undefined || this.datosCurriculares.length == 0) && (this.tarjetaCurriculares == "3" || this.tarjetaCurriculares == "2")) {
        this.onInitCurriculares();
        
        if(this.tarjetaCurriculares == "3"){
          this.permisos = true;
        }else{
          this.permisos = false;
        }
        this.getLetrado();

      }
    }
    if (this.openCurricu == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('curriculares')
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
  onChangeRowsPerPagesCurriculares(event) {
    this.selectedItemCurriculares = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableCurriculares.reset();
  }

  activarPaginacionCurriculares() {
    if (!this.datosCurriculares || this.datosCurriculares.length == 0)
      return false;
    else return true;
  }

  changeSort(event) {
    this.sortF = "fechaHasta";
    this.sortO = 1;
    if (this.tableCurriculares != undefined) {
      this.tableCurriculares.sortField = this.sortF;
      //this.table.sortOrder = this.sortO;
    }

    // this.table.sortMultiple();
  }

  deleteCurriculares(selectedDatosCurriculares) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    this.icon = "fa fa-trash-alt";
    let keyConfirmation = "eliminarCV";

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: mess,
      icon: this.icon,
      accept: () => {
        this.eliminarRegistroCV(selectedDatosCurriculares);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];

        this.selectedDatosCurriculares = [];
        this.selectMultipleCurriculares = false;
      }
    });
  }

  eliminarRegistroCV(selectedDatosCurriculares) {
    this.progressSpinner = true;

    selectedDatosCurriculares.forEach(element => {
      this.datosCurricularesRemove.fichaDatosCurricularesItem.push(element);
    });

    this.sigaServices
      .post("fichaDatosCurriculares_delete", this.datosCurricularesRemove)
      .subscribe(
        data => {
          if (selectedDatosCurriculares.length == 1) {
            this.showSuccessDetalle(
              this.translateService.instant("messages.deleted.success")
            );
          } else {
            this.showSuccessDetalle(
              selectedDatosCurriculares.length +
              " " +
              this.translateService.instant(
                "messages.deleted.selected.success"
              )
            );
          }

          //Se comprueba si se han realizado cambios en los datos colegiales
          if (
            selectedDatosCurriculares != null
          ) {
            //REVISAR: INTRODUCIR LLAMADA AL SERVICIO DE PROCESAMIENTO DE SERVICIOS DE PERSONA
            //let peticion = new RevisionAutLetradoItem();
            //peticion.idPersona = this.generalBody.idPersona.toString();
            //peticion.fechaProcesamiento = new Date();
            //this.sigaServices.post("PyS_actualizacionSuscripcionesPersona", peticion).subscribe();
          }
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          this.editar = false;
          this.selectedDatosCurriculares = [];
          this.numSelectedCurriculares = 0;
          this.selectMultipleCurriculares = false;
          this.searchDatosCurriculares();
        }
      );
  }

  actualizaSeleccionadosCurriculares(selectedDatos) {
    this.numSelectedCurriculares = selectedDatos.length;
  }
  redireccionarCurriculares(dato) {
    if (dato && dato.length < 2 && !this.selectMultipleCurriculares) {
      // enviarDatos = dato[0];
      sessionStorage.setItem("curriculo", JSON.stringify(dato));

      if (dato[0].fechaBaja != null || (this.tarjetaCurriculares == '2')) {
        sessionStorage.setItem("permisos", "false");
      } else {
        sessionStorage.setItem("permisos", "true");
      }

      sessionStorage.setItem("crearCurriculo", "false");
      this.router.navigate(["/edicionCurriculares"]);
    } else {
      this.numSelectedCurriculares = this.selectedDatosCurriculares.length;
      sessionStorage.setItem("crearCurriculo", "true");
    }
  }

  onInitCurriculares() {
    this.searchDatosCurriculares();
    if (sessionStorage.getItem("abrirCurriculares")) {
      // this.abreCierraFicha("curriculares");
    }
    sessionStorage.removeItem("abrirCurriculares");

    let event = { field: "fechaFin", order: 1, multisortmeta: undefined };
    this.changeSort(event);
  }

  irNuevoCurriculares() {
    sessionStorage.removeItem("permisos");
    sessionStorage.setItem("nuevoCurriculo", "true");
    sessionStorage.setItem("idPersona", JSON.stringify(this.idPersona));
    this.router.navigate(["/edicionCurriculares"]);
  }
  searchDatosCurriculares() {
    this.selectAllCurriculares = false;
    this.selectMultipleCurriculares = false;
    this.selectedDatosCurriculares = [];
    this.numSelectedCurriculares = 0;
    this.mostrarNumero = false;
    this.progressSpinner = true;
    let bodyCurricular = {
      idPersona: this.idPersona,
      historico: this.historicoCV
    };
    this.sigaServices
      .postPaginado(
        "fichaDatosCurriculares_search",
        "?numPagina=1",
        bodyCurricular
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          let search = JSON.parse(data["body"]);
          this.datosCurriculares = search.fichaDatosCurricularesItem;
          //REVISAR: INTRODUCIR LLAMADA AL SERVICIO DE PROCESAMIENTO DE SERVICIOS DE PERSONA
          //let peticion = new RevisionAutLetradoItem();
          //peticion.idPersona = this.generalBody.idPersona.toString();
          //peticion.fechaProcesamiento = new Date();
          //this.sigaServices.post("PyS_actualizacionSuscripcionesPersona", peticion).subscribe();
          // this.table.reset();
        },
        err => {
          //   console.log(err);
          this.progressSpinner = false;
          this.mostrarNumero = true;
        }, () => {
          this.progressSpinner = false;
          if (this.datosCurriculares.length > 0) {
            this.mostrarDatosCurriculares = true;
            for (let i = 0; i <= this.datosCurriculares.length - 1; i++) {
              this.DescripcionDatosCurriculares = this.datosCurriculares[i];
            }
          }
          if (this.datosCurriculares.length == 0) {
            this.message = this.datosCurriculares.length.toString();
            this.messageNoContent = this.translateService.instant(
              "general.message.no.registros"
            );
            this.mostrarNumero = true;

          } else {
            this.message = this.datosCurriculares.length.toString();
            this.mostrarNumero = true;

          }
        }
      );
  }

  isSelectMultipleCurriculares() {
    this.selectMultipleCurriculares = !this.selectMultipleCurriculares;
    if (!this.selectMultipleCurriculares) {
      this.numSelectedCurriculares = 0;
      this.selectedDatosCurriculares = [];
    } else {
      this.selectAllCurriculares = false;
      this.selectedDatosCurriculares = [];
      this.numSelectedCurriculares = 0;
    }
  }

  //Opción tabla de seleccionar todas las filas
  onChangeSelectAllCurriculares() {
    if (this.selectAllCurriculares === true) {
      if(this.historicoCV){
        this.selectMultipleCurriculares = false;
        this.selectedDatosCurriculares = this.datosCurriculares.filter(dato => dato.fechaBaja != undefined);
        this.numSelectedCurriculares = this.selectedDatosCurriculares.length;
      }else{
        this.selectMultipleCurriculares = false;
        this.selectedDatosCurriculares = this.datosCurriculares;
        this.numSelectedCurriculares = this.datosCurriculares.length;
      }
    } else {
      this.selectedDatosCurriculares = [];
      this.numSelectedCurriculares = 0;
    }
  }

  cargarDatosCV() {
    this.historicoCV = false;
    this.progressSpinner = true;

    this.searchDatosCurriculares();
    this.selectedDatosCurriculares = [];
    if (!this.historicoCV) {
      this.selectMultiple = false;
      this.selectAll = false;
    }
  }

  cargarHistorico() {
    this.selectAllCurriculares = false;
    this.selectMultipleCurriculares = false;
    this.selectedDatosCurriculares = [];
    this.numSelectedCurriculares = 0;
    this.progressSpinner = true;
    this.historicoCV = true;

    this.searchDatosCurriculares();
  }


  showSuccessDetalle(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: this.translateService.instant("general.message.correct"), detail: mensaje });
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
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

  clear() {
    this.msgs = [];
  }

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }
  isOpenReceive(event) {
    let fichaPosible = this.esFichaActiva(event);
    if (fichaPosible == false) {
      this.abreCierraFicha(event);
    }
    // window.scrollTo(0,0);
  }
  clickFilaCurricular(event) {
    if (event.data && !event.data.fechaBaja && this.historicoCV) {
      this.selectedDatosCurriculares.pop();
    }
  }
  
  getLetrado() {
    if (JSON.parse(sessionStorage.getItem("isLetrado")) == true) {
      this.isLetrado = true;
    } else {
      this.isLetrado = !this.permisos;
    }
  }

}
