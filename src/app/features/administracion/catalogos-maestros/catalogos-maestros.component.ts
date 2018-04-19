import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { SigaServices } from './../../../_services/siga.service';
import { SigaWrapper } from '../../../wrapper/wrapper.class';
import { SelectItem } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { Http, Response } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { USER_VALIDATIONS } from '../../../properties/val-properties';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Router } from '@angular/router';
import { TranslateService } from "../../../commons/translate/translation.service";
import { MessageService } from "primeng/components/common/messageservice";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";

@Component({
  selector: 'app-catalogos-maestros',
  templateUrl: './catalogos-maestros.component.html',
  styleUrls: ['./catalogos-maestros.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CatalogosMaestros extends SigaWrapper implements OnInit {
  maestros_update: String;
  maestros_create: String;
  maestros_delete: String;

  body: CatalogoRequestDto = new CatalogoRequestDto();

  //Creo los objetos para interactuar con sus respectivos DTO
  searchCatalogo: CatalogoResponseDto = new CatalogoResponseDto();
  his: CatalogoHistoricoRequestDto = new CatalogoHistoricoRequestDto();
  upd: CatalogoUpdateRequestDto = new CatalogoUpdateRequestDto();
  cre: CatalogoCreateRequestDto = new CatalogoCreateRequestDto();
  del: CatalogoDeleteRequestDto = new CatalogoDeleteRequestDto();


  pButton
  buscar: boolean = false;
  tablaHistorico: boolean = false;
  editar: boolean = false;

  selectMultiple: boolean = false;
  selectedItem: number = 4;

  formBusqueda: FormGroup;
  cols: any = [];
  datos: any[];
  datosHist: any[];
  select: any[];

  //Array de opciones del dropdown
  catalogoArray: any[];

  //elemento seleccionado en el dropdown
  catalogoSeleccionado: String;

  //elementos del form
  formDescripcion: String;
  formCodigo: String;

  //mensajes
  msgs: Message[] = [];

  showDatosGenerales: boolean = true
  blockSeleccionar: boolean = false;
  blockBuscar: boolean = true;
  blockCrear: boolean = true;

  rowsPerPage: any = [];

  @ViewChild('table')
  table
  constructor(private formBuilder: FormBuilder,
    private sigaServices: SigaServices,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService) {
    super(USER_VALIDATIONS);
    this.formBusqueda = this.formBuilder.group({
    });
  }

  //Cargo el combo nada mas comenzar
  ngOnInit() {
    this.sigaServices.get("maestros_rol").subscribe(n => {
      this.catalogoArray = n.combooItems;
    },
      err => {
        console.log(err);
      }
    );

    //Valores dummie de catalogo
    // this.catalogo = [
    //   { label: 'Selecciona un catálogo', value: '' },
    //   { label: 'dummie5', value: 'dummie5' }
    // ];
    this.cols = [
      { field: 'codigoExt', header: 'Código externo' },
      { field: 'descripcion', header: 'Descripción' },
    ];

    //Valores dummie de tabla
    // this.datos = [
    //   { codigoExt: '239123', descripcion: 'Administrador' },
    //   { codigoExt: '744689', descripcion: 'Dummies' },
    // ];

    this.rowsPerPage = [
      {
        label: 4,
        value: 4
      },
      {
        label: 6,
        value: 6
      },
      {
        label: 8,
        value: 8
      },
      {
        label: 10,
        value: 10
      }
    ];
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
  // Control de buscar desactivado por ahora (hasta tener primer elemento del combo preparado)
  onChangeCatalogo() {
    if (this.body.catalogo == "") {
      this.blockBuscar = true;
      this.blockCrear = true;
    } else {
      this.blockBuscar = false;
    }
  }
  //cada vez que cambia el formulario comprueba esto
  onChangeForm() {
    if (this.formCodigo == "" || this.formCodigo == undefined) {
      this.blockCrear = true;
    } else if (this.formDescripcion == "" || this.formDescripcion == undefined) {
      this.blockCrear = true;
    } else {
      this.blockCrear = false;
    }
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
      detail: "Accion realizada correctamente"
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: "Error, fallo al realizar la accion"
    });
  }

  historico() {
    this.buscar = false;
    this.catalogoSeleccionado = this.body.catalogo;
    this.body = new CatalogoRequestDto;
    this.body.catalogo = this.catalogoSeleccionado;
    this.bodyToForm();
    this.his = new CatalogoHistoricoRequestDto;
    this.his.catalogo = this.body.catalogo;
    this.his.codigoExt = "";
    this.his.descripcion = "";
    this.his.idInstitucion = "";
    this.his.idRegistro = "";
    this.tablaHistorico = true;
    this.sigaServices.post("maestros_historico", this.his).subscribe(
      data => {
        console.log(data);
        this.searchCatalogo = JSON.parse(data["body"]);
        this.datosHist = this.searchCatalogo.catalogoMaestroItem;
      },
      err => {
        console.log(err);
      },
      () => {
        this.reset();
      }
    );
  }

  isBuscar() {
    this.buscar = true;
    this.tablaHistorico = false;
    if (this.body.codigoExt != undefined) {
      this.formToBody();
    }
    if (this.body.codigoExt == undefined) {
      this.body.codigoExt = "";
      this.formToBody();
    }
    if (this.body.descripcion == undefined) {
      this.body.descripcion = "";
      this.formToBody();
    }
    if (this.body.idInstitucion == undefined) {
      this.body.idInstitucion = "";
    }
    this.sigaServices
      .postPaginado("maestros_search", "?numPagina=1", this.body)
      .subscribe(
      data => {
        console.log(data);

        this.searchCatalogo = JSON.parse(data["body"]);
        this.datos = this.searchCatalogo.catalogoMaestroItem;
      },
      err => {
        console.log(err);
      }
      );
  }

  isLimpiar() {
    this.body = new CatalogoRequestDto();
    this.bodyToForm();
    this.editar = false;
    this.blockSeleccionar = false;
    this.blockCrear = true;
    this.blockBuscar = true;
  }

  isCrear() {
    this.cre = new CatalogoCreateRequestDto();
    this.cre.tabla = this.body.catalogo;
    this.cre.idRegistro = "";
    this.cre.codigoExt = this.formCodigo;
    this.cre.descripcion = this.formDescripcion;
    this.cre.idInstitucion = "";
    this.sigaServices.post("maestros_create", this.cre).subscribe(
      data => {
        this.showSuccess();
      },
      err => {
        this.showFail();
        console.log(err);
      },
      () => {
        this.reset();
      }
    );
  }

  reset() {
    if (this.buscar == true) {
      this.table.reset();

    }
    this.editar = false;
    this.catalogoSeleccionado = this.body.catalogo;
    this.body = new CatalogoRequestDto();
    this.body.catalogo = this.catalogoSeleccionado;
    this.blockSeleccionar = false;
    this.bodyToForm();
    this.isBuscar();
    this.blockCrear = true;
  }

  formToBody() {
    this.body.descripcion = this.formDescripcion;
    this.body.codigoExt = this.formCodigo;
  }

  bodyToForm() {
    this.formDescripcion = this.body.descripcion;
    this.formCodigo = this.body.codigoExt;
  }

  isEditar(selectedItem) {
    this.upd = new CatalogoUpdateRequestDto();
    this.upd.tabla = this.body.catalogo;
    this.upd.descripcion = this.formDescripcion;
    this.upd.codigoExt = this.formCodigo;
    this.upd.idRegistro = this.body.idRegistro;
    this.blockSeleccionar = true;
    this.sigaServices.post("maestros_update", this.upd).subscribe(
      data => {
        this.showSuccess();
        console.log(data);
      },
      err => {
        this.showFail();
        console.log(err);
      },
      () => {
        this.reset();
      }
    );
  }

  editarCatalogos(selectedDatos) {
    if (selectedDatos.length == 1) {
      this.body = new CatalogoRequestDto();
      this.body = selectedDatos[0];
      this.editar = true;
      this.blockSeleccionar = true;
      this.bodyToForm();
    } else {
      this.editar = false;
      this.blockSeleccionar = false;

      this.body = new CatalogoRequestDto();
      this.bodyToForm();
      this.table.reset();
    }
  }

  isEliminar(selectedDatos) {
    this.del = new CatalogoDeleteRequestDto();
    selectedDatos.forEach((value: CatalogoMaestroItem, key: number) => {
      console.log(value);
      this.del.idRegistro.push(value.idRegistro);
      this.del.tabla = value.catalogo;
    });
    this.sigaServices.post("maestros_delete", this.del).subscribe(
      data => {
        if (selectedDatos == 1) {
          this.msgs = [];
          this.msgs.push({
            severity: "success",
            summary: "Correcto",
            detail: "Registro eliminado correctamente"
          });
        } else {
          this.msgs = [];
          this.msgs.push({
            severity: "success",
            summary: "Correcto",
            detail: selectedDatos.length + "registros eliminados correctamente"
          });
        }
      },
      err => {
        console.log(err);
      },
      () => {
        this.catalogoSeleccionado = this.body.catalogo;
        this.body = new CatalogoRequestDto();
        this.bodyToForm();
        this.body.catalogo = this.catalogoSeleccionado;
        this.isBuscar();
        this.editar = false;
      }
    )
  }

  confirmarBorrar(selectedDatos) {
    let mess = "¿Está seguro que desea eliminar el registro?";
    let icon = "fa fa-trash-alt";

    if (selectedDatos.length > 1) {
      mess =
        "¿Está seguro que desea eliminar " +
        selectedDatos.length +
        " registros?";
    }
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.isEliminar(selectedDatos);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: "Acción cancelada por el usuario"
          }
        ];
      }
    });
  }


}

