import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SigaServices } from "../../_services/siga.service";
import { TranslateService } from "../translate/translation.service";
import { Location } from "@angular/common";

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
  showIdioma: boolean = false;
  imagenURL: any;
  httpExit: string;
  comboIdiomas: any[];
  idiomaSelected: any;
  constructor(
    private router: Router,
    private sigaServices: SigaServices,
    private headerGestionEntidadService: HeaderGestionEntidadService,
    private imagePipe: ImagePipe,
    private translateService: TranslateService,
    private location: Location
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

    this.sigaServices.get("etiquetas_lenguajeFiltrado").subscribe(
      n => {
        this.comboIdiomas = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );

    this.sigaServices.get("recuperarApiKey").subscribe(n => {
      sessionStorage.setItem("tinyApiKey", n.data);
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

    //this.sigaServices.get("ruta_logout").subscribe(n => {
    sessionStorage.removeItem("authenticated");

    if (sessionStorage.getItem('loginDevelop') === 'true') {
      sessionStorage.setItem('loginDevelop', '0');
    }
    
    let tipoLogin = sessionStorage.getItem('tipoLogin');

    if(tipoLogin==="loginDevelop" || tipoLogin==="login"){
      this.sigaServices.get("eliminaCookie").subscribe(response => {
        let responseStatus = response[0].status;
        if (responseStatus == 200) {
          //console.log("Cookies eliminadas para cerrar la sesión");
        }
      });
      this.httpExit = this.menuUser[0].rutaLogoutCAS;
      window.location.href = this.httpExit;
    }else{
      //this.httpExit = this.menuUser[0].rutaLogout;
      this.router.navigate(["/logout"]);
    }
      //window.location.href = this.httpExit;
  }

  navigateTo() {
    this.router.navigate(["/home"]);
    // this.router.navigate(["/login"]);
  }

  mostrarPopUpIdioma() {

    this.showIdioma = true;
  }
  cancelar() {
    this.showIdioma = false;
  }

  idiomaChange(event) {
    if (event != null) {
      this.idiomaSelected = event.value.value;
    }

  }
  cambiarIdioma() {

    this.sigaServices.post("usuario_cambioIdioma", this.idiomaSelected).subscribe(result => {
      this.showIdioma = false;

      this.sigaServices.get("usuario_logeado").subscribe(n => {
        this.menuUser = n.usuarioLogeadoItem;
      });

      this.translateService.use(this.idiomaSelected);

    }, error => {
      //console.log(error);
    });
    this.showIdioma = false;
    this.translateService.use(this.idiomaSelected);

  }
  disableGuardar(): boolean {
    if (this.idiomaSelected != null && this.idiomaSelected != "") {
      return false;
    } else {
      return true;
    }
  }

}
