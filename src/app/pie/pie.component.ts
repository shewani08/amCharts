import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

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
import { forkJoin } from 'rxjs';
import { MigrantYearService } from '../service/MigrantYearService';
interface CsvData {
  id?: string;
  Continent?: string;
  Country: string;
  value: string;
  Number_of_immigrants: string;
  Proportion: string;
}
interface Result {
  [country: string]: { count: number; sum: number; mean?: number;name?:string};
}
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
interface CountryData {
  count: number;
  sum: number;
  mean?: number;
  name?:string
}
interface Entry {
  Country: string;
  [key: string]: number | string;
}
const getColorForValue = (value: number): string => {
  if (value >= 0 && value < 1) {
    return "#CFCD9D";
  } else if (value >= 1 && value < 2) {
    return "#CA9485";
  } else {
    return "#B41404";
  }
};

const getColorForLand = (value: number): string => {
  if (value >= 0 && value < 1) {
    return "#f0b7a1";
  } else if (value >= 1 && value < 2) {
    return "#c7856b";
  } else {
    return "#9e5336";
  }
};
const getColorForHeat = (value: number): string => {
  if (value >= 0 && value < 1) {
    return "#f0b7a1";
  } else if (value >= 1 && value < 2) {
    return "#c7856b";
  } else {
    return "#9e5336";
  }
};

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})

export class PieComponent implements OnInit {
  private bubbleSeries: am5map.MapPointSeries | undefined;
  indicators = [{ id: 'Drought intensity change (Water)', name: 'Drought intensity change (Water)' },
  { id: 'Water index stress (Water)', name: 'Water index stress (Water)' },
  { id: 'Heat Index Event exposure (Energy)', name: 'Heat Index Event exposure (Energy)' },
  // { id: 'Agriculture water Stress index (Land)', name: 'Agriculture water Stress index (Land)' },
  { id: 'Crop yield change (Land)', name: 'Crop yield change (Land)' }];
  countryNames: string[] = [
    'Tunisia', 'Egypt', 'Eritrea', 'Sudan', 'Gambia', 'Ethiopia', 'Nigeria', 'Algeria', 'South Sudan',
    'Cameroon', 'Mali', 'Senegal', 'Libya', 'Ghana', 'Morocco', 'Guinea', 'Somalia', 'Chad', 'Benin',
    'Burkina', 'Niger', 'Central African Republic', 'Togo', 'Sierra Leone', 'Uganda', 'Mauritius', 'Burundi',
    'Djibouti', 'Kenya', 'Zimbabwe', 'Liberia', 'Lesotho', 'Zambia', 'Mauritania', 'Madagascar', 'Malawi',
    'Mozambique', 'Comoros', 'Tanzania', 'South Africa', 'Cape Verde', 'Equatorial Guinea', 'Angola', 'Gabon',
    'Namibia', 'Rwanda'
  ];

  mapType=['Drought intensity change (Water)','Water index stress (Water)','Heat Index Event exposure (Energy)','Crop yield change (Land)'];
  selectedCountryValue: any | null = null;
  circle: any;
  selectedIndicators: string[] = [];
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
  selectedRcpValue: any='';
  selectYearValue:any ='No scenario';
  coordinaateandcountry: any;
  pointSeries: any;
  fetchData: any;
  data: any;
  routeData: any;
  citySeries: any;
  lineSeriesMap: any;
  destination1: any;
  destination2: any;
  destination3: any;
  center: any;
  western: any;
  westernMed: any;
  westernAfrica: any;
  finalMeditor: any=[];
  selectedIndicator: any;
  rcpData: any=[];
  droughtData: any=[];
  cropYieldData: any=[];
  agricultureData: any=[];
  temperaturData: any=[];
  meansByCountry: any;
  meansDroughtByCountry: any;
  meansCropYieldByCountry: any;
  meansAgricultureByCountry: any;
  meansTemparatureByCountry: any;
  countryMeanIdPairs: { id: string; value: any; }[] | undefined;
  polygonRouteSeries: any;
  rcpMediumData: any=[];
  droughtMedData: any=[];
  cropYieldMedData: any=[];
  agricultureMedData: any=[];
  temperaturMedData: any=[];
  meansByCountryMed: Result | undefined;
  meansDroughtByCountryMed: Result | undefined;
  meansCropYieldByCountryMed: Result | undefined;
  meansAgricultureByCountryMed: Result | undefined;
  meansTemparatureByCountryMed: Result | undefined;
  rcpHighData: any=[];
  droughtHighData: any=[];
  cropYieldHighData: any=[];
  agricultureHighData: any=[];
  temperaturHighData: any=[];
  meansDroughtByCountryHigh: Result | undefined;
  meansByCountryHigh: Result | undefined;
  meansCropYieldByCountryHigh: Result | undefined;
  meansAgricultureByCountryHigh: Result | undefined;
  meansTemparatureByCountryHigh: Result | undefined;
  private rootRoute:any;
  chartRoute: any;
  mapheatLegend: any;
  heatLegend: any;
  waterYearMigrant:any;
  droughtYearMigrant: any;
  cropYieldYearMigrant: any;
  heatYearMigrant: any;
  selectedIndicatos: any;
  mergedJSON: any;
  means: any;
 
