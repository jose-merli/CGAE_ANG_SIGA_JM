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
  maestros_rol: String;
  maestros_update: String;
  maestros_create: String;
  maestros_delete: String;

  body: CatalogoRequestDto = new CatalogoRequestDto();

  //Creo los objetos para interactuar con sus respectivos DTO
  upd: CatalogoUpdateResponseDto = new CatalogoUpdateResponseDto();
  cre: CatalogoCreateResponseDto = new CatalogoCreateResponseDto();
  del: CatalogoDeleteResponseDto = new CatalogoDeleteResponseDto();


  pButton
  buscar: boolean = false;
  editar: boolean = false;

  selectMultiple: boolean = false;
  selectedItem: number = 4;

  formBusqueda: FormGroup;
  cols: any = [];
  datos: any[];
  select: any[];

  //Array de opciones del dropdown
  catalogo: any[];
  //elemento seleccionado en el dropdown
  catalogoSeleccionado: String;

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

  search() {
    console.log("{ CatalogoRequestDto: " + JSON.stringify(this.body) + "}");
    this.sigaServices.post("maestros_search", "{ CatalogoRequestDto: " + JSON.stringify(this.body) + "}")
      .subscribe(data => {
        console.log("{ CatalogoRequestDto: " + JSON.stringify(this.body) + "}");
      },
      err => {
        console.log("JA JA JA");
      });
  }

  update() {
    console.log("{ CatalogoUpdateRequestDto: " + JSON.stringify(this.upd) + "}");
    this.sigaServices.post("maestros_update", "{ CatalogoUpdateRequestDto: " + JSON.stringify(this.upd) + "}")
      .subscribe(data => {
        console.log("{ CatalogoUpdateRequestDto: " + JSON.stringify(this.upd) + "}");
      },
      err => {
        console.log("JA JA JA");
      });
  }

  delete() {
    console.log("{ CatalogoDeleteRequestDto: " + JSON.stringify(this.del) + "}");
    this.sigaServices.post("maestros_delete", "{ CatalogoDeleteRequestDto: " + JSON.stringify(this.del) + "}")
      .subscribe(data => {
        console.log("{ CatalogoDeleteRequestDto: " + JSON.stringify(this.del) + "}");
      },
      err => {
        console.log("JA JA JA");
      });
  }

  create() {
    console.log("{ CatalogoCreateRequestDto: " + JSON.stringify(this.cre) + "}");
    this.sigaServices.post("maestros_create", "{ CatalogoCreateRequestDto: " + JSON.stringify(this.cre) + "}")
      .subscribe(data => {
        console.log("{ CatalogoCreateRequestDto: " + JSON.stringify(this.cre) + "}");
      },
      err => {
        console.log("JA JA JA");
      });
  }

  ngOnInit() {
    this.sigaServices.get("maestros_rol").subscribe(n => {
      this.maestros_rol = n.combooItems;
    });

    //Cambiando los elementos body de undefined a "" para poder controlar los textarea
    this.body.descripcion = "";
    this.body.codigoExt = "";

    //Valores dummie de catalogo
    this.catalogo = [
      { label: 'Selecciona un catálogo', value: '' },
      { label: 'dummie1', value: 'dummie1' },
      { label: 'dummie2', value: 'dummie2' },
      { label: 'dummie3', value: 'dummie3' },
      { label: 'dummie4', value: 'dummie4' },
      { label: 'dummie5', value: 'dummie5' }
    ];
    this.cols = [
      { field: 'codigoExt', header: 'Código externo' },
      { field: 'descripcion', header: 'Descripción' },
    ];

    //Valores dummie de tabla
    this.datos = [
      { codigoExt: '239123', descripcion: 'Administrador' },
      { codigoExt: '324542', descripcion: 'Otorgante' },
      { codigoExt: '214124', descripcion: 'Representante' },
      { codigoExt: '758689', descripcion: 'Secretario' },
      { codigoExt: '849123', descripcion: 'Paco' },
      { codigoExt: '944542', descripcion: 'Luis' },
      { codigoExt: '244124', descripcion: 'Pepe' },
      { codigoExt: '748689', descripcion: 'Juan' },
      { codigoExt: '249123', descripcion: 'Socio' },
      { codigoExt: '344542', descripcion: 'Analista' },
      { codigoExt: '244334', descripcion: 'Julian' },
      { codigoExt: '744689', descripcion: 'Dummies' },
    ];

    this.rowsPerPage = [
      {
        label: 4, value: 4
      },
      {
        label: 6, value: 6
      },
      {
        label: 'Todo', value: this.datos.length
      },
    ]
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeCatalogo() {
    if (this.catalogoSeleccionado == '') {
      this.blockBuscar = true;
      this.blockCrear = true;
    } else {
      this.blockBuscar = false;
    }
  }

  onChangeForm() {
    if (this.body.descripcion == "" || this.body.codigoExt == "") {
      this.blockCrear = true;
    } else if (this.blockBuscar == false) {
      this.blockCrear = false;
    }
  }

  editarCatalogos(selectedDatos) {
    if (selectedDatos.length == 1) {

      this.body = new CatalogoRequestDto();
      this.body = selectedDatos[0];
      this.editar = true;
      this.blockSeleccionar = true;
      this.body.catalogo = this.catalogoSeleccionado;
    } else {
      this.body = new CatalogoRequestDto();
      this.table.reset();
    }
  }

  isBuscar() {
    this.buscar = true;
  }

  isLimpiar() {
    this.body = new CatalogoRequestDto();
    this.editar = false;
    this.blockSeleccionar = false;
  }

  isCrear() {
    // 
  }

  isEditar() {
    // 
  }

}

export class CatalogoRequestDto {
  catalogo: String;
  codigoExt: String;
  descripcion: String;
  idInstitucion: String;
  constructor() { }
}

export class CatalogoDeleteResponseDto {
  catalogoItem: String;
  idRegistro: any = [];
  tabla: String;
  idInstitucion: String;
  error: String;
  constructor() { }
}

export class CatalogoUpdateResponseDto {
  catalogoItem: String;
  idRegistro: String;
  tabla: String;
  idTabla: String;
  codigoExt: String;
  descripcion: String;
  idInstitucion: String;
  error: String;
  constructor() { }
}

export class CatalogoCreateResponseDto {
  catalogoItem: String;
  tabla: String;
  idTabla: String;
  codigoExt: String;
  descripcion: String;
  idInstitucion: String;
  error: String;
  constructor() { }
}