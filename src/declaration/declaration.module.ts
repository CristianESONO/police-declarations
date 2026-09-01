import { Module, forwardRef } from '@nestjs/common';
import { DeclarationService } from './declaration.service';
import { DeclarationController } from './declaration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Declaration } from './declaration.entity';
import { UserModule } from '../user/user.module';  // Vérifie si tu utilises forwardRef ici aussi si c'est une dépendance circulaire

@Module({
  imports: [
    TypeOrmModule.forFeature([Declaration]),
    forwardRef(() => UserModule),  // forwardRef pour résoudre la dépendance circulaire
  ],
  providers: [DeclarationService],
  controllers: [DeclarationController],
  exports: [DeclarationService],  // Assure-toi d'exporter DeclarationService
})
export class DeclarationModule {}
