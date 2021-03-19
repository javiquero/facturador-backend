/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
        //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
        //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

        name: {
            type: 'string',
            required: true,
            description: 'User\'s name.',
            maxLength: 100,
            example: 'Mary Sue'
        },
        surname: {
            type: 'string',
            required: true,
            description: 'User\'s surname.',
            maxLength: 100,
            example: 'Mary Sue'
        },
        email: {
            type: 'string',
            required: true,
            unique: true,
            isEmail: true,
            maxLength: 200,
            example: 'mary.sue@example.com'
        },
        lopd: {
          type: 'boolean',
          description: 'The user has accepted the terms of the lopd data protection act.',
          extendedDescription: 'The user allows the use of their contact means to communicate with him'
        },
        emailStatus: {
            type: 'string',
            isIn: ['unconfirmed', 'change-requested', 'confirmed'],
            defaultsTo: 'confirmed',
            description: 'The confirmation status of the user\'s email address.',
            extendedDescription: `Users might be created as "unconfirmed" (e.g. normal signup) or as "confirmed" (e.g. hard-coded
admin users).  When the email verification feature is enabled, new users created via the
signup form have \`emailStatus: 'unconfirmed'\` until they click the link in the confirmation email.
Similarly, when an existing user changes their email address, they switch to the "change-requested"
email status until they click the link in the confirmation email.`
        },
        emailChangeCandidate: {
            type: 'string',
            description: 'A still-unconfirmed email address that this user wants to change to.'
        },

        password: {
            type: 'string',
            required: true,
            description: 'Securely hashed representation of the user\'s login password.',
            protect: true,
            example: '2$28a8eabna301089103-13948134nad'
        },

        passwordResetToken: {
            type: 'string',
            description: 'A unique token used to verify the user\'s identity when recovering a password.  Expires after 1 use, or after a set amount of time has elapsed.'
        },

        passwordResetTokenExpiresAt: {
            type: 'number',
            description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `passwordResetToken` will expire (or 0 if the user currently has no such token).',
            example: 1502844074211
        },

        accessToken: {
            type: 'string',
            description: 'A pseudorandom, probabilistically-unique token for access in account.'
        },

        accessTokenExpiresAt: {
            type: 'number',
            description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `accessToken` will expire (or 0 if the user currently has no such token).',
            example: 1502844074211
        },

        emailProofToken: {
            type: 'string',
            description: 'A pseudorandom, probabilistically-unique token for use in our account verification emails.'
        },

        emailProofTokenExpiresAt: {
            type: 'number',
            description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `emailProofToken` will expire (or 0 if the user currently has no such token).',
            example: 1502844074211
        },
        tosAcceptedByIp: {
            type: 'string',
            description: 'The IP (ipv4) address of the request that accepted the terms of service.',
            extendedDescription: 'Useful for certain types of businesses and regulatory requirements (KYC, etc.)',
            moreInfoUrl: 'https://en.wikipedia.org/wiki/Know_your_customer'
        },

        lastSeenAt: {
            type: 'number',
            description: 'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
            example: 1502844074211
        },
        avatar: {
            type: 'string'
        },
        config: {
            type:'json'
        },
        //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
        //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
        //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


        //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
        //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
        //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
        companies: {
          collection: 'Company',
          via: 'user'
        }
    },

};
