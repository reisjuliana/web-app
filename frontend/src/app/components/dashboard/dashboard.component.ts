import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import Chart from 'chart.js/auto';
import { Subscription, interval } from 'rxjs';

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
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;
  chart: any;
  lineChart: any;
  private updateSub?: Subscription;

  ngAfterViewInit() {
    this.chart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['sem1', 'sem2', 'sem3', 'sem4'],
        datasets: [{
          data: [65, 59, 80, 81],
          backgroundColor: '#2b891f'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        backgroundColor: '#f7ffee'
      }
    });

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [{
          label: 'Produção',
          data: [65, 59, 80, 81],
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

    // this.updateSub = interval(5000).subscribe(() => {
    //   const novosDadosBar = Array.from({ length: 4 }, () => Math.floor(Math.random() * 100));
    //   const novosDadosLine = Array.from({ length: 4 }, () => Math.floor(Math.random() * 100));
    //   this.chart.data.datasets[0].data = novosDadosBar;
    //   this.chart.update();
    //   this.lineChart.data.datasets[0].data = novosDadosLine;
    //   this.lineChart.update();
    // });

    // Atualiza os gráficos a cada 10 segundos (10000 ms)
    this.updateSub = interval(10000).subscribe(() => {
      this.dashboardService.getMetrics().subscribe(data => {
        // Atualiza os dados do gráfico de barras
        this.chart.data.labels = data.labels;
        this.chart.data.datasets[0].data = data.bar;
        this.chart.update();


        // Atualiza os dados do gráfico de linha
        this.lineChart.data.labels = data.labels;
        this.lineChart.data.datasets[0].data = data.line;
        this.lineChart.update();
      });
    });

    ngOnDestroy() {
    // Cancela a assinatura ao destruir o componente
      this.updateSub?.unsubscribe();
    }


  }
}