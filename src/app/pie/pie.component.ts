import { Component, OnDestroy, OnInit } from '@angular/core';

import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';
import * as am5percent from "@amcharts/amcharts5/percent";
import { DataService } from '../service/dataService';
import { CsvService } from '../service/CsvService';
import data from '../data/graph';
import { RouteService } from '../service/central-med';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { HeatWaterService } from '../service/HeatWaterService';
import { forEach } from 'angular';


interface ChartData {
  title: string;
  latitude: number;
  longitude: number;
  width: number;
  height: number;
  pieData: { category: string; value: number }[];
}
interface RegionData {
  x: number;
  y: string;
  Country: string;
  region_name: string;
  SSP1_1p5_Score: number;
  SSP1_2p0_Score: number;
  SSP1_3p0_Score: number

}

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})

export class PieComponent implements OnInit {
  private bubbleSeries: am5map.MapPointSeries | undefined;
  countryNames: string[] = [
    'Tunisia', 'Egypt', 'Eritrea', 'Sudan', 'Gambia', 'Ethiopia', 'Nigeria', 'Algeria', 'South Sudan',
    'Cameroon', 'Mali', 'Senegal', 'Libya', 'Ghana', 'Morocco', 'Guinea', 'Somalia', 'Chad', 'Benin',
    'Burkina', 'Niger', 'Central African Republic', 'Togo', 'Sierra Leone', 'Uganda', 'Mauritius', 'Burundi',
    'Djibouti', 'Kenya', 'Zimbabwe', 'Liberia', 'Lesotho', 'Zambia', 'Mauritania', 'Madagascar', 'Malawi',
    'Mozambique', 'Comoros', 'Tanzania', 'South Africa', 'Cape Verde', 'Equatorial Guinea', 'Angola', 'Gabon',
    'Namibia', 'Rwanda'
  ];

  mapType=['Heat','Water']
  selectedCountryValue: any | null = null;
  circle: any;
  mapData$: any;
  subscription: any;
  mapData: any;
  coordinates: RegionData[] = [];
  chart: any;
  root: am5.Root | undefined;
  cities: any;
  lineSeries: any;
  migrants: any[]=[];
  totalMigration: number = 0;
  showCentral: boolean = true;
  showWestern: boolean = false;
  showThird: boolean= false;
  mediator: string = 'Central Mediterranean Route';
  westernMigrants: any[]=[];
  westernafricaMigrants: any[] = [];
  selectedMediterranen: any[]=[];
  arrowSeries: any;
  mapTypeData: any;
  heatData: any=[];
  waterData: any=[];
  polygonSeries: any;
  selectedRcpValue: string='';
  selectYearValue:string ='';
  coordinaateandcountry: any;
  pointSeries: any;
 
  constructor(private dataService: CsvService,private routeService:RouteService,private heatwaterService:HeatWaterService) {}
  indicators = [{ id: 'Drought intensity change (Water)', name: 'Drought intensity change (Water)' },
  { id: 'Water index stress (Water)', name: 'Water index stress (Water)' },
  { id: 'Heat Index Event exposure (Energy)', name: 'Heat Index Event exposure (Energy)' },
  { id: 'Agriculture water Stress index(Land)', name: 'Agriculture water Stress index(Land)' },
  { id: 'Crop yield change (Land)', name: 'Crop yield change (Land)' }];
  ngOnInit() {
    this.dataService.getCropYieldData().subscribe((rcp) => {
      this.coordinates = this.removeDuplicates(this.csvToJson<RegionData>(rcp), 'Country');
    });
    this.routeService.getMedRouteData().subscribe((rcp) => {
      this.migrants = this.csvToJson<RegionData>(rcp);
    });
    this.routeService.getWesternMedRouteData().subscribe((rcp) => {
      this.westernMigrants = this.csvToJson<RegionData>(rcp);
    });
    this.routeService.getWesternAfricaRouteData().subscribe((rcp) => {
      this.westernafricaMigrants = this.csvToJson<RegionData>(rcp);
    });
    this.heatwaterService.getHeatData().subscribe((rcp) => {
      this.heatData = this.findHighestHeatCountry(this.csvToJson<RegionData>(rcp));
    });
    this.heatwaterService.getWaterData().subscribe((rcp) => {
      this.waterData = this.findHighestWaterCountry(this.csvToJson<RegionData>(rcp));
    });
    this.countryNames.sort((a, b) => a.localeCompare(b));
    this.loadMap();
  }

