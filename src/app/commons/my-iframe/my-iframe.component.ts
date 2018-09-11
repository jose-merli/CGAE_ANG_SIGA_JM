import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Input } from "@angular/core";
import { OldSigaServices } from "../../_services/oldSiga.service";
import { Pipe, PipeTransform } from "@angular/core";
import { SigaServices } from "../../_services/siga.service";
// import '../../../../SIGA.js'

declare var ajusteAlto: any;

@Component({
  selector: "app-my-iframe",
  templateUrl: "./my-iframe.component.html",
  styleUrls: ["./my-iframe.component.scss"]
})
@Pipe({ name: "safe" })
export class MyIframeComponent implements OnInit {
  @Input()
  url;
  // @ViewChild('iframe') iframe: ElementRef;

  // loading = true;
  cerrojo: boolean = true;
  @ViewChild("test")
  test: ElementRef;
  constructor(
    private domSanitizer: DomSanitizer,
    private service: OldSigaServices,
    private renderer: Renderer2,
    private sigaServices: SigaServices
  ) {}

  // transform(url: string) {
  //   return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  // }
  ngOnInit() {
    //this.renderer.removeClass();
    this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(this.url);

    if (
      String(this.url).includes("Dispatcher.do") &&
      sessionStorage.getItem("cerrojoDispatcher") === "true"
    ) {
      window.location.reload();
      console.log("refresca iframe");
      this.cerrojo = false;
      sessionStorage.setItem("cerrojoDispatcher", "false");
    }

    this.sigaServices.iframeRemove$.subscribe(() => {
      this.cerrojo = true;
      sessionStorage.setItem("cerrojoDispatcher", "true");
    });

    //this.test.nativeElement.remove();

    // const child = document.createElement('div');
    // this.renderer.appendChild(this.elementRef.nativeElement, child);

    //this.test.nativeElement.

    //ajusteAlto('mainWorkArea');
    // this.service.get(this.url).subscribe(blob => {
    //   // this.loading = false;
    //   this.iframe.nativeElement.src = blob;
    // });
  }
}

