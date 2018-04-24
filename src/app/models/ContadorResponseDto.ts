import { ContadorItem } from "./ContadorItem";
export class ContadorResponseDto {
  error: String;
  contadorItem: ContadorItem[] = [];
  constructor() {}
}
