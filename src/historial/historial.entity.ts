import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Role } from '../user/roles.enum';

@Entity()
export class Historial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: true })
  usuarioId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  usuarioNombre: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  rol: Role;

  @Column({ type: 'varchar', length: 100 })
  accion: string;

  @Column({ type: 'text', nullable: true })
  detalles: string;

  @CreateDateColumn({ type: 'datetime' })
  fechaHora: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;
}
