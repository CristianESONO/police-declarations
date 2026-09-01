import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DeclarationModule } from '../declaration/declaration.module'; // ✅ Vérifie le chemin !

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => DeclarationModule),  // forwardRef pour résoudre la dépendance circulaire
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService],  // Assure-toi d'exporter UserService pour que DeclarationModule puisse l'utiliser
})
export class UserModule {}


