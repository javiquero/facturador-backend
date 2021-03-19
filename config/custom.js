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

  mailgunDomain: 'sandbox8ccda7ebeb1e4d18a9ea04379bbac6eb.mailgun.org',
  mailgunSecret: '7cb5de11956b9111a8fae8608872adbe-059e099e-b1e2e524',

  fromEmailAddress: 'noreply@facturador.com',
  fromName: 'The Facturador Team',
  tokensecret: "est3_Es=mitk3n.s3cr37x26574",

  Defaults: {
    companyName: "Empresa"
  }
};
