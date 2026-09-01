import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Caso } from '../caso/caso.entity';

@Entity()
export class Evidencia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  casoId: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo: string;

  @CreateDateColumn({ type: 'datetime' })
  creadoEn: Date;

  @ManyToOne(() => Caso, (caso) => caso.evidencias, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'casoId' })
  caso: Caso;
}
