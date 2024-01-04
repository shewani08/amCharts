import { PieChart } from '@amcharts/amcharts5/percent';
import { XYChart } from '@amcharts/amcharts5/xy';
import { Component } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';
import { CsvService } from '../service/CsvService';
interface Entry {
  Country: string;
  [key: string]: number | string; 
}
interface CsvData {
  id: string;
  Continent: string;
  Country: string;
  value: string;
  Number_of_immigrants: string;
  Proportion: string;

}
interface Result {
  [country: string]: { count: number; sum: number; mean?: number };
}
interface CountryData {
  count: number;
  sum: number;
  mean?: number;
}
@Component({
  selector: 'app-collection-map',
  templateUrl: './collection-map.component.html',
  styleUrls: ['./collection-map.component.css']
})
export class CollectionMapComponent {
  private chart1: XYChart | undefined;
  private chart2: PieChart | undefined;
  private chart3: XYChart | undefined;
  private chart: am5map.MapChart | undefined;
  chartdiv: any;
  heatData: any;
  meansHeatByCountry: any;
  polygonSeries: any;
  countryMeanIdPairs: { id: string; value: number; }[] = [];
  constructor(private cvService:CsvService){

  }
  ngOnInit() {
    this.cvService.getHeatData().subscribe((rcp) => {
      this.heatData = this.rcpToJson(rcp);
      const property = 'SSP1_1p5_Score';
      this.meansHeatByCountry = this.calculateMeanByCountry(this.heatData, property);
    })
    this.showChart1();
    this.showChart2();
    this.showChart3();
   
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

private calculateMeanByCountry(data: Entry[], property: string) {
  const result: Result = {};
  data.forEach((entry: { [x: string]: any; Country: any; }) => {
    const country = entry.Country;
    const score = entry[property];
    if (!result[country]) {
      result[country] = { count: 0, sum: 0, mean: 0 };
    }
    result[country].count++;
    result[country].sum += score * 100 / 100;
    result[country].mean = result[country].sum / result[country].count;
  });
  return result;
}
showChart1(){
  var root = am5.Root.new("waterchartdiv"); 

  // Set themes
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  
  var chart = root.container.children.push(
    am5map.MapChart.new(root, {
      panX: "rotateX",
      projection: am5map.geoNaturalEarth1()
    })
  );
  this.polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
      include: [
        'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
        'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
        'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
        'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ'
      ],
      geoJSON: am5geodata_worldLow,
      exclude: ["AQ"]
    })
  );
  this.polygonSeries.mapPolygons.template.setAll({
    tooltipText: "{name}",
    interactive: true
  });
  this.polygonSeries.mapPolygons.template.states.create("hover", {
    fill: am5.color(0x677935)
  });
}
showChart2(){
  var root = am5.Root.new("landchartdiv"); 

  // Set themes
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  
  var chart = root.container.children.push(
    am5map.MapChart.new(root, {
      panX: "rotateX",
      projection: am5map.geoNaturalEarth1()
    })
  );
  
  // Create polygon series
  var polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
      include: [
        'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
        'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
        'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
        'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ'
      ],
      geoJSON: am5geodata_worldLow,
      exclude: ["AQ"]
    })
  );
  
  polygonSeries.mapPolygons.template.setAll({
    tooltipText: "{name}",
    interactive: true
  });
  
  polygonSeries.mapPolygons.template.states.create("hover", {
    fill: am5.color(0x677935)
  });
}
showChart3(){
  var root = am5.Root.new("heatchartdiv"); 

  // Set themes
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  
  var chart = root.container.children.push(
    am5map.MapChart.new(root, {
      panX: "rotateX",
      projection: am5map.geoNaturalEarth1()
    })
  );
  
  // Create polygon series
  var polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
      include: [
        'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
        'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
        'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
        'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ'
      ],
      geoJSON: am5geodata_worldLow,
      exclude: ["AQ"]
    })
  );
  
  polygonSeries.mapPolygons.template.setAll({
    tooltipText: "{name}",
    interactive: true
  });
  
  polygonSeries.mapPolygons.template.states.create("hover", {
    fill: am5.color(0x677935)
  });
}
private updateBubbleColor(): void {
  let countryMeanPairs: [string, number][];

  const data: { [key: string]: CountryData } | undefined =this.meansHeatByCountry;
  if (data) {
    countryMeanPairs = Object.entries(data).map(
      ([country, data]) => [country, data.mean || 0]
    );
    this.countryMeanIdPairs = Object.entries(data).map(
      ([country, data]) => ({ id: country, value: data.mean || 0 })
    );
  } else {
    console.error('Means by country is undefined.');
  }
  if (this.chart && this.chart.series.length > 0) {
   this.polygonSeries.mapPolygons.template.set("interactive", true);
    if (this.polygonSeries) {
     this.polygonSeries.mapPolygons.each((polygon:any) => {
        const dataContext = polygon.dataItem?.dataContext;
        if (dataContext && typeof dataContext === 'object' && 'name' in dataContext) {
          const countryName = dataContext.name;
        } else {
          console.error('Invalid or missing data structure for polygon:', polygon);
        }
      });
    }
  }
}
}
