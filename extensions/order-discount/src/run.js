import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

// Define the product ID to exclude from discounts
const EXCLUDED_PRODUCT_ID = '8518886686888';  // Replace with your actual product ID

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const targets = input.cart.lines
    // Filter out lines that match the excluded product ID
    .filter((line) => line.merchandise.product.id !== EXCLUDED_PRODUCT_ID)
    .map((line) => {
      return /** @type {Target} */ ({
        // Use the cart line ID to create a discount target
        cartLine: {
          id: line.id,
        },
      });
    });

  if (!targets.length) {
    // Log when no cart lines qualify for the discount
    console.error("No cart lines qualify for the discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: [
      {
        // Apply the discount to the collected targets
        targets,
        // Define a percentage-based discount
        value: {
          percentage: {
            value: "10.0",  // 10% discount
          },
        },
      },
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}
