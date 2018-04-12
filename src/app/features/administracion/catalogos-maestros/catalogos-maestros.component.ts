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
  upd: CatalogoUpdateRequestDto = new CatalogoUpdateRequestDto();
  cre: CatalogoCreateRequestDto = new CatalogoCreateRequestDto();
  del: CatalogoDeleteRequestDto = new CatalogoDeleteRequestDto();


  pButton
  buscar: boolean = false;
  editar: boolean = false;
  eliminacion: boolean = true;

  selectMultiple: boolean = false;
  selectedItem: number = 4;

  formBusqueda: FormGroup;
  cols: any = [];
  datos: any[];
  select: any[];

  //Array de opciones del dropdown
  catalogoArray: any[];

  //elemento seleccionado en el dropdown
  catalogoSeleccionado: String;

  //elementos del form
  formDescripcion: String;
  formCodigo: String;

  showDatosGenerales: boolean = true
  blockSeleccionar: boolean = false;
  blockBuscar: boolean = true;
  blockCrear: boolean = true;

  rowsPerPage: any = [];

  @ViewChild('table')
  table
  constructor(private formBuilder: FormBuilder, private sigaServices: SigaServices, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
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
    if (this.body.codigoExt == "" || this.body.codigoExt == undefined) {
      this.blockCrear = true;
    } else if (this.body.descripcion == "" || this.body.descripcion == undefined) {
      this.blockCrear = true;
    } else {
      this.formDescripcion = this.body.descripcion;
      this.formCodigo = this.body.codigoExt;
      this.blockCrear = false;
    }
  }

  editarCatalogos(selectedDatos) {
    this.eliminacion = true;
    if (selectedDatos.length == 1) {
      this.body = new CatalogoRequestDto();
      this.body = selectedDatos[0];
      this.editar = true;
      this.blockSeleccionar = true;
    } else {
      this.editar = false;
      this.blockSeleccionar = false;
      this.body = new CatalogoRequestDto();
      this.table.reset();
    }
  }

  isBuscar() {
    this.buscar = true;
    if (this.body.codigoExt == undefined) {
      this.body.codigoExt = "";
    }
    if (this.body.descripcion == undefined) {
      this.body.descripcion = "";
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
    this.editar = false;
    this.blockSeleccionar = false;
    this.eliminacion = false;
  }

  isCrear() {
    // 
  }

  isEditar(selectedItem) {
    this.catalogoSeleccionado = this.body.catalogo;
    this.body = new CatalogoRequestDto();
    this.body = selectedItem[0];
    this.body.catalogo = this.catalogoSeleccionado;
    this.blockSeleccionar = true;
    //aqui guardo los elementos de las cajas dentro del objeto body, no se si lo que debería hacer es ponerlos en el objeto editar.
    this.body.descripcion = this.formDescripcion;
    this.body.codigoExt = this.formCodigo;
  }

  isEliminar(selectedDatos) {
    this.del = new CatalogoDeleteRequestDto();
    selectedDatos.forEach((value: CatalogoMaestroItem, key: number) => {
      console.log(value);
      this.del.idRegistro.push(value.idRegistro);
      this.del.tabla = value.catalogo;
    });
    this.sigaServices.post("maestros_delete", this.del).subscribe(
      data => { },
      err => {
        console.log(err);
      },
      () => {
        this.body = new CatalogoRequestDto();
        this.isBuscar();

      }
    )
  }
}

export class CatalogoMaestroItem {
  idRegistro: "String";
  catalogo: "String";
  codigoExt: "String";
  descripcion: "String";
  idInstitucion: "String";
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