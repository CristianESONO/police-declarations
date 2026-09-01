import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Caso } from '../caso/caso.entity';

@Entity()
export class Declaration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;  // Nom complet de la personne

  @Column()
  phoneNumber: string;  // NumÃ©ro de tÃ©lÃ©phone

  @Column()
  dipNumber: string;  // NumÃ©ro d'identification (DIP)

  @Column()
  birthDate: Date;  // Date de naissance

  @Column()
  address: string;  // Adresse de rÃ©sidence

  @Column({ nullable: true })
  email: string;  // Email (optionnel)

  @Column()
  declarationDate: Date;  // Date de la dÃ©claration

  @Column('text')
  description: string;  // Description de l'incident

  @Column()
  declarationType: string;  // Type de dÃ©claration (Accident, Delit, etc.)

  @Column()
  agentName: string;  // Nom de l'agent responsable

  @Column()
  place: string;  // Lieu de la dÃ©claration

  @Column({ nullable: true })
  witnesses: string;  // TÃ©moins (optionnel)

  @Column({ nullable: true })
  additionalDocuments: string;  // Documents additionnels (optionnel)

  @Column({ nullable: true })
  identityPhoto: string;  // Photo d'identitÃ© (optionnel)

  @ManyToOne(() => User, (user) => user.declarations) // Liaison avec l'agent responsable
  @JoinColumn({ name: 'agentId' })
  agent: User;

  @ManyToOne(() => Caso, (caso) => caso.declaraciones, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'casoId' })
  caso: Caso;
}
