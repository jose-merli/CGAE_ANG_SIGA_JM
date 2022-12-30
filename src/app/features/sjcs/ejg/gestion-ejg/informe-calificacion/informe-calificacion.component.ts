import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from 'primeng/primeng';
import { procesos_ejg } from '../../../../../permisos/procesos_ejg';

@Component({
  selector: 'app-informe-calificacion',
  templateUrl: './informe-calificacion.component.html',
  styleUrls: ['./informe-calificacion.component.scss']
})
export class InformeCalificacionComponent implements OnInit {
  @Input() modoEdicion;
  permisoEscritura: boolean = false;
  @Input() tarjetaInformeCalificacion: string;

  openFicha: boolean = false;
  textFilter: string = "Seleccionar";
  progressSpinner: boolean = false;
  dictamen: EJGItem;
  nuevoBody: EJGItem = new EJGItem();
  item: EJGItem;

  bodyInicial: EJGItem;
  msgs = [];
  nuevo;
  isDisabledFundamentosCalif: boolean = true;
  comboFundamentoCalif = [];
  comboDictamen = [];

  dictamenCabecera = "";
  fundamentoCalifCabecera = "";

  selectedDatos = [];
  valueComboEstado = "";
  fechaEstado = new Date();

  fechaDictCabecera: Date = null;

  estados;

  fichaPosible = {
    key: "informeCalificacion",
    activa: false
  }

  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() newEstado = new EventEmitter();
  @Input() openTarjetaInformeCalificacion;


  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonServices: CommonsService, private translateService: TranslateService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    if (this.modoEdicion) {
      if (this.persistenceService.getDatosEJG()) {
        this.nuevo = false;
        this.dictamen = this.persistenceService.getDatosEJG();
        if(this.dictamen.fechaDictamen != null){
          this.dictamen.fechaDictamen = new Date(this.dictamen.fechaDictamen);
          this.fechaDictCabecera = this.dictamen.fechaDictamen;
        }

        // this.getDictamen(this.item);
        //Comprobamos el campo de fundamentos para que se asigne en caso de que haya un valor asignado
        //al tipo de dictamen
        this.onChangeDictamen();
        this.getComboTipoDictamen();
      }
    } else {
      this.nuevo = true;
      this.dictamen = new EJGItem();
      this.getComboTipoDictamen();
    }
    this.bodyInicial = JSON.parse(JSON.stringify(this.dictamen));

    this.commonServices.checkAcceso(procesos_ejg.informeCalif)
      .then(respuesta => {
        this.permisoEscritura = respuesta;

      }
      ).catch(error => console.error(error));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaInformeCalificacion == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  esFichaActiva(key) {
    return this.fichaPosible.activa;
  }