  loadMap(){
    this.root = am5.Root.new("chartdestionation");
    this.root.setThemes([
      am5themes_Animated.new(this.root)
    ]);
    // if (this.root) {
    // this.root.width = am5.percent(100);
    // this.root.height = am5.percent(100);
    // }
    this.chart = this.root.container.children.push(am5map.MapChart.new(this.root, {
      // panX: "translateX",
      // panY: "translateY",
      // projection: am5map.geoMercator()
    }));
   

    this.polygonSeries = this.chart.series.push(am5map.MapPolygonSeries.new(this.root, {
      geoJSON: am5geodata_worldLow,
      include: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
        "MT", 'NL', "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB", 'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
        'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
        'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
        'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ'],
      calculateAggregates: true,
      interactive: true,
      exclude: ["AQ"],
      
     //fill:am5.color(0xFF621F)
    }));
    this.chart?.set("zoomLevel", 1);
    // let graticuleSeries = this.chart.series.push(am5map.GraticuleSeries.new(this.root, {}));
    // graticuleSeries.mapLines.template.setAll({
    //   stroke: this.root.interfaceColors.get("alternativeBackground"),
    //   strokeOpacity: 0.08
    // });
    
    this.chart.appear(1000, 100);
  }
  
  arrowLink(coordinates: { x: number; y: string } | null,mediatorCountry: { x: number; y: number; } | null) {
   
     let citySeries = this.chart.series.push(
      am5map.MapPointSeries.new(this.root!, {})
    );
    this.lineSeries = this.chart.series.push(am5map.MapLineSeries.new(this.root!, {}));
    this.cityData();
  
   
   const cities = {
    type: "FeatureCollection",
    features: this.coordinaateandcountry?.map((coord: { name: any; coordinates: any; }) => ({
      type: "Feature",
      properties: {
        name: coord.name
      },
      geometry: {
        type: "Point",
        coordinates: coord.coordinates
      }
    }))
  };

  // Create point series
 this.pointSeries = this.chart.series.push(
  am5map.MapPointSeries.new(this.root!, {
   // geoJSON: cities
  })
);
this.pointSeries.bullets.push((root: am5.Root, series: any, dataItem: any) => {

  const isMediator = dataItem.get('name') === this.mediator;
  const fillColor = isMediator ? am5.color(0xFF0000) : am5.color(0x00FF00);
  return am5.Bullet.new(this.root!, {
    sprite: am5.Circle.new(this.root!, {
      radius: isMediator ? 10 : 5,
      fill: fillColor,
      tooltipText: "{name}"
    })
  });
});
 
  
    let destinations = ["United Kingdom"];
    let originLongitude = coordinates!.x;
    let originLatitude = coordinates!.y;
    this.arrowSeries = this.chart.series.push(
      am5map.MapPointSeries.new(this.root!, {})
    );

    
    
    let lineDataItem = [];
 

this.lineSeries = this.chart.series.push(
  am5map.MapLineSeries.new(this.root!, {})
);


var points: any[] = [];

// Loop to push data items to pointSeries
this.coordinateDetail().forEach((item: any) => {
  points.push(this.pointSeries.pushDataItem(item));
});

this.lineSeries.pushDataItem({
 pointsToConnect: points
});

   
   
    this.lineSeries.mapLines.template.setAll({
      stroke: am5.color(0xffba00),
      strokeWidth: 2,
      strokeOpacity: 1
    });
    console.log('dataItem',points.length);
//  points.each((lineDataItem: any) => {
    // for(let i=0;i<points.length-1;i++){
    //   this.arrowSeries.bullets.push(() => {
    //     let arrow = am5.Graphics.new(this.root!, {
    //       fill: am5.color(0x000000),
    //       stroke: am5.color(0x000000),
    //       draw: function (display) {
    //         display.moveTo(0, -3);
    //         display.lineTo(8, 0);
    //         display.lineTo(0, 3);
    //         display.lineTo(0, -3);
    //       }
    //     });
    
    //     return am5.Bullet.new(this.root!, {
    //       sprite: arrow
    //     });
    //   });
    
    //   if (this.chart && this.arrowSeries) {
    //     this.arrowSeries.pushDataItem({
    //       lineDataItem: lineSeries,
    //       positionOnLine: 100, // Adjust the position based on the index
    //       autoRotate: true
    //     });
    //   }

    // }
   // });

   for (let i = 0; i < points.length - 1; i++) {
    this.createArrow(points[i], points[i + 1]);
  }
    
         if (this.chart&&
          this.lineSeries ) {
        this.arrowSeries.pushDataItem({
          lineDataItem:this.lineSeries,
         positionOnLine: 1.5,
          autoRotate: true
        });
      }else {
        console.error("Error: Chart or lineDataItem is disposed or invalid");
      }

     
  }

  createArrow(startPoint: any, endPoint: any) {
    const positionOnLine = 1;  // You may adjust this value based on your requirements
  
    const arrowX = startPoint.pointX + (endPoint.pointX - startPoint.pointX) * positionOnLine;
    const arrowY = startPoint.pointY + (endPoint.pointY - startPoint.pointY) * positionOnLine;
  
    this.arrowSeries.bullets.push(() => {
      let arrow = am5.Graphics.new(this.root!, {
        fill: am5.color(0x000000),
        stroke: am5.color(0x000000),
        draw: function (display) {
          display.moveTo(0, -3);
          display.lineTo(8, 0);
          display.lineTo(0, 3);
          display.lineTo(0, -3);
        }
      });
  
      return am5.Bullet.new(this.root!, {
        sprite: arrow,
        locationX: arrowX,
        locationY: arrowY,
       // rotation: this.calculateArrowRotation(startPoint, endPoint)  // Optional: Rotate arrow based on line direction
      });
    });
  }
  
  calculateArrowRotation(startPoint: any, endPoint: any): number {
    const angle = Math.atan2(endPoint.pointY - startPoint.pointY, endPoint.pointX - startPoint.pointX);
    return (angle * 180) / Math.PI;
  }
 
