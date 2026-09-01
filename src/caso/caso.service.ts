import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caso } from './caso.entity';
import { HistorialService } from '../historial/historial.service';

@Injectable()
export class CasoService {
  constructor(
    @InjectRepository(Caso)
    private readonly casoRepository: Repository<Caso>,
    private readonly historialService: HistorialService,
  ) {}

  // UC5: Añadir Caso (?personaId)
  async crearCaso(casoData: Partial<Caso>, usuarioNombre?: string): Promise<Caso> {
    const caso = this.casoRepository.create(casoData);
    const saved = await this.casoRepository.save(caso);

    await this.historialService.registrarAccion(
      undefined,
      usuarioNombre,
      undefined,
      'CREAR_CASO',
      `Caso creado (Tipo: ${saved.tipo}, PersonaID: ${saved.personaId})`,
    );

    return saved;
  }

  async obtenerTodos(): Promise<Caso[]> {
    return this.casoRepository.find({
      relations: ['persona', 'expediente', 'evidencias', 'declaraciones'],
      order: { fechaHecho: 'DESC' },
    });
  }

  async obtenerPorId(id: string): Promise<Caso> {
    const caso = await this.casoRepository.findOne({
      where: { id },
      relations: ['persona', 'expediente', 'evidencias', 'declaraciones'],
    });
    if (!caso) {
      throw new NotFoundException(`Caso con ID ${id} no encontrado`);
    }
    return caso;
  }

  async obtenerPorPersona(personaId: string): Promise<Caso[]> {
    return this.casoRepository.find({
      where: { personaId },
      relations: ['expediente', 'evidencias'],
    });
  }

  // UC6: Editar Caso -> Exige código de seguridad 1234
  async editarCaso(id: string, updateData: Partial<Caso>, usuarioNombre?: string): Promise<Caso> {
    const caso = await this.obtenerPorId(id);
    Object.assign(caso, updateData);
    const updated = await this.casoRepository.save(caso);

    await this.historialService.registrarAccion(
      undefined,
      usuarioNombre,
      undefined,
      'EDITAR_CASO',
      `Caso ID ${id} modificado con código 1234`,
    );

    return updated;
  }

  // UC7: Borrar Caso -> Exige código de seguridad 1234
  async eliminarCaso(id: string, usuarioNombre?: string): Promise<void> {
    const caso = await this.obtenerPorId(id);
    await this.casoRepository.remove(caso);

    await this.historialService.registrarAccion(
      undefined,
      usuarioNombre,
      undefined,
      'BORRAR_CASO',
      `Caso ID ${id} eliminado con código 1234`,
    );
  }
}
