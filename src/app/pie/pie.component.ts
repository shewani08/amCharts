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
  selectYearValue:string ='';
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
 
  constructor(private dataService: CsvService,private routeService:RouteService,private heatwaterService:HeatWaterService,private migrantYearService:MigrantYearService) {

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


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
this.rootRoute.setThemes([
am5themes_Animated.new(this.rootRoute)
]);


// Create the map chart
// https://www.amcharts.com/docs/v5/charts/map-chart/
this.chartRoute = this.rootRoute.container.children.push(am5map.MapChart.new(this.rootRoute, {
}))


// Create main polygon series for countries
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
this.polygonRouteSeries = this.chartRoute?.series.push(am5map.MapPolygonSeries.new(this.rootRoute, {
geoJSON: am5geodata_worldLow,
include: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
"MT", 'NL', "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB", 'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ','UK'],
}));


this.chartRoute?.set("zoomLevel", 1);

// Create line series for trajectory lines
// https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/
 this.lineSeriesMap = this.chartRoute.series.push(am5map.MapLineSeries.new(this.rootRoute, {}));
// this.lineSeriesMap.mapLines.template.setAll({
// stroke: root.interfaceColors.get("alternativeBackground"),
// strokeOpacity: 0.6
// });

// destinations series
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

// arrow series
// let arrowSeries = chart.series.push(
// am5map.MapPointSeries.new(root, {})
// );

// arrowSeries.bullets.push(function() {
// let arrow = am5.Graphics.new(root, {
//   fill: am5.color(0x000000),
//   stroke: am5.color(0x000000),
//   draw: function (display) {
//     display.moveTo(0, -3);
//     display.lineTo(8, 0);
//     display.lineTo(0, 3);
//     display.lineTo(0, -3);
//   }
// });

// return am5.Bullet.new(root, {
//   sprite: arrow
// });
// });


// arrowSeries.bullets.push(function() {
// let arrow = am5.Graphics.new(root, {
//   fill: am5.color(0x000000),
//   stroke: am5.color(0x000000),
//   draw: function (display) {
//     display.moveTo(0, -3);
//     display.lineTo(8, 0);
//     display.lineTo(0, 3);
//     display.lineTo(0, -3);
//   }
// });

// return am5.Bullet.new(root, {
//   sprite: arrow
// });
////});


//const visibleCountries = ["Nigeria", "Niger", "Algeria", "Libya", "Morocco", "West Sharan", "United Kingdom"];

// Create point series for visible countries
// let visibleCitySeries = this.chartRoute.series.push(
// am5map.MapPointSeries.new(this.rootRoute, {
 
// })

// );
// visibleCitySeries.data.setAll(["Nigeria", "Niger", "Algeria", "Libya", "Morocco", "West Sharan", "United Kingdom"]);

// visibleCitySeries.bullets.push(() => {
// let circle = am5.Circle.new(this.chartRoute, {
//   radius: 5,
//   tooltipText: "{title}",
//   tooltipY: 0,
//   fill: am5.color(0xffba00),
//   //stroke: this.chartRoute.interfaceColors.get("background"),
//   strokeWidth: 2
// });

// return am5.Bullet.new(this.chartRoute, {
//   sprite: circle
// });
// });


if(this.data)
this.citySeries.data.setAll(this.data);

// prepare line series data
// let destinations = ["reykjavik", "lisbon", "moscow", "belgrade", "ljublana", "madrid", "stockholm", "bern", "kiev", "new york"];
// // London coordinates
// let originLongitude = 26.820553;
// let originLatitude = 30.802498;



// polygonSeries.events.on("datavalidated", function () {
//   chart.zoomToGeoPoint({ longitude: -0.1262, latitude: 51.5002 }, 3);
// })
//this.setConnection();

