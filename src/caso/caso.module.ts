import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caso } from './caso.entity';
import { CasoService } from './caso.service';
import { CasoController } from './caso.controller';
import { HistorialModule } from '../historial/historial.module';

@Module({
  imports: [TypeOrmModule.forFeature([Caso]), HistorialModule],
  controllers: [CasoController],
  providers: [CasoService],
  exports: [TypeOrmModule, CasoService],
})
export class CasoModule {}
