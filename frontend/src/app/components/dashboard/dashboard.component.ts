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
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;
  chart: any;
  lineChart: any;
  private updateSub?: Subscription;

  ngAfterViewInit() {
    this.chart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [ {
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
        plugins: {
          legend: {
            display: true
          }
        },
        backgroundColor: '#f7ffee'
      }
    });

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Produção',
          data: [],
          borderColor: '#2b891f',
          backgroundColor: 'rgba(43,137,31,0.1)',
          fill: true,
          tension: 0.4 // suaviza a linha
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false // Esconde a legenda, se desejar
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Atualiza os gráficos a cada 10 segundos (10000 ms)
    this.updateSub = interval(5000).subscribe(() => {
      this.dashboardService.getMetrics().subscribe(data => {
        // Atualiza os dados do gráfico de barras
        this.chart.data.labels = data.labels;
        this.chart.data.datasets[0].data = data.averageConsumption;
        this.chart.data.datasets[1].data = data.stockQuantity;
        this.chart.update();


        // Atualiza os dados do gráfico de linha
        this.lineChart.data.labels = data.labels;
        this.lineChart.data.datasets[0].data = data.line;
        this.lineChart.update();
      });
    });

    // ngOnDestroy() {
    // // Cancela a assinatura ao destruir o componente
    //   this.updateSub?.unsubscribe();
    // }
  }
}