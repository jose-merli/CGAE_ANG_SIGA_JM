import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { JusticiableBusquedaItem } from '../../../../../../models/sjcs/JusticiableBusquedaItem';
import { ConfirmationService, Message } from 'primeng/components/common/api';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';

@Component({
  selector: 'app-detalle-tarjeta-interesados-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-interesados-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-interesados-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaInteresadosFichaDesignacionOficioComponent implements OnInit {

  msgs: Message[] = [];

  @Output() searchInteresados = new EventEmitter<boolean>();

  @Input() interesados;
  @Input() campos;

  selectedItem: number = 10;
  datos;
  cols;
  rowsPerPage;
  selectMultiple: boolean = false;
  selectionMode: string = "single";
  numSelected = 0;

  selectedDatos: any = [];

  selectAll: boolean = false;
  progressSpinner: boolean = false;

  idClasesComunicacionArray: string[] = [];
  idClaseComunicacion: String;
  keys: any[] = [];

  @ViewChild("table") tabla;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getCols();
    this.datos = this.interesados;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.datos = this.interesados;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  actualizaSeleccionados() {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (this.selectedDatos != undefined) {
      if (this.selectedDatos.length == undefined) this.numSelected = 1;
      else this.numSelected = this.selectedDatos.length;
    }
  }

  getCols() {

    this.cols = [
      { field: "nif", header: "justiciaGratuita.oficio.designas.interesados.identificador" },
      { field: "apellidosnombre", header: "justiciaGratuita.oficio.designas.interesados.apellidosnombre" },
      { field: "direccion", header: "justiciaGratuita.oficio.designas.interesados.direccion" },
      { field: "representante", header: "justiciaGratuita.oficio.designas.interesados.representante" }
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

  Eliminar() {
    let keyConfirmation = "deletePlantillaDoc";

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: this.translateService.instant('messages.deleteConfirmation'),
      icon: "fa fa-trash-alt",
      accept: () => {
        this.progressSpinner = true;
        let request = [this.selectedDatos.idInstitucion, this.selectedDatos.idPersona, this.selectedDatos.anio, this.selectedDatos.idTurno, this.selectedDatos.numero]
        this.sigaServices.post("designaciones_deleteInteresado", request).subscribe(
          data => {
            this.selectedDatos = [];
            this.searchInteresados.emit();
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.progressSpinner = false;
          },
          err => {
            if (err != undefined && JSON.parse(err.error).error.description != "") {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            }
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
            this.selectMultiple = false;
            this.selectAll = false;
          }
        );
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

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  NewInteresado() {
    sessionStorage.setItem("origin", "newInteresado");
    sessionStorage.setItem("itemDesignas", JSON.stringify(true));
    sessionStorage.setItem("interesados", JSON.stringify(this.interesados));

    this.router.navigate(["/justiciables"]);
  }

  openTab(evento) {
    let interesado = new JusticiableBusquedaItem();
    let datos;
    interesado.idpersona = evento.idPersona;
    sessionStorage.setItem("personaDesigna", evento.idPersona);
    this.progressSpinner = true;
    this.sigaServices.post("busquedaJusticiables_searchJusticiables", interesado).subscribe(
      n => {
        datos = JSON.parse(n.body).justiciableBusquedaItems;
        let error = JSON.parse(n.body).error;
        this.progressSpinner = false;

        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }
        this.persistenceService.setDatos(datos[0]);
        sessionStorage.setItem("origin", "Interesado");
        sessionStorage.setItem("designa", JSON.stringify(this.interesados));
        this.persistenceService.clearBody();

        if (evento.representante != "" && evento.representante != null) {
          let representante = new JusticiableBusquedaItem();
          let nombre = evento.representante.split(",");
          representante.apellidos = nombre[0];
          representante.nombre = nombre[1];
          this.sigaServices.post("busquedaJusticiables_searchJusticiables", representante).subscribe(
            j => {
              this.persistenceService.setBody(JSON.parse(j.body).justiciableBusquedaItems[0]);
              this.router.navigate(["/gestionJusticiables"]);
            })
        }
        else {
          this.router.navigate(["/gestionJusticiables"]);
        }
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      });



  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      /* if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
        this.selectMultiple = true;
        this.selectionMode = "single";
      } else { */
      this.selectedDatos = this.datos;
      /* this.selectMultiple = false;
      this.selectionMode = "single";
    }
    this.selectionMode = "multiple"; */
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      /*  if (this.historico)
         this.selectMultiple = true;
       this.selectionMode = "multiple"; */
    }
  }

  clear() {
    this.msgs = [];
  }

  comunicar(){
    let rutaPri;
    if(this.selectedDatos.length > 0){
      rutaPri = "/fichaDesignacionesInteresados"
    }else{
      rutaPri = "/fichaDesignacionesSinInteresados"
    }
    sessionStorage.setItem("rutaComunicacion", rutaPri);
    //IDMODULO de SJCS 10
    sessionStorage.setItem("idModulo", '10');
    let datosSeleccionados = [];

    this.sigaServices
      .post("dialogo_claseComunicacion", rutaPri)
      .subscribe(
        data => {
          this.idClaseComunicacion = JSON.parse(
            data["body"]
          ).clasesComunicaciones[0].idClaseComunicacion;
          this.sigaServices
            .post("dialogo_keys", this.idClaseComunicacion)
            .subscribe(
              data => {
                this.keys = JSON.parse(data["body"]).keysItem;
                if(this.selectedDatos.length > 0){
                  this.selectedDatos.forEach(element => {
                    let keysValues = [];
                    this.keys.forEach(key => {
                      if (element[key.nombre] != undefined) {
                        keysValues.push(element[key.nombre]);
                      }  else if (key.nombre == "num" && element["numero"] != undefined) {
                        keysValues.push(element["numero"]);
                      }
                    });
                    datosSeleccionados.push(keysValues);
                  });
                }else{
                  let keysValues = [];
                this.keys.forEach(key => {
                  if (this.campos[key.nombre] != undefined) {
                    keysValues.push(this.campos[key.nombre].toString());
                  } else if (key.nombre == "num" && this.campos["numero"] != undefined) {
                    keysValues.push(this.campos["numero"].toString());
                  } else if (key.nombre == "idturno" && this.campos["idTurno"] != undefined) {
                    keysValues.push(this.campos["idTurno"].toString());
                  }
                });
                datosSeleccionados.push(keysValues);
                }

                sessionStorage.setItem(
                  "datosComunicar",
                  JSON.stringify(datosSeleccionados)
                );
                this.router.navigate(["/dialogoComunicaciones"]);
              },
              err => {
                //console.log(err);
              }
            );
        },
        err => {
          //console.log(err);
        }
      );
  }
}
