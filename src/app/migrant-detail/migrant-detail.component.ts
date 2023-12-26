import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CsvService } from '../service/CsvService';
import { animate, state, style, transition, trigger } from '@angular/animations';
interface MigrationData {
  Year: number;
  Country: string;
  Region: string;
  Sex: string;
  Age_Group: string;
  Applications: number;
}

@Component({
  selector: 'app-migrant-detail',
  templateUrl: './migrant-detail.component.html',
  styleUrls: ['./migrant-detail.component.css']
  

})
export class MigrantDetailComponent {
  panelOpenState = true;
  jsonData: any;
  @Input() dataItem: any;
  @Input() previousData:any;
  totalApplications: number = 0;
  displayedColumns: string[] = ['Overall', 'Predication', 'Countries'];
  dataSource = [
    {}
  ];
  topCountries: any;
  prevData: any;

  constructor(private dataService: CsvService) {

  }
  ngOnInit() {
    this.dataService?.getIrregularMigration()?.subscribe((migrationData) => {
      this.jsonData = this.csvToJson<MigrationData>(migrationData);
      for (const entry of this.jsonData) {
        this.totalApplications = parseInt(this.totalApplications + entry.Applications, 10);
      }
      this.findTop3Applications();
      this.prevData=this.previousData;

    })


  }
  findTop3Applications(): void {
    this.jsonData.sort((a: any, b: any) => b.Applications - a.Applications);
    this.topCountries = this.jsonData.slice(0, 3);
    console.log('topCountries', this.topCountries);
  }
  onPanelStateChange(isOpen: boolean): void {
    alert('testing');
    this.panelOpenState = isOpen;
  }

  openPanel() {
    this.panelOpenState = true;
  }
  closePanel() {
    this.panelOpenState = false;
  }
  private csvToJson<T>(csvData: string): T[] {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const result: T[] = [];
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
        const key = headers[j].trim() as keyof MigrationData;
        const value = currentLine[j] ? currentLine[j].trim() : '';
        obj[key] = value;
      }
      result.push(obj as T);
    }
    // console.log('result is',result);
    return result;
  }

}
