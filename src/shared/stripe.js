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
    createCustomer: createCustomer
};