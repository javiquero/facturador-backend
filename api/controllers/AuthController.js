/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const farmhash = require("farmhash");
const jwt = require("jsonwebtoken");
module.exports = {
	post_relogin: async (req, res) => {
		let token = req.param("token", undefined);
		if (!token) return res.status(403).send('incorrect Token');

		let userRecord = await User.findOne({ accessToken: token });
		if (!userRecord)
			return res.status(403).send('The provided token does not match any user in the database.');

		if (userRecord.emailStatus == 'unconfirmed')
			return res.status(401).send('The provided email belongs to an account that has not yet been activated.');

		if (userRecord.accessTokenExpiresAt <= Date.now())
			return res.status(498).send('Token Expired/Invalid');

		req.session.user=userRecord;
		return res.json({
			token: token,
			info: {
			name: userRecord.name + " " + userRecord.surname,
			email: userRecord.email
			}
		});
	},
    post_login: async (req, res) => {
        if (!req.param('email')) return res.badRequest('Email address is required!');
        if (!req.param('password')) return res.badRequest('Password is required!');

        let userRecord = await User.findOne({email: req.param('email').toLowerCase()});

        if (!userRecord)
            return res.status(403).send('The provided email and password combination does not match any user in the database.');

        if (userRecord.emailStatus == 'unconfirmed')
            return res.status(401).send('The provided email belongs to an account that has not yet been activated.');


        // If the password doesn't match, then also exit thru "badCombo".
        await sails.helpers.passwords.checkPassword(req.param('password'), userRecord.password)
            .intercept('incorrect', () => {
                return res.status(403).send('The provided email and password combination does not match any user in the database.');
            });

        // sails.log.debug(sails.io.sockets.connected[userRecord.config.socketId]);
        // if (sails.io.sockets.connected[userRecord.config.socketId]) {
        //     sails.log.info("Detected user login from another device.");
        //     await sails.sockets.broadcast(userRecord.config.socketId, "disconect", { reason: "Another device has logged in with the same account." });
        // }
		let valuesToSet = {accessToken: userRecord.accessToken};
		if (userRecord.accessTokenExpiresAt <= Date.now()){
			const passwordHash = farmhash.hash32(req.param('password'));
			const payload = {
				id: userRecord.id,
				pwh: passwordHash
			};
			let token = jwt.sign(payload, sails.config.custom.tokensecret);
			valuesToSet = {
				accessToken: token,
				accessTokenExpiresAt: Date.now() + sails.config.custom.accessTokenTTL
			}
			await User.updateOne({
				id: userRecord.id
			}).set(valuesToSet);
		}

		req.session.user=userRecord;
        return res.json({
            token: valuesToSet.accessToken,
            info: {
              name: userRecord.name + " " + userRecord.surname,
              email: userRecord.email
            }
        });
    },
    post_signup: async (req, res) => {

        if (!req.param('name')) return res.badRequest('An name is required!');
        if (!req.param('surname')) return res.badRequest('An surname is required!');
        if (!req.param('phone')) return res.badRequest('An phone number is required!');
        if (!req.param('email')) return res.badRequest('An email address is required!');
        if (!req.param('password')) return res.badRequest('An password is required!');
        if (!req.param('privacity')) return res.badRequest('Accept terms of privacity is required!');
        //if (!req.param('lopd')) return res.badRequest('Accept terms of lopd is required!');

        var newEmailAddress = req.param('email').toLowerCase();

        let existsEmail = await User.findOne({
            email: newEmailAddress
        });
        if (existsEmail) return res.badRequest("This email address already exists.")

        let nuser = {
            name: req.param('name'),
            surname: req.param('surname'),
            phone: req.param('phone'),
            password: await sails.helpers.passwords.hashPassword(req.param('password')),
            email: req.param('email'),
            tosAcceptedByIp: req.ip,
			lopd: req.param('lopd'),
			emailStatus: 'confirmed'
        }

        if (sails.config.custom.verifyEmailAddresses) {
            nuser.emailProofToken = await sails.helpers.strings.random('url-friendly');
            nuser.emailProofTokenExpiresAt = Date.now() + sails.config.custom.emailProofTokenTTL;
            nuser.emailStatus = 'unconfirmed';
        }


        let newUserRecord = await User.create(nuser)
        .intercept('E_UNIQUE', 'emailAlreadyInUse')
        .intercept({
            name: 'UsageError'
        }, 'invalid')
        .fetch();
        if (!newUserRecord) {
          sails.log.error("AuthController - post-signup - Error al crear la cuenta");
          return res.badRequest("Error creating the account.")
        }

        // let newCompany = await Company.create({
        //     name: sails.config.custom.Defaults.companyName,
        //     user: newUserRecord.id
        // }).fetch();
        // if (!newCompany) {
        //   await User.destroyOne({id: newUserRecord.id });
        //   sails.log.error("AuthController - post-signup - Error al crear la cuenta");
        //   return res.badRequest("Error creating the account.")
        // }

        // await User.updateOne({id: newUserRecord.id}).set({config: { selCompany: newCompany.id }})

        //req.session.user = newUserRecord;
        //sails.log.debug(newUserRecord);
        if (sails.config.custom.verifyEmailAddresses) {
            // Send "confirm account" email
            try {
              await sails.helpers.sendTemplateEmail.with({
                to: newEmailAddress,
                subject: 'Bienvenido, por favor confirma tu cuenta',
                template: 'email-verify-account',
                templateData: {
                    email: newEmailAddress,
                    fullName: req.param('name'),
                    token: newUserRecord.emailProofToken
                }
              });
              sails.log.debug("AuthController - post-signup - user has been created.");
              return res.ok();
            } catch (error) {
              await User.destroyOne({id: newUserRecord.id });
            //   await Company.destroyOne({id: newCompany.id });
              sails.log.error("AuthController - post-signup - Error al crear la cuenta");
              return res.badRequest("Error creating the account.")
            }
        } else {
            sails.log.info('Skipping new account email verification... (since `verifyEmailAddresses` is disabled)');
        }

    },
    post_confirm_email: async (req, res) => {
        // sails.log.debug("AuthController - post_confirm_email");
        // sails.log.debug("AuthController - allParams()", req.allParams());
        // If no token was provided, this is automatically invalid.
        if (!req.param('token'))
            return res.status(498).send('Token Expired/Invalid');


        // Get the user with the matching email token.
        let user = await User.findOne({ emailProofToken: req.param('token') });

        // If no such user exists, or their token is expired, bail.
        if (!user || user.emailProofTokenExpiresAt <= Date.now()) {
            return res.status(498).send('Token Expired/Invalid');
        }

        if (user.emailStatus === 'unconfirmed') {
            //  ┌─┐┌─┐┌┐┌┌─┐┬┬─┐┌┬┐┬┌┐┌┌─┐  ╔═╗╦╦═╗╔═╗╔╦╗ ╔╦╗╦╔╦╗╔═╗  ╦ ╦╔═╗╔═╗╦═╗  ┌─┐┌┬┐┌─┐┬┬
            //  │  │ ││││├┤ │├┬┘││││││││ ┬  ╠╣ ║╠╦╝╚═╗ ║───║ ║║║║║╣   ║ ║╚═╗║╣ ╠╦╝  ├┤ │││├─┤││
            //  └─┘└─┘┘└┘└  ┴┴└─┴ ┴┴┘└┘└─┘  ╚  ╩╩╚═╚═╝ ╩   ╩ ╩╩ ╩╚═╝  ╚═╝╚═╝╚═╝╩╚═  └─┘┴ ┴┴ ┴┴┴─┘
            // If this is a new user confirming their email for the first time,
            // then just update the state of their user record in the database,
            // store their user id in the session (just in case they aren't logged
            // in already), and then redirect them to the "email confirmed" page.
            const passwordHash = farmhash.hash32(user.password);
            const payload = {
                id: user.id,
                pwh: passwordHash
            };
            let token = jwt.sign(payload, sails.config.custom.tokensecret);
            await User.updateOne({
                id: user.id
            }).set({
                accessToken: token,
                accessTokenExpiresAt: Date.now() + sails.config.custom.accessTokenTTL,
                emailStatus: 'confirmed',
                emailProofToken: '',
                emailProofTokenExpiresAt: 0
            });
            req.session.userId = user.id;
            return res.json({
                token: token,
                info: {
                  name: user.name + " " + user.surname,
                  email: user.email
                }
            });
        } else if (user.emailStatus === 'change-requested') {
            //  ┌─┐┌─┐┌┐┌┌─┐┬┬─┐┌┬┐┬┌┐┌┌─┐  ╔═╗╦ ╦╔═╗╔╗╔╔═╗╔═╗╔╦╗  ┌─┐┌┬┐┌─┐┬┬
            //  │  │ ││││├┤ │├┬┘││││││││ ┬  ║  ╠═╣╠═╣║║║║ ╦║╣  ║║  ├┤ │││├─┤││
            //  └─┘└─┘┘└┘└  ┴┴└─┴ ┴┴┘└┘└─┘  ╚═╝╩ ╩╩ ╩╝╚╝╚═╝╚═╝═╩╝  └─┘┴ ┴┴ ┴┴┴─┘
            if (!user.emailChangeCandidate) {
                return res.badRequest(`Consistency violation: Could not update Stripe customer because this user record's emailChangeCandidate ("${user.emailChangeCandidate}") is missing.  (This should never happen.)`);
            }

            // Last line of defense: since email change candidates are not protected
            // by a uniqueness constraint in the database, it's important that we make
            // sure no one else managed to grab this email in the mean time since we
            // last checked its availability. (This is a relatively rare edge case--
            // see exit description.)
            if (await User.count({
                    emailAddress: user.emailChangeCandidate
                }) > 0) {
                return res.status(409).send('The email address is no longer available.');
            }

            // If billing features are enabled, also update the billing email for this
            // user's linked customer entry in the Stripe API to make sure they receive
            // email receipts.
            // > Note: If there was not already a Stripe customer entry for this user,
            // > then one will be set up implicitly, so we'll need to persist it to our
            // > database.  (This could happen if Stripe credentials were not configured
            // > at the time this user was originally created.)
            if (sails.config.custom.enableBillingFeatures) {
                // let didNotAlreadyHaveCustomerId = (!user.stripeCustomerId);
                // let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo.with({
                //     stripeCustomerId: user.stripeCustomerId,
                //     emailAddress: user.emailChangeCandidate
                // }).timeout(5000).retry();
                // if (didNotAlreadyHaveCustomerId) {
                //     await User.updateOne({
                //         id: user.id
                //     }).set({
                //         stripeCustomerId
                //     });
                // }
            }

            // Finally update the user in the database, store their id in the session
            // (just in case they aren't logged in already), then redirect them to
            // their "my account" page so they can see their updated email address.
            await User.updateOne({
                    id: user.id
                })
                .set({
                    emailStatus: 'confirmed',
                    emailProofToken: '',
                    emailProofTokenExpiresAt: 0,
                    emailAddress: user.emailChangeCandidate,
                    emailChangeCandidate: '',
                });
            req.session.userId = user.id;
            return res.ok();
            // if (this.req.wantsJSON) {
            // } else {
            //   throw { redirect: '/account' };
            // }

        } else {
            return res.badRequest(`Consistency violation: User ${user.id} has an email proof token, but somehow also has an emailStatus of "${user.emailStatus}"!  (This should never happen.)`);
        }

    },
    post_logout: (req, res) => {
        delete this.req.session.user;
        res.ok();
    },
    post_reset_password: async (req, res) => {
        sails.log.debug("AuthController - post_reset_password");
        sails.log.debug("AuthController - allParams()", req.allParams());

        if (!req.param('email')) return res.badRequest('Email address is required!');
        // Find the record for this user.
        // (Even if no such user exists, pretend it worked to discourage sniffing.)
        var userRecord = await User.findOne({
            email: req.param('email').toLowerCase()
        });
        if (!userRecord) {
            return res.ok()
        } //•

        // Come up with a pseudorandom, probabilistically-unique token for use
        // in our password recovery email.
        var token = await sails.helpers.strings.random('url-friendly');
        // Store the token on the user record
        // (This allows us to look up the user when the link from the email is clicked.)
        await User.update({
                id: userRecord.id
            })
            .set({
                passwordResetToken: token,
                passwordResetTokenExpiresAt: Date.now() + sails.config.custom.passwordResetTokenTTL,
            });

        // Send recovery email
        await sails.helpers.sendTemplateEmail.with({
            to: req.param('email').toLowerCase(),
            subject: 'Recuperar contraseña',
            template: 'email-reset-password',
            templateData: {
                email: req.param('email').toLowerCase(),
                fullName: userRecord.name,
                token: token
            }
		});
		return res.ok();
    },
    post_change_password: async (req, res) => {
        sails.log.debug("AuthController - post_change_password");
        sails.log.debug("AuthController - allParams()", req.allParams());

        if (!req.param('token')) {
            return res.status(498).send('Token Expired/Invalid');
        }

        // Get the user with the matching email token.
        var user = await User.findOne({
            passwordResetToken: req.param('token')
        });

        // If no such user exists, or their token is expired, bail.
        if (!user || user.passwordResetTokenExpiresAt <= Date.now()) {
            return res.status(498).send('Token Expired/Invalid');
        }
        sails.log.debug(req.param('password'), user.password);
        try {
            await sails.helpers.passwords.checkPassword(req.param('password'), user.password)
                .intercept('success', () => {
                    return res.status(403).send('The password must be different from the current one.');
                })
                .intercept('incorrect', () => {});
        } catch (error) {

        }


        let data = {
            password: await sails.helpers.passwords.hashPassword(req.param('password')),
            passwordResetToken: '',
            passwordResetTokenExpiresAt: 0,
            accessTokenExpiresAt: Date.now() + sails.config.custom.accessTokenTTL
        }

        const passwordHash = farmhash.hash32(data.password);
        const payload = {
            id: user.id,
            pwh: passwordHash
        };

        data.accessToken = jwt.sign(payload, sails.config.custom.tokensecret);
        await User.updateOne({
            id: user.id
        }).set(data);
        req.session.userId = user.id;
        return res.json({
            token: data.accessToken
        });

    }
};
