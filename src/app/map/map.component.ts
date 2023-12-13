
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CsvService } from '../service/CsvService';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { IComponentDataItem } from '@amcharts/amcharts5/.internal/core/render/Component';

interface CsvData {
  id: string;
  Continent: string;
  Country: string;
  value: string;
  Number_of_immigrants: string;
  Proportion: string;

}


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {


  private chart: am5map.MapChart | undefined;
  private bubbleSeries: am5map.MapPointSeries | undefined;
  private jsonData: any;

  public selectedContinent: string = 'Factor 1'; // Default selection
  public continents: string[] = ['Factor 1', 'Irregular migrants', 'Economic Score'];
  
  clicked: boolean = false;
  //dataSource: { id: any; Continent: any; Country: any; value: any; Number_of_immigrants: any; Proportion: any; }[];
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
  summaryData: any;
  constructor(private http: HttpClient, private dataService: CsvService, public dialog: MatDialog) { }



  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  onContinentChange(): void {
    if (this.bubbleSeries) {
      switch (this.selectedContinent) {
        case 'Factor 1':
          this.updateBubbleColor('red');
          break;
        case 'Irregular migrants':
          this.updateBubbleColor('red');
          break;
        case 'Economic Score':
          this.updateBubbleColor('green');
          break;
        default:
          break;
      }
    }

    console.log('Selected Continent:', this.selectedContinent);
  }

  private updateBubbleColor(color: string): void {
    if (this.bubbleSeries) {
      const heatRules = this.bubbleSeries.get('heatRules');
      if (heatRules && heatRules[0] && heatRules[0]['target']) {
        const circleTemplate = heatRules[0]['target'];
        if (circleTemplate) {
          circleTemplate.set('fill', am5.color(color));
        }
      }
    }
  }


  private loadData(): void {
    this.dataService.getCsvData().subscribe((csvData) => {
      this.jsonData = this.csvToJson<CsvData>(csvData);
      console.log('jsonData', this.jsonData);
      this.initChart();
      setInterval(() => this.updateData(), 2000);
    });
  }

  private initChart(): void {
    const chartdiv = document.getElementById('chartdiv');
    if (!chartdiv) {
      console.error('Chart container element not found!');
      return;
    }
    if (this.chart) {
      this.chart.dispose();
    }
    const root = am5.Root.new(chartdiv);
    root.setThemes([am5themes_Animated.new(root)]);
    this.chart = root.container.children.push(am5map.MapChart.new(root, {}));
    // this.chart.geoPoint().latitude=500;
    // this.chart.geoPoint().longitude=500;


    const polygonSeries = this.chart.series.push(
      am5map.MapPolygonSeries.new(root, {

        include: [
          'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
          'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
          'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
          'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ'
        ],
        geoJSON: am5geodata_worldLow,
      })
    );
    this.chart.set("zoomLevel", 0.9);
    this.bubbleSeries = this.chart.series.push(
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
    // console.log('dataItem',_dataItem);
    // const dialogRef = this.dialog.open(DialogComponent, {
    //   data: {
    //     //width: '250px', 
    //     panelClass: 'full-size-dialog',
    //     title: 'Dialog Title',
    //     data:_dataItem?.dataContext,
    //   },
    // });
    // const t = _dataItem?.dataContext['Continent']
    // console.log('dataItem is', t);
     this.clicked = true;
    // this.dataSource =
    //   [{
    //     id: _dataItem?.dataContext?.id,
    //     Continent: _dataItem?.dataContext.Continent,
    //     Country: _dataItem?.dataContext.name,
    //     value: _dataItem?.dataContext.value, Number_of_immigrants: _dataItem?.dataContext.Number_of_immigrants,
    //     Proportion: _dataItem?.dataContext.Proportion
    //   }];

  }
}
