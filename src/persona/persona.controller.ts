import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SecurityCodeGuard } from '../common/guards/security-code.guard';
import { Persona } from './persona.entity';

@Controller('personas')
@UseGuards(JwtAuthGuard)
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  @Get()
  async obtenerTodas() {
    return this.personaService.obtenerTodas();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return this.personaService.obtenerPorId(id);
  }

  @Get('dni/:dni')
  async obtenerPorDni(@Param('dni') dni: string) {
    return this.personaService.obtenerPorDni(dni);
  }

  // UC4: Registrar Persona (Genera EXP-XXX auto)
  @Post()
  async registrarPersona(@Body() body: Partial<Persona>, @Req() req: any) {
    const usuarioNombre = req.user?.username || 'SISTEMA';
    return this.personaService.registrarPersona(body, usuarioNombre);
  }

  // UC6: Editar Persona (🔐 Exige Código de Seguridad 1234)
  @Put(':id')
  @UseGuards(SecurityCodeGuard)
  async editarPersona(@Param('id') id: string, @Body() body: Partial<Persona>, @Req() req: any) {
    const usuarioNombre = req.user?.username || 'ADMIN';
    return this.personaService.editarPersona(id, body, usuarioNombre);
  }

  // UC7: Borrar Persona (🔐 Exige Código de Seguridad 1234)
  @Delete(':id')
  @UseGuards(SecurityCodeGuard)
  async eliminarPersona(@Param('id') id: string, @Req() req: any) {
    const usuarioNombre = req.user?.username || 'ADMIN';
    await this.personaService.eliminarPersona(id, usuarioNombre);
    return { message: 'Persona eliminada correctamente' };
  }
}
