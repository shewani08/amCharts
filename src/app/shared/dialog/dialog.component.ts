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

interface CsvData {
  id: string;
  Continent: string;
  Country: string;
  value: string;
  total_irregular_migrants: string;
  Proportion: string;
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



  constructor(private cdr: ChangeDetectorRef, private dataService: DataService,private yearService: YearService,
    private previousEvntService:PreviousEvntService,private migrantYear2030Service:MigrantYear2030Service) {
      this.migrantYear2030Service.getWaterStress().subscribe((rcp: any) => {
        this.waterYear2030Migrant = this.rcpToJson(rcp);
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
    this.previousData$ = this.previousEvntService.previousEvent$;
    this.prevsubscription = this.previousData$.subscribe((data: any) => {
      if (data) {
        setTimeout(() => {
          this.reloadPrevData(data);
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
    if (dataItem) {
      this.dataSource = [
        {
          id: dataItem?.dataContext?.id,
          Continent: dataItem?.dataContext.Continent,
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
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  } 
}
