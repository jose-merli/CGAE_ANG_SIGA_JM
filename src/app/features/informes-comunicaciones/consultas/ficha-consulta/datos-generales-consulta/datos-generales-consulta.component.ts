import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { DatosGeneralesConsultaItem } from '../../../../../models/DatosGeneralesConsultaItem';
import { DestinatariosItem } from '../../../../../models/DestinatariosItem';
import { Location } from "@angular/common";
import { SigaServices } from "./../../../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { Subject } from "rxjs/Subject";

@Component({
  selector: "app-datos-generales-consulta",
  templateUrl: "./datos-generales-consulta.component.html",
  styleUrls: ["./datos-generales-consulta.component.scss"]
})
export class DatosGeneralesConsultaComponent implements OnInit {


  openFicha: boolean = true;
  editar: boolean;
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  body: DatosGeneralesConsultaItem = new DatosGeneralesConsultaItem();
  bodyInicial: DatosGeneralesConsultaItem = new DatosGeneralesConsultaItem();
  bodyDestinatario: DestinatariosItem = new DestinatariosItem();
  modulos: any[];
  objetivos: any[];
  clasesComunicaciones: any[];
  idiomas: any[];
  institucionActual: any;
  msgs: Message[];
  generica: string;

  @ViewChild("table") table: DataTable;
  selectedDatos;

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "modelos",
      activa: false
    },
    {
      key: "plantillas",
      activa: false
    },
    {
      key: "consultas",
      activa: false
    }
  ];

  private consultasRefresh = new Subject<any>();
  consultasRefresh$ = this.consultasRefresh.asObservable();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    private sigaServices: SigaServices,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.getInstitucion();
    this.getDatos();
    this.getModulos();
    this.getClasesComunicaciones();
    this.getObjetivos();

    this.selectedItem = 4;

    this.getIdioma();

    this.cols = [
      {
        field: "consulta",
        header: "informesycomunicaciones.consultas.ficha.consulta"
      },
      {
        field: "finalidad",
        header: "informesycomunicaciones.plantillasenvio.ficha.finalidad"
      },
      {
        field: "tipoEjecucion",
        header: "informesycomunicaciones.consultas.ficha.tipoEjecucion"
      }
    ];

    this.datos = [
      {
        id: "1",
        consulta: "prueba",
        finalidad: "prueba",
        tipoEjecucion: "prueba"
      },
      {
        id: "2",
        consulta: "prueba",
        finalidad: "prueba",
        tipoEjecucion: "prueba"
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

    // this.body.idConsulta = this.consultas[1].value;
  }

  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }

  getInstitucion() {

    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      if (this.institucionActual != '2000' && sessionStorage.getItem("crearNuevaConsulta") != null) {
        this.generica = 'N';
      }
      this.habilitarBotones();
    },
      err => {
        console.log(err);
      }
    );
  }

  getIdioma() {
    this.sigaServices.get("etiquetas_lenguaje").subscribe(
      n => {
        this.idiomas = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getClasesComunicaciones() {
    if (this.body.idModulo != undefined && this.body.idModulo != "") {
      this.cargaComboClaseCom(null);
    } else {
      this.clasesComunicaciones = [];
      this.clasesComunicaciones.unshift({ label: 'Seleccionar', value: '' });
    }
  }

  cargaComboClaseCom(event) {
    if (event != null) {
      this.body.idModulo = event.value;
    }
    this.sigaServices
      .getParam(
        "consultas_claseComunicacionesByModulo",
        "?idModulo=" + this.body.idModulo
      )
      .subscribe(
        data => {
          this.clasesComunicaciones = data.combooItems;
          this.clasesComunicaciones.unshift({ label: '', value: '' });
          /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
          this.clasesComunicaciones.map(e => {
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
        },
        err => {
          console.log(err);
        }
      );
  }

  getModulos() {
    this.sigaServices.get("consultas_comboModulos").subscribe(
      data => {
        this.modulos = data.combooItems;
        this.modulos.unshift({ label: '', value: '' });
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.modulos.map((e) => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });
        if (this.body.idModulo == 'undefined' || this.body.idModulo == null || this.body.idModulo == "") {
          this.body.idModulo = this.modulos[0].value;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getObjetivos() {
    this.sigaServices.get("consultas_comboObjetivos").subscribe(
      data => {
        this.objetivos = data.combooItems;
        this.objetivos.unshift({ label: '', value: '' });
      },
      err => {
        console.log(err);
      }
    );
  }

  abreCierraFicha() {
    // fichaPosible.activa = !fichaPosible.activa;
    this.openFicha = !this.openFicha;
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

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onRowSelect() {
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    }
  }

  addConsulta() {
    let obj = {
      consulta: null,
      finalidad: null,
      tipoEjecucion: null
    };
    this.datos.push(obj);
    this.datos = [...this.datos];
  }

  backTo() {
    this.location.back();
  }

  getDatos() {
    if (sessionStorage.getItem("consultasSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("consultasSearch"));
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      if (this.body.generica == "Si") {
        this.generica = "S";
      } else {
        this.generica = "N";
      }
    } else {
      this.editar = true;
      this.generica = "S";
    }
  }

  habilitarBotones() {
    if (this.institucionActual != '2000' && this.body.generica == "Si") {
      this.editar = false;
    } else {
      this.editar = true;
    }
    if (this.editar == false) {
      this.sigaServices.notifyRefreshEditar();
    }
  }

  guardar() {
    this.body.generica = this.generica;

    this.sigaServices.post("consultas_guardarDatosGenerales", this.body).subscribe(
      data => {

        let result = JSON.parse(data["body"]);
        this.body.idConsulta = result.message;
        this.body.sentencia = result.description;
        this.body.idInstitucion = result.infoURL;
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        sessionStorage.removeItem("crearNuevaConsulta");
        sessionStorage.setItem("consultaEditable", "S");
        sessionStorage.setItem("consultasSearch", JSON.stringify(this.body));
        this.showSuccess(this.translateService.instant('informesycomunicaciones.consultas.ficha.correctGuardadoConsulta'));
        this.sigaServices.notifyRefreshConsulta();
      },
      err => {
        this.showFail(this.translateService.instant('informesycomunicaciones.consultas.ficha.errorGuardadoConsulta'));
        console.log(err);
      },
      () => {

      }
    );
  }

  restablecer() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.body.generica = "S";
  }

  isButtonDisabled() {
    if (this.body.idModulo != null && this.body.idModulo != '' && this.body.descripcion != null && this.body.descripcion != ''
      && this.body.idObjetivo != null && this.body.idObjetivo != '' && this.body.nombre != null && this.body.nombre != '') {
      return false;
    }
    return true;
  }

  onChangeObjetivo() {
    //sessionStorage.setItem("consultasSearch", JSON.stringify(this.body));
  }
}
