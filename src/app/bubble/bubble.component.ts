

  import { Component, OnInit, OnDestroy } from '@angular/core';
  import * as am5 from '@amcharts/amcharts5';
  import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
  import * as am5map from '@amcharts/amcharts5/map';
  import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
  
  @Component({
    selector: 'app-bubble',
    templateUrl: './bubble.component.html',
    styleUrls: ['./bubble.component.css']
  })
  export class BubbleComponent implements OnInit, OnDestroy {
    private chart: am5map.MapChart | undefined;
    private bubbleSeries: am5map.MapPointSeries | undefined;
  
    ngOnInit(): void {
      this.initChart();
      this.updateData();
      setInterval(() => this.updateData(), 2000);
    }
    
  
    ngOnDestroy(): void {
      if (this.chart) {
        this.chart.dispose();
      }
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
           // tooltipText: {name}: [bold]{value}[/]
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
          max: 50,
          minValue: 0,
          maxValue: 100,
          key: 'radius'
        }
      ]);
  
      this.bubbleSeries.data.setAll(this.getData());
    }
  
    private getData(): any[] {
      return [
        { id: 'US', name: 'United States', value: 100 },
        { id: 'GB', name: 'United Kingdom', value: 100 },
        { id: 'CN', name: 'China', value: 100 },
        { id: 'IN', name: 'India', value: 100 },
        { id: 'AU', name: 'Australia', value: 100 },
        { id: 'CA', name: 'Canada', value: 100 },
        { id: 'BR', name: 'Brasil', value: 100 },
        { id: 'ZA', name: 'South Africa', value: 100 }
      ];
    }
  
    private updateData(): void {
      if (this.bubbleSeries) {
        const data = this.getData();
        for (let i = 0; i < this.bubbleSeries.dataItems.length; i++) {
          this.bubbleSeries.data.setIndex(i, { value: Math.round(Math.random() * 100), id: data[i].id, name: data[i].name });
        }
      }
    }
  }