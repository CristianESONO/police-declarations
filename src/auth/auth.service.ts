// src/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { JwtPayload } from './jwt-payload.interface';  // Créez ce fichier pour définir la structure du payload du JWT
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Méthode pour valider l'utilisateur avec son mot de passe
  async validateUser(username: string, pass: string): Promise<any> {
    const isValid = await this.userService.validatePassword(username, pass); 
    if (isValid) {
      const user = await this.userService.findOneByUsername(username);
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Méthode pour générer un JWT
  async login(user: User) {
    const payload: JwtPayload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