export class CatalogoMaestroItem {
  idRegistro: "String";
  catalogo: "String";
  codigoExt: "String";
  descripcion: "String";
  idInstitucion: "String";
  fechaBaja: Date;
  constructor() { }
}

export class CatalogoResponseDto {
  error: String;
  catalogoMaestroItem: CatalogoMaestroItem[] = [];
  constructor() { }
}

export class CatalogoRequestDto {
  catalogo: String;
  codigoExt: String;
  descripcion: String;
  idRegistro: String;
  idInstitucion: String;
  constructor() { }
}

export class CatalogoHistoricoRequestDto {
  catalogo: String;
  codigoExt: String;
  descripcion: String;
  idRegistro: String;
  idInstitucion: String;
  constructor() { }
}

export class CatalogoDeleteRequestDto {
  idRegistro: any = [];
  tabla: String;
  idInstitucion: String;
  constructor() { }
}

export class CatalogoUpdateRequestDto {
  idRegistro: String;
  tabla: String;
  codigoExt: String;
  descripcion: String;
  idInstitucion: String;
  idLenguaje: String;
  constructor() { }
}

export class CatalogoCreateRequestDto {
  idRegistro: String;
  tabla: String;
  codigoExt: String;
  descripcion: String;
  idInstitucion: String;
  idLenguaje: String;
  constructor() { }
}