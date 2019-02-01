import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { DatosGeneralesConsultaItem } from '../../../../../models/DatosGeneralesConsultaItem';
import { DestinatariosItem } from '../../../../../models/DestinatariosItem';
import { Location } from "@angular/common";
import { SigaServices } from "./../../../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";

@Component({
  selector: 'app-datos-generales-consulta',
  templateUrl: './datos-generales-consulta.component.html',
  styleUrls: ['./datos-generales-consulta.component.scss']
})
export class DatosGeneralesConsultaComponent implements OnInit {


  openFicha: boolean = false;
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


  @ViewChild('table') table: DataTable;
  selectedDatos


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


  constructor(private changeDetectorRef: ChangeDetectorRef, private location: Location, private sigaServices: SigaServices) {



  }

  ngOnInit() {


    this.getInstitucion();
    this.getDatos();
    this.getClasesComunicaciones();
    this.getObjetivos();
    this.getModulos();

    this.selectedItem = 4;

    this.getIdioma();

    this.cols = [
      { field: 'consulta', header: 'Consulta' },
      { field: 'finalidad', header: 'Finalidad' },
      { field: 'tipoEjecucion', header: 'Tipo de ejecución' }
    ];

    this.datos = [
      { id: '1', consulta: 'prueba', finalidad: 'prueba', tipoEjecucion: 'prueba' },
      { id: '2', consulta: 'prueba', finalidad: 'prueba', tipoEjecucion: 'prueba' }
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
    },
      err => {
        console.log(err);
      }, );
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
    this.sigaServices.get("comunicaciones_claseComunicaciones").subscribe(
      data => {
        this.clasesComunicaciones = data.combooItems;
        this.clasesComunicaciones.unshift({ label: 'Seleccionar', value: '' });
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
    this.datos = [... this.datos];
  }


  backTo() {
    this.location.back();
  }

  getDatos() {

    if (sessionStorage.getItem("consultasSearch") != null) {
      this.editar = true;
      this.body = JSON.parse(sessionStorage.getItem("consultasSearch"));
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      if (this.body.generica == "Si") {
        this.generica = "S"
      } else {
        this.generica = "N"
      }
    } else {
      this.editar = false;
      this.generica = "S";
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
        sessionStorage.setItem("consultasSearch", JSON.stringify(this.body));
        this.showSuccess('Se ha guardado la consulta correctamente');
      },
      err => {
        this.showFail('Error al guardar la consulta');
        console.log(err);
      },
      () => {

      }
    );
  }


  restablecer() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.body.generica = 'S';
  }


  isButtonDisabled() {
    if (this.body.idModulo != null && this.body.idModulo != '' && this.body.idClaseComunicacion != null && this.body.idClaseComunicacion != ''
      && this.body.idObjetivo != null && this.body.idObjetivo != '' && this.body.nombre != null && this.body.nombre != '') {
      return false;
    }
    return true;
  }

  onChangeObjetivo() {
    sessionStorage.setItem("consultasSearch", JSON.stringify(this.body));
  }



}
