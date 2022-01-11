import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ControlAccesoDto } from "./../../../../../../app/models/ControlAccesoDto";
import { TranslateService } from "./../../../../../commons/translate/translation.service";
import { SigaServices } from "./../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { PlantillasConsultasItem } from "../../../../../models/PlantillasConsultasItem";

@Component({
  selector: "app-plantillas-envios-consultas",
  templateUrl: "./plantillas-envios-consultas.component.html",
  styleUrls: ["./plantillas-envios-consultas.component.scss"]
})
export class PlantillasEnviosConsultasComponent implements OnInit {
  openFicha: boolean = false;
  activacionEditar: boolean = true;
  derechoAcceso: any;
  permisos: any;
  permisosArray: any[];
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  clasesComunicaciones: any[];
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  numSelected: number = 0;
  rowsPerPage: any = [];
  body: PlantillasConsultasItem = new PlantillasConsultasItem();
  editar: boolean = false;

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
    }
  ];

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getDatos();

    if (sessionStorage.getItem("consultasSearch") == null) {
      this.editar = false;
    } else {
      this.editar = true;
    }
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
    this.selectedItem = 10;

    this.cols = [
      { field: 'nombre', header: "informesycomunicaciones.consultas.ficha.plantilla" },
      { field: 'tipoEnvio', header: "informesycomunicaciones.consultas.objetivo" }
    ]

  }

  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevaConsulta") == null) {
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

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "110";
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisos = JSON.parse(data.body);
        this.permisosArray = this.permisos.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        //console.log(err);
      },
      () => {
        // if (this.derechoAcceso == 3) {
        //   this.activacionEditar = true;
        // } else if (this.derechoAcceso == 2) {
        //   this.activacionEditar = false;
        // } else {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        //   this.router.navigate(["/errorAcceso"]);
        // }
      }
    );
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  navigateTo(dato) {
    let id = dato[0].id;
    if(sessionStorage.getItem("soloLectura") == "true"){
      sessionStorage.setItem('disabledPlantillaEnvio', "true");
    }else{
      sessionStorage.setItem('disabledPlantillaEnvio', "false");
    }
    this.router.navigate(['/fichaPlantilla']);
    sessionStorage.setItem('plantillasEnvioSearch', JSON.stringify(dato[0]));
  }

  getDatos() {
    if (sessionStorage.getItem("consultasSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("consultasSearch"));
      this.getResultados();
    }
  }

  getResultados() {
    this.sigaServices.post("consultas_listadoPlantillas", this.body).subscribe(
      data => {
        this.datos = JSON.parse(data["body"]).listadoPlantillas;
        this.body = this.datos[0];
      },
      err => {
        //console.log(err);
      }
    );
  }
}
