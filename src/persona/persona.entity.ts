import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Expediente } from '../expediente/expediente.entity';
import { Caso } from '../caso/caso.entity';

@Entity()
export class Persona {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 150 })
  apellidos: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  dni: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fechaNacimiento: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  telefono: string;

  @CreateDateColumn({ type: 'datetime' })
  creadoEn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  creadoPor: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  expedienteNumero: string;

  @OneToMany(() => Expediente, (expediente) => expediente.persona)
  expedientes: Expediente[];

  @OneToMany(() => Caso, (caso) => caso.persona)
  casos: Caso[];
}
