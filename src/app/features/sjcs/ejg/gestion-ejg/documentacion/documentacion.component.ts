import { Component, OnInit, Input } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.scss']
})
export class DocumentacionComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaDocumentacion: string;
  openFicha: boolean = false;
  nuevo;
  body: EJGItem;
  item: EJGItem;
  bodyInicial;
  [x: string]: any;
  rowsPerPage: any = [];
  cols;
  msgs;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  buscadores = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  nDocumentos;
  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private translateService: TranslateService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    if (this.persistenceService.getDatos()) {
      this.nuevo = false;
      this.modoEdicion = true;
      this.body = this.persistenceService.getDatos();
      this.item = this.body;
      this.getDocumentos(this.item);
      this.getCols();
    }else {
    this.nuevo = true;
    this.modoEdicion = false;
    this.item = new EJGItem();
  }
}
  getDocumentos(selected) {
     this.progressSpinner = true;
     this.sigaServices.post("gestionejg_getDocumentos", selected).subscribe(
     n => {
         this.documentos = JSON.parse(n.body).ejgDocItems;
         if(this.documentos){
          this.documentos.forEach(element => {
            if(!element.presentador && element.parentesco){
              element.presentador_persona = element.presentador_persona + " ("  + element.parentesco + " )";
            }
          });
         }
         this.nDocumentos = this.documentos.length;
         this.progressSpinner = false;
       },
       err => {
        console.log(err);
       }
     );
   }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }
  openTab(evento) {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    if (!this.selectAll && !this.selectMultiple) {
      // this.progressSpinner = true;
      // this.datosEJG();

    } else {
      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }
    }
  }
  getCols() {
    //docuemntos o recorrer el array?
    if(this.documentos != undefined && this.documentos.presentador != undefined){
      this.cols = [
        { field: "flimite_presentacion", header: "justiciaGratuita.ejg.datosGenerales.FechaLimPresentacion", width: "10%" },
        { field: "presentador", header: "justiciaGratuita.ejg.documentacion.Presentador", width: "20%" },
        { field: "documentoDesc", header: "justiciaGratuita.ejg.documentacion.Documento", width: "20%" },
        { field: "regEntrada", header: "justiciaGratuita.ejg.documentacion.RegistroEntrada", width: "15%" },
        { field: "regSalida", header: "justiciaGratuita.ejg.documentacion.RegistroSalida", width: "15%" },
        { field: "f_presentacion", header: "censo.consultaDatosGenerales.literal.fechaPresentacion", width: "10%" },
        { field: "propietario", header: "justiciaGratuita.ejg.documentacion.Propietario", width: "10%" },
      ];
    }else{
      this.cols = [
        { field: "flimite_presentacion", header: "justiciaGratuita.ejg.datosGenerales.FechaLimPresentacion", width: "10%" },
        { field: "presentador_persona", header: "justiciaGratuita.ejg.documentacion.Presentador", width: "20%" },
        { field: "documentoDesc", header: "justiciaGratuita.ejg.documentacion.Documento", width: "20%" },
        { field: "regEntrada", header: "justiciaGratuita.ejg.documentacion.RegistroEntrada", width: "15%" },
        { field: "regSalida", header: "justiciaGratuita.ejg.documentacion.RegistroSalida", width: "15%" },
        { field: "f_presentacion", header: "censo.consultaDatosGenerales.literal.fechaPresentacion", width: "10%" },
        { field: "propietario", header: "justiciaGratuita.ejg.documentacion.Propietario", width: "10%" },
      ];
    }  
    this.cols.forEach(it => this.buscadores.push(""));

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
  isSelectMultiple() {
    this.selectAll = false;
    if (this.permisoEscritura) {
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
  }
  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
  onChangeSelectAll() {
    if (this.permisoEscritura) {
      if (!this.historico) {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosFamiliares;
          this.numSelected = this.datosFamiliares.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      } else {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosFamiliares.filter(
            (dato) => dato.fechaBaja != undefined && dato.fechaBaja != null
          );
          this.numSelected = this.selectedDatos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      }
    }
  }
  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
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
  confirmDelete() {
    let mess = this.translateService.instant(
      "messages.deleteConfirmation"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.delete()
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancelar",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }
    delete() {

    }
    abreCierraFicha() {
      this.openFicha = !this.openFicha;
    }
    checkPermisosConsultar(){
      let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
      if (msg != undefined) {
        this.msgs = msg;
      } else {
        this.consultar();
      }
    }
    consultar(){
      
    }
    checkPermisosDownload(){
      let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
      if (msg != undefined) {
        this.msgs = msg;
      } else {
        this.download();
      }
    }
    download(){

    }
    checkPermisosConfirmDelete(){
      let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
      if (msg != undefined) {
        this.msgs = msg;
      } else {
        this.confirmDelete();
      }
    }
    checkPermisosPrint(){
      let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
      if (msg != undefined) {
        this.msgs = msg;
      } else {
        this.print();
      }
    }
    print(){

    }
  }

