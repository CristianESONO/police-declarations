import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './persona.entity';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';
import { ExpedienteModule } from '../expediente/expediente.module';
import { HistorialModule } from '../historial/historial.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Persona]),
    ExpedienteModule,
    HistorialModule,
  ],
  controllers: [PersonaController],
  providers: [PersonaService],
  exports: [TypeOrmModule, PersonaService],
})
export class PersonaModule {}