  constructor(private dataService: CsvService,private routeService:RouteService,private heatwaterService:HeatWaterService,
    private migrantYearService:MigrantYearService, private cd: ChangeDetectorRef) {

    this.dataService.getCoordinate().subscribe((rcp: any) => {
      this.fetchData = this.rcpToJson(rcp);
      this.loadData();
    })
    this.migrantYearService.getWaterStress().subscribe((rcp: any) => {
      this.waterYearMigrant = this.rcpToJson(rcp);
    })
    this.migrantYearService.getDroughtMigrantData().subscribe((rcp: any) => {
      this.droughtYearMigrant = this.rcpToJson(rcp);
    })
    this.migrantYearService.getCropYieldMigrantData().subscribe((rcp: any) => {
      this.cropYieldYearMigrant = this.rcpToJson(rcp);
    })
    this.migrantYearService.getHeatMigrantData().subscribe((rcp: any) => {
      this.heatYearMigrant = this.rcpToJson(rcp);
    })


    forkJoin([
      this.dataService.getRCPData(),
      this.dataService.getDroughtData(),
      this.dataService.getCropYieldData(),
      this.dataService.getAgricultureData(),
      this.dataService.getTemperatureData()
    ]).subscribe(([rcpData, droughtData, cropYieldData, agricultureData, temperaturData]) => {
      const property = 'SSP1_1p5_Score';
      this.rcpData = this.rcpToJson(rcpData);
      this.droughtData = this.rcpToJson(droughtData);
      this.cropYieldData = this.rcpToJson(cropYieldData);
      this.agricultureData = this.rcpToJson(agricultureData);
      this.temperaturData = this.rcpToJson(temperaturData);

      this.meansByCountry = this.calculateMeanByCountry(this.rcpData, property, 'Water index stress (Water)');
      this.meansDroughtByCountry = this.calculateMeanByCountry(this.droughtData, property, 'Drought intensity change (Water)');
      this.meansCropYieldByCountry = this.calculateMeanByCountry(this.cropYieldData, property, 'Crop yield change (Land)');
      this.meansAgricultureByCountry = this.calculateMeanByCountry(this.agricultureData, property, 'Agriculture water Stress index (Land)');
      this.meansTemparatureByCountry = this.calculateMeanByCountry(this.temperaturData, property, 'Heat Index Event exposure (Energy)');
      setTimeout(() => {
      
      }, 200);
    });
    // For RCP MEDIUM

    forkJoin([

      this.dataService.getMediumWaterIndex(),
      this.dataService.getMediumDroughtData(),
      this.dataService.getMediumCropYieldData(),
      this.dataService.getMediumAgricultureData(),
      this.dataService.getTemperatureData()]).subscribe(([rcpMediumData, droughtMedData, cropYieldMedData, agricultureMedData, temperaturMedData]) => {

        const property = 'SSP2_1p5_Score';

        this.rcpMediumData = this.rcpToJson(rcpMediumData);
        this.droughtMedData = this.rcpToJson(droughtMedData);
        this.cropYieldMedData = this.rcpToJson(cropYieldMedData);
        this.agricultureMedData = this.rcpToJson(agricultureMedData);
        this.temperaturMedData = this.rcpToJson(temperaturMedData);
        this.meansByCountryMed = this.calculateMeanByCountry(this.rcpMediumData, property, 'Water index stress (Water)');
        this.meansDroughtByCountryMed = this.calculateMeanByCountry(this.droughtMedData, property, 'Drought intensity change (Water)');
        this.meansCropYieldByCountryMed = this.calculateMeanByCountry(this.cropYieldMedData, property, 'Crop yield change (Land)');
        this.meansAgricultureByCountryMed = this.calculateMeanByCountry(this.agricultureMedData, property, 'Agriculture water Stress index (Land)');
        this.meansTemparatureByCountryMed = this.calculateMeanByCountry(this.temperaturMedData, property, 'Heat Index Event exposure (Energy)');

        setTimeout(() => {
          // console.log('Merged Data:', mergedData);

        }, 200);
      });

       // For RCP HIGH

    forkJoin([

      this.dataService.getHighWaterIndex(),
      this.dataService.getHighDroughtData(),
      this.dataService.getHighCropYieldData(),
      this.dataService.getHighAgricultureData(),
      this.dataService.getTemperatureData()]).subscribe(([rcpHighData, droughtHighData, cropYieldHighData, agricultureHighData, temperaturHighData]) => {

        const property = 'SSP3_1p5_Score';

        this.rcpHighData = this.rcpToJson(rcpHighData);
        this.droughtHighData = this.rcpToJson(droughtHighData);
        this.cropYieldHighData = this.rcpToJson(cropYieldHighData);
        this.agricultureHighData = this.rcpToJson(agricultureHighData);
        this.temperaturHighData = this.rcpToJson(temperaturHighData);
        this.meansByCountryHigh = this.calculateMeanByCountry(this.rcpHighData, property, 'Water index stress (Water)');
        this.meansDroughtByCountryHigh= this.calculateMeanByCountry(this.droughtHighData, property, 'Drought intensity change (Water)');
        this.meansCropYieldByCountryHigh = this.calculateMeanByCountry(this.cropYieldHighData, property, 'Crop yield change (Land)');
        this.meansAgricultureByCountryHigh= this.calculateMeanByCountry(this.agricultureHighData, property, 'Agriculture water Stress index (Land)');
        this.meansTemparatureByCountryHigh = this.calculateMeanByCountry(this.temperaturHighData, property, 'Heat Index Event exposure (Energy)');

        setTimeout(() => {
          // console.log('Merged Data:', mergedData);

        }, 200);
      });
  }
 
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

