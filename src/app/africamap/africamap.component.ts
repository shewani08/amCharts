
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import { HttpClient } from '@angular/common/http';
import { CsvService } from '../service/CsvService';


interface CsvData {
  id: string;
  Continent: string;
  Country: string;
  value: string;
}

@Component({
  selector: 'app-africamap',
  templateUrl: './africamap.component.html',
  styleUrls: ['./africamap.component.css']
})


export class AfricamapComponent implements OnInit {

  private chart: am5map.MapChart | undefined;
  private bubbleSeries: am5map.MapPointSeries | undefined;
  private jsonData: any;
  
  constructor(private http: HttpClient, private dataService: CsvService) {}
 
  ngOnInit(): void {
    this.loadData();
  }


  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.dispose();
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
    // Dispose of the previous chart
    if (this.chart) {
      this.chart.dispose();
    }
    const root = am5.Root.new(chartdiv);
    root.setThemes([am5themes_Animated.new(root)]);
    this.chart = root.container.children.push(am5map.MapChart.new(root, {}));

    const polygonSeries = this.chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ']
      })
    );

    this.bubbleSeries = this.chart.series.push(
      am5map.MapPointSeries.new(root, {
        valueField: 'value',
        calculateAggregates: true,
        polygonIdField: 'id'
      })
    );

    const circleTemplate = am5.Template.new({});

    this.bubbleSeries.bullets.push((root, series, dataItem) => {
      const container = am5.Container.new(root, {});

      const circle = container.children.push(
        am5.Circle.new(root, {
          radius: 20,
          fillOpacity: 0.7,
          fill: am5.color(0xff0000),
          cursorOverStyle: 'pointer',
          tooltipText: `{name}: [bold]{value}[/]`
        }, circleTemplate as any)
      );

      const countryLabel = container.children.push(
        am5.Label.new(root, {
          text: '{name}',
          paddingLeft: 5,
          populateText: true,
          fontWeight: 'bold',
          fontSize: 13,
          centerY: am5.p50
        })
      );

      circle.on('radius', (radius: any) => {
        countryLabel.set('x', radius);
      });

      return am5.Bullet.new(root, {
        sprite: container,
        dynamic: true
      });
    });

    this.bubbleSeries.bullets.push((root, series, dataItem) => {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          text: '{value.formatNumber(\'#\')}',
          fill: am5.color(0xffffff),
          populateText: true,
          centerX: am5.p50,
          centerY: am5.p50,
          textAlign: 'center'
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
        maxValue: 100,
        key: 'radius'
      }
    ]);
    //this.bubbleSeries.data.setAll(this.getData());
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
        this.bubbleSeries.data.setIndex(i, { value: data[i].value, id: data[i].id, name: data[i].Country });
      }
    }
  }


}
