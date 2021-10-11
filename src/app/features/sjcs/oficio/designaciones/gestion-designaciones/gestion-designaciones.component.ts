import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService, Message } from 'primeng/components/common/api';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { DataTable } from 'primeng/primeng';
import { SaltoCompItem } from '../../../../../models/guardia/SaltoCompItem';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-gestion-designaciones',
  templateUrl: './gestion-designaciones.component.html',
  styleUrls: ['./gestion-designaciones.component.scss']
})
export class GestionDesignacionesComponent implements OnInit {
  msgs: Message[] = [];
  selectMultiple: boolean = false;
  selectAll;
  rowsPerPage: any = [];
  cols;
  buscadores = [];
  selectedItem: number = 10;
  initDatos;
  datosInicial = [];
  selectedDatos: any[] = [];
  isLetrado: boolean = false;
  first = 0;
  progressSpinner: boolean = false;
  comboTipoDesigna: any[];
  //Resultados de la busqueda
  @Input() datos;
  numSelected: number = 0;
  esColegio: boolean = false;
  disableDelete: boolean = false;
  @Output() busqueda = new EventEmitter<boolean>();
  tieneLetradoAsignado: boolean = false;
  @ViewChild("table") tabla: DataTable;
  currentRoute: String;
  idClasesComunicacionArray: string[] = [];
  idClaseComunicacion: String;
  keys: any[] = [];

  constructor( private datepipe: DatePipe, private persistenceService: PersistenceService, private confirmationService: ConfirmationService, private router: Router, public sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {
    this.currentRoute = this.router.url;
    this.getKeysClaseComunicacion();
    this.getComboTipoDesignas();
    this.checkAcceso();
    
    if (
      sessionStorage.getItem("isLetrado") != null &&
      sessionStorage.getItem("isLetrado") != undefined
    ) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }
    this.selectedDatos = [];
    this.getCols();
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
    this.progressSpinner = false;
  }

