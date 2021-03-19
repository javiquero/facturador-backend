/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // sendgridSecret: 'SG.fake.3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …

  baseUrl: 'http://localhost:8081',
  baseUrlfront: 'http://localhost:8082',

  verifyEmailAddresses: false,

  passwordResetTokenTTL: 24*60*60*1000,// 24 hours
  emailProofTokenTTL:    24*60*60*1000,// 24 hours
  accessTokenTTL: 24 * 60 * 60 * 1000,// 24 hours

  mailgunDomain: 'XXXX',
  mailgunSecret: 'XXXX',

  fromEmailAddress: 'noreply@facturador.com',
  fromName: 'The Facturador Team',
  tokensecret: "est3_Es=mitk3n.s3cr37x26574",

  Defaults: {
    companyName: "Empresa"
  }
};
