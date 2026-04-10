export class PixPayload {
  chave: string;
  nome: string;
  cidade: string;
  txtId: string;
  valor: string | null;

  constructor(chave: string, nome: string, cidade: string, txtId = "***", valor: number | null = null) {
    this.chave = String(chave);
    this.nome = String(nome).substring(0, 25);
    this.cidade = String(cidade).substring(0, 15);
    this.txtId = String(txtId).substring(0, 25);
    this.valor = valor && !isNaN(valor) ? Number(valor).toFixed(2) : null;
  }

  getPayload(): string {
    const payload = [
      this.genEMV("00", "01"),
      this.genEMV("26", this.genEMV("00", "BR.GOV.BCB.PIX") + this.genEMV("01", this.chave)),
      this.genEMV("52", "0000"),
      this.genEMV("53", "986"),
      this.valor ? this.genEMV("54", this.valor) : "",
      this.genEMV("58", "BR"),
      this.genEMV("59", this.nome),
      this.genEMV("60", this.cidade),
      this.genEMV("62", this.genEMV("05", this.txtId)),
    ].join("");

    return payload + this.genCRC16(payload);
  }

  private genEMV(id: string, param: string): string {
    const val = String(param);
    return `${id}${val.length.toString().padStart(2, "0")}${val}`;
  }

  private genCRC16(payload: string): string {
    const data = `${payload}6304`;
    let res = 0xffff;

    for (let i = 0; i < data.length; i++) {
      res ^= data.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        res = res & 0x8000 ? (res << 1) ^ 0x1021 : res << 1;
      }
    }

    return `6304${(res & 0xffff).toString(16).toUpperCase().padStart(4, "0")}`;
  }
}