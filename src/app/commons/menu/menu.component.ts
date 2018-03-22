import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {

  items: MenuItem[];
  closeMenu: boolean = false;
  showChild: boolean = false;
  selectedItem: any;
  selectedLabel: any;
  showChildOfChild: boolean = false;
  selectedItemOfChild: any;
  selectedLabelOfChild: any;
  encontrado: boolean;

  constructor(private router: Router) { }

  ngOnInit() {

    this.items = [
      {
        label: 'Censo',
        items: [
          {
            label: 'Buscar Colegiados',
            routerLink: '/busquedaColegiados'
          },
          {
            label: 'Buscar No Colegiados',
            routerLink: '/searchNoColegiados'
          },
          {
            label: 'Certificados ACA',
            routerLink: '/certificadosAca'
          },
          {
            label: 'Comisiones y Cargos',
            routerLink: '/comisionesCargos'
          },

          {
            label: 'Ficha colegial',
            routerLink: '/fichaColegial'
          },
          {
            label: 'Solicitudes Modificación',
            items: [
              {
                label: 'Solicitudes Genéricas',
                routerLink: '/solicitudesGenericas'
              },
              {
                label: 'Solicitudes Específicas',
                routerLink: '/solicitudesEspecificas'
              },
            ]
          },
          {
            label: 'Solicitudes Incorporación',
            routerLink: '/solicitudesIncorporacion'
          },
          {
            label: 'Nueva incorporación',
            routerLink: '/nuevaIncorporacion'
          },
          {
            label: 'Busqueda Sanciones',
            routerLink: '/busquedaSanciones'
          },
          {
            label: 'Maestros y Mantenimientos',
            items: [
              {
                label: 'Documentación Solicitudes',
                routerLink: '/documentacionSolicitudes'
              },
              {
                label: 'Mantenimiento Grupos Fijos',
                routerLink: '/mantenimientoGruposFijos'
              },
              {
                label: 'Mantenimiento Mandatos',
                routerLink: '/mantenimientoMandatos'
              }
            ]
          },
          //{ separator: true },
        ]
      },
      {
        label: 'Certificados',
        items: [
          { label: 'Censo' },
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
            label: 'Gestión Catálogos Maestros',
            routerLink: '/catalogosMaestros'
          },
          {
            label: 'Seleccionar Idioma',
            routerLink: '/seleccionarIdioma'
          },
          {
            label: 'Gestión Multiidioma',
            items: [
              {
                label: 'Etiquetas',
                routerLink: '/etiquetas'
              },
              {
                label: 'Catálogos Maestros',
                routerLink: '/catalogosMaestros'
              }
            ]
          },
          {
            label: 'Gestión Usuarios y Grupos',
            items: [
              {
                label: 'Usuarios',
                routerLink: '/usuarios'
              },
              {
                label: 'Grupos de Usuarios',
                routerLink: '/gruposUsuarios'
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


  onCloseMenu() {
    this.closeMenu = !this.closeMenu;
  }

  onOpenMenu() {
    this.closeMenu = false;
  }


  isRoute(ruta) {
    var currentRoute = this.router.url;

    this.encontrado = false;
    if (currentRoute.indexOf(ruta) != -1) {
      this.encontrado = true;
    }
    return (currentRoute === ruta || this.encontrado);
  }

  navigateTo(ruta) {
    this.router.navigate([ruta]);
    console.log(ruta)

  }

  viewChild(e, i) {
    if (e) {
      this.showChild = true;
      this.selectedItem = e;
      this.selectedLabel = i;
    }

  }

  viewChildOfChild(e, i) {
    if (e) {
      this.showChildOfChild = true;
      this.selectedItemOfChild = e;
      this.selectedLabelOfChild = i;
    }

  }

  backMenu() {
    this.showChild = false;
  }

  backMenuChild() {
    this.showChildOfChild = false;
  }

}
