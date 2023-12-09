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
      { from: "A", to: "D", value: 10 },
      { from: "B", to: "D", value: 8 },
      { from: "B", to: "E", value: 4 },
      { from: "C", to: "E", value: 3 },
      { from: "D", to: "G", value: 5 },
      { from: "D", to: "I", value: 2 },
      { from: "D", to: "H", value: 3 },
      { from: "E", to: "H", value: 6 },
      { from: "G", to: "J", value: 5 },
      { from: "I", to: "J", value: 1 },
      { from: "H", to: "J", value: 9 }
    ]);

    // Make stuff animate on load
    series.appear(1000, 100);
  }

}
