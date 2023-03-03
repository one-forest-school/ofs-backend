import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { ConfirmationOTP, ResendConfirmation } from '../auth.interface';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { RegisterAuthDto } from '../dto/register-auth.dto';

@Injectable()
export class CognitoService {
  private userPool: CognitoUserPool;

  constructor(private configService: ConfigService) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get('auth.userPoolId'),
      ClientId: this.configService.get('auth.clientId'),
    });
  }

  /**
   * Login of User
   * @param user
   * @returns Promise<unknown>
   */
  authenticateUser(user: LoginAuthDto) {
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
      newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  registerUser(user: RegisterAuthDto) {
    const { name, email, password, mobile } = user;

    console.log(name, email, password, mobile);
    const attributeList = [];
    const dataEmail = {
      Name: 'email',
      Value: email,
    };
    const dataPhoneNumber = {
      Name: 'phone_number',
      Value: mobile,
    };
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    const attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);
    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        attributeList,
        null,
        function (err, result) {
          if (!result) {
            reject(err);
          } else {
            resolve(result);
          }
          const cognitoUser = result.user;
          console.log('user name is ' + cognitoUser.getUsername());
        },
      );
    });
  }

  confirmUser(confirmationotp: ConfirmationOTP) {
    console.log('inside confirmation otp');
    const { username, otp } = confirmationotp;
    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(otp, true, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log('call result: ' + result);
    });
  }

  resendConfirmation(confirmation: ResendConfirmation) {
    const { email } = confirmation;
    console.log(email);
    const userData = {
      Username: email,
      Pool: this.userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.resendConfirmationCode(function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log('call result: ' + result);
    });
  }
}
