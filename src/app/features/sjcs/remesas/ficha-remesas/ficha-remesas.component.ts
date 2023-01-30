import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { EJGRemesaItem } from '../../../../models/sjcs/EJGRemesaItem';
import { RemesasItem } from '../../../../models/sjcs/RemesasItem';
import { Location } from '@angular/common';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { TarjetaDatosGeneralesComponent } from './tarjeta-datos-generales/tarjeta-datos-generales.component';
import { Router } from '../../../../../../node_modules/@angular/router';
import { TarjetaEjgsComponent } from './tarjeta-ejgs/tarjeta-ejgs.component';
import { saveAs } from "file-saver/FileSaver";
import { procesos_comision } from '../../../../permisos/procesos_comision';

@Component({
  selector: 'app-ficha-remesas',
  templateUrl: './ficha-remesas.component.html',
  styleUrls: ['./ficha-remesas.component.scss']
})
export class FichaRemesasComponent implements OnInit {

  @ViewChild(TarjetaDatosGeneralesComponent) tarjetaDatosGenerales: TarjetaDatosGeneralesComponent;
  @ViewChild(TarjetaEjgsComponent) tarjetaEJGs: TarjetaEjgsComponent;
  permisoEscrituraGuardar;
  permisoEscrituraBorrarRemesa;
  permisoEscrituraBorrarExpediente;
  botonValidar: boolean = false;
  guardado: boolean = false;
  progressSpinner: boolean = false;
  msgs;
  datos;
  remesaFromTabla: boolean;
  descripcion;
  remesaTabla;
  remesaItem: RemesasItem = new RemesasItem();
  ejgItem;
  tipoPCAJG;
  remesa: { idRemesa: any; descripcion: string; numero: string; informacionEconomica: boolean; };
  getAccionesRemesas: any[];
  acciones: boolean = false;
  estado: boolean = false;
  remesaInformacionEconomica: boolean;

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private location: Location,
    private router: Router,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.botonValidar = false;

    if(localStorage.getItem('remesaInformacionEconomica') == "true"){
      localStorage.removeItem('remesaInformacionEconomica');
      this.remesaInformacionEconomica = true;
    }else{
      localStorage.removeItem('remesaInformacionEconomica');
      this.remesaInformacionEconomica = false;
    }

    if (localStorage.getItem('ficha') == "registro") {
      this.remesaTabla = JSON.parse(localStorage.getItem('remesaItem'));
      localStorage.removeItem('remesaItem');
      this.remesaTabla.informacionEconomica = this.remesaInformacionEconomica;
      //console.log("Item en JSON -> ", this.remesaTabla);
      this.guardado = true;
      this.search();
      this.remesaFromTabla = true;
      this.descripcion = this.remesaTabla.descripcion;
      if(this.remesaTabla.estado == "Iniciada" || this.remesaTabla.estado == "Validada" || this.remesaTabla.estado == "Error envío"){
        this.estado = true;
      }
    } else if (localStorage.getItem('ficha') == "nuevo") {
      this.remesaItem.descripcion = "";
      this.descripcion = "";
      this.remesaFromTabla = false;
    }
    localStorage.removeItem('ficha');

    this.remesa = {
      'idRemesa': 0,
      'descripcion': "",
      'numero': "0",
      'informacionEconomica': (this.remesaInformacionEconomica) ? this.remesaInformacionEconomica : this.remesaInformacionEconomica
    }

    // Recuperamos informacion cuando volvemos atras desde la ficha EJG a Remesa
    if (localStorage.getItem('remesa') != null) {
      this.remesaTabla = JSON.parse(localStorage.getItem('remesa'));
      if (this.remesaTabla != null && this.remesaTabla != undefined) {
        this.remesa.idRemesa = this.remesaTabla.idRemesa;
        this.remesa.descripcion = this.remesaTabla.descripcion;
        this.remesa.numero = this.remesaTabla.numero;
        this.remesa.informacionEconomica = (this.remesaInformacionEconomica) ? this.remesaInformacionEconomica : this.remesaTabla.informacionEconomica
      }
      localStorage.removeItem('remesa');
    }

