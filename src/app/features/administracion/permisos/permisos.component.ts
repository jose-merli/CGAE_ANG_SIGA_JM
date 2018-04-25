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
  }

  ngDoCheck() {
    setTimeout(() => {
      this.myWidth = this.widthContent.nativeElement.parentElement.parentElement.offsetWidth;
      //this.changeDetectorRef.detectChanges();
    }, 5)
  }

  ngOnInit() {




    this.myWidth = this.widthContent.nativeElement.parentElement.parentElement.offsetWidth;


    this.grupos = [
      {
        label: '-'
      },
      {
        label: 'Abogado', value: 'abogado', idGrupo: 1
      }

    ]

    // this.sigaServices.get("usuarios_perfil").subscribe(
    //   n => {
    //     this.grupos = n.combooItems;
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );


    // this.sigaServices.post("permisos_tree", {
    //   idGrupo: 'ABG'
    // }).subscribe(
    //   data => {

    //     let permisosTree = JSON.parse(data.body)
    //     this.permisosTree = permisosTree.permisoItems
    //     console.log(data);


    //   },
    //   err => {
    //     console.log(err);
    //   }

    //   );



    this.permisosTree =
      [
        {
          "label": "Catálogo Botones-Atajos",
          "derechoacceso": 2,
          "selected": false,
          "children":
          [{
            "label": "Botón colegiación",
            "derechoacceso": 2,
          },
          {
            "label": "Botón Generar Certificado"
          }]
        },
        {
          "label": "Catálogo Cursos"
        },
        {
          "label": "Catálogo Botones-Atajos",
          "children":
          [{
            "label": "Botón colegiación",
          },
          {
            "label": "Botón Generar Certificado"
          }]
        },
        {
          "label": "Catálogo Cursos"
        },
        {
          "label": "Catálogo Botones-Atajos",
          "children":
          [{
            "label": "Botón colegiación",
          },
          {
            "label": "Botón Generar Certificado"
          }]
        },
        {
          "label": "Catálogo Cursos"
        },
        {
          "label": "Catálogo Botones-Atajos",
          "children":
          [{
            "label": "Botón colegiación",
          },
          {
            "label": "Botón Generar Certificado"
          }]
        },
        {
          "label": "Catálogo Cursos"
        },
        {
          "label": "Catálogo Botones-Atajos",
          "children":
          [{
            "label": "Botón colegiación",
          },
          {
            "label": "Botón Generar Certificado"
          }]
        },
        {
          "label": "Catálogo Cursos"
        }
      ]


    this.treeInicial = JSON.parse(JSON.stringify(this.permisosTree))


    console.log('oninitInicial', this.treeInicial)

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

  changeAcceso(ref) {

    if (ref) {
      this.permisosChange = this.selectedPermiso
      for (let changed of this.permisosChange) {
        if (ref == 'sinAsignar') {
          changed.derechoacceso = 0;
        } else if (ref == 'denegado') {
          changed.derechoacceso = 1;
        } else if (ref == 'lectura') {
          changed.derechoacceso = 2;
        } else if (ref == 'total') {
          changed.derechoacceso = 3;
        }
        // console.log(this.permisosChange)
      }

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
      node.children.forEach(childNode => {
        this.selectAllRecursive(childNode);
      });
    }
  }

  onChangeSelectAll(node) {
    if (this.selectAll === true) {
      this.permisosTree.forEach(node => {
        this.selectAllRecursive(node);
      });

    } else {
      this.selectedPermiso = []
    }
  }


  savePermisos() {
    // for (let permiso of this.permisosChange) {
    //   let id = permiso.data;
    //   let derechoAcceso = permiso.derechoAcceso;
    //   console.log(id, derechoAcceso)
    //   this.sigaServices.post("permisos_update", { id, derechoAcceso }).subscribe(
    //     data => {
    //       console.log(data);
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );
    // }
  }


  restablecerPermisos() {
    this.permisosTree = JSON.parse(JSON.stringify(this.treeInicial));
    this.selectAll = false;
    this.selectedPermiso = [];

    console.log('redo', this.treeInicial);

  }


}
