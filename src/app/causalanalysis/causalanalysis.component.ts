// causalanalysis.component.ts

import { Component, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5hierarchy from '@amcharts/amcharts5/hierarchy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

// Define the types for selectedValues and dropdownOptions
type SelectedValues = { [key: string]: string };
type DropdownOptions = { [key: string]: string[] };

@Component({
  selector: 'app-causalanalysis',
  templateUrl: './causalanalysis.component.html',
  styleUrls: ['./causalanalysis.component.css']
})
export class CausalAnalysisComponent implements OnInit {

  health: string | undefined;
  circles = [
    "Inflation",
    "Health",
    "Food & Water",
    "Economic",
    "Political",
    "Social",
    
  ];
  selectedValues: SelectedValues = {};
  dropdownOptions: DropdownOptions = {};
  circleColors: string[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  selectedHealth: string ='';
  ngOnInit(): void {
    //selectHealth(type:string){
     //this.health=type;
    // AmCharts code goes here
    let root = am5.Root.new("chartdiv1");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let data: { value: number; children: { name: string; value: number }[] } = {
      value: 0,
      children: []
    };

    for (let i = 0; i < this.circles.length; i++) {
      data.children.push({ name: this.circles[i], value: Math.random() * 20 + 1 });
    }

    let container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.horizontalLayout,
      })
    );

    let series = container.children.push(
      am5hierarchy.ForceDirected.new(root, {
        singleBranchOnly: false,
        downDepth: 2,
        topDepth: 1,
        initialDepth: 1,
        maxRadius: 60,
        minRadius: 20,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
        manyBodyStrength: -13,
        centerStrength: 0.8
      })
    );

    (series.get("colors") as any).setAll({
      step: 1
    });

    series.links.template.setAll({
      strokeWidth: 2
    });

    series.nodes.template.setAll({
      tooltipText: undefined,
      cursorOverStyle: "pointer",
    });

    let selectedDataItem: any | undefined;

    series.nodes.template.events.on("click", function (e: any) {
      if (selectedDataItem) {
        let targetDataItem = e.target?.dataItem;
        if (targetDataItem && e.target?.dataItem == selectedDataItem) {
          selectedDataItem.get("outerCircle").setPrivate("visible", false);
          selectedDataItem = undefined;
        } else {
          if (targetDataItem && series.areLinked(selectedDataItem, targetDataItem)) {
            series.unlinkDataItems(selectedDataItem, targetDataItem);
          } else {
            if (targetDataItem) {
              series.linkDataItems(selectedDataItem, targetDataItem, 0.2);
            }
          }
        }
      } else {
        let targetDataItem = e.target?.dataItem;
        if (targetDataItem) {
          selectedDataItem = targetDataItem;
          selectedDataItem.get("outerCircle").setPrivate("visible", true);
        }
      }
    });

    series.data.setAll([data]);
    series.set("selectedDataItem", series.dataItems[0]);

    this.circles.forEach((circle: string) => {
      // this.dropdownOptions[circle] = this.getDropdownOptions(circle);
      this.selectedValues[circle] = this.dropdownOptions[circle][0];
    });
  }

  

  selectOption(circle: string, option: string): void {
    this.selectedValues[circle] = option;
  }

  selectHealth(val:string) {
    this.selectedHealth=val;
  }
}

