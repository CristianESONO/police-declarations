import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evidencia } from './evidencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evidencia])],
  exports: [TypeOrmModule],
})
export class EvidenciaModule {}
