// @ts-check

// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").RunInput} RunInput
* @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
*/

// The configured entrypoint for the 'purchase.validation.run' extension target
/**
* @param {RunInput} input
* @returns {FunctionRunResult}
*/
export function run(input) {


  console.log('ciao');
  // The error
  const error = {
    localizedMessage:
        "There is an order maximum of $1,000 for customers without established order history",
    target: "cart"
  };
  // Parse the decimal (serialized as a string) into a float.
  const orderSubtotal = parseFloat(input.cart.cost.subtotalAmount.amount);
  const errors = [];

  // Orders with subtotals greater than $1,000 are available only to established customers.
  if (orderSubtotal > 1.0) {
    console.log(input);
    //errors.push(error);

  }

  return { errors };
};