    this.commonsService.checkAcceso(procesos_comision.guardadoRemesasEnvio)
      .then(respuesta => {

        this.permisoEscrituraGuardar = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraGuardar);

        if (this.permisoEscrituraGuardar == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
    ).catch(error => console.error(error));

    this.commonsService.checkAcceso(procesos_comision.borradoRemesasEnvio)
      .then(respuesta => {

        this.permisoEscrituraBorrarRemesa = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraBorrarRemesa);

        if (this.permisoEscrituraBorrarRemesa == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
    ).catch(error => console.error(error));

    this.commonsService.checkAcceso(procesos_comision.borradoExpedienteRemesaEnvio)
      .then(respuesta => {

        this.permisoEscrituraBorrarExpediente = respuesta;

        this.persistenceService.setPermisos(this.permisoEscrituraBorrarExpediente);

        if (this.permisoEscrituraBorrarExpediente == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
    ).catch(error => console.error(error));
  }

  search() {
    //console.log("Dentro del search de la ficha-remesa");
    let remesasDatosEntradaItem =
    {
      'idRemesa': (this.remesaTabla.idRemesa != null && this.remesaTabla.idRemesa != undefined) ? this.remesaTabla.idRemesa.toString() : this.remesaTabla.idRemesa,
      'descripcion': (this.remesaTabla.descripcion != null && this.remesaTabla.descripcion != undefined) ? this.remesaTabla.descripcion.toString() : this.remesaTabla.descripcion,
      'informacionEconomica': this.remesaInformacionEconomica
      };
    this.progressSpinner = true;
    this.sigaServices.post("filtrosremesas_buscarRemesa", remesasDatosEntradaItem).subscribe(
      n => {
        //console.log("Dentro del servicio buscarRemesas para obtener las incidencias");
        this.datos = JSON.parse(n.body).remesasItems;

        this.remesaTabla.incidencias = this.datos[0].incidencias;
        this.remesaTabla.descripcion = this.datos[0].descripcion;
        this.remesaTabla.estado = this.datos[0].estado;

        //console.log("Contenido de la respuesta del back --> ", this.datos);

        this.getAcciones("");

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      },
      () =>{
        this.progressSpinner = false;
      });
  }

  getAcciones(event) {
    //console.log("Dentro del getAcciones --> ", this.tarjetaDatosGenerales);
    let remesaGetAcciones;

    if(event != ""){
      this.remesaTabla.estado = event;
    }

    if (this.remesaTabla != null) {
      remesaGetAcciones =
      {
        'estado': (this.remesaTabla.estado != null && this.remesaTabla.estado != undefined) ? this.remesaTabla.estado.toString() : this.remesaTabla.estado,
      };
    }else if(this.remesaItem != null){
      let indice = this.tarjetaDatosGenerales.resultado.length - 1;
      remesaGetAcciones =
      {
        'estado': (this.tarjetaDatosGenerales.resultado[indice].estado != null && this.tarjetaDatosGenerales.resultado[indice].estado != undefined) ? this.tarjetaDatosGenerales.resultado[indice].estado.toString() : this.tarjetaDatosGenerales.resultado[indice].estado,
      };
    }

    this.progressSpinner = true;

    this.sigaServices
      .post("ficharemesas_getAcciones", remesaGetAcciones)
      .subscribe(
        n => {
          //console.log("Dentro de la respuesta. Contenido --> ", JSON.parse(n.body).checkAccionesRemesas);

          this.getAccionesRemesas = JSON.parse(n.body).checkAccionesRemesas;
          
          if(this.getAccionesRemesas.length == 0){
            this.acciones = false;
          }else{
            this.acciones = true
          }
          this.progressSpinner = false;
        },
        error => {this.progressSpinner = false;},
        () => {this.progressSpinner = false; }
      );
  }

  ejecutarAccion(accion){
    let remesaAccion;
    let aux = this.getAccionesRemesas.find(accionRemesa => accionRemesa.idTipoAccionRemesa == accion);

    if (this.remesaTabla != null) {
      remesaAccion = {
        'idRemesa': this.remesaTabla.idRemesa,
        'accion': accion,
        'descripcion': aux.descripcion,
        'informacionEconomica': this.remesaInformacionEconomica
      };
    } else if (this.remesaItem != null) {
      remesaAccion = {
        'idRemesa': (this.remesa.idRemesa != null && this.remesa.idRemesa != undefined) ? this.remesa.idRemesa.toString() : 0,
        'accion': accion,
        'descripcion': aux.descripcion,
        'informacionEconomica': this.remesaInformacionEconomica
      };
    }

    this.progressSpinner = true;

    if(accion != 8){
      this.sigaServices.post("ficharemesa_ejecutaOperacionRemesa", remesaAccion).subscribe(
        data => {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), JSON.parse(data.body).error.description);
          this.remesa.idRemesa = JSON.parse(data.body).id;
          this.tarjetaDatosGenerales.listadoEstadosRemesa(this.remesa, true);
          this.search();
        },
        err => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
    }else{
      this.sigaServices.postDownloadFilesWithFileName("ficharemesa_descargar", remesaAccion).subscribe(
        (response: {file: Blob, filename: string, status: number}) => {
          // Se comprueba si todos los documentos asociados no tiene ningún fichero 
          if(response.file.size > 0 && response.status == 200){
            let filename = response.filename.split(';')[1].split('filename')[1].split('=')[1].trim();
            saveAs(response.file, filename);
          }else if(response.status == 206){
             this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("messages.general.error.masDe1zip"));
          }else{
            this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.ejg.documentacion.noFich"));
          }

          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }
    
  }

  descargarLogErrores(){
    let remesaAccion;

    if (this.remesaTabla != null) {
      remesaAccion = {
        'idRemesa': this.remesaTabla.idRemesa,
        'accion': 2
      };
    } else if (this.remesaItem != null) {
      remesaAccion = {
        'idRemesa': (this.remesa.idRemesa != null && this.remesa.idRemesa != undefined) ? this.remesa.idRemesa.toString() : 0,
        'accion': 2
      };
    }

    this.progressSpinner = true;

    this.sigaServices.postDownloadFilesWithFileName("ficharemesa_descargarLogErrores", remesaAccion).subscribe(
      (response: {file: Blob, filename: string}) => {
        let filename = response.filename.split(';')[1].split('filename')[1].split('=')[1].trim();
        if (response.file.size == 0) {          
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No existen expedientes con errores");          

        } else {
          saveAs(response.file, filename);
        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "El archivo no existe"); 
      }
    );

    this.progressSpinner = false;
  }

  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisoEscrituraGuardar, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
        this.save();
    }
  }

  save() {
    if (this.tarjetaDatosGenerales.remesaTabla != null) {
      this.remesa = {
        'idRemesa': this.remesaTabla.idRemesa,
        'descripcion': this.remesaTabla.descripcion,
        'numero': this.remesaTabla.numero,
        'informacionEconomica': (this.remesaInformacionEconomica) ? this.remesaInformacionEconomica : this.remesaInformacionEconomica
      };
    } else if (this.tarjetaDatosGenerales.remesaItem != null) {
      this.remesa = {
        'idRemesa': (this.remesa.idRemesa != null && this.remesa.idRemesa != undefined) ? this.remesa.idRemesa.toString() : 0,
        'descripcion': this.tarjetaDatosGenerales.remesaItem.descripcion,
        'numero': this.tarjetaDatosGenerales.remesaItem.numero.toString(),
        'informacionEconomica': (this.remesaInformacionEconomica) ? this.remesaInformacionEconomica : this.remesaInformacionEconomica
      };
    }

    this.progressSpinner = true;

    this.sigaServices.post("ficharemesas_guardarRemesa", this.remesa).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), JSON.parse(data.body).error.description);
        this.remesa.idRemesa = JSON.parse(data.body).id;
        this.guardado = true;
        this.estado = true;
        this.tarjetaDatosGenerales.listadoEstadosRemesa(this.remesa, true);
        this.tarjetaEJGs.getEJGRemesa(this.remesa, true);
        this.progressSpinner = false;
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
      () => {
        this.progressSpinner = false;
        this.guardado = true;
        this.estado = true;
      }
    );
  }

  checkPermisosDelete(evento) {
    let msg;

    if (evento) {
      msg = this.commonsService.checkPermisos(this.permisoEscrituraBorrarRemesa, undefined);
    } else {
      msg = this.commonsService.checkPermisos(this.permisoEscrituraBorrarExpediente, undefined);
    }
    

    if (msg != undefined) {
      this.msgs = msg;
    } else {
        this.confirmDelete(evento);
    }
  }

  confirmDelete(evento) {
    //console.log("Se ha pulsado el botón eliminar. Registro seleccionado -> ", this.tarjetaEJGs.selectedDatos);
    let mess = this.translateService.instant(
      "messages.deleteConfirmation"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        if (evento) {
          this.deleteRemesa();
        } else {
          this.deleteExpediente();
        }

      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  deleteRemesa() {
    let del: RemesasItem[] = [];
    //console.log("Remesa -> ", del);
    if (this.remesaTabla != null) {
      del[0] =
      { 
        'idRemesa': (this.remesaTabla.idRemesa != null && this.remesaTabla.idRemesa != undefined) ? this.remesaTabla.idRemesa.toString() : this.remesaTabla.idRemesa,
        'descripcion': (this.remesaTabla.descripcion != null && this.remesaTabla.descripcion != undefined) ? this.remesaTabla.descripcion.toString() : this.remesaTabla.descripcion,
        'ficha': true
      };
    } else if (this.remesaItem != null) {
      del[0] =
      {
        'idRemesa': (this.remesa.idRemesa != null && this.remesa.idRemesa != undefined) ? this.remesa.idRemesa : this.remesa.idRemesa,
        'descripcion': (this.remesaItem.descripcion != null && this.remesaItem.descripcion != undefined) ? this.remesaItem.descripcion.toString() : this.remesaItem.descripcion,
        'ficha': true
      };
    }

    this.sigaServices.post("listadoremesas_borrarRemesa", del).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), JSON.parse(data.body).error.description);
        this.progressSpinner = false;
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        if(this.remesaInformacionEconomica){
          this.router.navigate(["/remesas/1"]);
        }else{
          this.router.navigate(["/remesas/0"]);
        }
        localStorage.setItem('remesaBorrada', "true");
      }
    );
  }

  selectedRow(selectedDatos) {
    if (this.tarjetaEJGs.selectedDatos == undefined) {
      this.tarjetaEJGs.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.tarjetaEJGs.numSelected = selectedDatos.length;
      if (this.tarjetaEJGs.numSelected == 1) {
        this.tarjetaEJGs.selectMultiple = false;
      } else {
        this.tarjetaEJGs.selectMultiple = true;
      }
    }
  }

  deleteExpediente() {
    let ejgItem: EJGRemesaItem[] = [];
    let i = 0;
    this.tarjetaEJGs.selectedDatos.forEach(element => {
      ejgItem[i] =
      {
        'identificadorEJG': (element.identificadorEJG != null && element.identificadorEJG != undefined) ? element.identificadorEJG.toString() : element.identificadorEJG,
        'idEjgRemesa': (element.idEjgRemesa != null && element.idEjgRemesa != undefined) ? element.idEjgRemesa.toString() : element.idEjgRemesa,
        'anioEJG': (element.anioEJG != null && element.anioEJG != undefined) ? element.anioEJG.toString() : element.anioEJG,
        'numeroEJG': (element.numeroEJG != null && element.numeroEJG != undefined) ? element.numeroEJG.toString() : element.numeroEJG,
        'idTipoEJG': (element.idTipoEJG != null && element.idTipoEJG != undefined) ? element.idTipoEJG.toString() : element.idTipoEJG
      };
      i++;
    });

    this.sigaServices.post("ficharemesas_borrarExpedientesRemesa", ejgItem).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), JSON.parse(data.body).error.description);
        this.tarjetaEJGs.selectedDatos = [];
        this.progressSpinner = false;
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.tarjetaEJGs.selectMultiple = false;
        this.tarjetaEJGs.selectAll = false;
        this.tarjetaEJGs.getEJGRemesa(this.remesaTabla);
      }
    );
  }

  openTab() {
    this.progressSpinner = true;
    this.router.navigate(["/ejg"]);
    if(this.remesaFromTabla){
      localStorage.setItem('remesa', JSON.stringify(this.remesaTabla)); 
    }else{
      localStorage.setItem('remesa', JSON.stringify(this.remesa)); 
    }
  }
  
  volver(){
    this.progressSpinner = true;
    // if(this.remesaInformacionEconomica){
    //   this.router.navigate(["/remesas/1"]);
    // }else{
    //   this.router.navigate(["/remesas/0"]);
    // }
    this.location.back();
  }

  restablecer(){
    if(this.tarjetaDatosGenerales.remesaTabla != undefined && this.tarjetaDatosGenerales.remesaTabla != null){
      this.tarjetaDatosGenerales.remesaTabla.descripcion = this.descripcion;
    }else{
      this.tarjetaDatosGenerales.remesaItem.descripcion = this.descripcion;
    }
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

}