import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  ViewEncapsulation
} from "@angular/core";
import { Message } from "primeng/components/common/api";
import { Tree } from "primeng/components/tree/tree";
import { TreeNode } from "../../../utils/treenode";
import { TranslateService } from "../../../commons/translate/translation.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SigaServices } from "./../../../_services/siga.service";
import { ControlAccesoDto } from "./../../../../app/models/ControlAccesoDto";
import { PermisosAplicacionesDto } from "./../../../../app/models/PermisosAplicacionesDto";
import { Router } from "@angular/router";

@Component({
  selector: "app-permisos",
  templateUrl: "./permisos.component.html",
  styleUrls: ["./permisos.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PermisosComponent implements OnInit {
  formPermisos: FormGroup;

  permisosTree: any = [];
  treeInicial: any = [];
  grupos: any = [];
  todoDesplegado: boolean = false;
  selectedGrupo: any;
  selectedPermiso: any = [];
  selectAll: boolean = false;
  idGrupo: any;
  savedPermisos: boolean = false;
  //mensajes
  msgs: Message[] = [];

  numSeleccionados: number;
  numCambios: number;
  totalPermisos: number;

  //accesos totales
  accesoTotal: number;
  accesoLectura: number;
  accesoDenegado: number;
  sinAsignar: number;

  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisos: any;
  permisosArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean;
  propagateDown: boolean = true;
  isWidthChange: boolean = false;
  // treeNode: TreeNode[]
  first: any = [];

  // map con los permisos {data, ObjectoPermisosBack}
  permisosChange: Map<String, PermisosAplicacionesDto> = new Map<
    String,
    PermisosAplicacionesDto
    >();

  @ViewChild("widthContent") widthContent: any;

  myWidth: any;

  @ViewChild("expandingTree") expandingTree: Tree;

  constructor(
    private formBuilder: FormBuilder,
    private sigaServices: SigaServices,
    private router: Router,
    private translateService: TranslateService
  ) {
    this.formPermisos = this.formBuilder.group({
      grupo: null
    });

    this.numSeleccionados = 0;
    this.numCambios = 0;
    this.totalPermisos = 0;

    this.sigaServices.menuToggled$.subscribe(() => {
      this.isWidthChange = !this.isWidthChange;
      //console.log(this.isWidthChange)
    });
  }

  // ngDoCheck() {
  //   setTimeout(() => {
  //     this.myWidth = this.widthContent.nativeElement.parentElement.parentElement.offsetWidth;
  //   }, 5);
  // }

  ngOnInit() {
    this.checkAcceso();
    this.myWidth = this.widthContent.nativeElement.parentElement.parentElement.offsetWidth;

    this.sigaServices.get("usuarios_perfil").subscribe(
      n => {
        this.grupos = n.combooItems;
        // this.first = { label: "", value: "" };
        // //console.log(this.first);
        // this.grupos.unshift(this.first);

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.grupos.map(e => {
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
      },
      err => {
        //console.log(err);
      }
    );
  }

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "84";
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisos = JSON.parse(data.body);
        this.permisosArray = this.permisos.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        //console.log(err);
      },
      () => {
        if (this.derechoAcceso == 3) {
          this.activacionEditar = true;
        } else if (this.derechoAcceso == 2) {
          this.activacionEditar = false;
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
          this.router.navigate(["/errorAcceso"]);
        }
      }
    );
  }

  onChangeGrupo(id) {
    this.idGrupo = id.value;

    this.selectAll = false;
    this.numSeleccionados = 0;
    this.numCambios = 0;
    this.selectedPermiso = [];
    this.permisosChange.clear();
    this.totalPermisos = 0;
    this.todoDesplegado = false;

    this.sigaServices
      .post("permisos_tree", {
        idGrupo: this.idGrupo
      })
      .subscribe(
      data => {
        let permisosTree = JSON.parse(data.body);
        this.permisosTree = permisosTree.permisoItems;
        this.treeInicial = JSON.parse(JSON.stringify(this.permisosTree));
        this.permisosTree.forEach(node => {
          this.totalRecursive(node);
        });
        this.accesoTotal = 0;
        this.accesoLectura = 0;
        this.accesoDenegado = 0;
        this.sinAsignar = 0;

        this.permisosTree.forEach(node => {
          this.totalAccesosRecursive(node);
        });
      },
      err => {
        //console.log(err);
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

    // //console.log(this.totalPermisos)
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
    if (ref && this.selectedPermiso.length > 0) {
      for (let changed of this.selectedPermiso) {
        if (ref == "sinAsignar") {
          changed.derechoacceso = "0";
        } else if (ref == "denegado") {
          changed.derechoacceso = "1";
        } else if (ref == "lectura") {
          changed.derechoacceso = "2";
        } else if (ref == "total") {
          changed.derechoacceso = "3";
        }

        let permisosUpdate = new PermisosAplicacionesDto();
        permisosUpdate.derechoacceso = changed.derechoacceso;
        permisosUpdate.idGrupo = this.idGrupo;
        permisosUpdate.id = changed.data;

        this.permisosChange.set(changed.data, permisosUpdate);
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
      this.getNumChanges();
    }
  }

  totalAccesosRecursive(node: TreeNode) {
    if (node.derechoacceso === "3") {
      this.accesoTotal++;
    } else if (node.derechoacceso === "2") {
      this.accesoLectura++;
    } else if (node.derechoacceso === "1") {
      this.accesoDenegado++;
    } else if (node.derechoacceso === "0") {
      this.sinAsignar++;
    }

    if (node.children) {
      node.children.forEach(childNode => {
        this.totalAccesosRecursive(childNode);
      });
    }
  }

  isButtonDisabled() {
    if (
      this.permisosChange &&
      this.permisosChange.size > 0 &&
      this.savedPermisos == false
    ) {
      return false;
    } else return true;
  }

  selectAllRecursive(node: TreeNode) {
    this.selectedPermiso.push(node);
    if (node.children) {
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
      this.getNumSelected();
    } else {
      this.selectedPermiso = [];
      this.numSeleccionados = 0;
    }
  }

  savePermisos() {
        let permisosUpdate = new PermisosAplicacionesDto();
        permisosUpdate.derechoacceso = "3";
        permisosUpdate.idGrupo = this.idGrupo;
        permisosUpdate.id = 0;

        this.permisosChange.set("0", permisosUpdate);
    this.permisosChange.forEach(
      (value: PermisosAplicacionesDto, key: String) => {
        this.sigaServices.post("permisos_update", value).subscribe(
          data => {
            this.showSuccess();
            this.savedPermisos = true;
            this.numCambios = 0;
          },
          err => {
            //console.log(err);
          },
          () => {
            this.permisosChange.clear();
          }
        );
      }
    );
  }

  restablecerPermisos() {
    this.permisosTree = JSON.parse(JSON.stringify(this.treeInicial));

    this.selectAll = false;
    this.selectedPermiso = [];
    this.permisosChange.clear();
    this.numCambios = 0;
  }

  getNumSelected() {
    this.numSeleccionados = this.selectedPermiso.length;
  }
  getNumChanges() {
    if (this.permisosChange.size > 0) {
      this.numCambios = this.permisosChange.size;
    } else {
      this.numCambios = 0;
    }
  }

  getNumTotales() {
    // this.numTotales = this.permisosTree.length + node.children.length;
  }

  onNodeSelect() {
    this.propagateDown = true;
    this.getNumSelected();
    this.savedPermisos = false;
    this.getNumTotales();
  }

  onNodeUnselect() {
    this.propagateDown = true;
    this.getNumSelected();
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
      detail: "Árbol de permisos actualizado correctamente"
    });
  }

  onChangePropagate(node) {
    this.propagateDown = false;
  }

  clear() {
    this.msgs = [];
  }
}
