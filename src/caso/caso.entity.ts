import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Persona } from '../persona/persona.entity';
import { Expediente } from '../expediente/expediente.entity';
import { Evidencia } from '../evidencia/evidencia.entity';
import { Declaration } from '../declaration/declaration.entity';

@Entity()
export class Caso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  personaId: string;

  @Column({ type: 'varchar', nullable: true })
  expedienteId: string;

  @Column({ type: 'varchar', length: 100 })
  tipo: string;

  @Column({ type: 'text', nullable: true })
  antecedentes: string;

  @Column({ type: 'datetime', nullable: true })
  fechaHecho: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lugar: string;

  @Column({ type: 'varchar', length: 50, default: 'EN_PROCESO' })
  estado: string;

  @Column({ type: 'text', nullable: true })
  descripcionDetallada: string;

  @ManyToOne(() => Persona, (persona) => persona.casos, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'personaId' })
  persona: Persona;

  @ManyToOne(() => Expediente, (expediente) => expediente.casos, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'expedienteId' })
  expediente: Expediente;

  @OneToMany(() => Evidencia, (evidencia) => evidencia.caso)
  evidencias: Evidencia[];

  @OneToMany(() => Declaration, (declaration) => declaration.caso)
  declaraciones: Declaration[];
}
