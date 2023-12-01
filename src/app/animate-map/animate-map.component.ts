import { Component } from '@angular/core';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { GeoJSON } from 'geojson';
import * as am5map from "@amcharts/amcharts5/map";
// Import the world map geodata
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import { color } from 'highcharts';
import { CsvService } from '../service/CsvService';
interface CsvData {
  id: string;
  Continent: string;
  Country: string;
  value: string;
}
@Component({
  selector: 'app-animate-map',
  templateUrl: './animate-map.component.html',
  styleUrls: ['./animate-map.component.css']
})

export class AnimateMapComponent {
  bubbleSeries: am5map.MapPointSeries | undefined;
  private jsonData: any;


  constructor(private dataService: CsvService) { }
  private loadData(): void {
    this.dataService.getCsvData().subscribe((csvData) => {
      this.jsonData = this.csvToJson<CsvData>(csvData);
      console.log('jsonData', this.jsonData);

      this.initChart();
      // setInterval(() => this.updateData(), 2000);
    });
  }
  private csvToJson<T>(csvData: string): T[] {
    const lines = csvData.split('\n');
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
    this.loadData();
  }
  initChart() {
    let root = am5.Root.new("chartdiv");
    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Filtered geoJSON for Africa, Europe, and UK
    const filteredGeoJSON: GeoJSON = {
      type: 'FeatureCollection',
      features: am5geodata_worldLow.features.filter((feature) => {
        if (feature && feature.properties) {
          const region = feature.properties['name'];
          return region === 'Africa';
        }
        return false; // Or true if you want to include null/undefined features
      })
    };
    var selectedRegions = ["Africa", "Europe", "GB"];
    // Create the map chart
    // https://www.amcharts.com/docs/v5/charts/map-chart/
    let chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: "rotateX",
      panY: "translateY",
      projection: am5map.geoMercator(),
      homeGeoPoint: { latitude: 2, longitude: 2 }
    }));
    let cont = chart.children.push(am5.Container.new(root, {
      layout: root.horizontalLayout,
      x: 20,
      y: 40
    }));


    // Add labels and controls
    cont.children.push(am5.Label.new(root, {
      centerY: am5.p50,
      text: "Map"
    }));

    let switchButton = cont.children.push(am5.Button.new(root, {
      themeTags: ["switch"],
      centerY: am5.p50,
      icon: am5.Circle.new(root, {
        themeTags: ["icon"]
      })
    }));

    switchButton.on("active", function () {
      if (!switchButton.get("active")) {
        chart.set("projection", am5map.geoMercator());
        chart.set("panY", "translateY");
        chart.set("rotationY", 0);
        backgroundSeries.mapPolygons.template.set("fillOpacity", 0);
      } else {
        chart.set("projection", am5map.geoOrthographic());
        chart.set("panY", "rotateY")

        backgroundSeries.mapPolygons.template.set("fillOpacity", 0.1);
      }
    });

    cont.children.push(
      am5.Label.new(root, {
        centerY: am5.p50,
        text: "Globe"
      })
    );

    // Create series for background fill
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
    let backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    backgroundSeries.mapPolygons.template.setAll({
      fill: root.interfaceColors.get("alternativeBackground"),
      fillOpacity: 0,
      strokeOpacity: 0
    });

    // Add background polygon
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    });
    backgroundSeries?.data.setAll(this.jsonData);
    // Create main polygon series for countries
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
    console.log('filteredGeoJSON', filteredGeoJSON);
    // let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
    //    geoJSON: am5geodata_worldLow
    // //  geoJSON: filteredGeoJSON
    // }));
    let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      // exclude:['AQ'],
      include: ["DZ", 'AO',  'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CD', 'DJ', 'GQ',
        'ER',
        'ET',
        'GA',
        'GM',
        'GH',
        'GN',
        'GW',
        'CI',
        'KE',
        'LS',
        'LR',
        'LY',
        'MG',
        'MW',
        'ML',
        'MR',
        'MU',
        'YT',
        'MA',
        'MZ', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI',
        'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV',
        'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
        'AL', 'AD',  'BY',
        ' BA ',
        'FO',
        'GE',
        'IG',
        ' IS',
        'IM',
        'XK',
        'LI',
        'MK',
        'MD',
        'MC',
        'ME',
        'NO',
        'RU',
        'SM ',
        'RS',
        'CH',
        ' TR ',
        ' UA ',
        ' GB ',
        ' VA',


        'AF',
        'AX',

        'AL',

        'DZ',

        'AS',

        'AD',

        'AO',

        



        

        

        'AM',

        

        'AU',

        'AT',

        

      

        

        

        

        'BY',

        'BE',

      

        'BJ',

        

        

      

        

        'BA',

        'BW',

        'BV',

        

        

        

        'BG',

        'BF',

        'BI',

        'CV',

        

        'CM',
      

        'CF',

        'TD',

      

        

        'CX',

        

        

        'KM',

        'CD',

        'CG',

        'CK',

        

        'CI',

        'HR',

      

        'CY',

        'CZ',

        'DK',

        'DJ',

      

        

        'EG',

        

        'GQ',

        'ER',

        'EE',

        'SZ',
        'ET',

        

        'FO',
        'FJ',

        'FI',

        'FR',

        

        'PF',

        'TF',

        'GA',

        'GM',

      

        'DE',

        'GH',

        'GI',

        'GR',

      


        'GU',

      

        'GG',

        'GN',

        'GW',

      

      
        'HM',

        'VA',

      

        

        'HU',

        'IS',

        

        

        'IE',

        'IM',

        

        'IT',

      

        

        'JE',

        

        

        'KE',

        'KI',

        

        

      

      

        'LV',

        

        'LS',

        'LR',

        'LY',

        'LI',

        'LT',

        'LU',

        

        'MG',

        'MW',

        

        

        'ML',

        'MT',

        'MH',

      

        'MR',

        'MU',

        'YT',

      

        'FM',

        'MD',

        'MC',

        

        'ME',

      

        'MA',

        'MZ',

      

        'NA',

        'NR',

        

        'NL',

        'NC',

        'NZ',

      

        'NE',

        'NG',

        'NU',

        'NF',

        'MK',

        'MP',

        'NO',

      

        'PW',

        

        

        'PG',

      

      

        'PN',

        'PL',

        'PT',

        

        

        'RE',

        'RO',

        'RU',

        'RW',

        

        'SH',

       

     

        'WS',

        'SM',

        'ST',

        

        'SN',

        'RS',

        'SC',

        'SL',

      

  

        'SK',

        'SI',

        'SB',

        'SO',

        'ZA',

        'GS',

        'SS',

        'ES',

        

        'SD',

      
        'SJ',

        'SE',

        'CH',

      


        'TZ',

        

        'TL',

        'TG',

        'TK',

        'TO',
      

        'TN',

        

        

        

        'TV',

        'UG',

        'UA',

        
        'GB',

        'UM',

        

        

      

        'VU',

        

        

        

        

        'WF',

        'EH',

        

        'ZM',

        'ZW',


      ],


      // exclude: ["antarctica"],
      geoJSON: am5geodata_worldLow
      //geoJSON: filteredGeoJSON // Use the filtered GeoJSON
    }));
    polygonSeries.mapPolygons.template.setAll({
      tooltipText: `{name}: [bold]{value}[/]`,
      interactive: true,
      fill: am5.color(0x0064FF),
      templateField: "polygonSettings"
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0xFFA500)
    });




    // Create line series for trajectory lines
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/
    let lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
    lineSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get("alternativeBackground"),
      strokeOpacity: 0.3
    });

    // Create point series for markers
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/
    let pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    // Configure bubble series











    //Configure bubble series ends

    //chart.set("zoomLevel", 2);

    pointSeries.bullets.push(function () {
      let circle = am5.Circle.new(root, {
        radius: 7,
        tooltipText: "Drag me!",
        cursorOverStyle: "pointer",
        tooltipY: 0,
        fill: am5.color(0xffba00),
        stroke: root.interfaceColors.get("background"),
        strokeWidth: 2,
        draggable: true
      });

      circle.events.on("dragged", function (event) {
        let dataItem = event.target.dataItem;
        let projection = chart.get("projection");
        let geoPoint = chart.invert({ x: circle.x(), y: circle.y() });

        if (dataItem) {
          let projection = chart.get("projection");
          let geoPoint = chart.invert({ x: circle.x(), y: circle.y() });
          if ('setLatitude' in dataItem && 'setLongitude' in dataItem) {
            (dataItem as { setLatitude: (lat: number) => void, setLongitude: (lon: number) => void })
              .setLatitude(geoPoint.latitude);
            (dataItem as { setLatitude: (lat: number) => void, setLongitude: (lon: number) => void })
              .setLongitude(geoPoint.longitude);
          } else {
            console.error('Latitude and Longitude setters not found on dataItem.');
          }
        }
      });

      return am5.Bullet.new(root, {
        sprite: circle
      });
    });

    let egypt = addCity({ latitude: 26.8206, longitude: 30.8025 }, "Egypt");
    let sudan = addCity({ latitude: 12.8628, longitude: 30.2176}, "Sudan");
    let morocco = addCity({ latitude: 31.7917, longitude: 7.0926 }, "Morocco");
    let algeria = addCity({ latitude: 28.0339, longitude: 1.6596 }, "Algeria");
    let tunisia = addCity({ latitude: 33.8869, longitude: 9.5375 }, "Tunisia");

    let lineDataItem = lineSeries.pushDataItem({
      pointsToConnect: [egypt, sudan, morocco, algeria,tunisia]
    });

    let planeSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    let plane = am5.Graphics.new(root, {
      svgPath:
        "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47",
      scale: 0.06,
      centerY: am5.p50,
      centerX: am5.p50,
      fill: am5.color(0x000000)
    });

    planeSeries.bullets.push(function () {
      let container = am5.Container.new(root, {});
      container.children.push(plane);
      return am5.Bullet.new(root, { sprite: container });
    });


    let planeDataItem = planeSeries.pushDataItem({
      lineDataItem: lineDataItem,
      positionOnLine: 0,
      autoRotate: true
    });
    planeDataItem.dataContext = {};

    planeDataItem.animate({
      key: "positionOnLine",
      to: 1,
      duration: 10000,
      loops: Infinity,
      easing: am5.ease.yoyo(am5.ease.linear)
    });

    planeDataItem.on("positionOnLine", (value) => {
      // if (planeDataItem.dataContext.value < value) {
      //   plane.set("rotation", 0);
      // }

      // if (planeDataItem.dataContext > value) {
      //   plane.set("rotation", -180);
      // }
      planeDataItem.dataContext = value;
    });

    function addCity(coords: { latitude: any; longitude: any; }, _title: string) {
      return pointSeries.pushDataItem({
        latitude: coords.latitude,
        longitude: coords.longitude
      });
    }

    // Make stuff animate on load
    chart.appear(1000, 100);

  }


}
