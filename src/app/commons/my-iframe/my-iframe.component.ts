import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Input } from "@angular/core";
import { OldSigaServices } from "../../_services/oldSiga.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
// import '../../../../SIGA.js'

declare var ajusteAlto: any;

@Component({
  selector: "app-my-iframe",
  templateUrl: "./my-iframe.component.html",
  styleUrls: ["./my-iframe.component.scss"]
})
export class MyIframeComponent implements OnInit, AfterViewInit {
  @Input() url;
  postId: any;
  // @ViewChild('iframe') iframe: ElementRef;

  // loading = true;

  constructor(
    private domSanitizer: DomSanitizer,
    private service: OldSigaServices,
    private http: HttpClient
  ) {}

  ngOnInit() {
    //this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(this.url);

    this.url = 'https://sigades.redabogacia.org/SIGA/EXP_Auditoria_DatosGenerales.do';
    console.log('url: '+this.url);

    this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(this.url);

    console.log('url before sanitazer: '+this.url);

    let headers = new HttpHeaders({
			'X-UA-Compatible': 'IE=EmulateIE7'
		});

    console.log('header: '+ headers)
    let params = new URLSearchParams()
    params.append('soloSeguimiento', 'false')
    params.append('editable', '1')
    params.append('metodo', 'abrirNuevoEjg')
    params.append('numeroEjg', '80')
    params.append('numEjgDisciplinario', '20120')
    params.append('idTipoEjg', '3')
    params.append('anioEjg', '2021')
    params.append('idInstitucion_TipoExpediente', '2005')
    params.append('procedimiento', '1231')
    params.append('juzgado', '114')
    params.append('pretension', '128')
    params.append('pretensionInstitucion', '2005')
    params.append('idturnoDesignado', '2005001421')
    params.append('idclasificacion', '1')

    let body = params.toString()
    console.log('body: '+body)

    this.http.post<any>(this.url, body, { headers }).subscribe(data => {
        this.postId = data.id;
    });

    //ajusteAlto('mainWorkArea');
    // this.service.get(this.url).subscribe(blob => {
    //   // this.loading = false;
    //   this.iframe.nativeElement.src = blob;
    // });
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }
}
