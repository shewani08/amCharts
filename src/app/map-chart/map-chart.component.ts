// import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
// import * as am5 from '@amcharts/amcharts5';
// import * as am5map from "@amcharts/amcharts5/map";
// import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';
// import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
// import { CsvService } from '../service/CsvService';
// interface CsvData {
//   id?: string;
//   Continent?: string;
//   Country: string;
//   value: string;
//   Number_of_immigrants: string;
//   Proportion: string;
// }
// interface Entry {
//   Country: string;
//   mean?: number;  // Allow number or undefined
//   mean1?: number; // Allow number or undefined
//   mean2?: number; // Allow number or undefined
//   [key: string]: number | string | undefined; // Allow number, string, or undefined
// }
// interface Result {
//   [country: string]: { count: number; sum: number; mean?: number };
// }
// @Component({
//   selector: 'app-map-chart',
//   templateUrl: './map-chart.component.html',
//   styleUrls: ['./map-chart.component.css']
// })
// export class MapChartComponent implements OnInit, AfterViewInit {
//   private chart: am5map.MapChart | undefined;
//   jsonData: any;
//   tempjsonData: any;
//   droughtData: any;
//   meansDroughtByCountry: any;
//   meansTempByCountry: any;
//   agricultureData: any;
//   meansAgricultureByCountry: any;
//   temparaturejsonData: any;
//   fetchData: any;
//   mergedJSON: any;
//   constructor(private dataService: CsvService) { 
//     this.dataService?.getCsvData()?.subscribe((csvData) => {
//       this.jsonData = this.csvToJson<CsvData>(csvData);
//     });
//     this.dataService?.getTemperatureData()?.subscribe((csvData) => {
//       this.tempjsonData = this.csvToJson<CsvData>(csvData);
//     });
//     this.dataService?.getTemperatureData()?.subscribe((csvData) => {
//       this.temparaturejsonData = this.rcpToJson(csvData);
//       //this.fetchData =this.getData();
//       const property = 'SSP1_1p5_Score';
//       this.meansTempByCountry = this.calculateMeanByCountry(this.tempjsonData, property);
//       console.log('this.meansAgricultureByCountry',this.meansTempByCountry);
//       // this.mergedJSON = this.mergeTwoJson();
//       // this.initializeMap();
      
//     });
//     this.dataService.getDroughtData().subscribe((rcp) => {
//       this.droughtData = this.rcpToJson(rcp);
//       const property = 'SSP1_1p5_Score';
//       this.meansDroughtByCountry = this.calculateMeanByCountry(this.droughtData, property);
//       this.fetchData =this.getData();
   
//       this.mergedJSON = this.mergeTwoJson(this.fetchData,this.meansDroughtByCountry,'mean1');
//      // this.initializeMap();
//     })
//     this.dataService.getAgricultureData().subscribe((rcp) => {
//       this.agricultureData = this.rcpToJson(rcp);
//       const property = 'SSP1_1p5_Score';
//       this.meansAgricultureByCountry = this.calculateMeanByCountry(this.agricultureData, property);
//       console.log('meansAgricultureByCountry',this.meansAgricultureByCountry);
//       this.mergedJSON = this.mergeTwoJson(this.mergedJSON,this.meansAgricultureByCountry,'mean2');
//      // setTimeout(()=>this.initializeMap(),2000);
       
//     })
//   }
//   // mergeTwoJson(src1: any,src2: { [x: string]: any; },meanType:string) {
//   //   console.log('src1',src1);
//   //   const mergedData = [];
//   //   for (const entry of src1) {
//   //     const countryName = entry.Country;
//   //     if (src2[countryName]) {
//   //       const mergedEntry = { ...src2[countryName], ...entry };
//   //       mergedData.push(mergedEntry);
//   //     }
//   //   }
//   //   console.log('mergedData',mergedData);
//   //   return mergedData;
//   // }
//   mergeTwoJson(src1: any, src2: { [x: string]: any; }, meanType: string) {
//     const mergedData = [];
//     for (const entry of src1) {
//         const countryName = entry.Country;

//         if (src2[countryName]) {
//             const mergedEntry = { ...src2[countryName], ...entry };

//             // Check for property conflicts and rename if needed
//             for (const prop in src2[countryName]) {
//                 if (mergedEntry.hasOwnProperty(prop) && prop !== "Country") {
//                     // Rename the conflicting property in src2
//                     const renamedProp = meanType;
//                     mergedEntry[renamedProp] = src2[countryName][prop];
//                     delete mergedEntry[prop];
//                 }
//             }

//             mergedData.push(mergedEntry);
//         }
//     }

//     console.log('mergedData', mergedData);
//     return mergedData;
// }

//   ngOnInit(): void {
    
    
//   }
//   private rcpToJson<T>(data: string): T[] {
//     const lines = data.split('\n');
//     const headers = lines[0].split(',');
//     const result: T[] = [];
//     for (let i = 1; i < lines.length; i++) {
//       const currentLine = lines[i].split(',');
//       const obj: any = {};
//       for (let j = 0; j < headers.length; j++) {
//         const key = headers[j].trim() as keyof CsvData;
//         const value = currentLine[j] ? currentLine[j].trim() : '';
//         obj[key] = value;
//       }
//       result.push(obj as T);
//     }
//     return result;

//   }
//   private csvToJson<T>(csvData: string): T[] {
//     const lines = csvData.split('\n');
//     const headers = lines[0].split(',');
//     const result: T[] = [];
//     for (let i = 1; i < lines.length; i++) {
//       const currentLine = lines[i].split(',');
//       const obj: any = {};
//       for (let j = 0; j < headers.length; j++) {
//         const key = headers[j].trim() as keyof CsvData;
//         const value = currentLine[j] ? currentLine[j].trim() : '';
//         obj[key] = value;
//       }
//       result.push(obj as T);
//     }
//     return result;
//   }