coordinateDetail():any{
  const coordinates = this.findCoordinatesByCountry(this.selectedCountryValue, this.coordinates);
  const mediatorCountry = this.findCenteralCoordinates(this.mediator);
  // const cordinate= [
  //   [coordinates?.x, coordinates?.y],
  //   [mediatorCountry?.x,mediatorCountry?.y],
  //   [36.30904040702372, 22.218457547733337],
  //  [-0.1262, 51.5002]
    
     
  //   ]
  const cordinate=[{ name :this.selectedCountryValue,latitude:coordinates?.x, longitude:coordinates?.y },
    { name :'Mali',longitude:-6.25, latitude:24.75 },
    { name :'Libya',longitude:13.1913 , latitude:32.8872 },
   { name :this.mediator,latitude: mediatorCountry?.x, longitude: mediatorCountry?.y},
   //{ name :'Italy',longitude:12.240456489308606 , latitude:43.08918192577643 },
    { name :'United Kingdom',latitude: 51.509865, longitude: -0.118092},
    ]
    return cordinate;
}
  cityData(){
    this.cities = this.coordinates.map(item => {
      return {
        id: item.Country.toLowerCase().replace(/\s/g, "_"),
        title: item.Country,
        geometry: {
          type: "Point",
          coordinates: [item.x, parseFloat(item.y)]
        }
      };
    });
    this.cities.push({
      id: 'United Kingdom', title: 'United Kingdom', geometry: {
        type: "Point",

        coordinates: [-0.1262, 51.5002]
      }
    },{ id: 'Central Mediterranean Route', title: 'Central Mediterranean Route', geometry: {
      type: "Point",

      coordinates: [22.218457547733337,36.30904040702372 ]}},
      { id: 'Western Mediterranean', title: 'Western Mediterranean', geometry: {
        type: "Point",
  
        coordinates: [-5.291307397436539,36.34444502849807 ]}},
        { id: 'Western Africa', title: 'Western Africa', geometry: {
          type: "Point",
    
          coordinates: [-14.226280416672568,24.53051872073307 ]}})
  }

  setColor(){
      this.polygonSeries.mapPolygons.each((polygon: any) => {
        const countryId = polygon.dataItem.dataContext.name;
        if (countryId === this.heatData['Country']) { 
          console.log('comiing heere'); // Assuming 'EG' is the ISO code for Egypt
          polygon.set("fill", am5.color(0xFF621F));
         // polygon.fill.set(am5.color(0xFF621F));
         polygon.set("tooltipText", `{name}: Heat Color`);
         polygon.set("tooltipPosition", "fixed");
        }
      });
   
  }

  setWaterColor(){
    this.polygonSeries.mapPolygons.each((polygon: any) => {
      const countryId = polygon.dataItem.dataContext.name;
      if (countryId === this.waterData['Country']) { 
        console.log('comiing heere'); // Assuming 'EG' is the ISO code for Egypt
        polygon.set("fill", am5.color(0x4169e1));
       // polygon.fill.set(am5.color(0xFF621F));
       polygon.set("tooltipText", `{name}: Waterstress`);
       polygon.set("tooltipPosition", "fixed");
      }
    });
  }

  removeDuplicates(array: any[], property: string | number) {
    return array.filter((obj, index, self) =>
      index === self.findIndex((el) => el[property] === obj[property])
    );
  }

  selectCountry(country: any): void {
    this.selectedCountryValue = country;
    const coordinates = this.findCoordinatesByCountry(this.selectedCountryValue, this.coordinates);
    const mediatorCountry = this.findCenteralCoordinates(this.mediator);
    this.totalMigration = this.sumCountryData(this.selectedCountryValue);
    this.coordinaateandcountry =this.findCoordinatesandCountry(this.selectedCountryValue, this.coordinates);
    if (this.lineSeries && !this.lineSeries.isDisposed()) {
      this.chart.series.removeValue(this.lineSeries);
      this.chart.series.removeValue(this.pointSeries);
    }
    this.arrowLink(coordinates,mediatorCountry);
  }
  findHighestHeatCountry(data:any):any{
    const entryWithHighestValue = data.reduce((maxEntry:any, currentEntry:any) => {
      const maxValue = parseFloat(currentEntry.Values);
      const currentMaxValue = parseFloat(maxEntry.Values);
    
      // Check if the current entry's value is higher than the current max value
      if (!isNaN(maxValue) && !isNaN(currentMaxValue) && maxValue > currentMaxValue) {
        return currentEntry;
      }
    
      return maxEntry;
    }, data[0]); // Initialize with the first entry
    return entryWithHighestValue;
  }
  findHighestWaterCountry(data:any):any{
    const entryWithHighestValue = data.reduce((maxEntry:any, currentEntry:any) => {
      const maxValue = parseFloat(currentEntry.SSP1_1p5_Score);
      const currentMaxValue = parseFloat(maxEntry.SSP1_1p5_Score);
    
      // Check if the current entry's value is higher than the current max value
      if (!isNaN(maxValue) && !isNaN(currentMaxValue) && maxValue > currentMaxValue) {
        return currentEntry;
      }
    
      return maxEntry;
    }, data[0]); // Initialize with the first entry
    return entryWithHighestValue;

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

  
  
  
  
  
  
  
  
  
  
  
  
  findCoordinatesByCountry(selectedCountryValue: string, coordinates: RegionData[]) {
    for (const item of coordinates) {
      if (item.Country === selectedCountryValue) {
        return { x: item.x, y: item.y };
      }
    }
    return null;
  }
  findCoordinatesandCountry(selectedCountryValue: string, coordinates: RegionData[]) {
    let coordinateCountry =[];
    for (const item of coordinates) {
      if (item.Country === selectedCountryValue) {
       coordinateCountry.push({name:selectedCountryValue,coordinates:[item.x,item.y]});
      }
    }
    return coordinateCountry;
  }

  findCenteralCoordinates(selectedCountryValue: string) {
    console.log('selectedCountryValue',selectedCountryValue);
    let data =[ {name: 'Central Mediterranean Route', y:22.218457547733337,x:36.30904040702372 },
    {name: 'Western Mediterranean', x:-5.291307397436539,y:36.34444502849807},
    {name: 'Western Africa Route', y:-14.226280416672568,x:24.53051872073307}]
    
    for (const item of data) {
      if (item.name === selectedCountryValue) {
        return { x: item.x, y: item.y };
      }
    }
    return null;
  }

  sumCountryData(country: any) {
    let sum = 0;
    let totalSum;
    const countryData = {};
    this.selectedMediterranen = this.mediator ==='Central Mediterranean Route' ? this.migrants :'Western Mediterranean' ? this.westernMigrants : this.westernafricaMigrants;
    for (const date in this.selectedMediterranen) {
      const Value = parseInt(this.selectedMediterranen[date][country], 10);
      if (!isNaN(Value)) {
        sum += Value;
      }
    }
    return sum;
  } 
  onTabChange(_e: MatTabChangeEvent) {
    this.mediator=_e.tab.textLabel;
    this.totalMigration = this.sumCountryData(this.selectedCountryValue);
    this.selectCountry(this.selectedCountryValue);
   

   
    // if (_e.index === 0) {
    //   this.showCentral = true;
    //   this.showWestern = false;
    //   this.showThird = false;
    // } else if (_e.index === 1) {
    //   this.showCentral = false;
    //   this.showWestern = true;
    //   this.showThird = false;
    // }
    // else {
    //   this.showCentral = false;
    //   this.showWestern = false;
    //   this.showThird = true;aqw1 
    // }

  }
  selectMapType(type: any) {
   this.updateDefaultColor();
    this.mapTypeData = type;
    if (type === 'Heat')
      setTimeout(() => { this.setColor(); }, 200)
    else setTimeout(() => { this.setWaterColor(); }, 200)


  }
  private updateDefaultColor(): void {
    if (this.chart && this.chart.series.length > 0) {
   
      const polygonSeries = this.chart.series.getIndex(0) as am5map.MapPolygonSeries;
      if (polygonSeries) {
        polygonSeries.mapPolygons.each((polygon) => {
          polygon.set("fill", am5.color(0x6794dc));
        });
      }
    }

  }
  selectRcp(value: string): void {
    this.selectedRcpValue=value;
   
  }
  selectYear(value:string){
    this.selectYearValue=value;
  }
  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}




