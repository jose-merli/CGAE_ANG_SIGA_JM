import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, DoCheck, ViewEncapsulation } from '@angular/core';
import { Message, MenuItem, TreeNode } from 'primeng/components/common/api';
import { Tree } from 'primeng/components/tree/tree';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SigaServices } from "./../../../_services/siga.service";

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PermisosComponent implements OnInit, DoCheck {

  formPermisos: FormGroup;

  permisosTree: any = [];
  treeInicial: any = [];
  permisosChange: any = [];
  grupos: any = [];
  todoDesplegado: boolean = false;
  selectedGrupo: any;
  selectedPermiso: any = [];
  selectAll: boolean = false;
  idGrupo: any;
  savedPermisos: boolean = false;

  numSeleccionados: number;
  numCambios: number;
  totalPermisos: number;

  //accesos totales
  accesoTotal: number;
  accesoLectura: number;
  accesoDenegado: number;
  sinAsignar: number;

  // treeNode: TreeNode[]

  @ViewChild('widthContent')
  widthContent: any;

  myWidth: any;



  @ViewChild('expandingTree')
  expandingTree: Tree;

  constructor(private formBuilder: FormBuilder, private elementRef: ElementRef, private changeDetectorRef: ChangeDetectorRef, private sigaServices: SigaServices) {

    this.formPermisos = this.formBuilder.group({
      'grupo': null,
    });

    this.numSeleccionados = 0;
    this.numCambios = 0;
    this.totalPermisos = 0;
    this.accesoTotal = 0;
    this.accesoLectura = 0;


  }

  ngDoCheck() {
    setTimeout(() => {
      this.myWidth = this.widthContent.nativeElement.parentElement.parentElement.offsetWidth;
      //this.changeDetectorRef.detectChanges();
    }, 5)
  }

  ngOnInit() {




    this.myWidth = this.widthContent.nativeElement.parentElement.parentElement.offsetWidth;


    // this.grupos = [
    //   {
    //     label: '-'
    //   },
    //   {
    //     label: 'Abogado', value: 'abogado', idGrupo: 1
    //   }

    // ]

    this.sigaServices.get("usuarios_perfil").subscribe(
      n => {
        this.grupos = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );


    this.sigaServices.post("permisos_tree", {
      idGrupo: 'ABG'
    }).subscribe(
      data => {
        let permisosTree = JSON.parse(data.body)
        this.permisosTree = permisosTree.permisoItems;
        this.treeInicial = JSON.parse(JSON.stringify(this.permisosTree));
        this.permisosTree.forEach(node => {
          this.totalRecursive(node);

        });

        console.log(this.totalPermisos)
      },
      err => {
        console.log(err);
      }

      );


    // this.permisosTree =
    //   [
    //     {
    //       "label": "Catálogo Botones-Atajos",
    //       "derechoacceso": 2,
    //       "selected": false,
    //       "children":
    //       [{
    //         "label": "Botón colegiación",
    //         "derechoacceso": 2,
    //       },
    //       {
    //         "label": "Botón Generar Certificado"
    //       }]
    //     },
    //     {
    //       "label": "Catálogo Cursos"
    //     },
    //     {
    //       "label": "Catálogo Botones-Atajos",
    //       "children":
    //       [{
    //         "label": "Botón colegiación",
    //       },
    //       {
    //         "label": "Botón Generar Certificado"
    //       }]
    //     },
    //     {
    //       "label": "Catálogo Cursos"
    //     },
    //     {
    //       "label": "Catálogo Botones-Atajos",
    //       "children":
    //       [{
    //         "label": "Botón colegiación",
    //       },
    //       {
    //         "label": "Botón Generar Certificado"
    //       }]
    //     },
    //     {
    //       "label": "Catálogo Cursos"
    //     },
    //     {
    //       "label": "Catálogo Botones-Atajos",
    //       "children":
    //       [{
    //         "label": "Botón colegiación",
    //       },
    //       {
    //         "label": "Botón Generar Certificado"
    //       }]
    //     },
    //     {
    //       "label": "Catálogo Cursos"
    //     },
    //     {
    //       "label": "Catálogo Botones-Atajos",
    //       "children":
    //       [{
    //         "label": "Botón colegiación",
    //       },
    //       {
    //         "label": "Botón Generar Certificado"
    //       }]
    //     },
    //     {
    //       "label": "Catálogo Cursos"
    //     }
    //   ]

    // this.treeInicial = JSON.parse(JSON.stringify(this.permisosTree));
    // this.permisosTree.forEach(node => {
    //   this.totalRecursive(node);

    // });

    // console.log(this.totalPermisos)


  }

  onChangeGrupo(id) {

    this.idGrupo = id.value;
    console.log(this.permisosTree);

    this.selectAll = false;
    this.numSeleccionados = 0;
    this.numCambios = 0;
    this.selectedPermiso = [];
    this.permisosChange = [];


  }


  expandAll() {
    this.todoDesplegado = true;
    this.permisosTree.forEach(node => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.todoDesplegado = false;
    this.permisosTree.forEach(node => {
      this.expandRecursive(node, false);
    });


  }
  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }

  }

  // onNodeSelect(selectedPermiso) {
  //   console.log(this.selectedPermiso)
  // }

  onChangeAcceso(ref) {
    if (ref) {
      this.permisosChange = this.selectedPermiso
      for (let changed of this.permisosChange) {
        if (ref == 'sinAsignar') {
          changed.derechoacceso = '0';
        } else if (ref == 'denegado') {
          changed.derechoacceso = '1';
        } else if (ref == 'lectura') {
          changed.derechoacceso = '2';
        } else if (ref == 'total') {
          changed.derechoacceso = '3';
        }
      }
      this.selectAll = false;
      this.numSeleccionados = 0;
      this.accesoTotal = 0;
      this.accesoLectura = 0;
      this.accesoDenegado = 0;
      this.sinAsignar = 0;
      this.selectedPermiso = [];
      this.permisosTree.forEach(node => {
        this.totalAccesosRecursive(node);
      });
    }
  }


  totalAccesosRecursive(node: TreeNode) {
    if (node.derechoacceso === ' 3') {
      this.accesoTotal++;
    } else if (node.derechoacceso === '2') {
      this.accesoLectura++;
    } else if (node.derechoacceso === '1') {
      this.accesoDenegado++;
    } else if (node.derechoacceso === '0') {
      this.sinAsignar++;
    }

    if (node.children) {
      node.children.forEach(childNode => {
        this.totalAccesosRecursive(childNode);
      });
    }
  }

  isButtonDisabled() {

    if (this.permisosChange && this.permisosChange.length > 0) {
      return false;
    }
    return true;
  }

  // onChangeSelectAll() {

  //   if (this.selectAll === true) {
  //     this.selectedPermiso = this.permisosTree;
  //     for (let permisos of this.permisosTree) {
  //       if (permisos.children) {
  //         for (let child of permisos.children) {
  //           this.selectedPermiso.push(child)
  //         }
  //       }
  //     }
  //   } else {
  //     this.selectedPermiso = [];
  //   }

  //   console.log(this.selectedPermiso)

  // }


  selectAllRecursive(node: TreeNode) {
    this.selectedPermiso.push(node);
    if (node.children) {
      console.log(node.children)
      node.children.forEach(childNode => {
        this.selectAllRecursive(childNode);
      });
    }
  }

  totalRecursive(node: TreeNode) {
    this.totalPermisos += 1;
    if (node.children) {
      node.children.forEach(childNode => {
        this.totalRecursive(childNode);
      });
    }
  }


  onChangeSelectAll(node) {
    if (this.selectAll === true) {
      this.permisosTree.forEach(node => {
        this.selectAllRecursive(node);
      });
      this.getNumSelected()

    } else {
      this.selectedPermiso = []
    }
  }


  savePermisos() {
    for (let permiso of this.permisosChange) {

      let objUpdate = {
        idGrupo: this.idGrupo,
        id: permiso.data,
        derechoAcceso: permiso.derechoacceso
      }

      console.log(objUpdate)

      this.sigaServices.post("permisos_update", { objUpdate }).subscribe(
        data => {
          console.log(data);

        },
        err => {
          console.log(err);
        }
      );

    }

    this.savedPermisos = true;

    this.getNumChanges();
  }

  restablecerPermisos() {
    this.permisosTree = JSON.parse(JSON.stringify(this.treeInicial));
    this.selectAll = false;
    this.selectedPermiso = [];
    this.permisosChange = [];

    console.log('redo', this.treeInicial);
  }


  getNumSelected() {
    this.numSeleccionados = this.selectedPermiso.length;
  }
  getNumChanges() {
    this.numCambios = this.permisosChange.length;
  }

  getNumTotales() {
    // this.numTotales = this.permisosTree.length + node.children.length;
  }

  onNodeSelect() {
    this.getNumSelected();

    this.getNumTotales()
  }

  onNodeUnselect() {
    this.getNumSelected();
  }



}
