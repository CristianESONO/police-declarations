import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from './persona.entity';
import { ExpedienteService } from '../expediente/expediente.service';
import { HistorialService } from '../historial/historial.service';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    private readonly expedienteService: ExpedienteService,
    private readonly historialService: HistorialService,
  ) {}

  // UC4: Registrar Persona -> Genera automatícamente EXP-XXX
  async registrarPersona(personaData: Partial<Persona>, usuarioNombre?: string): Promise<{ persona: Persona; expedienteNumero: string }> {
    if (personaData.dni) {
      const existente = await this.personaRepository.findOne({ where: { dni: personaData.dni } });
      if (existente) {
        throw new ConflictException(`Ya existe una persona registrada con el DNI ${personaData.dni}`);
      }
    }

    personaData.creadoPor = usuarioNombre || 'SISTEMA';
    const persona = this.personaRepository.create(personaData);
    const personaGuardada = await this.personaRepository.save(persona);

    // Auto-generación del Expediente EXP-XXX (UC4 -> UC12)
    const expediente = await this.expedienteService.crearExpediente(
      {
        personaId: personaGuardada.id,
        descripcion: `Expediente generado para ${personaGuardada.nombre} ${personaGuardada.apellidos}`,
      },
      usuarioNombre,
    );

    personaGuardada.expedienteNumero = expediente.numero;
    await this.personaRepository.save(personaGuardada);

    await this.historialService.registrarAccion(
      undefined,
      usuarioNombre,
      undefined,
      'REGISTRAR_PERSONA',
      `Persona registrada (${personaGuardada.nombre} ${personaGuardada.apellidos}, DNI: ${personaGuardada.dni}) con ${expediente.numero}`,
    );

    return {
      persona: personaGuardada,
      expedienteNumero: expediente.numero,
    };
  }

  async obtenerTodas(): Promise<Persona[]> {
    return this.personaRepository.find({
      relations: ['expedientes', 'casos'],
      order: { creadoEn: 'DESC' },
    });
  }

  async obtenerPorId(id: string): Promise<Persona> {
    const persona = await this.personaRepository.findOne({
      where: { id },
      relations: ['expedientes', 'casos'],
    });
    if (!persona) {
      throw new NotFoundException(`Persona con ID ${id} no encontrada`);
    }
    return persona;
  }

  async obtenerPorDni(dni: string): Promise<Persona> {
    const persona = await this.personaRepository.findOne({
      where: { dni },
      relations: ['expedientes', 'casos'],
    });
    if (!persona) {
      throw new NotFoundException(`Persona con DNI ${dni} no encontrada`);
    }
    return persona;
  }

  // UC6: Editar Persona -> Exige código de seguridad 1234
  async editarPersona(id: string, updateData: Partial<Persona>, usuarioNombre?: string): Promise<Persona> {
    const persona = await this.obtenerPorId(id);
    Object.assign(persona, updateData);
    const updated = await this.personaRepository.save(persona);

    await this.historialService.registrarAccion(
      undefined,
      usuarioNombre,
      undefined,
      'EDITAR_PERSONA',
      `Persona ${persona.nombre} ${persona.apellidos} modificada con código 1234`,
    );

    return updated;
  }

  // UC7: Borrar Persona -> Exige código de seguridad 1234
  async eliminarPersona(id: string, usuarioNombre?: string): Promise<void> {
    const persona = await this.obtenerPorId(id);
    await this.personaRepository.remove(persona);

    await this.historialService.registrarAccion(
      undefined,
      usuarioNombre,
      undefined,
      'BORRAR_PERSONA',
      `Persona ${persona.nombre} ${persona.apellidos} eliminada con código 1234`,
    );
  }
}
