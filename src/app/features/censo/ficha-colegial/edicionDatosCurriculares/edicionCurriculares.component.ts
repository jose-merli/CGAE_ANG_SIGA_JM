import { Component, OnInit, ViewChild } from "@angular/core";
import { esCalendar } from "./../../../../utils/calendar";
import { SigaServices } from "./../../../../_services/siga.service";
import { Router } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { ControlAccesoDto } from "./../../../../../app/models/ControlAccesoDto";
import { Location, DatePipe } from "@angular/common";
import { TranslateService } from "../../../../commons/translate/translation.service";

import { FichaColegialEdicionCurricularesItem } from "../../../../models/FichaColegialEdicionCurricularesItem";
import { FichaColegialEdicionCurricularesObject } from "../../../../models/FichaColegialEdicionCurricularesObject";
import { TipoCurricularItem } from "../../../../models/TipoCurricularItem";
import { SubtipoCurricularItem } from "../../../../models/SubtipoCurricularItem";
/*** COMPONENTES ***/

@Component({
  selector: "app-edicionCurriculares",
  templateUrl: "./edicionCurriculares.component.html",
  styleUrls: ["./edicionCurriculares.component.scss"]
})
export class EdicionCurricularesComponent implements OnInit {
  cols: any = [];
  datos: any[];
  searchIntegrantes = new FichaColegialEdicionCurricularesObject();
  datosActivos: any[];
  select: any[];
  msgs: Message[] = [];
  es: any = esCalendar;
  verificado: Boolean;
  displayAuditoria: any;
  motivo: any;
  showGuardarAuditoria: any;
  comprobarCampoMotivo: any;
  cerrarAuditoria: any;
  guardar: any;
  rowsPerPage: any = [];
  showDatosGenerales: boolean = true;
  pButton;
  historico: boolean = false;
  editar: boolean = false;
  buscar: boolean = false;
  disabled: boolean = false;
  selectMultiple: boolean = false;
  blockCrear: boolean = true;
  selectedItem: number = 10;
  first: number = 0;
  activo: boolean = false;
  dniCorrecto: boolean;
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  categoriaCurricular: any[];
  tipoCurricularCombo: any[];
  subtipoCurricularCombo: any[];
  usuarioBody: any[];
  derechoAcceso: any;
  selectAll: boolean = false;
  update: boolean = true;
  progressSpinner: boolean = false;
  numSelected: number = 0;
  openFicha: boolean = true;
  fichasPosibles: any[];
  tipoCurricular: TipoCurricularItem = new TipoCurricularItem();
  subtipoCurricular: SubtipoCurricularItem = new SubtipoCurricularItem();
  body: FichaColegialEdicionCurricularesItem = new FichaColegialEdicionCurricularesItem();
  datosIntegrantes: FichaColegialEdicionCurricularesObject = new FichaColegialEdicionCurricularesObject();
  fechaCarga: Date;
  fechaBajaCargo: Date;
  columnasTabla: any = [];
  nuevo: Boolean;
  creditosIncorrecto: boolean = false;
  // Obj extras
  bodyInicial: FichaColegialEdicionCurricularesItem = new FichaColegialEdicionCurricularesItem();
  body2: FichaColegialEdicionCurricularesItem = new FichaColegialEdicionCurricularesItem();

  @ViewChild("table")
  table;
  selectedDatos;

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    // this.editar = this.body.editar;
    if (sessionStorage.getItem("nuevoCurriculo")) {
      this.body = new FichaColegialEdicionCurricularesItem();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.nuevo = true;
    } else {
      this.body = JSON.parse(sessionStorage.getItem("curriculo"));
      this.body = this.body[0];
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.nuevo = false;
    }

