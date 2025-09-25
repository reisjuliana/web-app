import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
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
