import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SigaServices } from '../../_services/siga.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {

  items: MenuItem[];
  closeMenu: boolean = false;

  constructor(private router: Router, private sigaServices: SigaServices) {


  }

  // TODO: Revisar si tiene sentido que las rutas las devuelva el back 
  //o revisar si se pude instanciar el router de forma dinámica al arrancar el angular
  ngOnInit() {
    this.sigaServices.get("menu").subscribe(response => {
      this.items = response.get("menuItems");
      return this.items;
    });


  }


  onCloseMenu() {
    this.closeMenu = !this.closeMenu;
  }

  onOpenMenu() {
    this.closeMenu = false;
  }


  isRoute(ruta) {
    var currentRoute = this.router.url;
    return (currentRoute === ruta);
  }

  navigateTo(ruta) {
    this.router.navigate([ruta]);
  }



}
