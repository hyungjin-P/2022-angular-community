import {Component, OnInit} from '@angular/core'

interface SampleTopic {
  id: string;
  nameKo: string;
  nameEn: string;
  sort: number;
}

const sampleTopic: SampleTopic[] = [
  {id: '1', nameKo: '액션피규어', nameEn: 'Action Figure', sort: 0},
  {id: '2', nameKo: '레진', nameEn: 'Resin', sort: 0},
  {id: '3', nameKo: '스테츄', nameEn: 'Statue', sort: 0},
  {id: '4', nameKo: '샘플1', nameEn: 'Sample1', sort: 0},
  {id: '5', nameKo: '샘플2', nameEn: 'Sample2', sort: 0},
  {id: '6', nameKo: '샘플3', nameEn: 'Sample3', sort: 0},
  {id: '7', nameKo: '샘플4', nameEn: 'Sample4', sort: 0},
  {id: '8', nameKo: '샘플5', nameEn: 'Sample5', sort: 0},
  {id: '9', nameKo: '샘플6', nameEn: 'Sample6', sort: 0},
  {id: '10', nameKo: '샘플7', nameEn: 'Sample7', sort: 0},
  {id: '11', nameKo: '샘플8', nameEn: 'Sample8', sort: 0},
  {id: '12', nameKo: '샘플9', nameEn: 'Sample9', sort: 0},
  {id: '13', nameKo: '샘플10', nameEn: 'Sample10', sort: 0},
  {id: '14', nameKo: '샘플11', nameEn: 'Sample11', sort: 0},
  {id: '15', nameKo: '샘플12', nameEn: 'Sample12', sort: 0},
  {id: '16', nameKo: '샘플13', nameEn: 'Sample13', sort: 0},
  {id: '17', nameKo: '샘플14', nameEn: 'Sample14', sort: 0},
  {id: '18', nameKo: '샘플15', nameEn: 'Sample15', sort: 0},
  {id: '19', nameKo: '샘플16', nameEn: 'Sample16', sort: 0},
  {id: '20', nameKo: '샘플17', nameEn: 'Sample17', sort: 0},
];

@Component({
  selector: 'button_',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {

  topics: any[];

  constructor() {
  }

  ngOnInit() {
    this.topics = sampleTopic;
  }

  getChooseTopic(topic: any): void {
    console.log('topic : ', topic);
  }

  getChooseOptions(option: any): void {
    console.log('choose option : ', option);
  }

}
