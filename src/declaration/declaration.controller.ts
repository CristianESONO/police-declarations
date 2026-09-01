import { Controller, Post, Get, Param, Body, UseGuards,NotFoundException } from '@nestjs/common';
import { DeclarationService } from './declaration.service';
import { Declaration } from './declaration.entity';
import { CreateDeclarationDto } from './dto/create-declaration.dto';  // Importation du DTO
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importation du guard
import { GetUser } from '../auth/get-user.decorator'; // Décorateur pour obtenir l'utilisateur connecté

@Controller('declarations')
export class DeclarationController {
  constructor(private readonly declarationService: DeclarationService) {}

  // Créer une déclaration - Protégé
  @UseGuards(JwtAuthGuard) // Protection de la route
  @Post()
  async createDeclaration(@Body() data: CreateDeclarationDto, @GetUser() user: any): Promise<Declaration> {
    // Utilisation de l'ID de l'utilisateur connecté pour l'agent
    return this.declarationService.createDeclaration(data, user.id);  
  }

  // Récupérer toutes les déclarations - Protégé
  @UseGuards(JwtAuthGuard) // Protection de la route
  @Get()
  async findAll(): Promise<Declaration[]> {
    return this.declarationService.findAll();
  }

  // Récupérer une déclaration par ID - Protégé
  @UseGuards(JwtAuthGuard) // Protection de la route
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Declaration> {
    return this.declarationService.findOne(id);
  }

  // Récupérer les déclarations par type (ex: GET /declarations/type/Accident)
@Get('type/:type')
async findByType(@Param('type') type: string) {
  return this.declarationService.findByDeclarationType(type);
}

// Récupérer les déclarations de l'utilisateur connecté
@UseGuards(JwtAuthGuard)
@Get('my-declarations')
async findMyDeclarations(@GetUser() user: { id: number }) {
  return this.declarationService.findByUser(user.id);
}


}
