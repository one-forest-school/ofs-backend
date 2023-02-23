import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import {
  AuthenticateUser,
  SignUpUser,
  ConfirmationOTP,
  ResendConfirmation,
} from './auth.interface';

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
    console.log(this.configService.get('auth.userPoolId'));
    console.log(email, password);
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

  signUpUser(user: SignUpUser) {
    const { name, email, password, phone } = user;
    console.log('inside signup user');
    console.log(name, email, password, phone);
    const attributeList = [];
    const dataEmail = {
      Name: 'email',
      Value: email,
    };
    const dataPhoneNumber = {
      Name: 'phone_number',
      Value: phone,
    };
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    const attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);
    this.userPool.signUp(
      email,
      password,
      attributeList,
      null,
      function (err, result) {
        if (err) {
          console.log('inside error');
          console.log(err.message);
          return;
        }
        const cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
      },
    );
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
