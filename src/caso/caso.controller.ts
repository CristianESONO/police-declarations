import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CasoService } from './caso.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SecurityCodeGuard } from '../common/guards/security-code.guard';
import { Caso } from './caso.entity';

@Controller('casos')
@UseGuards(JwtAuthGuard)
export class CasoController {
  constructor(private readonly casoService: CasoService) {}

  @Get()
  async obtenerTodos() {
    return this.casoService.obtenerTodos();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return this.casoService.obtenerPorId(id);
  }

  @Get('persona/:personaId')
  async obtenerPorPersona(@Param('personaId') personaId: string) {
    return this.casoService.obtenerPorPersona(personaId);
  }

  // UC5: Añadir Caso (?personaId)
  @Post()
  async crearCaso(@Body() body: Partial<Caso>, @Req() req: any) {
    const usuarioNombre = req.user?.username || 'SISTEMA';
    return this.casoService.crearCaso(body, usuarioNombre);
  }

  // UC6: Editar Caso (🔐 Exige Código de Seguridad 1234)
  @Put(':id')
  @UseGuards(SecurityCodeGuard)
  async editarCaso(@Param('id') id: string, @Body() body: Partial<Caso>, @Req() req: any) {
    const usuarioNombre = req.user?.username || 'ADMIN';
    return this.casoService.editarCaso(id, body, usuarioNombre);
  }

  // UC7: Borrar Caso (🔐 Exige Código de Seguridad 1234)
  @Delete(':id')
  @UseGuards(SecurityCodeGuard)
  async eliminarCaso(@Param('id') id: string, @Req() req: any) {
    const usuarioNombre = req.user?.username || 'ADMIN';
    await this.casoService.eliminarCaso(id, usuarioNombre);
    return { message: 'Caso eliminado correctamente' };
  }
}
