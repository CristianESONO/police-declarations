// Seed standalone con 10 Agentes completos (Fecha de nacimiento y Dirección incluidos)
import 'reflect-metadata';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { User } from './user/user.entity';
import { Role } from './user/roles.enum';
import { Persona } from './persona/persona.entity';
import { Expediente } from './expediente/expediente.entity';
import { Caso } from './caso/caso.entity';
import { Evidencia } from './evidencia/evidencia.entity';
import { Historial } from './historial/historial.entity';
import { Declaration } from './declaration/declaration.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '..', 'database.sqlite'),
  entities: [User, Persona, Expediente, Caso, Evidencia, Historial, Declaration],
  synchronize: true,
  logging: false,
});

async function runSeed() {
  console.log('🌱 Completando Fecha de Nacimiento y Dirección de todos los Agentes...');
  await AppDataSource.initialize();

  const userRepo        = AppDataSource.getRepository(User);
  const declarationRepo = AppDataSource.getRepository(Declaration);

  const hashedPassword = await bcrypt.hash('123456', 10);

  // Lista de Agentes con TODOS los campos completos (Teléfono, DIP, Fecha Nacimiento, Dirección)
  const agentesData = [
    { username: 'policia',   fullName: 'Agente Carlos Ramírez',       email: 'policia@comisaria.es',          phoneNumber: '600111000', dipNumber: 'DIP-9000', birthDate: '1982-01-15', address: 'Paseo de la Castellana 40, Madrid' },
    { username: 'policia1',  fullName: 'Agente Andrés Beltrán',       email: 'andres.beltran@comisaria.es',   phoneNumber: '600111001', dipNumber: 'DIP-9001', birthDate: '1986-05-20', address: 'Calle Mayor 15, Madrid' },
    { username: 'policia2',  fullName: 'Agente Ana Martínez',         email: 'ana.martinez@comisaria.es',     phoneNumber: '600111002', dipNumber: 'DIP-9002', birthDate: '1991-08-11', address: 'Avenida del Sol 23, Madrid' },
    { username: 'policia3',  fullName: 'Agente Javier López',         email: 'javier.lopez@comisaria.es',     phoneNumber: '600111003', dipNumber: 'DIP-9003', birthDate: '1984-11-03', address: 'Calle Alcalá 140, Madrid' },
    { username: 'policia4',  fullName: 'Agente Laura Gómez',          email: 'laura.gomez@comisaria.es',      phoneNumber: '600111004', dipNumber: 'DIP-9004', birthDate: '1989-02-28', address: 'Calle Princesa 88, Madrid' },
    { username: 'policia5',  fullName: 'Agente Miguel Fernández',     email: 'miguel.fernandez@comisaria.es', phoneNumber: '600111005', dipNumber: 'DIP-9005', birthDate: '1993-07-14', address: 'Plaza de España 10, Madrid' },
    { username: 'policia6',  fullName: 'Inspector Alejandro Ruiz',    email: 'alejandro.ruiz@comisaria.es',   phoneNumber: '600111006', dipNumber: 'DIP-9006', birthDate: '1979-10-05', address: 'Calle Velázquez 50, Madrid' },
    { username: 'policia7',  fullName: 'Inspector Elena Blanco',      email: 'elena.blanco@comisaria.es',     phoneNumber: '600111007', dipNumber: 'DIP-9007', birthDate: '1983-03-22', address: 'Calle Serrano 112, Madrid' },
    { username: 'policia8',  fullName: 'Subinspectora Sofía Navarro', email: 'sofia.navarro@comisaria.es',   phoneNumber: '600111008', dipNumber: 'DIP-9008', birthDate: '1988-12-19', address: 'Avenida de América 34, Madrid' },
    { username: 'policia9',  fullName: 'Agente David Morales',        email: 'david.morales@comisaria.es',    phoneNumber: '600111009', dipNumber: 'DIP-9009', birthDate: '1995-09-09', address: 'Calle Goya 65, Madrid' },
    { username: 'policia10', fullName: 'Agente Carmen Torres',        email: 'carmen.torres@comisaria.es',    phoneNumber: '600111010', dipNumber: 'DIP-9010', birthDate: '1990-06-17', address: 'Paseo del Prado 21, Madrid' },
  ];

  for (const aData of agentesData) {
    let agent = await userRepo.findOne({ where: { username: aData.username } });
    if (!agent) {
      agent = userRepo.create({
        ...aData,
        password: hashedPassword,
        role: Role.POLICIA,
        activo: true,
      });
    } else {
      agent.fullName = aData.fullName;
      agent.email = aData.email;
      agent.phoneNumber = aData.phoneNumber;
      agent.dipNumber = aData.dipNumber;
      agent.birthDate = aData.birthDate;
      agent.address = aData.address;
    }
    agent = await userRepo.save(agent);
    console.log(`  ✅ Agente completado: ${agent.username} -> ${agent.birthDate} | ${agent.address}`);
  }

  console.log('\n🎉 ¡Todos los agentes tienen datos de Fecha de Nacimiento y Dirección!');
  await AppDataSource.destroy();
}

runSeed().catch((err) => {
  console.error('\n❌ Error durante el Seeding:', err.message ?? err);
  process.exit(1);
});
