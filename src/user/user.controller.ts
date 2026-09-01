import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards,ValidationPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateAgentDto } from './dto/create-agent.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { Declaration } from '../declaration/declaration.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importation du guard
import { SecurityCodeGuard } from '../common/guards/security-code.guard';
import { Role } from './roles.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Créer un nouvel utilisateur - Pas protégé
  @Post('/admin')
  async createAdmin(@Body(new ValidationPipe()) userData: CreateAdminDto): Promise<User> {
    return this.userService.createAdmin(userData);
  }
  
  @Post('/agent')
  async createAgent(@Body(new ValidationPipe()) userData: CreateAgentDto): Promise<User> {
    return this.userService.createAgent(userData);
  }
  
  @Post('/client')
  async createClient(@Body(new ValidationPipe()) userData: CreateClientDto): Promise<User> {
    return this.userService.createClient(userData);
  }

  // Récupérer tous les utilisateurs - Protégé
  @UseGuards(JwtAuthGuard) // Protection de la route
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  // Récupérer un utilisateur par ID - Protégé
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findUserById(id);
  }

  // Récupérer un utilisateur par nom d'utilisateur - Pas protégé
  @Get('username/:username')
  async findOneByUsername(@Param('username') username: string): Promise<User> {
    return this.userService.findOneByUsername(username);
  }

  // Mettre à jour un utilisateur - Protégé
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateData: Partial<User>): Promise<User> {
    return this.userService.updateUser(id, updateData);
  }

  // Supprimer un utilisateur - Protégé
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.removeUser(id);
  }

  // Récupérer les déclarations d'un utilisateur - Protégé
  @UseGuards(JwtAuthGuard)
  @Get(':id/declarations')
  async getDeclarations(@Param('id') id: number): Promise<Declaration[]> {
    return this.userService.getUserDeclarations(id);
  }


  // Ajoutez ces méthodes dans la classe UserController

  @UseGuards(JwtAuthGuard)
  @Get('/role/:role')
  async findAllByRole(
    @Param('role') role: string,
    @Query('page') page: number = 1,  // Paramètre de page avec valeur par défaut 1
    @Query('limit') limit: number = 10 // Paramètre de limite avec valeur par défaut 10
  ): Promise<{ users: User[], totalPages: number }> {
    return this.userService.findAllByRole(role, page, limit);  // Passer page et limit à la méthode du service
  }
  

  // UC9: Bloquear Cuenta (🔐 Exige Código 1234)
  @UseGuards(JwtAuthGuard, SecurityCodeGuard)
  @Put(':id/block')
  async blockUser(@Param('id') id: number): Promise<User> {
    return this.userService.blockUser(id);
  }
}
