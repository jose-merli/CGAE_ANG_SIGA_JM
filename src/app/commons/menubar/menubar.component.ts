import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: [
    "menubar.component.css"
  ],
  encapsulation: ViewEncapsulation.None
})
export class MenubarComponent {
  constructor(private elRef: ElementRef) { }

  items: MenuItem[];
  /**
    label?: string;
    icon?: string;
    command?: (event?: any) => void;
    url?: string;
    routerLink?: any;
    queryParams?: { [k: string]: any };
    items?: MenuItem[]|MenuItem[][];
    expanded?: boolean;
    disabled?: boolean;
    visible?: boolean;
    target?: string;
    routerLinkActiveOptions?: any;
    separator?: boolean;
    badge?: string;
    badgeStyleClass?: string;
    style?:any;
    styleClass?:string;
    title?: string;
    id?: string;
   */


  /*ngAfterViewInit() {
    this.elRef.nativeElement.querySelector("div.ui-menubar p-menubarsub li.ui-menu-parent p-menubarsub.ui-submenu ul.ui-submenu-list li.ui-menu-parent p-menubarsub ul.ui-submenu-list").style.cssText = "margin-top: -" +
      this.elRef.nativeElement.querySelector("div.ui-menubar p-menubarsub li.ui-menu-parent p-menubarsub.ui-submenu ul.ui-submenu-list li.ui-menu-parent p-menubarsub ul.ui-submenu-list").parentElement.style.height.px + "px!important";
  }*/

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
            routerLink: 'certificadosAca'
          },
          {
            label: 'Comisiones y Cargos',
            routerLink: 'comisionesCargos'
          },
          {
            label: 'Solicitudes Modificación',
            items: [
              {
                label: 'Solicitudes Genéricas',
                routerLink: 'solicitudesGenericas'
              },
              {
                label: 'Solicitudes Específicas',
                routerLink: 'solicitudesEspecificas'
              },
            ]
          },
          { label: 'Solicitudes Incorporación',
            routerLink: 'solicitudesIncorporacion' },
          { label: 'Nueva incorporación',
            routerLink: 'nuevaIncorporacion' },
          {
            label: 'Busqueda Sanciones',
            routerLink: 'busquedaSanciones'
          },
          {
            label: 'Maestros y Mantenimientos',
            items: [
              { label: 'Documentación Solicitudes',
                routerLink: 'documentacionSolicitudes' },
              { label: 'Mantenimiento Grupos Fijos',
                routerLink: 'mantenimientoGruposFijos' },
              { label: 'Mantenimiento Mandatos',
                routerLink: 'mantenimientoMandatos' }
            ]
          },
          //{ separator: true },
        ]
      },
      {
        label: 'Certificados',
        icon: 'fa-edit',
        items: [
          { label: 'Solicitud Certificado' },
          { label: 'Solicitud Comunicación y Diligencia' },
          { label: 'Gestión Solicitudes' },
          { label: 'Mantenimiento de Certificados' }
        ]
      },
      {
        label: 'Facturación',
        items: [
          {
            label: 'Sufijos/Coneptos'
          },
          {
            label: 'Plantillas'
          },
          {
            label: 'Series de Facturación'
          },
          {
            label: 'Previsiones Facturación'
          },
          {
            label: 'Mantenimiento Facturación'
          },
          {
            label: 'Facturas'
          },
          {
            label: 'Ficheros de Adeudos'
          },
          {
            label: 'Devoluciones',
            items: [
              {
                label: 'Ficheros de Devoluciones'
              },
              {
                label: 'Devoluciones Manuales'
              }
            ]
          },
          {
            label: 'Abonos'
          },
          {
            label: 'Ficheros de Transferencias'
          },
          {
            label: 'Paso a contabilidad'
          },
          {
            label: 'Gestión de Cobros y Recobros'
          }
        ]
      },
      {
        label: 'Productos y Servicios',
        items: [
          {
            label: 'Configuración Tipos',
            items: [
              {
                label: 'Productos'
              },
              {
                label: 'Servicios'
              }
            ]
          },
          {
            label: 'Mantenimiento',
            items: [
              {
                label: 'Productos'
              },
              {
                label: 'Servicios'
              }
            ]
          },
          {
            label: 'Gestionar Solicitudes'
          },
          {
            label: 'Solicitudes',
            items: [
              {
                label: 'Compra/Suscripción'
              },
              {
                label: 'Anuación'
              }
            ]
          }
        ]
      },
      {
        label: 'Expedientes',
        items: [
          {
            label: 'Tipos Expedientes'
          },
          {
            label: 'Gestionar Expedientes'
          },
          {
            label: 'Alertas'
          },
          {
            label: 'Nuevo Expediente'
          }
        ]
      },
      {
        label: 'Administración',
        items: [
          {
            label: 'Gestión Catálogos Maestros'
          },
          {
            label: 'Seleccionar Idioma'
          },
          {
            label: 'Gestión Multiidioma',
            items: [
              {
                label: 'Catálogos Maestros'
              }
            ]
          },
          {
            label: 'Gestión Usuarios y Grupos',
            items: [
              {
                label: 'Usuarios'
              },
              {
                label: 'Grupos de Usuarios'
              },
              {
                label: 'Asignación de Grupo por Defecto'
              },
              {
                label: 'Asignación de Usuarios a Grupos'
              }
            ]
          },
          {
            label: 'Gestionar Permisos Aplicación'
          },
          {
            label: 'Auditoría',
            items: [
              {
                label: 'Configuración'
              },
              {
                label: 'Usuarios'
              }
            ]
          },
          {
            label: 'Gestión de Parámetros',
            items: [
              {
                label: 'Parámetros Generales'
              },
              {
                label: 'Contadores'
              }
            ]
          }
        ]
      },
      {
        label: 'SJCS',
        items: [
          {
            label: 'Maestros'
          },
          {
            label: 'Oficio'
          },
          {
            label: 'Guardia'
          },
          {
            label: 'S.O.J.'
          },
          {
            label: 'E.J.G.'
          },
          {
            label: 'Facturación SJCS'
          },
          {
            label: 'Informes'
          },
          {
            label: 'e - Comunicaciones'
          }
        ]
      },
      {
        label: 'Consultas',
        icon: 'fa-gear',
        items: [
          {
            label: 'Recuperar Consultas',
          },
          {
            label: 'Consultas Listas Dinámicas'
          },
          {
            label: 'Nueva Consulta'
          }
        ]
      },
      {
        label: 'Comunicaciones',
        items: [
          {
            label: 'Definir Tipo Plantilla'
          },
          {
            label: 'Lista de Correos'
          },
          {
            label: 'Bandeja de Salida'
          }
        ]
      }
    ];
  }

}
