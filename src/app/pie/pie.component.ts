import { Component, OnDestroy, OnInit } from '@angular/core';

import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';
import * as am5percent from "@amcharts/amcharts5/percent";
import { DataService } from '../service/dataService';
import { CsvService } from '../service/CsvService';
import data from '../data/graph';
import { RouteService } from '../service/route/central-med';


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
  selectedCountryValue: string | null = null;
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
 
  constructor(private dataService: CsvService,private routeService:RouteService) {}

  ngOnInit() {
    this.dataService.getCropYieldData().subscribe((rcp) => {
      this.coordinates = this.removeDuplicates(this.csvToJson<RegionData>(rcp), 'Country');
    });
    this.routeService.getMedRouteData().subscribe((rcp) => {
      this.migrants = this.csvToJson<RegionData>(rcp);
    });
    this.loadMap();
  }

  loadMap(){
    this.root = am5.Root.new("chartdestionation");
    this.root.setThemes([
      am5themes_Animated.new(this.root)
    ]);
    this.chart = this.root.container.children.push(am5map.MapChart.new(this.root, {
      panX: "translateX",
      panY: "translateY",
      projection: am5map.geoMercator()
    }));

    let cont = this.chart.children.push(am5.Container.new(this.root, {
      layout: this.root.horizontalLayout,
      x: 20,
      y: 40
    }));

    // Add labels and controls
    cont.children.push(am5.Label.new(this.root, {
      centerY: am5.p50,
      text: "Map"
    }));


    let polygonSeries = this.chart.series.push(am5map.MapPolygonSeries.new(this.root, {
      geoJSON: am5geodata_worldLow,
      include: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
        "MT", 'NL', "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB", 'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
        'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
        'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
        'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ'],
      calculateAggregates: true,
      interactive: true
    }));

    let graticuleSeries = this.chart.series.push(am5map.GraticuleSeries.new(this.root, {}));
    graticuleSeries.mapLines.template.setAll({
      stroke: this.root.interfaceColors.get("alternativeBackground"),
      strokeOpacity: 0.08
    });

    this.chart.appear(1000, 100);
  }
  
  arrowLink(coordinates: { x: number; y: string } | null) {
    let citySeries = this.chart.series.push(
      am5map.MapPointSeries.new(this.root!, {})
    );
    if (this.lineSeries) {
      this.chart.series.removeValue(this.lineSeries);
    }
    // Create a new line series
    this.lineSeries = this.chart.series.push(am5map.MapLineSeries.new(this.root!, {}));
    citySeries.bullets.push(() => {
      let circle = am5.Circle.new(this.root!, {
        radius: 5,
        tooltipText: "{title}",
        tooltipY: 0,
        fill: am5.color(0xffba00),
        stroke: this.root?.interfaceColors.get("background"),
        strokeWidth: 2,
      });
      return am5.Bullet.new(this.root!, {
        sprite: circle,
      });
    });
    // Arrow series
    let arrowSeries = this.chart.series.push(
      am5map.MapLineSeries.new(this.root!, {})
    );
    this.cityData();
    citySeries.data.setAll(this.cities);
    let destinations = ["Denmark"];
    let originLongitude = coordinates!.x;
    let originLatitude = coordinates!.y;

    am5.array.each(destinations, (did) => {
      let destinationDataItem = citySeries.getDataItemById(did);
      if (destinationDataItem) {
        let lineDataItem = this.lineSeries?.pushDataItem({
          geometry: {
            type: "LineString",
            coordinates: [
              [originLongitude, originLatitude],
              [
                destinationDataItem.get("longitude") ?? 0,
                destinationDataItem.get("latitude") ?? 0,
              ], // Provide default values if longitude or latitude is undefined
            ],
          },
        });


      } else {
        console.error("Destination data item not found for ID: ", did);
      }
    });
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
      id: 'Denmark', title: 'Denmark', geometry: {
        type: "Point",
        coordinates: [56.26, 56.26]
      }
    })
  }

  removeDuplicates(array: any[], property: string | number) {
    return array.filter((obj, index, self) =>
      index === self.findIndex((el) => el[property] === obj[property])
    );
  }

  selectCountry(country: string): void {
    this.selectedCountryValue = country;
    const coordinates = this.findCoordinatesByCountry(this.selectedCountryValue, this.coordinates);
    this.totalMigration = this.sumCountryData(this.selectedCountryValue);
    this.arrowLink(coordinates);
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

  sumCountryData(country: any) {
    let sum = 0;
    let totalSum;
    const countryData = {};
    for (const date in this.migrants) {
      const Value = parseInt(this.migrants[date][country], 10);
      if (!isNaN(Value)) {
        sum += Value;
      }
    }
    return sum;
  } 
}




