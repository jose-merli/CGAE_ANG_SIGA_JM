import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { Location } from "@angular/common";
import { Router } from '@angular/router';
import { PlantillaEnvioConsultasItem } from '../../../../../models/PlantillaEnvioConsultasItem';
import { PlantillasEnvioConsultasObject } from '../../../../../models/PlantillasEnvioConsultasObject';
import { SigaServices } from "./../../../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";

@Component({
  selector: 'app-consultas-plantillas',
  templateUrl: './consultas-plantillas.component.html',
  styleUrls: ['./consultas-plantillas.component.scss']
})

export class ConsultasPlantillasComponent implements OnInit {

  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  formatos: any[];
  sufijos: any[];
  textFilter: string;
  openFicha: boolean = false;
  body: PlantillaEnvioConsultasItem = new PlantillaEnvioConsultasItem();
  searchConsultasPlantillasEnvio: PlantillasEnvioConsultasObject = new PlantillasEnvioConsultasObject();
  progressSpinner: boolean = false;
  consultas: any = [];
  selectedConsulta: string;
  nuevaConsulta: boolean = false;
  eliminarArray: any[];
  msgs: Message[];
  finalidad: string;

  @ViewChild('table') table: DataTable;
  selectedDatos


  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "consultas",
      activa: false
    },
    {
      key: "remitente",
      activa: false
    },

  ];


  constructor(private changeDetectorRef: ChangeDetectorRef, private location: Location, private router: Router, private sigaServices: SigaServices,
    private confirmationService: ConfirmationService, private translateService: TranslateService) {


  }

  ngOnInit() {

    // this.getDatos();

    this.textFilter = "Elegir";

    this.selectedItem = 10;

    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'finalidad', header: 'Finalidad' },
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

  navigateTo(dato) {
    let id = dato[0].id;
    console.log(dato)
    if (!this.selectMultiple && id) {
      this.router.navigate(['/fichaConsulta']);
      sessionStorage.setItem("consultaPlantillaSearch", JSON.stringify(this.body))
    }
  }


  abreCierraFicha() {

    if (sessionStorage.getItem("crearNuevaPlantilla") == null) {
      this.openFicha = !this.openFicha;
      if (this.openFicha) {
        this.getDatos();
      }
    }

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

  addConsulta() {
    let objNewConsulta = {
      idConsulta: '',
      nombre: '',
      finalidad: '',
      asociada: false
    }

    this.nuevaConsulta = true;

    this.datos.push(objNewConsulta);
    this.datos = [... this.datos];
    this.selectedDatos = [];
  }

  getDatos() {
    if (sessionStorage.getItem("plantillasEnvioSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("plantillasEnvioSearch"));
      this.progressSpinner = true;
      this.getResultados();
    }
  }

  getResultados() {

    //llamar al servicio de busqueda
    this.sigaServices
      .post("plantillasEnvio_consultas", this.body)
      .subscribe(
        data => {

          this.searchConsultasPlantillasEnvio = JSON.parse(data["body"]);
          this.datos = this.searchConsultasPlantillasEnvio.consultaItem;
          this.getConsultas();
          this.datos.map(e => {
            let id = e.idConsulta;
            this.getFinalidad(id);
            return e.finalidad = '', e.asociada = true;
          })



        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => { }
      );

  }


  getConsultas() {
    this.sigaServices
      .get("plantillasEnvio_comboConsultas")
      .subscribe(
        data => {
          this.consultas = data.combooItems;
          console.log(this.consultas)

        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => { }
      );
  }

  onChangeConsultas(e) {
    let id = e.value;
    this.getFinalidad(id);
    console.log(id)
  }

  asociar(dato) {
    let objAsociar = {
      idConsulta: dato[0].idConsulta,
      idTipoEnvios: this.body.idTipoEnvios,
      idPlantillaEnvios: this.body.idPlantillaEnvios
    }

    this.sigaServices
      .post("plantillasEnvio_asociarConsulta", objAsociar)
      .subscribe(
        data => {
          this.nuevaConsulta = false;
          this.showSuccess('La consulta ha sido asociada correctamente');

        },
        err => {
          console.log(err);
          this.progressSpinner = false;
          this.showFail('Error al asociar la consulta');
        },
        () => {
          this.getResultados();
        }
      );
  }

  desasociar(dato) {

    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message: '¿Está seguro de cancelar los' + dato.length + 'envíos seleccionados',
      icon: "fa fa-trash-alt",
      accept: () => {
        this.confirmarDesasociar(dato);
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
      }
    });
  }


  confirmarDesasociar(dato) {
    // this.eliminarArray = [];
    // dato.forEach(element => {
    let objEliminar = {
      idConsulta: dato[0].idConsulta,
      idTipoEnvios: this.body.idTipoEnvios,
      idPlantillaEnvios: this.body.idPlantillaEnvios
    };
    //   this.eliminarArray.push(objEliminar);
    // });
    this.sigaServices.post("plantillasEnvio_desaociarConsulta", objEliminar).subscribe(
      data => {
        this.showSuccess('Se ha desasociado la plantilla correctamente');
      },
      err => {
        this.showFail('Error al desasociar la plantilla');
        console.log(err);
      },
      () => {
        this.getResultados();
      }
    );
  }

  goNuevaConsulta() {
    this.router.navigate(['/fichaConsulta']);
    sessionStorage.setItem("nuevaConsultaPlantillaEnvios", JSON.stringify(this.body))
  }

  getFinalidad(id) {
    this.sigaServices
      .post("plantillasEnvio_finalidadConsulta", id)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.finalidad = JSON.parse(data["body"]).finalidad;
          for (let dato of this.datos) {
            if (!dato.idConsulta) {
              dato.idConsulta = id;
              dato.finalidad = this.finalidad;
            } else if (dato.idConsulta && dato.idConsulta == id) {
              dato.finalidad = this.finalidad;
            }
          }
          this.datos = [... this.datos];
          console.log(this.datos)
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => { }
      );
  }


}