// Make stuff animate on load
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
  // Loop to push data items to pointSeries
  // lineSeriesData.forEach((item: any) => {
  //   points.push(this.citySeries.pushDataItem(item));
  // });
  
  // this.lineSeriesMap.pushDataItem({
  //  pointsToConnect: points
  // });
 
  // Set the line series data
  // this.lineSeriesMap.pushDataItem({
  //   pointsToConnect: lineSeriesData
  //  });
 this.lineSeriesMap.data.setAll(lineSeriesData);
  
}
getOrigin() {
  const transitions: { id: any; destinations: any; }[] = [];
  // const location[0] :any= {
  //   Central: "Libya",
  //   Country: "Nigeria",
  //   Destination1: "Niger",
  //   Destination2: undefined,
  //   Destination3: undefined,
  //   Final: "United Kingdom",
  //   Western: "Algeria",
  //   WesternAfrica: "",
  //   WesternMedi: "Morocco",
  //   geometry: { type: 'Point', coordinates: [] },
  //   id: "Nigeria",
  //   name: "Nigeria",
  //   title: "Nigeria"
  // };
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
  loadMap(){
    this.root = am5.Root.new("chartdestionation");
    this.root.setThemes([
      am5themes_Animated.new(this.root)
    ]);
 
    this.chart = this.root.container.children.push(am5map.MapChart.new(this.root, {  }));
   

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
      
 
    }));
    this.chart?.set("zoomLevel", 1);
   
    
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
    { name :'Algeira',longitude:-1.659626 , latitude:28.033886 },
    //{ name :'Libya',longitude:13.1913 , latitude:32.8872 },
    { name :this.mediator,latitude: mediatorCountry?.x, longitude: mediatorCountry?.y},
    { name :'Italy',longitude:12.240456489308606 , latitude:43.08918192577643 },
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
    this.finalMeditor=[];
    this.selectedCountryValue = country;
   // this.totalMigration = this.sumCountryData(this.selectedCountryValue);
    this.routeData = this.data.filter((c: { Country: any; }) => c.Country === country);
      if (this.routeData.length) {
        console.log('Found country data', this.routeData);
      } else {
        console.log('Country data not found for', country);
      }
      this.setConnection();
  }

 

  selectCountry1(country: any): void {
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
  }
  selectMapType(type: any) {
    this.selectedIndicator=type;
    if (this.selectedRcpValue === 'RCP 2.6(LOW)' || this.selectedRcpValue === 'RCP 4.5(MEDIUM)' || this.selectedRcpValue === 'RCP 8.5(HIGH)') {
      this.showPolygonColors();
      
    
     
    }


  }
  showPolygonColors() {
 
   //this.polygonRouteSeries const polygonSeries = this.polygonRouteSeries.series.getIndex(0) as am5map.MapPolygonSeries;
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
          if (countryEntry?.length && (this.selectedIndicator === 'Water index stress (Water)'
            || this.selectedIndicator === 'Drought intensity change (Water)')) {
              polygon.set("fill", am5.color(getColorForValue(countryEntry[1])));
          }else if (countryEntry?.length && (this.selectedIndicator === 'Crop yield change (Land)' ||
          this.selectedIndicator === 'Agriculture water Stress index (Land)')) {
           polygon.set("fill", am5.color(getColorForLand(countryEntry[1]))); 
        } 
        else if (countryEntry?.length && (this.selectedIndicator=== 'Heat Index Event exposure (Energy)')) {
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
  
      if (this.selectedIndicator === 'Water index stress (Water)' || this.selectedIndicator === 'Agriculture water Stress index (Land)') {

        return 'Least reduction in \n available water';
      } else if (this.selectedIndicator=== 'Crop yield change (Land)') {
        return 'Least reduction in \n crops';
      } else if (this.selectedIndicator=== 'Heat Index Event exposure (Energy)') {
        return 'Least increase in heat stress';
      } else if (this.selectedIndicator === 'Drought intensity change (Water)') {
        return 'Least increase drought intensity';
      }
      else {
        return 'Default start text';
      }
    
    return '';
  }

  updateHeatLegendEndText(selectedCategory: string[]): string {
  
      if (this.selectedIndicator === 'Water index stress (Water)' || this.selectedIndicator=== 'Agriculture water Stress index (Land)') {
        return 'Most reduction in \n available water';
      } else if (this.selectedIndicator === 'Crop yield change (Land)') {
        return 'Most reduction in \n crops';
      } else if (this.selectedIndicator === 'Heat Index Event exposure (Energy)') {
        return 'Most increase in heat stress';
      } else if (this.selectedIndicator === 'Drought intensity change (Water)') {
        return 'Most increase drought intensity';
      } else {
        return 'Default end text';
      }
    
    return '';
  }
  updateHeatLegendEndColor(selectedIndicators: string[]) {
    if (this.selectedIndicator=== 'Water index stress (Water)'
      || this.selectedIndicator === 'Drought intensity change (Water)') {
      return am5.color(0xCFCD9D);
    }
    else if (this.selectedIndicator=== 'Crop yield change (Land)' ||
      this.selectedIndicator === 'Agriculture water Stress index (Land)') {
      return am5.color(0xf0b7a1);
      }
      else if (this.selectedIndicator === 'Heat Index Event exposure (Energy)') {
        return am5.color(0xf0b7a1);
      
    }
    return am5.color("#000000");;
  }

  updateHeatLegendStartColor(selectedIndicators: string[]) {
    if (this.selectedIndicator === 'Water index stress (Water)'
      || this.selectedIndicator === 'Drought intensity change (Water)') {
      return am5.color(0xB41404);
    }
    else if (this.selectedIndicator === 'Crop yield change (Land)' || this.selectedIndicator === 'Agriculture water Stress index (Land)') {
      return am5.color(0x752201);
    }
    else if (this.selectedIndicator === 'Heat Index Event exposure (Energy)') {
      return am5.color(0x752201);
    }
    return am5.color("#000000");;;
  }
  selectedIndicatorData(): any {
    if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicator === 'Water index stress (Water)') {
      return this.meansByCountry;
    } else if (this.selectedRcpValue === 'RCP 2.6(LOW)'  && this.selectedIndicator === 'Drought intensity change (Water)') {
     
      return this.meansDroughtByCountry ;
    } else if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicator === 'Crop yield change (Land)') {
      return this.meansCropYieldByCountry;
    } else if (this.selectedRcpValue === 'RCP 2.6(LOW)'  && this.selectedIndicator === 'Agriculture water Stress index (Land)') {
      return this.meansAgricultureByCountry;
    }else if (this.selectedRcpValue === 'RCP 2.6(LOW)'  && this.selectedIndicator === 'Heat Index Event exposure (Energy)') {
      return this.meansTemparatureByCountry;
    }
    else if (this.selectedRcpValue === 'RCP 4.5(MEDIUM)' && this.selectedIndicator === 'Water index stress (Water)') {
      return this.meansByCountryMed;
    } else if (this.selectedRcpValue === 'RCP 4.5(MEDIUM)'  && this.selectedIndicator === 'Drought intensity change (Water)') {
      return this.meansDroughtByCountryMed;
    } else if (this.selectedRcpValue === 'RCP 4.5(MEDIUM)' && this.selectedIndicator === 'Crop yield change (Land)') {
      return this.meansCropYieldByCountryMed;
    } else if (this.selectedRcpValue === 'RCP 4.5(MEDIUM)'  && this.selectedIndicator === 'Agriculture water Stress index (Land)') {
      return this.meansAgricultureByCountryMed;
    }else if (this.selectedRcpValue === 'RCP 4.5(MEDIUM)'  && this.selectedIndicator === 'Heat Index Event exposure (Energy)') {
      return this.meansTemparatureByCountryMed;
    }
    else if (this.selectedRcpValue === 'RCP 8.5(HIGH)' && this.selectedIndicator === 'Water index stress (Water)') {
      return this.meansByCountryHigh;
    } else if (this.selectedRcpValue === 'RCP 8.5(HIGH)'  && this.selectedIndicator === 'Drought intensity change (Water)') {
      return this.meansDroughtByCountryHigh;
    } else if (this.selectedRcpValue === 'RCP 8.5(HIGH)' && this.selectedIndicator === 'Crop yield change (Land)') {
      return this.meansCropYieldByCountryHigh;
    } else if (this.selectedRcpValue === 'RCP 8.5(HIGH)'  && this.selectedIndicator === 'Agriculture water Stress index (Land)') {
      return this.meansAgricultureByCountryHigh;
    }else if (this.selectedRcpValue === 'RCP 8.5(HIGH)'  && this.selectedIndicator === 'Heat Index Event exposure (Energy)') {
      return this.meansTemparatureByCountryHigh;
    }

    // Add a default return statement (could be null, an empty object, or another appropriate value)
    return null;
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
  selectRcp(value: any): void {
    this.selectedRcpValue=value;
  }
  selectYear(value:string){
    this.selectYearValue=value;
    const countryYearData = this.filterDataByCountryAndYear(this.selectedCountryValue, value,this.selectedRcpValue,this.selectedIndicator);
    this.totalMigration = countryYearData?.Value;

  }
  filterDataByCountryAndYear(country: any, year: string,rcp:string,indicators:string) {
    let filteredData:any ={};
    if(this.selectedRcpValue=='RCP 2.6(LOW)' && this.selectedIndicator =='Water index stress (Water)')
    filteredData = this.waterYearMigrant.find((entry: { Country: any; }) => entry.Country === country);
    if(this.selectedRcpValue=='RCP 2.6(LOW)' && this.selectedIndicator =='Drought intensity change (Water)')
    filteredData = this.droughtYearMigrant.find((entry: { Country: any; }) => entry.Country === country);
    if(this.selectedRcpValue=='RCP 2.6(LOW)' && this.selectedIndicator =='Crop yield change (Land)')
    filteredData = this.cropYieldYearMigrant.find((entry: { Country: any; }) => entry.Country === country);
    if(this.selectedRcpValue=='RCP 2.6(LOW)' && this.selectedIndicator =='Heat Index Event exposure (Energy)')
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
}