  getCols() {

    this.cols = [
      { field: "nombreTurno", header: "justiciaGratuita.sjcs.designas.DatosIden.turno" },
      { field: "ano", header: "justiciaGratuita.ejg.datosGenerales.annioNum" },
      { field: "fechaEntradaInicio", header: "censo.resultadosSolicitudesModificacion.literal.fecha" },
      { field: "estado", header: "censo.nuevaSolicitud.estado" },
      { field: "numColegiado", header: "facturacionSJCS.facturacionesYPagos.numColegiado" },
      { field: "nombreColegiado", header: "administracion.parametrosGenerales.literal.nombre.apellidos" },
      { field: "nombreInteresado", header: "justiciaGratuita.justiciables.literal.interesados" },
      { field: "validada", header: "justiciaGratuita.oficio.designas.actuaciones.validada" },
    ];
    this.cols.forEach(element => {
      this.buscadores.push("");
    });

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

  openTab(dato) {
    this.progressSpinner = true;
    let idProcedimiento = dato.idProcedimiento;
    let datosProcedimiento;
    let datosModulo;
    if (dato.idTipoDesignaColegio != null && dato.idTipoDesignaColegio != undefined && this.comboTipoDesigna != undefined) {
      this.comboTipoDesigna.forEach(element => {
        if (element.value == dato.idTipoDesignaColegio) {
          dato.descripcionTipoDesigna = element.label;
        }
      });
    }
    let designaProcedimiento = new DesignaItem();
    let data = sessionStorage.getItem("designaItem");
    let dataProcedimiento = JSON.parse(data);
    dataProcedimiento.idPretension = dato.idPretension;
    dataProcedimiento.idTurno = dato.idTurno;
    dataProcedimiento.ano = dato.factConvenio;
    dataProcedimiento.numero = dato.numero
    this.sigaServices.post("designaciones_busquedaProcedimiento", dataProcedimiento).subscribe(
      n => {
        datosProcedimiento = JSON.parse(n.body);
        if (datosProcedimiento.length == 0) {
          dato.nombreProcedimiento = "";
          dato.idProcedimiento = "";
        } else {
          dato.nombreProcedimiento = datosProcedimiento[0].nombreProcedimiento;
          dato.idProcedimiento = dataProcedimiento.idPretension;
        }

        let designaModulo = new DesignaItem();
        let dataModulo = JSON.parse(data);
        dataModulo.idProcedimiento = idProcedimiento;
        dataModulo.idTurno = dato.idTurno;
        dataModulo.ano = dato.factConvenio;
        dataModulo.numero = dato.numero
        this.sigaServices.post("designaciones_busquedaModulo", dataModulo).subscribe(
          n => {
            datosModulo = JSON.parse(n.body);
            if (datosModulo.length == 0) {
              dato.modulo = "";
              dato.idModulo = "";
            } else {
              dato.modulo = datosModulo[0].modulo;
              dato.idModulo = datosModulo[0].idModulo;
            }
            this.sigaServices.post("designaciones_busquedaJuzgado", dato.idJuzgado).subscribe(
              n => {
                dato.nombreJuzgado = n.body;
                sessionStorage.setItem("nuevaDesigna", "false");
                sessionStorage.setItem("designaItemLink", JSON.stringify(dato));
                this.router.navigate(["/fichaDesignaciones"]);
    
              },
              err => {
                this.progressSpinner = false;
                dato.nombreJuzgado = "";
                sessionStorage.setItem("nuevaDesigna", "false");
                sessionStorage.setItem("designaItemLink", JSON.stringify(dato));
                this.router.navigate(["/fichaDesignaciones"]);
              }, () => {
                this.progressSpinner = false;
              });
          },
          err => {
            this.progressSpinner = false;

            console.log(err);
          }, () => {
            this.progressSpinner = false;
          });
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        this.progressSpinner = false;
      });
  }

  getComboTipoDesignas() {
    this.progressSpinner = true;

    this.sigaServices.get("designas_tipoDesignas").subscribe(
      n => {
        this.comboTipoDesigna = n.combooItems;
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.arregloTildesCombo(this.comboTipoDesigna);
      }
    );
  }

  arregloTildesCombo(combo) {
    if (combo != undefined)
      combo.map(e => {
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
  }

  checkAcceso() {
    this.progressSpinner = true;
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = procesos_oficio.designa;

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        const permisos = JSON.parse(data.body);
        const permisosArray = permisos.permisoItems;
        const derechoAcceso = permisosArray[0].derechoacceso;

        if (derechoAcceso == 3) {// es un colegio
          this.esColegio = true;
          this.disableDelete = false;
        } else if (derechoAcceso == 2) { //es un colegiado
          this.esColegio = false;
          this.disableDelete = true;
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        this.progressSpinner = false;
      }
    );

  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  clickFila(event) {
    // if (event.data) { //} && !event.data.fechaBaja) {
    //   this.selectedDatos.pop();
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

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectMultiple = true;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  clear() {
    this.msgs = [];
  }

  delete() {
    console.log(this.selectedDatos);
    let designaToDelete = [];
    let designaToDeleteCompensacion = [];
    let designaToDeleteSinCompensacion = [];
    let request;
    let resquetLetrado;
    this.selectedDatos.forEach((element, i) => {
    request = new DesignaItem();
    request.ano = element.ano;
    request.idTurno = element.idTurno;
    request.numero = element.numero;
    request.idPersona = element.idPersona;
    this.tieneLetradoAsignado = false;
    resquetLetrado = [element.ano, element.idTurno, element.numero];
    this.tieneLetrado(resquetLetrado,designaToDelete, request, i);
    });
  }

  tieneLetrado(requestLetrado, designaToDelete, request, indice) {
    //Buscamos los letrados asociados a la designacion
    let institucionActual;
    this.sigaServices.post("designaciones_busquedaLetradosDesignacion", requestLetrado).subscribe(
      data => {
        let letrados = JSON.parse(data.body);
        if (letrados.length > 0) {
          this.tieneLetradoAsignado = true;
          designaToDelete.push(request);
          requestLetrado.push(letrados[0].idPersona);
        }
        if(designaToDelete.length ==(indice + 1)){
          let mess = "¿Se desea añadir una compensación al letrado designado?";
          let icon = "fa fa-question-circle";
          let keyConfirmation = "confirmGuardar";
          this.confirmationService.confirm({
            key: keyConfirmation,
            message: mess,
            icon: icon,
            accept: () => {
              let saltos = [];
              designaToDelete.forEach(element => {
                let salto = new SaltoCompItem();
                salto.fecha = this.formatDate(new Date());
                salto.idPersona = element.idPersona;
                salto.idTurno = element.idTurno;
                salto.motivo = "";
                salto.saltoCompensacion = "C";
                saltos.push(salto);
              });
              this.sigaServices.post("saltosCompensacionesOficio_guardar", saltos).subscribe(
                result => {
    
                  const resp = JSON.parse(result.body);
    
                  if (resp.status == 'KO' || (resp.error != undefined && resp.error != null)) {
                    this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
                  }
    
                  if (resp.status == 'OK') {
                    let listDesignas = [];
                    this.sigaServices.get("institucionActual").subscribe(n => {
                      institucionActual = n.value;
                      designaToDelete.forEach(element => {
                        // element.push(institucionActual);
                        let designa = new DesignaItem();
                        designa.idInstitucion = Number(institucionActual);
                        let anio = element.ano.split("/");
                        element.ano = Number(anio[0].substring(1, 5));
                        designa.ano = element.ano;
                        designa.idTurno = element.idTurno;
                        designa.numero = element.numero;
                        listDesignas.push(designa);
                      });
                      this.deleteDesigna(listDesignas);
                    });
    
                  }
    
                },
                error => {
                  this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
                }
              );
            },
            reject: () => {
              //BORRAMOS DESIGNAS SIN AÑADIR COMPENSACION
              let listDesignas = [];
              this.sigaServices.get("institucionActual").subscribe(n => {
                institucionActual = n.value;
                designaToDelete.forEach(element => {
                  let designa = new DesignaItem();
                  designa.idInstitucion = Number(institucionActual);
                  let anio = element.ano.split("/");
                  element.ano = Number(anio[0].substring(1, 5));
                  designa.ano = element.ano;
                  designa.idTurno = element.idTurno;
                  designa.numero = element.numero;
                  listDesignas.push(designa);
                });
                this.deleteDesigna(listDesignas);
              });
            }
          });
        }else{
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
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
      }
    );
  }

  deleteDesigna(designas) {
    //Buscamos los letrados asociados a la designacion
    this.sigaServices.post("designaciones_eliminarDesignaciones", designas).subscribe(
      data => {
        const resp = JSON.parse(data.body);

        if (resp.status == 'KO' || (resp.error != undefined && resp.error != null)) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }

        if (resp.status == 'OK') {
          this.showMessage("success", 'Operación realizada con éxito', 'Los registros seleccionados han sido eliminados');
          this.busqueda.emit(false);
        }
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
      }
    );
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }
  
  actualizaFicha(event){
    sessionStorage.removeItem("designaItemLink");
    this.openTab(event);
  }

  navigateComunicar() {
    sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString());
    //IDMODULO de SJCS es 10
    sessionStorage.setItem("idModulo", '10');
    
    this.getDatosComunicar();
  }
  
  getKeysClaseComunicacion() {
    this.sigaServices.post("dialogo_keys", this.idClaseComunicacion).subscribe(
      data => {
        this.keys = JSON.parse(data["body"]);
      },
      err => {
        console.log(err);
      }
    );
  }

  getDatosComunicar() {
    let datosSeleccionados = [];
    let rutaClaseComunicacion = this.currentRoute.toString();

    this.sigaServices
      .post("dialogo_claseComunicacion", rutaClaseComunicacion)
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
                this.selectedDatos.forEach(element => {
                  let keysValues = [];
                  this.keys.forEach(key => {
                    if (element[key.nombre] != undefined) {
                      keysValues.push(element[key.nombre]);
                    }else if(key.nombre == "num" && element["numero"] != undefined){
                      keysValues.push(element["numero"]);
                    }else if(key.nombre == "idturno" && element["idTurno"] != undefined){
                      keysValues.push(element["idTurno"]);
                    }
                  });
                  datosSeleccionados.push(keysValues);
                });

                sessionStorage.setItem(
                  "datosComunicar",
                  JSON.stringify(datosSeleccionados)
                );
                this.router.navigate(["/dialogoComunicaciones"]);
              },
              err => {
                console.log(err);
              }
            );
        },
        err => {
          console.log(err);
        }
      );
  }
}