    this.countryNames.sort((a, b) => a.localeCompare(b));
}
private calculateMeanByCountry(data: Entry[], property: string,name:string) {
  const result: Result = {};
  data?.forEach((entry: { [x: string]: any; Country: any; }) => {
    const country = entry.Country;
    const score = entry[property];
    if (!result[country]) {
      result[country] = { count: 0, sum: 0, mean: 0 ,name:''};
    }
    result[country].name=name;
    result[country].count++;
    result[country].sum += score * 100 / 100;
    result[country].mean = result[country].sum / result[country].count;
  });
  return result;
}
loadData() {
  if (this.fetchData) {
    this.data = this.fetchData.map((coord: any) => ({
      id: coord.Country,
      title: coord.Country,
      name: coord.Country,
      Country: coord.Country,
      Destination1 :coord.Destination1,
      Destination2 :coord.Destination2,
      Destination3 :coord.Destination3,
      Central: coord.Central,
      Western: coord.WesternMedi1,
      WesternMedi: coord.WesternMedi2,
      WesternAfrica:coord.WesternAfrica,
      Final:coord.Final,
     geometry: {
        type: "Point",
        coordinates: [parseFloat(coord.longitude),parseFloat(coord.latitude)]
      }
    }));
    this.data.push({
      Country:"United Kingdom",
      id: "United Kingdom",
      title: "United Kingdom",
      geometry: { type: "Point", coordinates: [-0.1262, 51.5002] }
      
    });
    this.initializeChart();
  }
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
initializeChart(){
  this.rootRoute = am5.Root.new("chartdestionation");
this.rootRoute.setThemes([
am5themes_Animated.new(this.rootRoute)
]);
this.chartRoute = this.rootRoute.container.children.push(am5map.MapChart.new(this.rootRoute, {
}))
this.polygonRouteSeries = this.chartRoute?.series.push(am5map.MapPolygonSeries.new(this.rootRoute, {
geoJSON: am5geodata_worldLow,
include: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
"MT", 'NL', "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB", 'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ','UK'],
}));

this.chartRoute?.set("zoomLevel", 1.3);
 this.lineSeriesMap = this.chartRoute.series.push(am5map.MapLineSeries.new(this.rootRoute, {}));
this.citySeries = this.chartRoute.series.push(
am5map.MapPointSeries.new(this.rootRoute, {})
);

this.citySeries.bullets.push(() => {
let circle = am5.Circle.new(this.rootRoute!, {
  radius: 5,
 tooltipText: "{title}",
  tooltipY: 0,
  fill: am5.color(0xffba00),
  stroke: this.rootRoute?.interfaceColors.get("background"),
  strokeWidth: 2
});
return am5.Bullet.new(this.rootRoute!, {
  sprite: circle
});
});
if(this.data)
this.citySeries.data.setAll(this.data);
this.polygonRouteSeries.mapPolygons.template.events.on("pointerover", this.onMapPolygonPointerOver.bind(this));
this.chartRoute.appear(1000, 100);

}
public setupHeatLegend(data: any) {
  this.polygonRouteSeries.set("heatRules", [{
    target: this.polygonRouteSeries.mapPolygons.template,
    dataField: "value",
    min: am5.color(0xff621f),
    max: am5.color(0x661f00),
    key: "fill"
  }]);
}
onMapPolygonPointerOver(ev: any) {
  let countryDetail = (ev.target.dataItem?.dataContext as { name: string }).name;
  let countryMeanPairs: any;
  let countryEntry;
  const data: { [key: string]: CountryData } | undefined = this.selectedIndicatorData();
  if (data) {
    countryMeanPairs = Object.entries(data).map(
      ([country, data]) => [country, data.mean || 0]
    );
  }
  if (countryMeanPairs?.length) {
    countryEntry = countryMeanPairs?.find(([country]: [string, number]) => country === countryDetail);
  }
 
  if (countryEntry !== undefined && countryEntry[1] && countryEntry[1]!== null){ 
    this.heatLegend?.showValue(countryEntry[1]);
  }
   
}

