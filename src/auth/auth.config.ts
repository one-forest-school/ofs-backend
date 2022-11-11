import { registerAs } from '@nestjs/config';
export default registerAs('auth', () => ({
  userPoolId: process.env.AUTH_COGNITO_USERPOOLID,
  clientId: process.env.AUTH_COGNITO_CLIENTID,
  region: process.env.AUTH_COGNITO_REGION,
  authority: `https://cognito-idp.${process.env.AUTH_COGNITO_REGION}.amazonaws.com/${process.env.AUTH_COGNITO_USERPOOLID}`,
}));
