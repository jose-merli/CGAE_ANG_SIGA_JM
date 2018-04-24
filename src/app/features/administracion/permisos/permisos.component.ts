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

  permisosTree: any = []
  grupos: any = []
  todoDesplegado: boolean = false;
  selectedGrupo: any;


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

    // this.widthContent = this.elementRef.nativeElement.offsetWidth;
    // this.changeDetectorRef.detectChanges();
    this.myWidth = this.widthContent.nativeElement.parentElement.parentElement.offsetWidth;
    console.log(this.widthContent)

    // this.grupos = [
    //   {
    //     label: '-'
    //   },
    //   {
    //     label: 'Abogado', value: 'abogado'
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

    this.permisosTree =
      [
        {
          "label": "Catálogo Botones-Atajos",
          "derechoacceso": 2,
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





}
