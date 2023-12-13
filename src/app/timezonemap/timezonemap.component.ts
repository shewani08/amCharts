import { Component } from '@angular/core';


import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';
import { CsvService } from '../service/CsvService';
import { HttpClient } from '@angular/common/http';

interface CsvData {
  id: string;
  Continent: string;
  Country: string;
  value: string;
  Number_of_immigrants: string;
  Proportion: string;

}

@Component({
  selector: 'app-timezonemap',
  templateUrl: './timezonemap.component.html',
  styleUrls: ['./timezonemap.component.css']
})
export class TimezonemapComponent {
  private bubbleSeries: am5map.MapPointSeries | undefined;
  summaryData: any;
  countryNames = [
    'Algeria',
    'Angola',
    'Benin',
    'Botswana',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cameroon',
    'Central African Republic',
    'Chad',
    'Comoros',
    'Congo',
    'Côte d\'Ivoire',
    'Djibouti',
    'DR Congo',
    'Egypt',
    'Equatorial Guinea',
    'Eritrea',
    'Eswatini',
    'Ethiopia',
    'Gabon',
    'Gambia',
    'Ghana',
    'Guinea',
    'Guinea-Bissau',
    'Kenya',
    'Lesotho',
    'Liberia',
    'Libya',
    'Madagascar',
    'Malawi',
    'Mali',
    'Mauritania',
    'Mauritius',
    'Morocco',
    'Mozambique',
    'Namibia',
    'Niger',
    'Nigeria',
    'Rwanda',
    'Sao Tome & Principe',
    'Senegal',
    'Seychelles',
    'Sierra Leone',
    'Somalia',
    'South Africa',
    'South Sudan',
    'Sudan',
    'Tanzania',
    'Togo',
    'Tunisia',
    'Uganda',
    'Zambia',
    'Zimbabwe'
  ];
  indicatorName = [
    'drought intensity change',
    'non renewable groundwater stress',
    'water stress index',

    'agricultural water stress index',
    'crop yield change',
    'habitat degradation',

    'Consecutive dry days',
    'Heavy precipitation days (Precipitation > 10mm)',
    'Very heavy precipitation days (Precipitation > 20mm)',
    'Wet days (Annual total precipitation when PR > historical 95th percentile)',
    'Very wet days (Annual total precipitation when PR > historical 99th percentile)',
    'Precipitation intensity index (Annual total precipitation / no. of wet days)'
  ]
  jsonData: any;
  clicked: boolean = false;
  constructor(private http: HttpClient, private dataService: CsvService) { }
  ngOnInit(){
    this.loadData();
  }
  private loadData(): void {
    this.dataService.getCsvData().subscribe((csvData) => {
      this.jsonData = this.csvToJson<CsvData>(csvData);
      console.log('jsonData', this.jsonData);
      this.loadMap();
    setInterval(() => this.updateData(), 2000);
    });
  }
  private updateData(): void {
    if (this.bubbleSeries && this.jsonData) {
      const data = this.jsonData;
      for (let i = 0; i < this.bubbleSeries.dataItems.length; i++) {
        const newDataItem = {
          value: data[i].value,
          id: data[i].id,
          name: data[i].Country,
          Number_of_immigrants: data[i].Number_of_immigrants,
          Proportion: data[i].Proportion
        };
        this.bubbleSeries.data.setIndex(i, newDataItem);
      }
    }
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
  private loadMap() {
    let root = am5.Root.new("timemap");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    // Create the map chart
    // https://www.amcharts.com/docs/v5/charts/map-chart/
    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "translateX",
        panY: "translateY",
        projection: am5map.geoMercator()
      })
    );
    
    let colorSet = am5.ColorSet.new(root, {});
    
    // Create main polygon series for time zone areas
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
    let areaSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        include: [
          'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
          'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
          'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
          'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ'
        ],
        geoJSON: am5geodata_worldLow
      })
    );
    
    let areaPolygonTemplate = areaSeries.mapPolygons.template;
    areaPolygonTemplate.setAll({ fillOpacity: 0.6 });
    areaPolygonTemplate.adapters.add("fill", function (fill, target) {
      return am5.Color.saturate(
        colorSet.getIndex(areaSeries.mapPolygons.indexOf(target)),
        0.5
      );
    });
    
    areaPolygonTemplate.states.create("hover", { fillOpacity: 0.8 });
    
    // Create main polygon series for time zones
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
    let zoneSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        include: [
          'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
          'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
          'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
          'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ'
        ],
        geoJSON: am5geodata_worldLow
      })
    );
   // zoneSeries.data.setAll(this.jsonData);
    zoneSeries.mapPolygons.template.setAll({
      fill: am5.color(0x000000),
      fillOpacity: 0.08,
     // userData:this.jsonData
    });
   
    // let zonePolygonTemplate = zoneSeries.mapPolygons.template;
    // zoneSeries.data.setAll(this.jsonData);
    // zonePolygonTemplate.setAll({ interactive: true, tooltipText: "{id}"});
    // zonePolygonTemplate.states.create("hover", { fillOpacity: 0.3 });
   
    // labels
    // let labelSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
    // labelSeries.bullets.push(() => {
    //   return am5.Bullet.new(root, {
    //     sprite: am5.Label.new(root, {
    //      // text: "{id}",
    //       populateText: true,
    //       centerX: am5.p50,
    //       centerY: am5.p50,
    //       fontSize: "0.7em"
    //     })
    //   });
    // });
    
    
    
    // create labels for each zone
    // zoneSeries.events.on("datavalidated", () => {
    //   am5.array.each(zoneSeries.dataItems, (dataItem) => {
    //     let centroid = dataItem.get("mapPolygon").visualCentroid();
    //     labelSeries.pushDataItem({
          
    //       id: dataItem.get("id"),
          
    //       geometry: {
           
    //         type: "Point",
    //         coordinates: [centroid.longitude, centroid.latitude],
            
    //       }
    //     });
    //   });
    // });
    this.bubbleSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        valueField: 'value',
        calculateAggregates: true,
        polygonIdField: 'id'
      })
    );

    const circleTemplate = am5.Template.new({});
    let colorset = am5.ColorSet.new(root, {});
    this.bubbleSeries.bullets.push((root, series, dataItem) => {
      const container = am5.Container.new(root, {});
      const circle = container.children.push(
        am5.Circle.new(root, {
          //   dx:-250,
          // dy:-50,
          // tooltipY: 0,
          radius: 3,
          strokeOpacity: 0,
          fillOpacity: 0.7,
          fill: colorset.next(),
          // fill: am5.color(0xffa500),
          cursorOverStyle: 'pointer',
          tooltipText: '{name}: [bold]{value}[/]\nNumber of Irregular migrants: [bold]{Number_of_immigrants}[/]\nProportion: [bold]{Proportion}[/]'
        }, circleTemplate as any)
      );

      const countryLabel = container.children.push(
        am5.Label.new(root, {
          //   dx:-280,
          // dy:-50,
          text: '{name}',
          paddingLeft: 5,
          populateText: true,
          // tooltipY: 0,
          // fontWeight: 'bold',
          fontSize: 10,
          centerY: am5.p50
        })
      );
      circle.on('radius', (radius: any) => {
        countryLabel.set('x', radius);
      });
      circle.animate({
        key: "scale",
        from: 1,
        to: 5,
        duration: 600,
        easing: am5.ease.out(am5.ease.cubic),
        loops: Infinity
      });
      circle.animate({
        key: "opacity",
        from: 1,
        to: 0.1,
        duration: 600,
        easing: am5.ease.out(am5.ease.cubic),
        loops: Infinity
      });
      circle.events.on("click", (event) => {
        this.openDialog(event.target.dataItem);
        //  const countryId = event.target.get("dataItem.dataContext.id");
        console.log("Bubble clicked for country with ID:", event.target.dataItem);
        // Add your custom logic here based on the clicked country
      });
      return am5.Bullet.new(root, {
        sprite: container,
        dynamic: true
      });
    });

    this.bubbleSeries.bullets.push((root, series, dataItem) => {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          // text: '{value.formatNumber(\'#\')}',
          fill: am5.color(0xffffff),
          populateText: true,
          centerX: am5.p50,
          centerY: am5.p50,
          textAlign: 'center',
          //   dx:-290,
          // dy:-10
        }),
        dynamic: true
      });
    });
    this.bubbleSeries.set('heatRules', [
      {
        target: circleTemplate,
        dataField: 'value',
        min: 10,
        max: 30,
        minValue: 0,
        maxValue: 0,
        key: 'radius'
      }
    ]);
    this.bubbleSeries.data.setAll(this.jsonData);
    // Add zoom control
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Zoom_control
    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
    
    // Add labels and controls
    // let cont = chart.children.push(
    //   am5.Container.new(root, {
    //     layout: root.horizontalLayout,
    //     x: 20,
    //     y: 40
    //   })
    // );
    
    // cont.children.push(
    //   am5.Label.new(root, {
    //     centerY: am5.p50,
    //     text: "Map"
    //   })
    // );
    
    // let switchButton = cont.children.push(
    //   am5.Button.new(root, {
    //     themeTags: ["switch"],
    //     centerY: am5.p50,
    //     icon: am5.Circle.new(root, {
    //       themeTags: ["icon"]
    //     })
    //   })
    // );
    
    // switchButton.on("active", function () {
    //   if (!switchButton.get("active")) {
    //     chart.set("projection", am5map.geoMercator());
    //     chart.set("panX", "translateX");
    //     chart.set("panY", "translateY");
    //   } else {
    //     chart.set("projection", am5map.geoOrthographic());
    //     chart.set("panX", "rotateX");
    //     chart.set("panY", "rotateY");
    //   }
    // });
    
    // cont.children.push(
    //   am5.Label.new(root, {
    //     centerY: am5.p50,
    //     text: "Globe"
    //   })
    // );
    // Make stuff animate on load
    chart.appear(1000, 100);

  }
  selectedRcpValue: string | null = null;
  selectedIndicatorValue: string | null = null;
  selectedNameValue: string | null = null;
  selectedCountryValue: string | null = null;

  selectRcp(value: string): void {
    this.selectedRcpValue = value;
  }

  selectIndicator(value: string): void {
    this.selectedIndicatorValue = value;
  }
  selectCountry(country: string): void {
    this.selectedCountryValue = country;

  }
  selectName(value: string): void {
    this.selectedNameValue = value;
  }
  openDialog(_dataItem: any): void {
    this.summaryData=_dataItem;
    
     this.clicked = true;
   

  }

}
