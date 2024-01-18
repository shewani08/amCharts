import { Component, OnInit, OnDestroy, Inject, Input, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { any } from '@amcharts/amcharts5/.internal/core/util/Array';
import { DataService } from 'src/app/service/dataService';
import { YearService } from 'src/app/service/yearService';
import { PreviousEvntService } from 'src/app/service/previousEvent';
import { MigrantYear2030Service } from 'src/app/service/MigrantYearService2030';
import { MigrantYear2050Service } from 'src/app/service/MigrantYearService2050';

interface CsvData {
  id: string;
  Continent: string;
  Country: string;
  value: string;
  total_irregular_migrants: string;
  Proportion: number;
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnChanges {
 
  selectedYear=''
  chart: any;
  dataSource: CsvData[] = [];
  displayedColumns: string[] = [

    'Country',
    'Number_of_immigrants',
    'Proportion', 'Year'];
 

  mapData: any;
  subscription: any;
  mapData$: any;
  previousData$:any;
  selectedCar: number | undefined;
  prevsubscription: any;
  prevData: any;
  rcpData$: any;
  rcpSubscription: any;
  rcpData: any;
  waterYear2030Migrant: any;
  droughtYear2030Migrant: any;
  cropYear2030Migrant: any;
  heatYear2030Migrant: any;
  waterYearSSP2Migrant: any;
  heatYearSSP2Migrant: any;
  cropYearSSP2Migrant: any;
  droughtYearSSP2Migrant: any;
  waterYearSSP3Migrant: any;
  heatYearSSP3Migrant: any;
  droughtYearSSP3Migrant: any;
  cropYearSSP3Migrant: any;
  waterYear2050Migrant: any;
  droughtYear2050Migrant: any;
  cropYear2050Migrant: any;
  heatYear2050Migrant: any;
  waterYear2050SSP2Migrant: any;
  heatYear2050SSP2Migrant: any;
  cropYear2050SSP2Migrant: any;
  droughtYear2050SSP2Migrant: any;
  waterYear2050SSP3Migrant: any;
  heatYear2050SSP3Migrant: any;
  droughtYear2050SSP3Migrant: any;
  cropYear2050SSP3Migrant: any;
  selectedRcpValue: any='';
  cropYieldYear2030Migrant: any;
  indicatorData$: any;
  indicatorsubscription: any;
  indicatorData: any;
  id: any;
  Continent: any;
  Country: any;
  value: any;
  total_irregular_migrants: any;
  Proportion: any;



  constructor(private cdr: ChangeDetectorRef, private dataService: DataService,private yearService: YearService,
    private previousEvntService:PreviousEvntService,private migrantYear2030Service:MigrantYear2030Service,private migrantYear2050Service:MigrantYear2050Service) {
      this.migrantYear2030Service.getWaterStress().subscribe((rcp: any) => {
        this.waterYear2030Migrant = this.rcpToJson(rcp);
      
      // 2030 Year Data 
    this.migrantYear2030Service.getWaterStress().subscribe((rcp: any) => {
      this.waterYear2030Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2030Service.getDroughtMigrantData().subscribe((rcp: any) => {
      this.droughtYear2030Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2030Service.getCropYieldMigrantData().subscribe((rcp: any) => {
      this.cropYear2030Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2030Service.getHeatMigrantData().subscribe((rcp: any) => {
      this.heatYear2030Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2030Service.getWaterStressSSP2().subscribe((rcp: any) => {
      this.waterYearSSP2Migrant = this.rcpToJson(rcp);
      
    })
    this.migrantYear2030Service.getHeatMigrantDataSSP2().subscribe((rcp: any) => {
      this.heatYearSSP2Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2030Service.getCropYieldMigrantDataSSP2().subscribe((rcp: any) => {
      this.cropYearSSP2Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2030Service.getDroughtMigrantDataSSP2().subscribe((rcp: any) => {
      this.droughtYearSSP2Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2030Service.getWaterStressSSP3().subscribe((rcp: any) => {
      this.waterYearSSP3Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2030Service.getHeatMigrantDataSSP3().subscribe((rcp: any) => {
      this.heatYearSSP3Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2030Service.getDroughtMigrantDataSSP3().subscribe((rcp: any) => {
      this.droughtYearSSP3Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2030Service.getCropYieldMigrantDataSSp3().subscribe((rcp: any) => {
      this.cropYearSSP3Migrant = this.rcpToJson(rcp);
    })
    // Year 2050 Service
    this.migrantYear2050Service.getWaterStress().subscribe((rcp: any) => {
      this.waterYear2050Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2050Service.getDroughtMigrantData().subscribe((rcp: any) => {
      this.droughtYear2050Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2050Service.getCropYieldMigrantData().subscribe((rcp: any) => {
      this.cropYear2050Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2050Service.getHeatMigrantData().subscribe((rcp: any) => {
      this.heatYear2050Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2050Service.getWaterStressSSP2().subscribe((rcp: any) => {
      this.waterYear2050SSP2Migrant = this.rcpToJson(rcp);
      
    })
    this.migrantYear2050Service.getHeatMigrantDataSSP2().subscribe((rcp: any) => {
      this.heatYear2050SSP2Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2050Service.getCropYieldMigrantDataSSP2().subscribe((rcp: any) => {
      this.cropYear2050SSP2Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2050Service.getDroughtMigrantDataSSP2().subscribe((rcp: any) => {
      this.droughtYear2050SSP2Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2050Service.getWaterStressSSP3().subscribe((rcp: any) => {
      this.waterYear2050SSP3Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2050Service.getHeatMigrantDataSSP3().subscribe((rcp: any) => {
      this.heatYear2050SSP3Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2050Service.getDroughtMigrantDataSSP3().subscribe((rcp: any) => {
      this.droughtYear2050SSP3Migrant = this.rcpToJson(rcp);
    })
    this.migrantYear2050Service.getCropYieldMigrantDataSSp3().subscribe((rcp: any) => {
      this.cropYear2050SSP3Migrant = this.rcpToJson(rcp);
    })
      
      })

  }
  
  ngOnChanges(changes: SimpleChanges): void {
  }
  private rcpToJson<T>(data: string): T[] {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const result: T[] = [];
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
                const key = headers[j].trim() as keyof CsvData;
        const value = currentLine[j] ? currentLine[j].trim() : '';
        obj[key] = value;
      }
      result.push(obj as T);
    }
    return result;
  
  }

  ngOnInit() {

    this.selectedYear='';
    console.log('init',this.selectedYear);
    this.initializeChart();
    this.mapData$ = this.dataService.mapData$;
    this.subscription = this.mapData$.subscribe((data: any) => {
      this.mapData = data;
      if (this.mapData) {
        setTimeout(() => {
          this.reloadData(this.mapData);
        }, 200);
      }
    });

    this.rcpData$ = this.dataService.setRCP$;
    this.rcpSubscription = this.rcpData$.subscribe((data: any) => {
      this.rcpData = data;
      this.cdr.detectChanges();

    });

    this.indicatorData$ = this.dataService.setIndicator$;
    this.indicatorsubscription = this.indicatorData$.subscribe((data: any) => {
      this.indicatorData = data;
      this.cdr.detectChanges();

    });
    this.previousData$ = this.previousEvntService.previousEvent$;
    this.prevsubscription = this.previousData$.subscribe((data: any) => {
      if (data) {
        setTimeout(() => {
         // this.reloadPrevData(data);
        }, 200);
      }
    });
   
  }


  
  initializeChart() {
   const chartdiv = document.getElementById('dialog');
    if (chartdiv) {
      const root = am5.Root.new(chartdiv);
      root.setThemes([am5themes_Animated.new(root)]);
      this.chart = root.container.children.push(am5map.MapChart.new(root, {}));

      const polygonSeries = this.chart.series.push(
        am5map.MapPolygonSeries.new(this.chart.root, {
        //  include: this.getMap(),
         // geoJSON: am5geodata_worldLow,
          dx: 50,
          dy: -50
        })
      );
    } else {
      console.error('Chart container element not found!');
    }
    this.chart.set("zoomLevel", 0.8);
    
  }

  getMap() {
    return [this.mapData?.dataContext?.id];
  }

  reloadData(dataItem: any) {
    const include = [dataItem?.dataContext?.id];
    const newGeoJSONData = am5geodata_worldLow;
    if (this.chart)
      this.chart.series.each((series: { set: (arg0: string, arg1: any) => void; }) => {
        if (series instanceof am5map.MapPolygonSeries) {
          series.set("include", this.getMap());
          series.set("geoJSON", newGeoJSONData);
          series.set("dx", 70);
          series.set("dy", -70);
        }
      });
      this.selectedYear = '';
    if (dataItem) {
          this.id = dataItem?.dataContext?.id,
          this.Continent=dataItem?.dataContext?.Continent,
          this.Country= dataItem?.dataContext.name,
          this.value= dataItem?.dataContext.value,
          this.total_irregular_migrants= dataItem?.dataContext.Number_of_immigrants,
          this.Proportion= dataItem?.dataContext.Proportion
      this.dataSource = [
        {
          id: dataItem?.dataContext?.id,
          Continent: dataItem?.dataContext?.Continent,
          Country: dataItem?.dataContext.name,
          value: dataItem?.dataContext.value,
          total_irregular_migrants: dataItem?.dataContext.Number_of_immigrants,
          Proportion: dataItem?.dataContext.Proportion
        }
      ];
    }
  this.cdr.detectChanges();
  }

  reloadPrevData(dataItem:any){
      this.dataSource = [
    {
      id: dataItem.id,
      Continent: dataItem.Continent,
      Country: dataItem.Country,
      value: dataItem.value,
      total_irregular_migrants: dataItem.Number_of_immigrants,
      Proportion: dataItem.Proportion}]
      this.cdr.detectChanges();
      
  }
  onYearSelected(event: any): void {
    const selectedYear = event.value; 
    this.yearService.saveSelectedYear(selectedYear);
    this.dataSource=[];
    this.dataSource.push(this.filterDataByCountryAndYear(this.Country,selectedYear,this.rcpData,this.indicatorData));
    this.cdr.detectChanges();
  }
  filterDataByCountryAndYear(country: any, year: string,rcp:string,indicators:string):any {
    let filteredData:any ={};
    if(rcp=='SSP-1(LOW)' && indicators =='Water index stress (Water)' ){
      if( year == '2030')
      filteredData = this.waterYear2030Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.waterYear2050Migrant.find((entry: { Country: any; }) => entry.Country === country);
    }
   else if(rcp=='SSP-1(LOW)' && indicators =='Drought intensity change (Water)' ){
      if( year == '2030')
      filteredData = this.droughtYear2030Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.droughtYear2050Migrant.find((entry: { Country: any; }) => entry.Country === country);
    }
   
   else if(rcp=='SSP-1(LOW)' && indicators =='Crop yield change (Land)' ){
      if( year == '2030')
      filteredData = this.cropYieldYear2030Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.cropYear2050Migrant.find((entry: { Country: any; }) => entry.Country === country);
    }
 
   else if(rcp=='SSP-1(LOW)' && indicators =='Heat Index Event exposure (Energy)'){
      if( year == '2030')
      filteredData = this.heatYear2030Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.heatYear2050Migrant.find((entry: { Country: any; }) => entry.Country === country);
    }
    
   else if(rcp=='SSP-1(LOW)' && indicators =='Water index stress (Water)' ){
      if( year == '2030')
      filteredData = this.waterYear2030Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.waterYear2050Migrant.find((entry: { Country: any; }) => entry.Country === country);
      
    }
  

   else if(rcp=='SSP-2(MEDIUM)' && indicators =='Water index stress (Water)' ){
      if( year == '2030')
      filteredData = this.waterYearSSP2Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.waterYear2050SSP2Migrant.find((entry: { Country: any; }) => entry.Country === country);
     
    }
   else if(rcp=='SSP-2(MEDIUM)' && indicators =='Drought intensity change (Water)'){
      if( year == '2030')
      filteredData = this.droughtYearSSP2Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.droughtYear2050SSP2Migrant.find((entry: { Country: any; }) => entry.Country === country);
    }
   
   else if(rcp=='SSP-2(MEDIUM)' && indicators =='Crop yield change (Land)'){
      if( year == '2030')
      filteredData = this.cropYearSSP2Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.cropYear2050SSP2Migrant.find((entry: { Country: any; }) => entry.Country === country);
    }
    
   else if(rcp=='SSP-2(MEDIUM)' && indicators =='Heat Index Event exposure (Energy)' ){
      if( year == '2030')
      filteredData = this.heatYearSSP2Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.heatYear2050SSP2Migrant.find((entry: { Country: any; }) => entry.Country === country);
    }
   
   else if(rcp=='SSP-2(MEDIUM))' && indicators =='Water index stress (Water)' ){
      if( year == '2030')
      filteredData = this.waterYearSSP2Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.waterYear2050SSP2Migrant.find((entry: { Country: any; }) => entry.Country === country);
    }

   else if(rcp=='SSP-3(HIGH)' && indicators =='Water index stress (Water)'){
      if( year == '2030')
      filteredData = this.waterYearSSP3Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.waterYear2050SSP3Migrant.find((entry: { Country: any; }) => entry.Country === country);

    }
   else if(rcp=='SSP-3(HIGH)' && indicators =='Drought intensity change (Water)'){
      if( year == '2030')
      filteredData = this.droughtYearSSP3Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.droughtYear2050SSP3Migrant.find((entry: { Country: any; }) => entry.Country === country);
    }
   
   else if(rcp=='SSP-3(HIGH)' && indicators =='Crop yield change (Land)'){
      if( year == '2030')
      filteredData = this.cropYearSSP3Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.cropYear2050SSP3Migrant.find((entry: { Country: any; }) => entry.Country === country);
    }
   
   else if(rcp=='SSP-3(HIGH)' && indicators =='Heat Index Event exposure (Energy)'){
      if( year == '2030')
      filteredData = this.heatYearSSP3Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.heatYear2050SSP3Migrant.find((entry: { Country: any; }) => entry.Country === country);
    }
    
   else if(rcp=='SSP-3(HIGH)' && indicators =='Water index stress (Water)'){
      if( year == '2030')
      filteredData = this.waterYearSSP3Migrant.find((entry: { Country: any; }) => entry.Country === country);
      if( year == '2050')
      filteredData = this.waterYear2050SSP3Migrant.find((entry: { Country: any; }) => entry.Country === country);
    }
    const proportion = (filteredData.No_of_Irregular_Migrants_in_UK/100)*100;

    return filteredData ? 
      {
        id: this.id,
        Continent: this.Continent,
        Country: this.Country,
        value: this.value,
        total_irregular_migrants: filteredData.Total_Irregular_Migrants,
        Proportion:proportion}
         : 0;
   }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  } 
}
