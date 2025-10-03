import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

declare var Chart: any;

@Component({
  selector: 'app-new-users-chart',
  imports: [CommonModule],
  templateUrl: './new-users-chart.component.html',
  styleUrl: './new-users-chart.component.scss'
})
export class NewUsersChartComponent implements AfterViewInit, OnDestroy{
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart: any;

  ngAfterViewInit(): void {
    this.createChart();
  }

  // Helper to safely get CSS variable values for the chart theme
  private getCssVariable(variableName: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  }

  private createChart(): void {
    if(!this.chartCanvas) return;

    const context = this.chartCanvas.nativeElement.getContext('2d');

    // Generate dummy labels for last 7 days
    const labels = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-GB', { weekday: 'short' });
    }).reverse();

    // Dummy data for new users
    const data = [12, 19, 3, 5, 2, 3, 7];

    //  Prevent re-creating the chart if it already exists
    if(this.chart){
      this.chart.destroy();
    }

    this.chart = new Chart(context, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'New Users',
            data: data,
            backgroundColor: this.getCssVariable('--primary-color-translucent'),
            borderColor: this.getCssVariable('--primary-color'),
            borderWidth: 1,
            borderRadius: 4,
            hoverBackgroundColor: this.getCssVariable('--primary-color-focus'),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // We don't need a legend for a single dataset
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: this.getCssVariable('--border-color'),
            },
            ticks: {
              color: this.getCssVariable('--secondary-color'),
              precision: 0, // Show only whole numbers
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: this.getCssVariable('--secondary-color'),
            },
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    if(this.chart){
      this.chart.destroy();
    }
  }
}