setConnection() {
  const origins = this.getOrigin();
  const lineSeriesData: any[] = [];
  origins.forEach((originData: any) => {
    const originDataItem = this.citySeries.getDataItemById(originData.id);
    originData.destinations.forEach((destId: any) => {
      const destinationDataItem = this.citySeries.getDataItemById(String(destId));
      if (originDataItem && destinationDataItem) {
        const lineData = {
          geometry: {
            type: "LineString",
            coordinates: [
              [originDataItem.get("longitude"), originDataItem.get("latitude")],
              [destinationDataItem.get("longitude"), destinationDataItem.get("latitude")]
            ]
          },
          animationPosition: 0
        };
        lineSeriesData.push(lineData);
      }
    });
 
  });

  var points: any[] = [];
 this.lineSeriesMap.data.setAll(lineSeriesData);
  
}
getOrigin() {
  const transitions: { id: any; destinations: any; }[] = [];
  const location:any =this.routeData;
  this.destination1 = location[0].Destination1;
  this.destination2 = location[0].Destination2;
  this.destination3 = location[0].Destination3;
  this.finalMeditor.push(location[0]?.Central);
  this.finalMeditor.push(location[0]?.Western);
  this.finalMeditor.push(location[0]?.WesternMedi);
  this.finalMeditor.push(location[0]?.WesternAfrica);
  console.log('finalMeditor',this.finalMeditor);
  this.center = location[0].Central;
  this.western = location[0].Western;
  this.westernMed = location[0].WesternMedi;
  this.westernAfrica= location[0].WesternAfrica;
  let lastDestination = location[0].Country;
  
  const order = ["Destination1", "Destination2", "Destination3", "Central", "Western", "WesternMedi", "WesternAfrica", "Final"];
  
  for (let i = 0; i < order.length; i++) {
    const currentKey = order[i];
  
    if (location[0] && location[0][currentKey]) {
      transitions.push({ id: lastDestination, destinations: [location[0][currentKey]] });
      lastDestination = location[0][currentKey];
    } else {
      break; // Break if the current destinations is not available
    }
  }
  if ( location[0].Destination3) {
    transitions.push({ id: location[0].Destination3, destinations:[ location[0].Central ]});
    transitions.push({ id: location[0].Destination3, destinations: [location[0].Western] });
    transitions.push({ id: location[0].Destination3, destinations: [location[0].WesternMedi] });
    transitions.push({ id: location[0].Destination3, destinations: [location[0].WesternAfrica] });
  }
  if ( location[0].Destination2) {
    transitions.push({ id: location[0].Destination2, destinations: [location[0].Central ]});
    transitions.push({ id: location[0].Destination2, destinations: [location[0].Western] });
    transitions.push({ id: location[0].Destination2, destinations: [location[0].WesternMedi] });
    transitions.push({ id: location[0].Destination2, destinations: [location[0].WesternAfrica] });
  }
  if ( location[0].Destination1) {
    transitions.push({ id: location[0].Destination1, destinations: [location[0].Central] });
    transitions.push({ id: location[0].Destination1, destinations: [location[0].Western ]});
    transitions.push({ id: location[0].Destination1, destinations: [location[0].WesternMedi] });
    transitions.push({ id: location[0].Destination1, destinations: [location[0].WesternAfrica] });
  }
  // Add the final destinations (if available)
  if (location[0].Central  ) {
    transitions.push({ id: location[0].Central, destinations: [location[0].Final] });
  }
  if (location[0].Western  ) {
    transitions.push({ id: location[0].Western, destinations: [location[0].Final] });
  }
  if (location[0].WesternMedi  ) {
    transitions.push({ id: location[0].WesternMedi, destinations:[ location[0].Final] });
  }
  if (location[0].WesternAfrica  ) {
    transitions.push({ id: location[0].WesternAfrica, destinations: [location[0].Final] });
  }
  // If Destination3 is present, connect it to Central, Western, WesternMedi, and WesternAfrica
  

// Add the final destinations (if available)
if (location[0].Final) {
// transitions.push({ id: lastDestination, destinations: location[0].Final });
}
console.log(transitions);
return transitions;

}
  


 




  removeDuplicates(array: any[], property: string | number) {
    return array.filter((obj, index, self) =>
      index === self.findIndex((el) => el[property] === obj[property])
    );
  }

  selectCountry(country: any): void {
    this.finalMeditor=[];
    this.selectedCountryValue = country;
    this.totalMigration = this.sumCountryData(this.selectedCountryValue);
    this.routeData = this.data.filter((c: { Country: any; }) => c.Country === country);
      if (this.routeData.length) {
        console.log('Found country data', this.routeData);
      } else {
        console.log('Country data not found for', country);
      }
      this.setConnection();
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
  
 
   showPolygonColors() {
      this.polygonRouteSeries?.mapPolygons?.each((polygon: any) => {
        let countryMeanPairs: [string, number][] = [];
        const dataContext = polygon.dataItem?.dataContext;
        const data: { [key: string]: CountryData } | undefined = this.selectedIndicatorData();
        if (data) {
          countryMeanPairs = Object.entries(data).map(
            ([country, data]) => [country, data.mean || 0]
          );
          this.countryMeanIdPairs = Object.entries(data).map(
            ([country, data]) => ({ id: country, value: data.mean || 0 })
          );
        }

        if (dataContext && typeof dataContext === 'object' && 'name' in dataContext) {
          const countryName = dataContext.name;
          const countryEntry = countryMeanPairs?.find(([country]) => country === countryName);
          if (countryEntry?.length && (this.selectedIndicators[0] === 'Water index stress (Water)'
            || this.selectedIndicators[0] === 'Drought intensity change (Water)')) {
              polygon.set("fill", am5.color(getColorForValue(countryEntry[1])));
          }else if (countryEntry?.length && (this.selectedIndicators[0] === 'Crop yield change (Land)' ||
          this.selectedIndicators[0] === 'Agriculture water Stress index (Land)')) {
           polygon.set("fill", am5.color(getColorForLand(countryEntry[1]))); 
        } 
        else if (countryEntry?.length && (this.selectedIndicators[0]=== 'Heat Index Event exposure (Energy)')) {
          polygon.set("fill", am5.color(getColorForHeat(countryEntry[1])));
        }
        }
      });
      this.setupHeatLegend(1);
      this.heatLegend = this.chartRoute.children.push(am5.HeatLegend.new(this.rootRoute!, {
        orientation: "vertical",
        endColor: this.updateHeatLegendStartColor(this.selectedIndicator),
        startColor: this.updateHeatLegendEndColor(this.selectedIndicator),
        startText: this.updateHeatLegendStartText(this.selectedIndicator),
        endText: this.updateHeatLegendEndText(this.selectedIndicator),
        stepCount: 3,
        minHeight: 20,
        maxHeight: 500,
        startValue: 0,
        endValue: 3,
        pixelHeight: 30,
  
          y: 90
      }));
      
      this.heatLegend.startLabel.setAll({
        fontSize: 12,
        fill: this.heatLegend.get("startColor")
      });
      
      this.heatLegend.endLabel.setAll({
        fontSize: 12,
        fill: this.heatLegend.get("endColor")
      });
   
  }
  updateHeatLegendStartText(selectedCategory: string[]): string {
      if (this.selectedIndicators[0] === 'Water index stress (Water)' || this.selectedIndicators[0] === 'Agriculture water Stress index (Land)') {
        return 'Least reduction in \n available water';
      } else if (this.selectedIndicators[0]=== 'Crop yield change (Land)') {
        return 'Least reduction in \n crops';
      } else if (this.selectedIndicators[0]=== 'Heat Index Event exposure (Energy)') {
        return 'Least increase in heat stress';
      } else if (this.selectedIndicators[0] === 'Drought intensity change (Water)') {
        return 'Least increase drought intensity';
      }
      else {
        return 'Default start text';
      }
    
    return '';
  }

  updateHeatLegendEndText(selectedCategory: string[]): string {
  
      if (this.selectedIndicators[0] === 'Water index stress (Water)' || this.selectedIndicators[0]=== 'Agriculture water Stress index (Land)') {
        return 'Most reduction in \n available water';
      } else if (this.selectedIndicators[0] === 'Crop yield change (Land)') {
        return 'Most reduction in \n crops';
      } else if (this.selectedIndicators[0] === 'Heat Index Event exposure (Energy)') {
        return 'Most increase in heat stress';
      } else if (this.selectedIndicators[0] === 'Drought intensity change (Water)') {
        return 'Most increase drought intensity';
      } else {
        return 'Default end text';
      }
    
    return '';
  }
  updateHeatLegendEndColor(selectedIndicators: string[]) {
    if (this.selectedIndicators[0] === 'Water index stress (Water)'
      || this.selectedIndicators[0] === 'Drought intensity change (Water)') {
      return am5.color(0xCFCD9D);
    }
    else if (this.selectedIndicators[0] === 'Crop yield change (Land)' ||
      this.selectedIndicators[0] === 'Agriculture water Stress index (Land)') {
      return am5.color(0xf0b7a1);
      }
      else if (this.selectedIndicators[0] === 'Heat Index Event exposure (Energy)') {
        return am5.color(0xf0b7a1);
      
    }
    return am5.color("#000000");;
  }

  updateHeatLegendStartColor(selectedIndicators: string[]) {
    if (this.selectedIndicators[0] === 'Water index stress (Water)'
      || this.selectedIndicators[0] === 'Drought intensity change (Water)') {
      return am5.color(0xB41404);
    }
    else if (this.selectedIndicators[0] === 'Crop yield change (Land)' || this.selectedIndicators[0] === 'Agriculture water Stress index (Land)') {
      return am5.color(0x752201);
    }
    else if (this.selectedIndicators[0] === 'Heat Index Event exposure (Energy)') {
      return am5.color(0x752201);
    }
    return am5.color("#000000");;;
  }
  selectedIndicatorData(): any {
    if (this.selectedRcpValue === 'SSP-1(LOW)' && this.selectedIndicators[0] === 'Water index stress (Water)') {
      return this.meansByCountry;
    } else if (this.selectedRcpValue === 'SSP-1(LOW)'  && this.selectedIndicators[0]=== 'Drought intensity change (Water)') {
      return this.meansDroughtByCountry ;
    } else if (this.selectedRcpValue === 'SSP-1(LOW)' && this.selectedIndicators[0] === 'Crop yield change (Land)') {
      return this.meansCropYieldByCountry;
    } else if (this.selectedRcpValue === 'SSP-1(LOW)'  && this.selectedIndicators[0] === 'Agriculture water Stress index (Land)') {
      return this.meansAgricultureByCountry;
    }else if (this.selectedRcpValue === 'SSP-1(LOW)'  && this.selectedIndicators[0] === 'Heat Index Event exposure (Energy)') {
      return this.meansTemparatureByCountry;
    }
    else if (this.selectedRcpValue === 'SSP-2(MEDIUM)' && this.selectedIndicators[0] === 'Water index stress (Water)') {
      return this.meansByCountryMed;
    } else if (this.selectedRcpValue === 'SSP-2(MEDIUM)'  && this.selectedIndicators[0] === 'Drought intensity change (Water)') {
      return this.meansDroughtByCountryMed;
    } else if (this.selectedRcpValue === 'SSP-2(MEDIUM)' && this.selectedIndicators[0] === 'Crop yield change (Land)') {
      return this.meansCropYieldByCountryMed;
    } else if (this.selectedRcpValue === 'SSP-2(MEDIUM)'  && this.selectedIndicators[0] === 'Agriculture water Stress index (Land)') {
      return this.meansAgricultureByCountryMed;
    }else if (this.selectedRcpValue === 'SSP-2(MEDIUM)'  && this.selectedIndicators[0] === 'Heat Index Event exposure (Energy)') {
      return this.meansTemparatureByCountryMed;
    }
    else if (this.selectedRcpValue === 'SSP-3(HIGH)' && this.selectedIndicators[0] === 'Water index stress (Water)') {
      return this.meansByCountryHigh;
    } else if (this.selectedRcpValue === 'SSP-3(HIGH)'  && this.selectedIndicators[0] === 'Drought intensity change (Water)') {
      return this.meansDroughtByCountryHigh;
    } else if (this.selectedRcpValue === 'SSP-3(HIGH)' && this.selectedIndicators[0] === 'Crop yield change (Land)') {
      return this.meansCropYieldByCountryHigh;
    } else if (this.selectedRcpValue === 'SSP-3(HIGH)'  && this.selectedIndicators[0] === 'Agriculture water Stress index (Land)') {
      return this.meansAgricultureByCountryHigh;
    }else if (this.selectedRcpValue === 'SSP-3(HIGH)'  && this.selectedIndicators[0] === 'Heat Index Event exposure (Energy)') {
      return this.meansTemparatureByCountryHigh;
    }

    // Add a default return statement (could be null, an empty object, or another appropriate value)
    return null;
  }
  private updateDefaultColor(): void {
    this.heatLegend?.hide();
    if (this.chartRoute && this.chartRoute.series.length > 0) {
     // const polygonSeries = this.chart.series.getIndex(0) as am5map.MapPolygonSeries;
      if (this.polygonRouteSeries) {
        this.polygonRouteSeries.mapPolygons.each((polygon: { set: (arg0: string, arg1: am5.Color) => void; }) => {
          polygon.set("fill", am5.color(0x6794dc));
        });
      }
    }
  }

  selectRcp(value: any): void {
    this.selectedRcpValue=value;
  }

  selectYear(value:string){
    this.selectYearValue=value;
     let countryYearData;
    if(value === '2030' || value === '2050'){
    countryYearData = this.filterDataByCountryAndYear(this.selectedCountryValue, value,this.selectedRcpValue,this.selectedIndicator);
    this.totalMigration = countryYearData?.Value;
    }else{
      this.totalMigration=this.sumCountryData(this.selectedCountryValue);
    }
  }

  filterDataByCountryAndYear(country: any, year: string,rcp:string,indicators:string) {
    let filteredData:any ={};
    if(this.selectedRcpValue=='SSP-1(LOW)' && this.selectedIndicators[0] =='Water index stress (Water)')
    filteredData = this.waterYearMigrant.find((entry: { Country: any; }) => entry.Country === country);
    if(this.selectedRcpValue=='SSP-1(LOW)' && this.selectedIndicators[0] =='Drought intensity change (Water)')
    filteredData = this.droughtYearMigrant.find((entry: { Country: any; }) => entry.Country === country);
    if(this.selectedRcpValue=='SSP-1(LOW)' && this.selectedIndicators[0] =='Crop yield change (Land)')
    filteredData = this.cropYieldYearMigrant.find((entry: { Country: any; }) => entry.Country === country);
    if(this.selectedRcpValue=='SSP-1(LOW)' && this.selectedIndicators[0] =='Heat Index Event exposure (Energy)')
    filteredData = this.heatYearMigrant.find((entry: { Country: any; }) => entry.Country === country);
    return filteredData ? {
      Country: filteredData.Country,
      Scenario: filteredData.Scenario,
      Variable: filteredData.Variable,
      Value: filteredData[year]
    } : null;
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
  selectIndicator(value: string): void {
  //  this.heatLegend?.hide();
    const index = this.selectedIndicators.indexOf(value);
    if (index === -1) {
      this.selectedIndicators.push(value);
    } else {
      this.selectedIndicators.splice(index, 1);
    } 
    this.pointSeries?.data.clear();
      this.updateMap();
    
  }
  updateMap() {
    if( this.selectedIndicators.length === 1) {
      this.showPolygonColors();
    }
    else if( this.selectedIndicators.length > 1) {
    this.showIcons();
    }
    else {
      this.updateDefaultColor();
    }
  }
  showIcons(){
    if (this.selectedRcpValue === 'SSP-1(LOW)' && this.selectedIndicators?.length > 1) {
      const property = 'SSP1_1p5_Score';
      //this.mergedJSON = this.mergeJsonSources([this.fetchData, this.calculateMeanByCountry(this.droughtData,property), this.calculateMeanByCountry(this.cropYieldData,property) ]);
      const selectedDataSources = [];
      for (const indicator of this.selectedIndicators) {
        switch (indicator) {
          case 'Drought intensity change (Water)':
            selectedDataSources.push(this.calculateMeanByCountry(this.droughtData, property,'Drought intensity change (Water)'));
            break;
          case 'Crop yield change (Land)':
            selectedDataSources.push(this.calculateMeanByCountry(this.cropYieldData, property,'Crop yield change (Land)'));
            break;
            case 'Water index stress (Water)':
              selectedDataSources.push(this.calculateMeanByCountry(this.rcpData, property,'Water index stress (Water)'));
              break;
              case 'Agriculture water Stress index (Land)':
                selectedDataSources.push(this.calculateMeanByCountry(this.agricultureData, property,'Agriculture water Stress index (Land)'));
                break;
                case 'Heat Index Event exposure (Energy)':
                  selectedDataSources.push(this.calculateMeanByCountry(this.temperaturData, property,'Heat Index Event exposure (Energy)'));
                  break;
          
        }
      }
//this.pointSeries.data.clear();
      this.mergedJSON = this.mergeJsonSources([this.fetchData, ...selectedDataSources]);
      this.cd.detectChanges();
      //this.setIconsMap();
  //    this.cd.detectChanges();
  //this.initializeChart();
  this.setIconsMap();

  }

 
}
  setIconsMap() {
    
   //this.initializeChart();
   this.pointSeries = this.chartRoute?.series.push(
      am5map.MapPointSeries.new(this.rootRoute, {
        polygonIdField: "id"
      })
    );
    
    if (this.mergedJSON) {
      for (let i = 0; i < this.mergedJSON.length; i++) {
        const d = this.mergedJSON[i];
    
        // Assuming you have an array of mean values in the order you want
        const meanValues = [d.mean1, d.mean2, d.mean3,d.mean4,d.mean5];
        this.means= meanValues;
        const nameValues=[d.name1,d.name2,d.name3,d.name4,d.name5]
    
        const pointData:any = {
          geometry: { type: 'Point', coordinates: [d.longitude,d.latitude] },
          id: d.id,
          title: d.Country,
          value: d.Country,
        };
        for (let j = 0; j < meanValues.length; j++) {
          pointData[`mean${j + 1}`] = meanValues[j];
         
        }
        for (let j = 0; j < nameValues.length; j++) {
          
          pointData[`name${j + 1}`] = nameValues[j];
        }

        this.pointSeries?.data.push(pointData);
     // }
      }
    }
    const colorSet = am5.ColorSet.new(this.rootRoute, { step: 2 });

this.pointSeries?.bullets.push((root1: am5.Root, series: any, dataItem: any) => {
  const container = am5.Container.new(this.rootRoute, {});
  let meanValue;

  for (let i = 1; i <= this.selectedIndicators.length-1; i++) {
    // Assuming the mean values are stored in dataItem object
    if(i==1)
    meanValue = dataItem?.dataContext?.[`mean${i}`];
    if (meanValue !== undefined) {
      let indicator = this.selectedIndicators[i];
      let src = `/assets/images/${indicator}.png`;
      let numberOfCircles = 1;
      if (meanValue > 2) {
        numberOfCircles = 3;
      } else if (meanValue > 1 && meanValue < 2) {
        numberOfCircles = 2;
      }

      for (let j = 0; j < numberOfCircles; j++) {
        const horizontalSpacing = 2; // Adjust this value as needed
        const verticalSpacing = 2; // Adjust this value as needed
      // let dx =10;
        let dx = 10 * (i - 1) + j * (10 + horizontalSpacing);
        let dy = 10 + j * verticalSpacing;

        // Additional adjustments for specific values of i
        if (i === 2) {
          dy += 15; // Adjust this value as needed
        }
        if (i === 3) {
          dy += 30; // Adjust this value as needed
        }
        if (i === 4) {
          dy += 45; // Adjust this value as needed
        }
        if (i === 5) {
          dy += 60; // Adjust this value as needed
        }
        const circle = am5.Picture.new(this.rootRoute, {
          dx: dx,
          dy: dy,
          width: 15,
          height: 15,
          // centerX: am5.p50,
          // centerY: am5.p50,
          tooltipText: j === 0 ? `{name${i + 1}}-{mean${i + 1}}` : undefined,
          src: src
        });

        container.children.push(circle);
      }
    }
  }

  const label = am5.Label.new(root1, {
    centerX: am5.p50,
    centerY: am5.p50,
    //text: "{title}",
    populateText: true,
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "segoe ui symbol"
  });

  container.set("interactive", true);
  container.children.push(label);

  return am5.Bullet.new(root1, {
    sprite: container
  });
});
}

mergeJsonSources(sources: any[]) {
  const mergedData = [];
  if (sources.every(src => src)) {
    for (const entry of sources[0]) {
      const countryName = entry.Country;
      const mergedEntry: any = { ...entry };
      for (let i = 1; i < sources.length; i++) {
        const source = sources[i];
        if (source[countryName]) {
          for (const prop in source[countryName]) {
            
            if (prop !== "Country" && prop === 'mean') {
              const renamedProp = `mean${i}`;
              mergedEntry[renamedProp] = source[countryName][prop];
            } if (prop !== "Country" && prop === 'name') {
              const renamedProp = `name${i}`;
              mergedEntry[renamedProp] = source[countryName][prop];
            }
          }
          Object.assign(mergedEntry, source[countryName]);
        }
      }
      mergedData.push(mergedEntry);
    }
  }
  return mergedData;
}
}




