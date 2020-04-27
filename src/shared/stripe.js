const stripe = require('stripe')('sk_test_NRvYvirXBcxz3YjC5HPc0hL200djInxiBv');

// Create a Customer:
const createCustomer = function(email,token,callback){
    // const customer = await stripe.customers.create({
    //     source: 'tok_mastercard',
    //     email: 'paying.user@example.com',
    //   });
    stripe.customers.create(
        {
            source: token,
            email: email,
            description: 'My First Test Customer (created for API docs)'
        },
        function(err, customer) {
          // asynchronously called
          if(err)
            return callback(err);
          else
            return callback(null,customer['id']);
        }
      );
};

const createAccount = function(token,callback){
  stripe.accounts.create({
    country: 'US',
    type: 'custom',
    requested_capabilities: ['card_payments', 'transfers'],
  },
  function(err, account) {
    // asynchronously called
    if(err)
      return callback(err);
    else{
      stripe.accounts.createExternalAccount(
        account['id'],
        {external_account: token},
        function(err, card) {
          // asynchronously called
          if(err)
            return callback(err);
          else{
            const returnObj = {
              stripeAccountID: account['id'],
              stripeCard: card['id']
            };
            return callback(null,returnObj);
          }
        }
      );
    }
  });
};


// Charge the Customer instead of the card:
// const charge = await stripe.charges.create({
//   amount: 1000,
//   currency: 'usd',
//   customer: customer.id,
// });

// YOUR CODE: Save the customer ID and other info in a database for later.

// When it's time to charge the customer again, retrieve the customer ID.
// const charge = await stripe.charges.create({
//   amount: 1500, // $15.00 this time
//   currency: 'usd',
//   customer: customer.id, // Previously stored, then retrieved
// });

// stripe.charges.create(
//     {
//       amount: 2000,
//       currency: 'usd',
//       source: 'tok_visa',
//       description: 'My First Test Charge (created for API docs)',
//     },
//     function(err, charge) {
//       // asynchronously called
//     }
//   );

module.exports = {
    createCustomer: createCustomer,
    createAccount: createAccount
};