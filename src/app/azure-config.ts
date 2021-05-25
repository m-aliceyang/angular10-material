import { Configuration } from 'msal';
import { MsalAngularConfiguration } from '@azure/msal-angular';

const loginPolicies: Map<string, string> = new Map([
  ['https://localhost:44348', 'B2C_1_login'],
  ['https://csed-staging.azurewebsites.net', 'B2C_1_login_lane_crawford']
]);

export const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

/** =================== REGIONS ====================
 * 1) B2C policies and user flows
 * 2) Web API configuration parameters
 * 3) Authentication configuration parameters
 * 4) MSAL-Angular specific configuration parameters
 * =================================================
 */

// #region 1) B2C policies and user flows
/**
 * Enter here the user flows and custom policies for your B2C application,
 * To learn more about user flows, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1_login',
    resetPassword: 'B2C_1_reset',
    editProfile: 'B2C_1_edit'
  },
  authorities: {
    signUpSignIn: {
      authority: `https://cimcnj.b2clogin.com/cimcnj.onmicrosoft.com/${loginPolicies.get(location.origin)}`
    },
    resetPassword: {
      authority: 'https://cimcnj.b2clogin.com/cimcnj.onmicrosoft.com/B2C_1_reset'
    },
    editProfile: {
      authority: 'https://cimcnj.b2clogin.com/cimcnj.onmicrosoft.com/B2C_1_edit'
    }
  }
};
// #endregion

// #region 2) Web API Configuration
/**
 * Enter here the coordinates of your Web API and scopes for access token request
 * The current application coordinates were pre-registered in a B2C tenant.
 */
export const apiConfig: {b2cScopes: string[], webApi: string} = {
  b2cScopes: ['https://cimcnj.onmicrosoft.com/fbeb22e6-52e6-48c8-82eb-07604a68d38d/STsysAirFreight.Basic'],
  webApi: `${location.origin}/api/**`
};
// #endregion

// #region 3) Authentication Configuration
/**
 * Config object to be passed to Msal on creation. For a full list of msal.js configuration parameters,
 * visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_configuration_.html
 */
export const msalConfig: Configuration = {
  auth: {
      clientId: 'fbeb22e6-52e6-48c8-82eb-07604a68d38d',
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      redirectUri: `${location.origin}`,
      postLogoutRedirectUri: `${location.origin}`,
      navigateToLoginRequestUrl: true,
      validateAuthority: false,
    },
  cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: isIE, // Set this to 'true' to save cache in cookies to address trusted zones limitations in IE
  },
  system: {
    tokenRenewalOffsetSeconds: 3600
  },
  framework: {
    isAngular: true
  }
};

/**
 * Scopes you enter here will be consented once you authenticate. For a full list of available authentication parameters,
 * visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
 */
export const loginRequest: {scopes: string[]} = {
  scopes: ['openid', 'profile', 'offline_access'],
};

// Scopes you enter will be used for the access token request for your web API
export const tokenRequest: {scopes: string[]} = {
  scopes: apiConfig.b2cScopes // i.e. [https://cimcnj.onmicrosoft.com/helloapi/demo.read]
};
// #endregion

// #region 4) MSAL-Angular Configuration
// here you can define the coordinates and required permissions for your protected resources
export const protectedResourceMap: [string, string[]][] = [
  [apiConfig.webApi, apiConfig.b2cScopes]
];

/**
 * MSAL-Angular specific authentication parameters. For a full list of available options,
 * tslint:disable-next-line:max-line-length
 * visit https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular#config-options-for-msal-initialization
 */
export const msalAngularConfig: MsalAngularConfiguration = {
  popUp: !isIE,
  consentScopes: [
      ...loginRequest.scopes,
      ...tokenRequest.scopes,
  ],
  unprotectedResources: [
  ], // API calls to these coordinates will NOT activate MSALGuard
  protectedResourceMap,     // API calls to these coordinates will activate MSALGuard
  extraQueryParameters: {}
};
// #endregion
