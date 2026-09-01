import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Persona } from '../persona/persona.entity';
import { Caso } from '../caso/caso.entity';

@Entity()
export class Expediente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  numero: string;

  @Column({ type: 'varchar', nullable: true })
  personaId: string;

  @CreateDateColumn({ type: 'datetime' })
  fecha: Date;

  @Column({ type: 'varchar', length: 10, nullable: true })
  hora: string;

  @Column({ type: 'varchar', length: 50, default: 'ABIERTO' })
  estado: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  creadoPor: string;

  @ManyToOne(() => Persona, (persona) => persona.expedientes, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'personaId' })
  persona: Persona;

  @OneToMany(() => Caso, (caso) => caso.expediente)
  casos: Caso[];
}
