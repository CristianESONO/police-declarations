import { IsString, IsOptional, IsDate, IsPhoneNumber, IsEnum, IsArray,IsEmail } from 'class-validator';

export class CreateDeclarationDto {
  @IsString()
  fullName: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  dipNumber: string;

  @IsDate()
  birthDate: Date;

  @IsString()
  address: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsDate()
  declarationDate: Date;

  @IsString()
  description: string;

  @IsString()
  @IsEnum(['Accident', 'Delit', 'Confession', 'Témoin', 'Autre'])
  declarationType: string;

  @IsString()
  agentName: string;

  @IsString()
  place: string;

  @IsOptional()
  @IsString()
  witnesses?: string;

  @IsOptional()
  @IsString()
  additionalDocuments?: string;

  @IsOptional()
  @IsString()
  identityPhoto?: string;
}
