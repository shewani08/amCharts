import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CsvService } from '../service/CsvService';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PreviousEvntService } from '../service/previousEvent';
import { DataService } from '../service/dataService';
import { any } from '@amcharts/amcharts5/.internal/core/util/Array';
interface MigrationData {
  Year: number;
  Country: string;
  Region: string;
  Sex: string;
  Age_Group: string;
  Applications: number;
}

interface RegionData {
  x: number;
  y: string;
  Country: string;
  region_name: string;
  SSP1_1p5_Score: number;
  SSP1_2p0_Score: number;
  SSP1_3p0_Score:number

}
interface Region {
  name: string;
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
  previousData$: any;
  prevsubscription: any;
  mapData$: any;
  subscription: any;
  mapData: any;
  selectedCountry: any;
  regionData: RegionData[]=[];
  regionArray: string | unknown[] | undefined;
 

 constructor(private dataService: CsvService,  private mapdataService: DataService,private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.dataService.getCropYieldData().subscribe((rcp) => {
      this.regionData = this.csvToJson<RegionData>(rcp);
    });
    this.dataService?.getIrregularMigration()?.subscribe((migrationData) => {
      this.jsonData = this.csvToJson<MigrationData>(migrationData);
      for (const entry of this.jsonData) {
        this.totalApplications = parseInt(this.totalApplications + entry.Applications, 10);
      }
      this.findTop3Applications();
      this.prevData = this.previousData;

    })

    this.mapData$ = this.mapdataService.mapData$;
    this.subscription = this.mapData$.subscribe((data: any) => {
      this.mapData = data;
      if (this.mapData && this.regionData) {
          this.selectedCountry = this.mapData.dataContext.name;
          this.regionArray=this.getRegion(this.regionData, this.selectedCountry);
          console.log('regionResult',this.regionArray);
      }
   });
  }

  getRegion(data: any, country: any) {
    const result = data
      .filter((entry: { Country: any; }) => entry.Country === country)
      .map((entry: { region_name: any; }) => entry.region_name);
    const uniqueRegions = [...new Set(result)];
 
    return uniqueRegions.length > 0 ? uniqueRegions : 'Country not found';
  }

 
  findTop3Applications(): void {
    this.jsonData.sort((a: any, b: any) => b.Applications - a.Applications);
    this.topCountries = this.jsonData.slice(0, 3);
  }
  onPanelStateChange(isOpen: boolean): void {
    this.panelOpenState = isOpen;
  }

  openPanel() {
    this.panelOpenState = true;
  }
  closePanel() {
    this.panelOpenState = false;
  }
  
  migrationPanelOpenState = false;
  summaryPanelOpenState = false;
  regionPanelOpenState = false;

  onMigrationPanelOpened() {
    this.migrationPanelOpenState = true;
    this.summaryPanelOpenState = false; // Close other panels if needed
    this.regionPanelOpenState = false;
  }

  onMigrationPanelClosed() {
    // Handle any actions when the Migration panel is closed
  }

  onSummaryPanelOpened() {
    this.migrationPanelOpenState = false;
    this.summaryPanelOpenState = true;
    this.regionPanelOpenState = false; // Close other panels if needed
  }

  onSummaryPanelClosed() {
    // Handle any actions when the Summary panel is closed
  }

  onRegionPanelOpened() {
    this.migrationPanelOpenState = false;
    this.summaryPanelOpenState = false;
    this.regionPanelOpenState = true;
  }

  onRegionPanelClosed() {
    // Handle any actions when the Region panel is closed
  }
  private rcpToJson<T>(data: string): T[] {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const result: T[] = [];
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
        const key = headers[j].trim() as keyof RegionData;
        const value = currentLine[j] ? currentLine[j].trim() : '';
        obj[key] = value;
      }
      result.push(obj as T);
    }
    return result;

  }
  private csvToJson<T>(csvData: string): T[] {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const result: T[] = [];
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
        const key = headers[j].trim() as keyof RegionData;
        const value = currentLine[j] ? currentLine[j].trim() : '';
        obj[key] = value;
      }
      result.push(obj as T);
    }
    return result;
  }


}
