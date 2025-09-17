import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
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

  }
}