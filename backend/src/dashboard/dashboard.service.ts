import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getMetrics() {
    return {
      bar: Array.from({ length: 4 }, () => Math.floor(Math.random() * 100)),
      line: Array.from({ length: 4 }, () => Math.floor(Math.random() * 100)),
      labels: ['sem1', 'sem2', 'sem3', 'sem4']
    };
  }
}
