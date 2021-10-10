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
  ) {

  }

  ngOnInit() {
    this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(this.url);

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
