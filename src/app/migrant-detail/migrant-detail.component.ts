import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CsvService } from '../service/CsvService';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PreviousEvntService } from '../service/previousEvent';
import { DataService } from '../service/dataService';
import { any } from '@amcharts/amcharts5/.internal/core/util/Array';
import { MatDialog } from '@angular/material/dialog';
import { MigrantDialogComponent } from '../migrant-dialog/migrant-dialog.component';
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
  totalApplications: any = 0;
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
  total: number = 0;
  migrantData: any[]=[];
  totalMigrant: number = 0;
  totalMig: string = '';
  rcpData$: any;
  rcpSubscription: any;
  rcpData: any;
 

 constructor(private dataService: CsvService,  private mapdataService: DataService,private cdr: ChangeDetectorRef,
  private dialog: MatDialog) {}
  selectedYear= '2030';
  predicatedVal=97079;

  ngOnInit() {
    this.dataService.getCropYieldData().subscribe((rcp) => {
      this.regionData = this.csvToJson<RegionData>(rcp);
    });

    this.rcpData$ = this.mapdataService.setRCP$;
    this.rcpSubscription = this.rcpData$.subscribe((data: any) => {
      this.rcpData = data;
      this.cdr.detectChanges();

    });
  
    this.dataService?.getIrregularMigration()?.subscribe((migrationData) => {
      this.jsonData = this.csvToJson<MigrationData>(migrationData);
      for (const entry of this.jsonData) {
        this.total = parseInt(this.totalApplications + entry.Applications, 10);
        this.totalApplications = this.total;
      }
    //  this.findTop3Applications();
      this.prevData = this.previousData;
    });
  
    this.mapData$ = this.mapdataService.mapData$;
    this.subscription = this.mapData$.subscribe((data: any) => {
      this.mapData = data;
      if (this.mapData && this.regionData) {
        this.selectedCountry = this.mapData.dataContext.name;
        this.regionArray = this.getRegion(this.regionData, this.selectedCountry);
      }
    });
  
    this.dataService.getMigrantData().subscribe((rcp) => {
      this.migrantData = this.csvToJson(rcp);
      console.log('this.migrantData',this.migrantData);
      this.total = 0; // Reset total before calculating again
      for (const entry of this.migrantData) {
        const parsedValue = parseInt(entry.total_irregular_migrants, 10);
        if (!isNaN(parsedValue)) {
          this.total += parsedValue;
         
        }
        this.totalMig =this.addCommasToNumber(this.total);
      }
      this.findTop3Applications();
      console.log('this.total', this.total);
    });
  }
  getRegion(data: any, country: any) {
    const result = data
      .filter((entry: { Country: any; }) => entry.Country === country)
      .map((entry: { region_name: any; }) => entry.region_name);
    const uniqueRegions = [...new Set(result)];
 
    return uniqueRegions.length > 0 ? uniqueRegions : 'Country not found';
  }

   addCommasToNumber(number:number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
 
  findTop3Applications(): void {
    console.log('MD', this.migrantData);
    this.migrantData.sort((a: any, b: any) => b.total_irregular_migrants - a.total_irregular_migrants);
    console.log('MD',  this.migrantData);
    this.topCountries = this.migrantData.slice(0, 5);
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
    this.summaryPanelOpenState = false; 
    this.regionPanelOpenState = false;
  }

  onMigrationPanelClosed() {
    
  }

  onSummaryPanelOpened() {
    this.migrationPanelOpenState = false;
    this.summaryPanelOpenState = true;
    this.regionPanelOpenState = false; 
  }

  onSummaryPanelClosed() {
 
  }

  onRegionPanelOpened() {
    this.migrationPanelOpenState = false;
    this.summaryPanelOpenState = false;
    this.regionPanelOpenState = true;
  }

  onRegionPanelClosed() {
  
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

  openDialog(): void {
    console.log('opendialog');
    const dialogRef = this.dialog.open(MigrantDialogComponent,{
      data: this.migrantData,
      width: '800px', 
      height: '400px', 
    });
}
  onYearSelected(e:any){
    console.log('value of e is',e);
    if(e.value === '2050')
    this.predicatedVal=79806;
  }}
