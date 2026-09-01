import { Controller, Get, UseGuards } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('historial')
@UseGuards(JwtAuthGuard)
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Get('completo')
  async getHistorialCompleto() {
    return this.historialService.obtenerHistorialCompleto();
  }

  @Get('basico')
  async getHistorialBasico() {
    return this.historialService.obtenerHistorialBasico();
  }
}
