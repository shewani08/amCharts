import { Component } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { CsvService } from '../service/CsvService';
interface MigrationData{
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
  styleUrls: ['./migrant-detail.component.css'],
 
})
export class MigrantDetailComponent {
  panelOpenState = true;
  jsonData: any;
  totalApplications: number = 0;
  constructor(private dataService: CsvService){
   
  }
ngOnInit(){
  
  this.dataService?.getIrregularMigration()?.subscribe((migrationData) => {
 
    this.jsonData = this.csvToJson<MigrationData>(migrationData);
     console.log('migrationData>>>>', this.jsonData );
     for (const entry of this.jsonData) {
      console.log('entry',entry.Applications);
      // Convert the "Applications" value to a number and add it to the total
      this.totalApplications = parseInt(this.totalApplications + entry.Applications,10);
  }
  this.detailedData();
  })
 
  
}
onPanelStateChange(isOpen: boolean): void {
  alert('testing');
  this.panelOpenState = isOpen;
}
detailedData(){
  console.log('this.totalApplications>>>>',this.totalApplications);
}
openPanel(){
  this.panelOpenState = true;
}
closePanel(){
  this. panelOpenState = false;
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
