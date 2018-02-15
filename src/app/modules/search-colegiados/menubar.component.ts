import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: [
    "menubar.component.css"
  ]
})
export class MenubarComponent {

  items: MenuItem[];

  ngOnInit() {
    this.items = [
      {
        label: 'Censo',
        icon: 'fa-file-o',
        items: [
          {
            label: 'Buscar Colegiados',
            routerLink: 'searchColegiados'
          },
          {
            label: 'Buscar No Colegiados',
            routerLink: 'searchNoColegiados'
          },
          {
            label: 'Certificados ACA',
            routerLink: 'landpage'
          },
          { label: 'Comisiones y Cargos' },
          {
            label: 'Solicitudes Modificación',
            icon: 'fa-plus',
            items: [
              { label: 'Solicitudes Genéricas' },
              { label: 'Solicitudes Específicas' },
            ]
          },
          { label: 'Solicitudes incorporación' },
          { label: 'Nueva incorporación' },
          {
            label: 'Maestros y Mantenimientos',
            icon: 'fa-plus',
            items: [
              { label: 'Documentación Solicitudes' },
              { label: 'Mantenimiento Grupos Fijo' },
            ]
          },
          //{ separator: true },
          { label: 'Quit' }
        ]
      },
      {
        label: 'Certificados',
        icon: 'fa-edit',
        items: [
          { label: 'Undo', icon: 'fa-mail-forward' },
          { label: 'Redo', icon: 'fa-mail-reply' }
        ]
      },
      {
        label: 'Facturación',
        icon: 'fa-question',
        items: [
          {
            label: 'Contents'
          },
          {
            label: 'Search',
            icon: 'fa-search',
            items: [
              {
                label: 'Text',
                items: [
                  {
                    label: 'Workspace'
                  }
                ]
              },
              {
                label: 'File'
              }
            ]
          }
        ]
      },
      {
        label: 'Productos y Servicios',
        icon: 'fa-gear',
        items: [
          {
            label: 'Edit',
            icon: 'fa-refresh',
            items: [
              { label: 'Save', icon: 'fa-save' },
              { label: 'Update', icon: 'fa-save' },
            ]
          },
          {
            label: 'Other',
            icon: 'fa-phone',
            items: [
              { label: 'Delete', icon: 'fa-minus' }
            ]
          }
        ]
      },
      {
        label: 'Expedientes',
        icon: 'fa-gear',
        items: [
          {
            label: 'Edit',
            icon: 'fa-refresh',
            items: [
              { label: 'Save', icon: 'fa-save' },
              { label: 'Update', icon: 'fa-save' },
            ]
          },
          {
            label: 'Other',
            icon: 'fa-phone',
            items: [
              { label: 'Delete', icon: 'fa-minus' }
            ]
          }
        ]
      },
      {
        label: 'Administración',
        icon: 'fa-gear',
        items: [
          {
            label: 'Edit',
            icon: 'fa-refresh',
            items: [
              { label: 'Save', icon: 'fa-save' },
              { label: 'Update', icon: 'fa-save' },
            ]
          },
          {
            label: 'Other',
            icon: 'fa-phone',
            items: [
              { label: 'Delete', icon: 'fa-minus' }
            ]
          }
        ]
      },
      {
        label: 'SJCS',
        icon: 'fa-gear',
        items: [
          {
            label: 'Edit',
            icon: 'fa-refresh',
            items: [
              { label: 'Save', icon: 'fa-save' },
              { label: 'Update', icon: 'fa-save' },
            ]
          },
          {
            label: 'Other',
            icon: 'fa-phone',
            items: [
              { label: 'Delete', icon: 'fa-minus' }
            ]
          }
        ]
      },
      {
        label: 'Consultas',
        icon: 'fa-gear',
        items: [
          {
            label: 'Edit',
            icon: 'fa-refresh',
            items: [
              { label: 'Save', icon: 'fa-save' },
              { label: 'Update', icon: 'fa-save' },
            ]
          },
          {
            label: 'Other',
            icon: 'fa-phone',
            items: [
              { label: 'Delete', icon: 'fa-minus' }
            ]
          }
        ]
      },
      {
        label: 'Comunicaciones', icon: 'fa-minus'
      }
    ];
  }

}
