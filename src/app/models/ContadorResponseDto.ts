import { ContadorItem } from "./ContadorItem";
export class ContadorResponseDto {
  error: String;
  contadorItems: ContadorItem[] = [];
  constructor() {}
}
