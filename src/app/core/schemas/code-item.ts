export class CodeItem {
    constructor(public id: string, public text_ko: string, public text_en: string, public sequence_number: number) {
        this.id = id
        this.text_ko = text_ko
        this.text_en = text_en
        this.sequence_number = sequence_number
    }
}
