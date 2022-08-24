import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  Highcharts = Highcharts;
  chartOptions = {};

  @Input() data = {};
  @Input() title = "Random Data"

  constructor() { }

  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        backgroundColor: "#f1f1f1",
        plotBackgroundColor: "#f1f1f1",
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: this.title
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>'
          }
        }
      },
      exporting: {
        enabled: true
      },      
      credits: {
        enabled: false
      },
      series: [{
        name: 'Students',
        colorByPoint: true,
        data: this.data,
      }]
    };

    //now we can export the chart --> download it for example
    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300)
  }

}
