import { Injectable, Inject, forwardRef,NotFoundException,ConflictException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateAgentDto } from './dto/create-agent.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { Declaration } from '../declaration/declaration.entity';
import { DeclarationService } from '../declaration/declaration.service';
import { Role } from './roles.enum';  // Importer l'énumération des rôles
import * as bcrypt from 'bcrypt'; // Importer bcrypt

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => DeclarationService))  // forwardRef pour gérer la dépendance circulaire
    private readonly declarationService: DeclarationService,
  ) {}

   // Fonction pour hasher un mot de passe
   private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);  // Hashage du mot de passe
  }

   // Vérifier si le mot de passe est correct lors de la connexion
   async validatePassword(username: string, password: string): Promise<boolean> {
    const user = await this.findOneByUsername(username);
    return bcrypt.compare(password, user.password);  // Comparaison avec le mot de passe hashé
  }

    // Création d'un utilisateur ADMIN avec mot de passe hashé
  async createAdmin(userData: CreateAdminDto): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { username: userData.username } });
    if (existing) {
      throw new ConflictException('Username already exists');
    }
    const hashedPassword = await this.hashPassword(userData.password); // Hashage du mot de passe
    const user = this.userRepository.create({ ...userData, password: hashedPassword, role: Role.ADMIN });
    return this.userRepository.save(user);
  }
  
    // Création d'un utilisateur AGENT (POLICIA) avec mot de passe hashé
  async createAgent(userData: CreateAgentDto): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { username: userData.username } });
    if (existing) {
      throw new ConflictException('Username already exists');
    }
    const hashedPassword = await this.hashPassword(userData.password); // Hashage du mot de passe
    const user = this.userRepository.create({ ...userData, password: hashedPassword, role: Role.POLICIA });
    return this.userRepository.save(user);
  }
  
  // Création d'un utilisateur CLIENT (POLICIA par défaut)
  async createClient(userData: CreateClientDto): Promise<User> {
    const user = this.userRepository.create({ ...userData, role: Role.POLICIA });
    return this.userRepository.save(user);
  }
  
  // Récupérer tous les utilisateurs
  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Ajoutez cette méthode dans la classe UserService

  async findAllByRole(role: string, page: number, limit: number): Promise<{ users: User[], totalPages: number }> {
    const uppercaseRole = role.toUpperCase();
    let roleEnum: Role;

    if (uppercaseRole === 'AGENT' || uppercaseRole === 'POLICIA') {
      roleEnum = Role.POLICIA;
    } else if (uppercaseRole === 'ADMIN') {
      roleEnum = Role.ADMIN;
    } else if (uppercaseRole === 'SUPERADMIN') {
      roleEnum = Role.SUPERADMIN;
    } else if (uppercaseRole === 'JUEZ') {
      roleEnum = Role.JUEZ;
    } else if (uppercaseRole === 'ABOGADO') {
      roleEnum = Role.ABOGADO;
    } else {
      roleEnum = Role[uppercaseRole as keyof typeof Role] || Role.POLICIA;
    }
  
    const skip = (page - 1) * limit;
  
    try {
      const [users, total] = await this.userRepository.findAndCount({
        where: { role: roleEnum },
        relations: ['declarations'],
        take: limit,
        skip: skip,
      });
  
      const totalPages = Math.ceil(total / limit);
  
      return { users, totalPages };
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw new Error('Impossible de récupérer les utilisateurs');
    }
  }
  


  
  

  // Récupérer un utilisateur par son ID
  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['declarations'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Récupérer un utilisateur par son nom d'utilisateur
  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  // Mettre à jour les informations d'un utilisateur sans modifier le rôle
  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findUserById(id);
  
    // Si le rôle est modifié, lever une erreur
    if (updateData.role && updateData.role !== user.role) {
      throw new NotFoundException("Cannot change user role.");
    }

    await this.userRepository.update(id, updateData);
    return this.findUserById(id);
  }

  // Supprimer un utilisateur
  async removeUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  // Récupérer les déclarations d'un utilisateur
  async getUserDeclarations(id: number): Promise<Declaration[]> {
    const user = await this.findUserById(id);
    return user.declarations;
  }

  // UC9: Bloquear Cuenta (🔐 Exige código 1234)
  async blockUser(id: number): Promise<User> {
    const user = await this.findUserById(id);
    user.activo = false;
    return this.userRepository.save(user);
  }
}
