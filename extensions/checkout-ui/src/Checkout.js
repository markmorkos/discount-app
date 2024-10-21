import { extension, Banner, TextField } from '@shopify/ui-extensions/checkout';

// Extend the Checkout UI with the appropriate extension point
export default extension("purchase.checkout.block.render", (root, api) => {

  const subtotalAmount = api.cost.subtotalAmount.current.amount;
  const discountCodes = api.discountAllocations.current;
  const cartItems = api.lines.current;
  const deliveryTotalAmount = api.cost.totalShippingAmount.current.amount;

  // Exit if no discounts or cart items
  if (!discountCodes.length || !cartItems.length) {
    console.log('No discounts or cart items, exit!');
    return;
  }

  // Calculate discount total amount and percentage
  const discountTotalAmount = discountCodes.reduce((total, discount) => total + discount.discountedAmount.amount, 0);
  const discountPercentage = calculateDiscountPercentage(discountTotalAmount, subtotalAmount);

  // Initialize item costs
  let cavalliItemsCost = 0, otherItemsCost = 0, cavalliItemsCount = 0;

  // Process cart items
  cartItems.forEach(item => {
    const isCavalli = item.merchandise.title.toLowerCase().includes('cavalli');
    const originalAmount = getOriginalAmount(item.cost.totalAmount.amount, discountPercentage);

    if (isCavalli) {
      cavalliItemsCost += originalAmount;
      cavalliItemsCount++;
    } else {
      otherItemsCost += originalAmount;
    }
  });

  // Exit if no Cavalli items
  if (cavalliItemsCount < 1) {
    console.log('No Cavalli items, exit!');
    return;
  }

  // Calculate the new total amount
  const newSubTotalAmount = calculateNewSubTotal(deliveryTotalAmount, discountPercentage, cavalliItemsCost, otherItemsCost);
  console.log('New Total Amount:', newSubTotalAmount);

  // Display the result in the UI
  root.replaceChildren(
    root.createComponent(Banner, { title: "New Total: "+newSubTotalAmount, status: "info" })
  );

  // Function to calculate discount percentage
  function calculateDiscountPercentage(discountAmount, totalAmount) {
    return totalAmount ? (discountAmount / totalAmount) * 100 : 0;
  }

  // Function to retrieve original amount before discount
  function getOriginalAmount(discountedAmount, discountPercentage) {
    return discountedAmount / (1 - (discountPercentage / 100));
  }

  // Function to calculate new total
  function calculateNewSubTotal(deliveryCost, discountPercentage, cavalliItemsCost, otherItemsCost) {
    const discountedOtherItemsCost = otherItemsCost * (1 - (discountPercentage / 100));
    return cavalliItemsCost + discountedOtherItemsCost + deliveryCost;
  }
});
