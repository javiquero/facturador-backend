/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

  '/': { view: 'pages/homepage' },
  //  - AUTH -
  //  --------
  'POST   /api/v1/login':                                 { action: 'auth/post_login' },
  'POST   /api/v1/relogin':                               { action: 'auth/post_relogin' },
  'POST   /api/v1/signup':                                { action: 'auth/post_signup' },
  'POST   /api/v1/email/confirm':                         { action: 'auth/post_confirm_email' },
  'POST   /api/v1/password/reset':                        { action: 'auth/post_reset_password' },
  'POST   /api/v1/password/change':                       { action: 'auth/post_change_password' },

  // ----------------
  //  - COMPANIES -
  //  --------
  'POST   /api/v1/data/companies':                         { action: 'company/getall' },
  'POST   /api/v1/data/companies/add':                     { action: 'company/add' },
  'GET    /api/v1/data/companies/logo/get/:file':          { action: 'company/getLogo', skipAssets: false, policy: 'privateNoSocket'},
  'POST   /api/v1/data/companies/logo/add':                { action: 'company/addLogo' },
  'POST   /api/v1/data/companies/remove':                  { action: 'company/remove' },
  'POST   /api/v1/data/companies/edit':                    { action: 'company/edit' },

  // ----------------
  //  - CONTACTS -
  //  --------
  'POST   /api/v1/data/clients':                         { action: 'client/getall' },
  'POST   /api/v1/data/clients/add':                     { action: 'client/add' },
  'POST   /api/v1/data/clients/remove':                  { action: 'client/remove' },
  'POST   /api/v1/data/clients/edit':                    { action: 'client/edit' },
  // ----------------
  //  - COUNTRIES -
  //  --------
  'POST   /api/v1/data/countries':                         { action: 'country/getall' },

  'POST   /api/v1/data/socket':                           { action: 'socket/connect' },

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
  // '/*': {
  //   controller: 'App',
  //   action: 'serve',
  //   skipAssets: true,
  //   skipRegex: /^\/api\/.*$/
  // },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
