import { TranslateService } from '../translate/translation.service';
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
  showChild: boolean = false;
  selectedItem: any;
  selectedLabel: any;
  showChildOfChild: boolean = false;
  selectedItemOfChild: any;
  selectedLabelOfChild: any;
  encontrado: boolean;

  constructor(private router: Router, private sigaServices: SigaServices, private translateService: TranslateService) {


  }

  // TODO: Revisar si tiene sentido que las rutas las devuelva el back 
  //o revisar si se pude instanciar el router de forma dinámica al arrancar el angular
  ngOnInit() {
    this.sigaServices.get("menu").subscribe(response => {
      this.items = response.menuItems;
      return this.items;


    });




  }


  onCloseMenu() {
    this.closeMenu = !this.closeMenu;
    console.log(this.items)
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