//   private calculateMeanByCountry(data: Entry[], property: string) {
//     const result: Result = {};
//     data.forEach((entry: { [x: string]: any; Country: any; }) => {
//       const country = entry.Country;
//       const score = entry[property];
//       if (!result[country]) {
//         result[country] = { count: 0, sum: 0, mean: 0 };
//       }
//       result[country].count++;
//       result[country].sum += score * 100 / 100;
//       result[country].mean = result[country].sum / result[country].count;
//     });
//     return result;
//   }
//   ngAfterViewInit(): void {
//     // this.initializeMap();
//   }


//   private initializeMap(): void {
//     const root = am5.Root.new('map-chart');
//     root.setThemes([
//       am5themes_Animated.new(root)
//     ]);
//     const map = root.container.children.push(
//       am5map.MapChart.new(root, {
//         panX: 'none',
//         projection: am5map.geoNaturalEarth1()
//       })
//     );
//     const polygonSeries = map.series.push(
//       am5map.MapPolygonSeries.new(root, {
//         geoJSON: am5geodata_worldLow,
//         exclude: ['antarctica'],
//         include: [
//           'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
//           'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
//           'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
//           'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ','CI'
//         ],
//       })
//     );
//     this.chart?.set("zoomLevel", 1.4);
//     const pointSeries = map.series.push(
//       am5map.MapPointSeries.new(root, {})
//     );
//     const colorSet = am5.ColorSet.new(root, { step: 2 });
//     pointSeries.bullets.push(function (root, series, dataItem) {
//       const value = dataItem.get('value') || 0;
//       const container = am5.Container.new(root, {});
//       const color = colorSet.next();
//       const baseRadius = 8;
//       for (let i = 1; i <= 3; i++) {
//         const radius = baseRadius + i * 5; 
//         container.children.push(am5.Circle.new(root, {
//           radius: 4,
//           fill: i == 1? am5.color(0x964B00): i==2?am5.color(0xDEF4FC):am5.color(0x00FF00),
//           dx:10*i,
//          tooltipText:i == 1? 'Drought-{mean1}': i==2?'Water-{mean2}':'Agriculture-{mean1}',
//         }));
          
//       container.children.push(am5.Line.new(root, {
//         stroke: color,
//         dx:10*i,
//         height: -40,
//         strokeGradient: am5.LinearGradient.new(root, {
//           stops: [
//             { opacity: 2 },
//             { opacity: 2 },
//             { opacity: 0 }
//           ]
//         })
//       }));
//       }
//       return am5.Bullet.new(root, {
//         sprite: container
//       });
//     });

//     for (let i = 0; i < this.mergedJSON.length; i++) {
//       if(this.mergedJSON){
//         const d = this.mergedJSON[i];
//         console.log('value of d is',this.mergedJSON);
//         pointSeries.data.push({
//           geometry: { type: 'Point', coordinates: [d.x, d.y] },
//           title: d.Country,
//           value: d.Country,
//           mean:d.mean,
//           mean1:d.mean1,
//           mean2:d.mean2
//         });
//       }
//     }
//   }
//   getData() {
//     let uniqueCountries: any;
//     const t = this.removeDuplicates(this.droughtData, 'Country');
//      return t; 
//   }

//   removeDuplicates(array: any[], property: string | number) {
//     return array.filter((obj, index, self) =>
//       index === self.findIndex((el) => el[property] === obj[property])
//     );
//   }
// }
import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';

@Component({
  selector: 'app-map-chart',
  templateUrl: './map-chart.component.html',
  styleUrls: ['./map-chart.component.css']
})
export class MapChartComponent implements OnInit, AfterViewInit {
  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.run(() => {
      this.initializeMapChart();
    });
  }
 ngOnInit(): void {
   
 }
  initializeMapChart(): void {
    // Declare GeoJSON variable before usage
    const am5geodata_worldLow1: GeoJSON.FeatureCollection = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {
            "id": "london",
            "name": "London"
          },
          "geometry": {
            "type": "Point",
            "coordinates": [-0.1262, 51.5002]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "brussels",
            "name": "Brussels"
          },
          "geometry": {
            "type": "Point",
            "coordinates": [4.3676, 50.8371]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "prague",
            "name": "Prague"
          },
          "geometry": {
            "type": "Point",
            "coordinates": [14.4205, 50.0878]
          }
        },
        // Add more countries as needed
      ]
    };

    let root = am5.Root.new('map-chart');

    let chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: 'translateX',
      panY: 'translateY',
      projection: am5map.geoMercator()
    }));
console.log('coming here');
    let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      valueField: "value",
        calculateAggregates: true,
        interactive: true
    }));

    let graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
    graticuleSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get('alternativeBackground'),
      strokeOpacity: 0.08
    });

    let lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
    lineSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get('alternativeBackground'),
      strokeOpacity: 0.6
    });

    let citySeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

   // citySeries.data.setAll(am5geodata_worldLow.features);

    citySeries.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Picture.new(root, {
          width: 32,
          height: 32,
          x: am5.percent(30),
          y: am5.percent(50),
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          src: "assets/images/grass-land-leaves-svgrepo-com.svg"
        })
      });
    });
    //   let circle = am5.Circle.new(root, {
    //     radius: 5,
    //     tooltipText: '{name}',
    //     tooltipY: 0,
    //     fill: am5.color(0xffba00),
    //     stroke: root.interfaceColors.get('background'),
    //     strokeWidth: 2
        
    //   });

    //   return am5.Bullet.new(root, {
    //     sprite: circle
    //   });
    // });
  }
}