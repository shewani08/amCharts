
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
import { element } from 'angular';
import data from '../data/graph';
import { text } from 'd3';

interface CsvData {
  id: string;
  Continent: string;
  Country: string;
  value: string;
  Number_of_immigrants: string;
  Proportion: string;

}
interface Entry {
  Country: string;
  [key: string]: number | string; // Add other possible property types
}

interface Result {
  [country: string]: { count: number; sum: number; mean?: number };
}

interface CountryData {
  count: number;
  sum: number;
  mean?: number;
}

const getColorForValue = (value: number): string => {
  if (value >= 0 && value < 1) {
    return "#ff621f";
  } else if (value >= 1 && value < 2) {
    return "#d65016";
  } else {
    return "#842c06";
  }
};
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

  @ViewChild('dropdown')
  dropdown!: ElementRef;
  private chart: am5map.MapChart | undefined;
  private bubbleSeries: am5map.MapPointSeries | undefined;
  private jsonData: any;

  public selectedContinent: string = 'Factor 1'; // Default selection
  public continents: string[] = ['Factor 1', 'Irregular migrants', 'Economic Score'];

  clicked: boolean = false;
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
  indicators=[{id:'Drought intensity change (Water)', name:'Drought intensity change (Water)'},
    {id:'Water index stress (Water)',name:'Water index stress (Water)'},
    {id:'Heat Index Event exposure (Energy)',name:'Heat Index Event exposure (Energy)'},
    {id:'Agriculture water Stress index(Land)',name:'Agriculture water Stress index(Land)'},
    {id:'Crop yield change (Land)',name:'Crop yield change (Land)'}];
  indicatorName: string[] = [];
  summaryData: any;
  rcpData: any;
  meansByCountry: Result | undefined;
  countryMeanIdPairs: { id: string; value: number; }[] = [];
  meanData: any;
  showHeatLegend: boolean = false;
  chartdiv: HTMLElement | null | undefined;
  heatLegend: any;
  polygonSeries: any;
  countryEntry: any;
  selectedRcpValues: string[] = [];
  selectedIndicators: string[] = [];
  selectedYear: number = 2022;
  years: number[] = [2022, 2023];
  constructor(private http: HttpClient, private dataService: CsvService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  private updateBubbleColor(): void {
    let countryMeanPairs: [string, number][];
    const data: { [key: string]: CountryData } | undefined = this.meansByCountry;
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
      this.heatLegend = this.chart?.children.push(am5.HeatLegend.new(this.chart.root, {

        orientation: "vertical",
        endColor: am5.color(0x842c06), // Red
        startColor: am5.color(0xff621f),   // Green
        startText:this.updateHeatLegendStartText(this.selectedIndicators),
        endText:this.updateHeatLegendEndText(this.selectedIndicators),
        // startText: this.selectedIndicators[0] === 'Water index stress (Water)'?'Least reduction in available water':'',
        // endText: this.selectedIndicators[0] === 'Water index stress (Water)'?'Most reduction in available water':'',
        stepCount: 3,
        minHeight: 20, // Set the minimum height of the legend
        maxHeight: 500,
        startValue: 0,
        endValue: 3
      }));
      console.log('heatLegend', this.heatLegend);

      this.heatLegend?.startLabel.setAll({
        fontSize: 12,
        fill: this.heatLegend.get("startColor")
      });

      this.heatLegend?.endLabel.setAll({
        fontSize: 12,
        fill: this.heatLegend.get("endColor")
      });
      this.polygonSeries.mapPolygons.template.set("interactive", true);
      if (this.polygonSeries) {
        this.setupHeatLegend(1);
        this.polygonSeries.mapPolygons.each((polygon: { dataItem: { dataContext: any; }; set: (arg0: string, arg1: am5.Color) => void; }) => {
          const dataContext = polygon.dataItem?.dataContext;
          if (dataContext && typeof dataContext === 'object' && 'name' in dataContext) {
            const countryName = dataContext.name;
            const countryEntry = countryMeanPairs.find(([country]) => country === countryName);
            if (countryEntry?.length) {
              polygon.set("fill", am5.color(getColorForValue(countryEntry[1])));

            }
          } else {
            console.error('Invalid or missing data structure for polygon:', polygon);
          }
        });
     }
    }

  }
  private updateDefaultColor(): void {
    if (this.chart && this.chart.series.length > 0) {
      this.heatLegend.hide();
      const polygonSeries = this.chart.series.getIndex(0) as am5map.MapPolygonSeries;
      if (polygonSeries) {
        polygonSeries.mapPolygons.each((polygon) => {
          polygon.set("fill", am5.color(0x6794dc));
        });
      }
    }

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

  private loadData(): void {
    this.dataService?.getCsvData()?.subscribe((csvData) => {
      this.jsonData = this.csvToJson<CsvData>(csvData);
      this.initChart();
      setInterval(() => this.updateData(), 2000);
    });
    this.dataService.getRCPData().subscribe((rcp) => {
      this.rcpData = this.rcpToJson(rcp);
      const property = 'SSP1_1p5_Score';
      this.meansByCountry = this.calculateMeanByCountry(this.rcpData, property);
    })
  }

  private initChart(): void {
    this.chartdiv = document.getElementById('chartdiv');
    if (!this.chartdiv) {
      console.error('Chart container element not found!');
      return;
    }
    if (this.chart) {
      this.chart.dispose();
    }
    const root = am5.Root.new(this.chartdiv);
    root.setThemes([am5themes_Animated.new(root)]);
    this.chart = root.container.children.push(am5map.MapChart.new(root, {}));
    this.polygonSeries = this.chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        include: [
          'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
          'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
          'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
          'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ'
        ],
        geoJSON: am5geodata_worldLow,
        valueField: "value",
        calculateAggregates: true,
        interactive: true
        // fill: am5.color(0xffa500)
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
          radius: 3,
          strokeOpacity: 0,
          fillOpacity: 0.7,
          fill: colorset.next(),
          cursorOverStyle: 'pointer',
          tooltipText: '{name}: [bold]{value}[/]\nNumber of Irregular migrants: [bold]{Number_of_immigrants}[/]\nProportion: [bold]{Proportion}[/]'
        }, circleTemplate as any)
      );

      const countryLabel = container.children.push(
        am5.Label.new(root, {
          text: '{name}',
          paddingLeft: 5,
          populateText: true,
          fontSize: 10,
          centerY: am5.p50
        })
      );

      const valueLabel = document.createElement('div');
      valueLabel.style.fontSize = '12px';
      valueLabel.style.position = 'absolute';
      valueLabel.style.top = '10px'; // Adjust the position as needed
      document.body.appendChild(valueLabel);
      circle.on('radius', (radius: any) => {
        countryLabel.set('x', radius);
        this.updateValueLabel(valueLabel, radius);

      });
      circle.events.on("click", (event) => {
        this.openDialog(event.target.dataItem);
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
    this.setupHeatLegend(0);

  }
  public setupHeatLegend(data: any) {
    this.polygonSeries.set("heatRules", [{
      target: this.polygonSeries.mapPolygons.template,
      dataField: "value",
      min: am5.color(0xff621f),
      max: am5.color(0x661f00),
      key: "fill"
    }]);
    this.polygonSeries.mapPolygons.template.events.on("pointerover", this.onMapPolygonPointerOver.bind(this));
  }

  onMapPolygonPointerOver(ev: any) {
    let countryDetail = (ev.target.dataItem?.dataContext as { name: string }).name;
    let countryMeanPairs: any;
    let countryEntry;
    const data: { [key: string]: CountryData } | undefined = this.meansByCountry;
    if (data) {
      countryMeanPairs = Object.entries(data).map(
        ([country, data]) => [country, data.mean || 0]
      );
    }
    if (countryMeanPairs.length) {
      countryEntry = countryMeanPairs.find(([country]: [string, number]) => country === countryDetail);
    }
    if (countryEntry !== undefined && countryEntry[1])
      this.heatLegend?.showValue(countryEntry[1]);
  }

  private updateValueLabel(valueLabel: any, radius: number) {
    valueLabel.textContent = `Radius: ${radius.toFixed(2)}`; // Adjust formatting as needed
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
  selectedNameValue: string='';
  selectedCountryValue: string | null = null;

  selectRcp(value: string): void {
      this.selectedRcpValue = value;
     switch (value) {
          case 'RCP 2.6(low)':{
            // this.showHeatLegend=true;
            //   this.updateBubbleColor(); 

            this.showHeatLegend=false;
            this.updateDefaultColor();

              break;
          }
          case 'RCP 2.4(medium)':{
            if(this.heatLegend)
            this.heatLegend.hide();
            this.showHeatLegend=false;
              this.updateDefaultColor();
              this.polygonSeries.mapPolygons.template.events.off("pointerover", this.onMapPolygonPointerOver.bind(this));

              break;
          }
          default:{
            if(this.heatLegend)
           this.heatLegend.hide();
            this.updateDefaultColor();
            this.showHeatLegend=false;

            break;
          }
      }
  }

  selectIndicator(value: string): void {
    const index = this.selectedIndicators.indexOf(value);

    if (index === -1) {
      // Value not found, add it to the array
      this.selectedIndicators.push(value);

    } else {
      // Value found, remove it from the array
      this.selectedIndicators.splice(index, 1);
    } this.updateIndicatorName();


    // Handle other logic based on selected indicators as needed
  }
   updateIndicatorName(): void {
console.log('this.selectedIndicators',this.selectedIndicators[0]);
    if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicators?.length == 1 && this.selectedIndicators[0] === 'Water index stress (Water)') {
      this.showHeatLegend = true;
     // this.updateHeatLegendText(this.selectedIndicators[0] );
      this.updateBubbleColor();

    } else {
      //  this.polygonSeries.removeEventListener("pointerover", this.removePointer, false);
      this.showHeatLegend = false;
      // this.heatLegend.showValue(null);
      this.updateDefaultColor();
      // this.chart=undefined;
      // this.polygonSeries=null;
      // this.initChart();
    }

  
   }

  selectCountry(country: string): void {
    this.selectedCountryValue = country;

  }
  

  openDialog(_dataItem: any): void {
    this.summaryData = _dataItem;
    this.clicked = true;
  }
  selectYear(year: number): void {
   
    this.selectedYear = year;
  }
  updateHeatLegendStartText(selectedCategory: string[]) :string{
    if (selectedCategory.length > 0) {
      console.log('coming here');
      if (selectedCategory[0] === 'Water index stress (Water)') {
       
                return 'Least reduction in \n available water';
      } else {
        return 'Default start text';
      }
    }
    return ''; 
  }
  updateHeatLegendEndText(selectedCategory: string[]):string{
    console.log('coming end here');
    if (selectedCategory.length > 0) {
      if (selectedCategory[0] === 'Water index stress (Water)') {
       
        return 'Most reduction in \n available water';
      } else {
        return 'Default end text';
      }
    }
    return ''; 
}
}