    // Llamada al rest para obtener la categoría curricular
    this.sigaServices.get("tipoCurricular_categoriaCurricular").subscribe(
      n => {
        this.categoriaCurricular = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.editar = true;
    this.fichasPosibles = [
      {
        key: "identificacion",
        activa: this.editar
      },
      {
        key: "colegiacion",
        activa: this.editar
      },
      {
        key: "vinculacion",
        activa: this.editar
      }
    ];
    this.cols = [
      { field: "nif", header: "administracion.usuarios.literal.NIF" },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      { field: "apellidos", header: "Apellidos" },
      { field: "fechaInicioCargo", header: "Fecha de alta - fecha de baja" },
      { field: "cargos", header: "Cargos del integrante" },
      { field: "liquidacionComoSociedad", header: "Liquidación como sociedad" },
      { field: "ejerciente", header: "Ejerciente" },
      { field: "participacion", header: "Participación en la sociedad" }
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
    // this.sigaServices.get("tipoCurricular_categoriaCurricular").subscribe(
    //   n => {
    //     this.categoriaCurricular = n.combooItems;
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
    // this.body.certificado
    // this.verificado
    this.booleanToCertificado();
    this.activateGuardar();
    this.changeCategoria();
  }
  abrirFicha() {
    this.openFicha = !this.openFicha;
  }

  arreglarFecha(fecha) {
    let fechaNueva = new Date();
    if (fecha != undefined && fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[1] + "/" + splitDate[0] + "/" + splitDate[2];
        fechaNueva = new Date(arrayDate);
      } else {
        fechaNueva = new Date(rawDate);
      }
    } else {
      fechaNueva = undefined;
    }
    return fechaNueva;
  }

  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  certificadoToBoolean() {
    if (this.verificado == true) {
      this.body.certificado = "1";
    } else {
      this.body.certificado = "0";
    }
  }

  booleanToCertificado() {
    if (this.body.certificado == "1") {
      this.verificado = true;
    } else {
      this.verificado = false;
    }
  }

  backTo() {
    this.router.navigate(["fichaColegial"]);
  }

  // pInputText;
  // transformaFecha(fecha) {
  //   let jsonDate = JSON.stringify(fecha);
  //   let rawDate = jsonDate.slice(1, -1);
  //   if (rawDate.length < 14) {
  //     let splitDate = rawDate.split("/");
  //     let arrayDate = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
  //     fecha = new Date((arrayDate += "T00:00:00.001Z"));
  //   } else {
  //     fecha = new Date(fecha);
  //   }
  //   return fecha;
  // }

  guardarCv() {
    this.progressSpinner = true;
    this.body.dateFechaInicio = this.arreglarFecha(this.body.fechaDesde);
    this.body.dateFechaFin = this.arreglarFecha(this.body.fechaHasta);
    this.body.dateFechaMovimiento = this.arreglarFecha(
      this.body.fechaMovimiento
    );

    if (this.nuevo) {
      this.progressSpinner = false;
    } else {
      this.sigaServices
        .postPaginado(
          "fichaDatosCurriculares_update",
          "?numPagina=1",
          this.body
        )
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.bodyInicial = JSON.parse(JSON.stringify(this.body));
            this.activateGuardar();
            this.showSuccess();
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
            this.showFail();
          },
          () => {}
        );
    }
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  compruebaRegistro() {
    var a = this.body.creditos;
    if (Number(this.body.creditos) && !this.onlySpaces(this.body.creditos)) {
      this.creditosIncorrecto = false;
      return true;
    } else {
      if (this.body.creditos == "" || this.onlySpaces(this.body.creditos)) {
        this.creditosIncorrecto = null;
        return false;
      } else {
        this.creditosIncorrecto = true;
        return false;
      }
    }
  }

  onlySpaces(str) {
    let i = 0;
    var ret;
    ret = true;
    while (i < str.length) {
      if (str[i] != " ") {
        ret = false;
      }
      i++;
    }
    return ret;
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }
  restablecer() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.booleanToCertificado();
    this.compruebaRegistro();
  }

  isDisabledCombos() {
    if (this.body.idTipoCv != "" && this.body.idTipoCv != null) {
      return false;
    } else {
      return true;
    }
  }

  activateGuardar() {
    if (JSON.stringify(this.body) == JSON.stringify(this.bodyInicial)) {
      return false;
    } else {
      if (
        this.creditosIncorrecto == true ||
        this.body.fechaDesde == null ||
        this.body.idTipoCv == undefined ||
        this.body.idTipoCv == null
      ) {
        return false;
      } else {
        return true;
      }
    }
  }

  activateRestablecer() {
    if (JSON.stringify(this.body) == JSON.stringify(this.bodyInicial)) {
      return false;
    } else {
      return true;
    }
  }

  changeCategoria() {
    this.tipoCurricular.idTipoCV = this.body.idTipoCv;
    this.subtipoCurricular.idTipoCV = this.body.idTipoCv;
    this.sigaServices
      .postPaginado(
        "tipoCurricular_comboTipoCurricular",
        "?numPagina=1",
        this.tipoCurricular
      )
      .subscribe(
        data => {
          this.tipoCurricularCombo = JSON.parse(data.body).combooItems;
        },
        err => {
          console.log(err);
        }
      );

    this.sigaServices
      .postPaginado(
        "subtipoCurricular_comboSubtipoCurricular",
        "?numPagina=1",
        this.subtipoCurricular
      )
      .subscribe(
        data => {
          this.subtipoCurricularCombo = JSON.parse(data.body).combooItems;
        },
        err => {
          console.log(err);
        }
      );
  }

  showFailDetallado(message: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: message
    });
  }
}
