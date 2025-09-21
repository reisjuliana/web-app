import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  async getMetrics() {
    return await this.dashboardService.getMetrics();
  }

  @Get('last-entries')
  async getLastEntries() {
    return await this.dashboardService.getLastEntries();
  }

  @Get('product-quantities')
  async getProductQuantities() {
    return await this.dashboardService.getProductQuantities();
  }

}
