import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expediente } from './expediente.entity';
import { ExpedienteService } from './expediente.service';
import { ExpedienteController } from './expediente.controller';
import { HistorialModule } from '../historial/historial.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expediente]), HistorialModule],
  controllers: [ExpedienteController],
  providers: [ExpedienteService],
  exports: [TypeOrmModule, ExpedienteService],
})
export class ExpedienteModule {}
