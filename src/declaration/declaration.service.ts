import { Injectable, Inject, forwardRef,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Declaration } from './declaration.entity';
import { UserService } from '../user/user.service';
import { CreateDeclarationDto } from './dto/create-declaration.dto'; // Import du DTO

@Injectable()
export class DeclarationService {
  constructor(
    @InjectRepository(Declaration)
    private declarationRepository: Repository<Declaration>,
    @Inject(forwardRef(() => UserService))  // Utilisation de forwardRef pour l'injection dans le service
    private userService: UserService,
  ) {}

  async createDeclaration(data: CreateDeclarationDto, agentId: number): Promise<Declaration> {
    try {
      // Vérification de l'agent, en utilisant l'ID de l'utilisateur connecté
      const agent = await this.userService.findUserById(agentId);
      if (!agent) {
        throw new NotFoundException('Agent non trouvé');
      }
  
      // Création de la déclaration à partir du DTO
      const declaration = new Declaration();
      declaration.fullName = data.fullName;
      declaration.phoneNumber = data.phoneNumber;
      declaration.dipNumber = data.dipNumber;
      declaration.birthDate = data.birthDate;
      declaration.address = data.address;
      declaration.email = data.email ?? "";
      declaration.declarationDate = data.declarationDate;
      declaration.description = data.description;
      declaration.declarationType = data.declarationType;
      declaration.agentName = data.agentName;
      declaration.place = data.place;
      declaration.witnesses = data.witnesses ?? "";
      declaration.additionalDocuments = data.additionalDocuments ?? "";
      declaration.identityPhoto = data.identityPhoto ?? "";
      declaration.agent = agent;  // Associer l'agent à la déclaration
  
      return await this.declarationRepository.save(declaration);
    } catch (error) {
      throw new NotFoundException(`Erreur lors de la création de la déclaration: ${error.message}`);
    }
  }
  
  

  async findAll(): Promise<Declaration[]> {
    return this.declarationRepository.find();
  }

  async findOne(id: number): Promise<Declaration> {
    const declaration = await this.declarationRepository.findOne({
      where: { id },  // Recherche par l'id de la déclaration
    });
    if (!declaration) {
      throw new NotFoundException('Déclaration introuvable');
    }
    return declaration;
  }

  
  

  async update(id: number, data: any): Promise<Declaration> {
    const declaration = await this.findOne(id);
    declaration.fullName = data.fullName ?? declaration.fullName;
    declaration.phoneNumber = data.phoneNumber ?? declaration.phoneNumber;
    declaration.dipNumber = data.dipNumber ?? declaration.dipNumber;
    declaration.birthDate = data.birthDate ?? declaration.birthDate;
    declaration.address = data.address ?? declaration.address;
    declaration.email = data.email ?? declaration.email;
    declaration.declarationDate = data.declarationDate ?? declaration.declarationDate;
    declaration.description = data.description ?? declaration.description;
    declaration.declarationType = data.declarationType ?? declaration.declarationType;
    declaration.agentName = data.agentName ?? declaration.agentName;
    declaration.place = data.place ?? declaration.place;
    declaration.witnesses = data.witnesses ?? declaration.witnesses;
    declaration.additionalDocuments = data.additionalDocuments ?? declaration.additionalDocuments;
    declaration.identityPhoto = data.identityPhoto ?? declaration.identityPhoto;
    return this.declarationRepository.save(declaration);
  }

  async remove(id: number): Promise<void> {
    const declaration = await this.findOne(id);
    await this.declarationRepository.remove(declaration);
  }

  async findByUser(userId: number): Promise<Declaration[]> {
    return this.declarationRepository.find({ where: { agent: { id: userId } } });
  }

  async findByDeclarationType(type: string): Promise<Declaration[]> {
    return this.declarationRepository.find({ where: { declarationType: type } });
  }

  
}
