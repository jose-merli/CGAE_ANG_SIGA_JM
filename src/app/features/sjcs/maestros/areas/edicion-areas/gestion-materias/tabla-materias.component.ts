import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { AreasItem } from '../../../../../../models/sjcs/AreasItem';
import { UpperCasePipe } from '../../../../../../../../node_modules/@angular/common';
import { AreasObject } from '../../../../../../models/sjcs/AreasObject';
import { findIndex } from 'rxjs/operators';

@Component({
  selector: 'app-tabla-materias',
  templateUrl: './tabla-materias.component.html',
  styleUrls: ['./tabla-materias.component.scss']
})
export class TablaMateriasComponent implements OnInit {

  textSelected: String = "{label}";

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  cols;
  rowsPerPage;

  datos = [];


  comboPJ;

  progressSpinner: boolean = false;
  msgs;
  body;
  nuevo: boolean = false;
  datosInicial = [];
  update = [];

  selectedBefore;

  //Resultados de la busqueda
  @Input() idArea;
  //Resultados de la busqueda
  @Input() modoEdicion: boolean = false;

  @ViewChild("tabla") tablaAreas;


  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices, private translateService: TranslateService, private upperCasePipe: UpperCasePipe) { }

  ngOnInit() {

    this.cols = [
      { field: "descripcionsub", header: "" },
      { field: "jurisdiccion", header: "Partidos Judiciales" }
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
    this.getComboPartidosJudiciales();

    if (this.idArea != undefined) {
      this.modoEdicion = true;
    } else {
      this.modoEdicion = false;
    }


  }

  getComboPartidosJudiciales() {
    this.progressSpinner = true;

    this.sigaServices.get("fichaAreas_getPartidosJudiciales").subscribe(
      n => {
        this.comboPJ = n.combooItems;

        if (this.idArea != undefined) {
          this.getAreas();
        } else {
          this.progressSpinner = false;
        }

      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      }
    );
  }

  getAreas() {
    this.sigaServices
      .getParam(
        "fichaAreas_searchSubzones",
        "?idArea=" + this.idArea
      )
      .subscribe(
        res => {
          this.datos = res.AreasItems;

          this.datos.forEach(element => {
            element.editable = false
          });

          this.progressSpinner = false;

          this.getPartidosJudiciales();
        },
        err => {
          console.log(err);
          this.progressSpinner = false;

        }
      );
  }

  getPartidosJudiciales() {

    for (let i = 0; i < this.datos.length; i++) {
      this.datos[i].partidosJudiciales = [];
      this.datos[i].jurisdiccion.forEach(partido => {
        let findPartido = this.comboPJ.find(x => x.value === partido);

        if (findPartido != undefined) {
          this.datos[i].partidosJudiciales.push(findPartido);
        }

      });

      if (i == this.datos.length - 1) {
        this.datosInicial = JSON.parse(JSON.stringify(this.datos));
      }

    }

    if (this.datos.length == 0) {
      this.datosInicial = [];
    }


  }


  save() {
    // this.progressSpinner = true;
    // let url = "";

    // if (this.nuevo) {
    //   url = "fichaAreas_createZone";
    //   this.validateNewZone(url);

    // } else {
    //   url = "fichaAreas_updateZones";
    //   this.body = new AreasObject();
    //   this.body.areasItems = this.updateAreas;
    //   this.callSaveZoneService(url)
    // }


  }


  // callSaveZoneService(url) {


  // this.sigaServices.post(url, this.body).subscribe(
  //   data => {

  //     if (this.nuevo) {
  //       this.nuevo = false;
  //       this.datosInicial = JSON.parse(JSON.stringify(this.datos));
  //     }

  //     this.getAreas();
  //     this.selectedDatos = [];
  //     this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
  //     this.progressSpinner = false;
  //   },
  //   err => {

  //     if (JSON.parse(err.error).error.description != "") {
  //       this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
  //     } else {
  //       this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
  //     }
  //     this.progressSpinner = false;
  //   },
  //   () => {
  //     this.progressSpinner = false;
  //   }
  // );

  // }

  // newZone() {
  //   this.nuevo = true;
  //   this.seleccionAreas = false;

  //   if (this.datosInicial != undefined && this.datosInicial != null) {
  //     this.datos = JSON.parse(JSON.stringify(this.datosInicial));
  //   } else {
  //     this.datos = [];
  //   }

  //   let  = {
  //     descripcion: "",
  //     descripcionsub: "",
  //     partidosJudiciales: [],
  //     jurisdiccion: [],
  //     id: this.id,
  //     Nueva: true
  //   };

  //   if (this.datos.length == 0) {
  //     this.datos.push();
  //   } else {
  //     this.datos = [, ...this.datos];
  //   }

  // }

  // validateZone(e) {

  //   if (!this.nuevo) {
  //     let datoId = this.datos.findIndex(item => item.idsub === this.selectedBefore.idsub);

  //     let findDato = this.datos.filter(item => this.upperCasePipe.transform(item.descripcionsub) === this.upperCasePipe.transform(e.srcElement.value.trim()));

  //     if (findDato.length > 1) {
  //       this.showMessage("error", this.translateService.instant("general.message.incorrect"), "Ya existe una sub con esa descripción");
  //       this.progressSpinner = false;
  //       this.datos[datoId].descripcionsub = this.selectedBefore.descripcionsub;

  //     } else {
  //       let dato = this.datos.find(item => this.upperCasePipe.transform(item.descripcionsub) === this.upperCasePipe.transform(e.srcElement.value.trim()));
  //       this.editarDescripcion(dato);
  //     }

  //     this.seleccionAreas = false;
  //   }
  // }

  // validateNewZone(url) {
  //   let  = this.datos[0];

  //   let findDato = this.datosInicial.find(item => item.id === .id && item.descripcionsub === .descripcionsub);

  //   if (findDato != undefined) {
  //     this.showMessage("info", "Informacion", "Ya existe un  con ese nombre");
  //   } else {
  //     this.body = ;
  //     this.callSaveZoneService(url);
  //   }

  // }

  disabledSave() {
    // if (this.nuevo) {
    //   if (this.datos[0].descripcionsub != undefined && this.datos[0].descripcionsub != null
    //     && this.datos[0].descripcionsub != "" && this.datos[0].partidosJudiciales != undefined && this.datos[0].partidosJudiciales.length > 0) {
    //     return false;
    //   } else {
    //     return true;
    //   }

    // } else {
    //   if (this.updateAreas != undefined && this.updateAreas.length > 0) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // }
  }

  editAreas(selectedDatos) {

    // if (this.nuevo) {
    //   this.seleccionAreas = false;
    // } else {

    //   if (!this.selectAll && !this.selectMultiple) {
    //     this.datos.forEach(element => {
    //       element.editable = false;
    //     });

    //     selectedDatos[0].editable = true;
    //     this.seleccionAreas = true;

    //     let findDato = this.datosInicial.find(item => item.id === selectedDatos[0].id && item.idsub === selectedDatos[0].idsub);

    //     this.selectedBefore = findDato;
    //   }

    // }
  }

  editarDescripcion(dato) {

    // let findDato = this.datosInicial.find(item => item.id === dato.id && item.idsub === dato.idsub);

    // if (findDato != undefined) {
    //   if (dato.descripcionsub != findDato.descripcionsub) {

    //     let findUpdate = this.updateAreas.find(item => item.id === dato.id && item.idsub === dato.idsub);

    //     if (findUpdate == undefined) {
    //       this.updateAreas.push(dato);
    //     }
    //   }
    // }

  }

  editPartidosJudiciales(dato) {

    // if (!this.nuevo) {

    //   let findUpdate = this.updateAreas.find(item => item.id === dato.id && item.idsub === dato.idsub);

    //   if (findUpdate == undefined) {
    //     this.updateAreas.push(dato);
    //   } else {
    //     let findUpdate = this.updateAreas.findIndex(item => item.id === dato.id && item.idsub === dato.idsub);
    //     this.updateAreas[findUpdate].partidosJudiciales = dato.partidosJudiciales;
    //   }
    // } else {
    //   this.selectedDatos = [];
    // }

  }

  delete() {
    // this.body = new AreasObject();
    // this.body.AreasItems = this.selectedDatos;

    // this.sigaServices.post("fichaAreas_deleteZones", this.body).subscribe(
    //   data => {

    //     this.nuevo = false;
    //     this.selectedDatos = [];
    //     this.getAreas();
    //     this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
    //     this.progressSpinner = false;
    //   },
    //   err => {

    //     if (JSON.parse(err.error).error.description != "") {
    //       this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
    //     } else {
    //       this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
    //     }
    //     this.progressSpinner = false;
    //   },
    //   () => {
    //     this.progressSpinner = false;
    //   }
    // );
  }


  rest() {
    // if (this.datosInicial != undefined) {
    //   this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    // } else {
    //   this.datos = [];
    // }

    // this.updateAreas = [];
    // this.nuevo = false;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }


  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tablaAreas.reset();
  }

  onChangeSelectAllAreas() {
    if (this.selectAll) {
      this.selectMultiple = true;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
    }
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
    // this.volver();
  }


  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    // this.seleccionAreas = false;
  }

  clear() {
    this.msgs = [];
  }
}
