import { Root } from '@amcharts/amcharts5';
import { Component, ElementRef } from '@angular/core';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { Flow, Sankey } from "@amcharts/amcharts5/flow";

@Component({
  selector: 'app-sankey-graph',
  templateUrl: './sankey-graph.component.html',
  styleUrls: ['./sankey-graph.component.css']
})
export class SankeyGraphComponent {
  constructor(private el: ElementRef) { }
  ngOnInit(): void {
    // Create root element
    let root = Root.new(this.el.nativeElement.querySelector("#chartdiv"));

    // Set themes

 
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Create series
    let series = root.container.children.push(Sankey.new(root, {
      sourceIdField: "from",
      targetIdField: "to",
      valueField: "value",
      paddingRight: 50
    }));
series.nodes.get('colors')?.set('step',2);
   
    // Set data
    series.data.setAll([
      { from: "Country Of Origin 1", to: "Port of Transit", value: 10 },
      { from: "Country Of Origin 2", to: "Port of Transit", value: 8 },
      { from: "Country Of Origin 3", to: "Port of Transit ", value: 3 },
      { from: "Country Of Origin 4", to: "Port of Transit", value: 6 },
      { from: "Port of Transit", to: "No. of Migrants in Europe ", value: 5 },
      { from: "Port of Transit", to: "Number of Migrants in Europe", value: 2 },
      { from: "Port of Transit", to: "Number of Migrants in Europe", value: 3 },
      // { from: "Port of Transit", to: "Number of Migrants in Europe", value: 4 },
      // // { from: "Port of Transit", to: "Number of Migrants in Europe", value: 5 },
      { from: "Number of Migrants in Europe", to: "No. of Migrants in UK", value: 1 },
      // { from: "Number of Migrants in Europe", to: "No. of Migrants in UK", value: 9 }
    ]);

    // Make stuff animate on load
    series.appear(1000, 100);
  }

}
