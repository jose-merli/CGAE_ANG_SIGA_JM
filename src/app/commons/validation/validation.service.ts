import { Injectable } from "@angular/core";

@Injectable()
export class ValidationService {
  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  isValidDNI(dni: string): boolean {
    return (
      dni &&
      typeof dni === "string" &&
      /^[0-9]{8}([A-Za-z]{1})$/.test(dni) &&
      dni.substr(8, 9).toUpperCase() ===
      this.DNI_LETTERS.charAt(parseInt(dni.substr(0, 8), 10) % 23)
    );
  }
}
