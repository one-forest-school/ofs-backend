import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthenticateUser } from './auth.interface';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor(private configService: ConfigService) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get('auth.userPoolId'),
      ClientId: this.configService.get('auth.clientId'),
    });
  }

  authenticateUser(user: AuthenticateUser) {
    const { email, password } = user;

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
