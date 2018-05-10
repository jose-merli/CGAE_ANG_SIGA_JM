import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SigaServices } from "../../_services/siga.service";

import { HeaderLogoDto } from "../../models/HeaderLogoDto";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  menuUser: any = [];
  menuHide: boolean;
  logoImagen: HeaderLogoDto = new HeaderLogoDto();

  constructor(private router: Router, private sigaServices: SigaServices) {}

  ngOnInit() {
    this.menuHide = true;

    this.sigaServices.get("usuario_logeado").subscribe(n => {
      this.menuUser = n.usuarioLogeadoItem;
    });
    /*this.menuUser = [
      {
        nombre: 'Usuario1',
        dni: '92938293',
        grupo: '',
        institucion: 'Consejo General de la Abogacía Española',
        idioma: 'Español',
        ultimaConex: '16:30 | 22/02/2018'
      },

    ]*/
  }

  isMenuVisible() {
    this.menuHide = !this.menuHide;
  }

  logout() {
    sessionStorage.removeItem("authenticated");
    this.router.navigate(["/login"]);
  }

  probarLogo() {
    this.sigaServices.get("header_logo").subscribe(
      n => {
        this.logoImagen.imagen = n.imagen;
        //const base64String = btoa(String.fromCharCode(new Uint8Array(this.logoImagen.imagen)));
      },
      err => {
        console.log(err);
      }
    );
  }
}
