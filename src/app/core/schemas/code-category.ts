import { CodeItem } from './code-item'

export class CodeCategory {
    constructor(
        public id: string,
        public text_ko: string,
        public text_en: string,
        public sequence_number: number,
        public items: Array<CodeItem>
    ) {
        this.id = id
        this.text_ko = text_ko
        this.text_en = text_en
        this.sequence_number = sequence_number
        this.items = items
    }
}