  abreCierraFicha(key) {
    if (
      key == "informeCalificacion" &&
      !this.activacionTarjeta
    ) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  getComboFundamentoCalif() {
    this.sigaServices.getParam(
      "filtrosejg_comboFundamentoCalif",
      "?list_dictamen=" + this.dictamen.idTipoDictamen
    ).subscribe(
      n => {
        // this.isDisabledFundamentosCalif = false;
        this.comboFundamentoCalif = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboFundamentoCalif);

        this.comboFundamentoCalif.forEach(pres => {
          if (pres.value == this.dictamen.fundamentoCalif) this.fundamentoCalifCabecera = pres.label;
        });
      },
      err => {
        //console.log(err);

      }
    );

  }
  getComboTipoDictamen() {
    this.sigaServices.get("busquedaFundamentosCalificacion_comboDictamen").subscribe(
      n => {
        this.comboDictamen = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboDictamen);
        //Craear entrada en la base de datos
        // this.comboDictamen.push({ label: "Indiferente", value: "-1" });
        this.comboDictamen.forEach(pres => {
          if (pres.value == this.dictamen.idTipoDictamen) {
            //this.dictamenCabecera = pres.label;
            this.dictamen.dictamenSing = pres.label;
          }
        });
      },
      err => {
      }
    );
  }

  // getDictamen(selected) {
  //   this.progressSpinner = true;
  //   this.sigaServices.post("gestionejg_getDictamen", selected).subscribe(
  //     n => {
  //       if (n.body) {
  //         this.dictamen = JSON.parse(n.body);
  //       } else { this.dictamen = new EJGItem(); }
  //       if (this.dictamen.fechaDictamen != undefined)
  //         this.dictamen.fechaDictamen = new Date(this.dictamen.fechaDictamen);
  //       this.getComboTipoDictamen();
  //       if (this.dictamen.iddictamen)
  //         this.getComboFundamentoCalif();
  //       this.progressSpinner = false;
  //     },
  //     err => {
  //       this.progressSpinner = false;
  //     }
  //   );
  // }
  
  onChangeDictamen() {
    this.comboFundamentoCalif = [];
    if (this.dictamen.idTipoDictamen != undefined) {
      this.isDisabledFundamentosCalif = false;
      this.getComboFundamentoCalif();
    } else {
      this.isDisabledFundamentosCalif = true;
      this.dictamen.fundamentoCalif = null;
    }
  }

  fillFechaDictamen(event) {
    if(event != null && !isNaN(Date.parse(event))){
      this.dictamen.fechaDictamen = new Date(event);
    }
    
  }

  getEstados() {
    //this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getEstados", this.dictamen).subscribe(
      n => {
        this.estados = JSON.parse(n.body).estadoEjgItems;
        //this.progressSpinner = false;
      },
      err => {
        //this.progressSpinner = false;
      }
    );
  }

  save() {
    // if (this.disabledSave()) {
      this.progressSpinner = true;

      // this.dictamen.nuevoEJG=!this.modoEdicion;

      this.sigaServices.post("gestionejg_actualizarInformeCalificacionEjg", this.dictamen).subscribe(
        n => {
          

          if (n.statusText == "OK") {

            this.newEstado.emit(null);
            
            //En el caso que se cree un nuevo dictamen, se debe extraer del back
            if(this.dictamen.iddictamen == null){
            this.sigaServices.post("gestionejg_datosEJG", this.dictamen).subscribe(
              n => {
                this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                let ejgObject = JSON.parse(n.body).ejgItems;
                let datosItem = ejgObject[0];
                this.persistenceService.setDatosEJG(datosItem);
                this.dictamen = datosItem;
                //Para que se presente la fecha correctamente
                this.dictamen.fechaDictamen = new Date(this.dictamen.fechaDictamen);
                this.fechaDictCabecera = this.dictamen.fechaDictamen;
                this.progressSpinner = false;
              },
              err => {
                this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
                this.progressSpinner = false;
              }
            );
            }
            //Actualizacion de un dictamen existente
            else{
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.bodyInicial = this.dictamen;
            this.bodyInicial.fechaDictamen = new Date(this.dictamen.fechaDictamen);
            //Revisamos la cabecera de la tarjeta
            this.comboFundamentoCalif.forEach(pres => {
              if (pres.value == this.dictamen.fundamentoCalif) this.fundamentoCalifCabecera = pres.label;
            });
            this.comboDictamen.forEach(pres => {
              if (pres.value == this.dictamen.idTipoDictamen) {
                //this.dictamenCabecera = pres.label;
                this.dictamen.dictamenSing = pres.label;
              }
            });

            this.fechaDictCabecera = this.dictamen.fechaDictamen;

            this.persistenceService.setDatosEJG(this.bodyInicial);

            this.progressSpinner = false;
            }
          }
          else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

            this.progressSpinner = false;
          }
        },
        err => {
          this.progressSpinner = false;

          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
    // }
  }
  
  confirmDelete() {
    // let mess = this.translateService.instant(
    //   "messages.deleteConfirmation"
    // );
    // let icon = "fa fa-edit";
    // this.confirmationService.confirm({
    //   message: mess,
    //   icon: icon,
    //   accept: () => {
        this.delete()
    //   },
    //   reject: () => {
    //     this.msgs = [
    //       {
    //         severity: "info",
    //         summary: "Cancelar",
    //         detail: this.translateService.instant(
    //           "general.message.accion.cancelada"
    //         )
    //       }
    //     ];
    //   }
    // });
  }

  delete() {
    this.progressSpinner = true;

    //this.dictamen.nuevoEJG=!this.modoEdicion;
    // let data = [];
    // let ejg: EJGItem;

    // for (let i = 0; this.selectedDatos.length > i; i++) {
    //   ejg = this.selectedDatos[i];
    //   ejg.fechaEstadoNew = this.fechaEstado;
    //   ejg.estadoNew = this.valueComboEstado;

    //   data.push(ejg);
    // }
    // this.sigaServices.post("gestionejg_borrarInformeCalificacion", data).subscribe(
    //   n => {
    //     this.progressSpinner = false;
    //     this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
    //   },
    //   err => {
    //     //console.log(err);
    //     this.progressSpinner = false;
    //     this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
    //   }
    // );

    let dictamenPeticion: EJGItem = this.dictamen;

    dictamenPeticion.fechaDictamen = null;
    dictamenPeticion.idTipoDictamen = null;
    dictamenPeticion.fundamentoCalif = null;
    dictamenPeticion.dictamen = null;

    this.sigaServices.post("gestionejg_actualizarInformeCalificacionEjg", this.dictamen).subscribe(
      n => {
        this.progressSpinner = false;

        if (n.statusText == "OK") {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          dictamenPeticion.iddictamen = null;
          
          this.bodyInicial = dictamenPeticion;
          this.dictamen = dictamenPeticion;
          this.dictamen.dictamenSing = "";
          this.persistenceService.setDatosEJG(this.bodyInicial);

          this.fechaDictCabecera = this.dictamen.fechaDictamen;

          this.fundamentoCalifCabecera = "";
          //this.dictamenCabecera = "";
        }
        else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      },
      err => {
        this.progressSpinner = false;

        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  rest() {
    this.dictamen = JSON.parse(JSON.stringify(this.bodyInicial));
    if(this.dictamen.fundamentoCalif != null){
      this.progressSpinner = true;
      this.getComboFundamentoCalif();
      this.progressSpinner = false;
      this.isDisabledFundamentosCalif = false;
    }
    this.dictamen.fechaDictamen = new Date(this.dictamen.fechaDictamen);
  }

  download() {
    // if (this.disabledSave()) {
      this.progressSpinner = true;

      // this.dictamen.nuevoEJG=!this.modoEdicion;

      this.sigaServices.post("gestionejg_descargarInformeCalificacion", this.dictamen).subscribe(
        n => {
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        }
      );
    // }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  checkPermisosConfirmDelete() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } 
    else this.checkFechaEstadoComision()
  }

  checkFechaEstadoComision(){
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getEstados", this.dictamen).subscribe(
      n => {
        let estados = JSON.parse(n.body).estadoEjgItems;
        this.progressSpinner = false;

        let estadoCAJG = estados.find(
          item => item.propietario == "1" && item.fechaInicio > this.dictamen.fechaDictamen
        );
        //Introducir mensaje en la base de datos
        if (estadoCAJG != undefined)  this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.ejg.dictamen.disDel"));
        else this.confirmDelete();
      },
      err => {
        this.progressSpinner = false;

        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }
  
  checkPermisosSave() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      // if (this.disabledSave()) {
      //   this.msgs = this.commonServices.checkPermisoAccion();
      // } else {
        this.save();
      // }
    }
  }

  checkPermisosRest() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      // if (this.disabledSave()) {
      //   this.msgs = this.commonServices.checkPermisoAccion();
      // } else {
        this.rest();
      // }
    }
  }
  
  checkPermisosDownload() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.download();
    }
  }
}
