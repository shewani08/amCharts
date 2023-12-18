import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5hierarchy from '@amcharts/amcharts5/hierarchy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { rightClick } from '@syncfusion/ej2-angular-maps';

@Component({
  selector: 'app-factor-nodegraph',
  templateUrl: './factor-nodegraph.component.html',
  styleUrls: ['./factor-nodegraph.component.css']
})
export class FactorNodegraphComponent implements OnInit {
  maxLevels = 3;
  maxNodes = 7;
  maxValue = 7;
  @Output() newItemEvent = new EventEmitter<boolean>();

  ngOnInit(): void {
    // AmCharts code here
    
let root = am5.Root.new('treediv');
root.setThemes([am5themes_Animated.new(root)]);

let container = root.container.children.push(am5.Container.new(root, {
  width: am5.percent(80),
  height: am5.percent(80),
  layout: root.verticalLayout
}));

let series = container.children.push(am5hierarchy.Tree.new(root, {
 

  downDepth: 1,
  initialDepth: 2,
  valueField: 'value',
  categoryField: 'name',
  childDataField: 'children',
  orientation: 'horizontal',
  
 // linkWithField: "link"
}));
let circleTemplate = series.circles.template;


// Use the events property to handle the click event
circleTemplate.events.on("click", (event) => {
  this.handleNodeClick(event.target);
});
series.circles.template.setAll({
  radius: 30,
  interactive:true,
  
  
  

  
});

series.outerCircles.template.setAll({
  radius: 30,
});

let data = {
  name: 'Factors Affecting Migration',
  children: []
};

this.generateLevel(data, '', 0);
series.data.setAll([data]);
series.set('selectedDataItem', series.dataItems[0]);
series.nodes.template.setAll({
  toggleKey: "none",
  cursorOverStyle: "default",
});

series.appear(1000, 100);
//series.appear(1);
  }
  handleNodeClick(dataContext: unknown) {
    this.newItemEvent.emit(false);
    console.log('clicked',dataContext);
   // throw new Error('Method not implemented.');
  }

  generateLevel(data: any, name: string, level: number, parent?: any) {
    console.log('datA',data);
    if (level === 0) {
      // Root level
      data.name = 'Factors Affecting Migration';
    // data.split = 70;
      for (const rootChild of ["Inflation", "Health", "Social", "Economic", "Political", "Food & Water","Climate Change"]) {
        let child = {
          name: rootChild,
          children: [],
          parent: data ,// Include reference to the parent node
          
        };
        this.generateLevel(child, rootChild, level + 1, child);
        data.children.push(child);
      }
    } else if (level === 1 ) {
      console.log('data is',data);
      // Level 1
      if(data.name=='Climate Change'){
      for (const level1Child of ["Wild Fire", "Storms", "Droughts", "Temperature", "Floods", "Landslides"]) {
        let child = {
          name: level1Child,
          children: [],
          parent: data // Connect directly to the root node
        };
        this.generateLevel(child, level1Child, level + 1, child);
        data.children.push(child);
      }
    }
    } else {
      // Termination condition to prevent infinite recursion
      if (level > this.maxLevels) {
        return;
      }

      // Additional levels if needed
      // for (let i = 0; i < Math.min(this.maxNodes, 7); i++) {
      //   let nodeName = 'AdditionalNode' + i;
      //   let child = {
      //     name: nodeName,
      //     children: [],
      //     parent: parent // Include reference to the parent node
      //   };

      //   this.generateLevel(child, nodeName, level + 1, child);

      //   // Add the child to the parent
      //   parent.children.push(child);
      // }
    }
  }
}
