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
  accesoTotal: any;
  accesoDenegado: any;
  accesoLectura: any;
  sinAsignar: any;

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




  }

  ngDoCheck() {
    setTimeout(() => {
      this.myWidth = this.widthContent.nativeElement.parentElement.parentElement.offsetWidth;

    }, 5)
  }

  ngOnInit() {




    this.myWidth = this.widthContent.nativeElement.parentElement.parentElement.offsetWidth;


    this.sigaServices.get("usuarios_perfil").subscribe(
      n => {
        this.grupos = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );



  }

  onChangeGrupo(id) {

    this.idGrupo = id.value;
    console.log(this.permisosTree);

    this.sigaServices.post("permisos_tree", {
      idGrupo: this.idGrupo
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



  onChangeAcceso(ref) {
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

      }
      this.selectedPermiso = [];

    }


  }

  isButtonDisabled() {

    if (this.permisosChange && this.permisosChange.length > 0) {
      return false;
    }
    return true;
  }




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
        derechoacceso: permiso.derechoacceso
      }

      console.log(objUpdate)

      this.sigaServices.post("permisos_update", objUpdate).subscribe(
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
