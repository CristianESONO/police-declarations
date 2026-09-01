import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Role } from '../roles.enum'; 

export class CreateAgentDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  dipNumber?: string;

  @IsOptional()
  @IsDateString()  // ✅ Transforme une string en date valide
  birthDate?: string;

  @IsOptional()
  @IsString()
  address?: string;

}
