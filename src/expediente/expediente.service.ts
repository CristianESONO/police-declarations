import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expediente } from './expediente.entity';
import { HistorialService } from '../historial/historial.service';

@Injectable()
export class ExpedienteService {
  constructor(
    @InjectRepository(Expediente)
    private readonly expedienteRepository: Repository<Expediente>,
    private readonly historialService: HistorialService,
  ) {}

  // Génère automatiquement un numéro EXP-001, EXP-002, etc.
  async generarNumeroExpediente(): Promise<string> {
    const count = await this.expedienteRepository.count();
    const nextSeq = (count + 1).toString().padStart(3, '0');
    return `EXP-${nextSeq}`;
  }

  async crearExpediente(data: Partial<Expediente>, usuarioNombre?: string): Promise<Expediente> {
    if (!data.numero) {
      data.numero = await this.generarNumeroExpediente();
    }

    const now = new Date();
    data.fecha = now;
    data.hora = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    data.creadoPor = usuarioNombre || 'SISTEMA';

    const expediente = this.expedienteRepository.create(data);
    const saved = await this.expedienteRepository.save(expediente);

    await this.historialService.registrarAccion(
      undefined,
      usuarioNombre,
      undefined,
      'CREAR_EXPEDIENTE',
      `Expediente generado: ${saved.numero}`,
    );

    return saved;
  }

  async obtenerTodos(): Promise<Expediente[]> {
    return this.expedienteRepository.find({
      relations: ['persona', 'casos'],
      order: { fecha: 'DESC' },
    });
  }

  async obtenerPorId(id: string): Promise<Expediente> {
    const expediente = await this.expedienteRepository.findOne({
      where: { id },
      relations: ['persona', 'casos'],
    });
    if (!expediente) {
      throw new NotFoundException(`Expediente con ID ${id} no encontrado`);
    }
    return expediente;
  }

  async obtenerPorNumero(numero: string): Promise<Expediente> {
    const expediente = await this.expedienteRepository.findOne({
      where: { numero },
      relations: ['persona', 'casos'],
    });
    if (!expediente) {
      throw new NotFoundException(`Expediente número ${numero} no encontrado`);
    }
    return expediente;
  }

  // UC7: Borrar Expediente (exige código 1234 y registra historial)
  async eliminarExpediente(id: string, usuarioNombre?: string): Promise<void> {
    const expediente = await this.obtenerPorId(id);
    await this.expedienteRepository.remove(expediente);

    await this.historialService.registrarAccion(
      undefined,
      usuarioNombre,
      undefined,
      'BORRAR_EXPEDIENTE',
      `Expediente ${expediente.numero} eliminado con código 1234`,
    );
  }
}
