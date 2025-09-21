import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import Chart from 'chart.js/auto';
import { Subscription, interval } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    // outros módulos necessários
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  constructor(private dashboardService: DashboardService) {}
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  pieChart: any;
  chart: any;
  lastEntries: any[] = [];
  timeRefresh: number = 5000;
  private updateSub?: Subscription;

  ngAfterViewInit() {
    this.initBarChart();
    this.initPieChart();

    // Atualiza os gráficos a cada 10 segundos (10000 ms)
    this.updateSub = interval(this.timeRefresh).subscribe(() => {
      this.updateBarCharts();
      this.updatePieChart();

      this.dashboardService.getLastEntries().subscribe(entries => {
        this.lastEntries = entries;
      });
    });
  }

  initBarChart() {
    this.chart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Consumo Médio',
            data: [],
            backgroundColor: '#2b891f'
          },
          {
            label: 'Quantidade em Estoque',
            data: [],
            backgroundColor: '#4f7096'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true }
        },
        backgroundColor: '#f7ffee',
        scales: {
          x: {
            ticks: {
              font: {
                size: 10 // tamanho menor para os labels do eixo X
              }
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }

    });
  }

  initPieChart() {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#2b891f', '#4f7096', '#e83808', '#f7ffee', '#1976d2', '#ffb300', '#8e24aa'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    });
  }

  updateBarCharts() {
    this.dashboardService.getMetrics().subscribe(data => {
      // Atualiza gráfico de barras
      this.chart.data.labels = data.labels;
      this.chart.data.datasets[0].data = data.averageConsumption;
      this.chart.data.datasets[1].data = data.stockQuantity;
      this.chart.update();
    });
  }

  updatePieChart() {
    this.dashboardService.getProductQuantities().subscribe(data => {
      this.pieChart.data.labels = data.labels;
      this.pieChart.data.datasets[0].data = data.quantities;
      this.pieChart.update();
    });
  }
}