import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Declaration } from '../declaration/declaration.entity';
import { Role } from './roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', length: 50, default: Role.POLICIA })
  role: Role;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  dipNumber: string;

  @Column({ type: 'date', nullable: true })
  birthDate: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'datetime', nullable: true })
  ultimoAcceso: Date;

  @OneToMany(() => Declaration, (declaration) => declaration.agent, { nullable: true })
  declarations: Declaration[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
