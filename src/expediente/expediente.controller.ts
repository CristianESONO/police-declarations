import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ExpedienteService } from './expediente.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SecurityCodeGuard } from '../common/guards/security-code.guard';
import { Expediente } from './expediente.entity';

@Controller('expedientes')
@UseGuards(JwtAuthGuard)
export class ExpedienteController {
  constructor(private readonly expedienteService: ExpedienteService) {}

  @Get()
  async obtenerTodos() {
    return this.expedienteService.obtenerTodos();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return this.expedienteService.obtenerPorId(id);
  }

  @Post()
  async crearExpediente(@Body() body: Partial<Expediente>, @Req() req: any) {
    const usuarioNombre = req.user?.username || 'SISTEMA';
    return this.expedienteService.crearExpediente(body, usuarioNombre);
  }

  // UC7: Borrar Expediente -> Exige código de seguridad 1234
  @Delete(':id')
  @UseGuards(SecurityCodeGuard)
  async eliminarExpediente(@Param('id') id: string, @Req() req: any) {
    const usuarioNombre = req.user?.username || 'ADMIN';
    await this.expedienteService.eliminarExpediente(id, usuarioNombre);
    return { message: 'Expediente eliminado correctamente' };
  }
}
