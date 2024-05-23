import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Pipe, PipeTransform } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";

@Pipe({ name: "image" })
export class ImagePipe implements PipeTransform {
  constructor(private http: HttpClient) {}

  transform(url: string): Observable<Blob> {
    return (
      this.http
        .get(url, {
          headers: new HttpHeaders({
            Authorization: sessionStorage.getItem("Authorization"),
            "Content-Type": "image/jpg",
          }),
          responseType: "blob",
        }) // specify that response should be treated as blob data
        //.map(response => response) // take the blob
        .switchMap((blob) => {
          //return new observable which emits a base64 string when blob is converted to base64
          return Observable.create((observer) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob); // convert blob to base64
            reader.onloadend = function () {
              observer.next(reader.result); // emit the base64 string result
            };
          });
        })
    );
  }
}
