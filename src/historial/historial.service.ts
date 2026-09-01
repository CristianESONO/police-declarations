import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historial } from './historial.entity';
import { Role } from '../user/roles.enum';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(Historial)
    private readonly historialRepository: Repository<Historial>,
  ) {}

  async registrarAccion(
    usuarioId?: number,
    usuarioNombre?: string,
    rol?: Role,
    accion?: string,
    detalles?: string,
  ): Promise<Historial> {
    const entry = this.historialRepository.create({
      usuarioId,
      usuarioNombre: usuarioNombre || 'SISTEMA',
      rol,
      accion,
      detalles,
    });
    return this.historialRepository.save(entry);
  }

  // UC10: Ver Historial Completo (fecha/hora exacta + rol)
  async obtenerHistorialCompleto(): Promise<Historial[]> {
    return this.historialRepository.find({
      order: { fechaHora: 'DESC' },
    });
  }

  // UC11: Ver Historial Básico (sans détails confidentiels)
  async obtenerHistorialBasico(): Promise<Partial<Historial>[]> {
    const logs = await this.historialRepository.find({
      order: { fechaHora: 'DESC' },
      take: 50,
    });
    return logs.map((log) => ({
      id: log.id,
      accion: log.accion,
      fechaHora: log.fechaHora,
      usuarioNombre: log.usuarioNombre,
    }));
  }
}
