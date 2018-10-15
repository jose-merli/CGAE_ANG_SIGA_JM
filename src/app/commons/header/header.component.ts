import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SigaServices } from "../../_services/siga.service";

// prueba
import { HeaderGestionEntidadService } from "../../_services/headerGestionEntidad.service";
import { ImagePipe } from "../image-pipe/image.pipe";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  menuUser: any = [];
  menuHide: boolean;

  imagenURL: any;

  constructor(
    private router: Router,
    private sigaServices: SigaServices,
    private headerGestionEntidadService: HeaderGestionEntidadService,
    private imagePipe: ImagePipe
  ) {
    this.headerGestionEntidadService.url$.subscribe(data => {
      this.imagenURL = data;
    });
  }

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

    window.location.href =
      "http://demo.redabogacia.org/pra/accesoSeleccionaColegio/";
    // this.router.navigate(["/"]).then(result => {
    //   window.location.href =
    //     "http://demo.redabogacia.org/pra/accesoSeleccionaColegio/";
    // });
  }

  navigateTo() {
    this.router.navigate(["/login"]);
  }
}
