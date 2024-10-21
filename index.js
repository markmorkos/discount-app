const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Маршрут для создания скидки
app.get('/discounts/create', (req, res) => {
  res.send('This is the page where you create discounts.');
});

// Маршрут для отображения деталей скидки
app.get('/discounts/details', (req, res) => {
  res.send('This is the page where you see discount details.');
});

// Пример логики для применения скидки через POST-запрос
app.post('/apply-discount', (req, res) => {
  const cavalliProductId = 'gid://shopify/Product/10260757053771'; 
  let cavalliInCart = false;
  let discounts = [];

  const cart = req.body.cart;

  for (const cartLine of cart.lines) {
    if (cartLine.merchandise.__typename === 'ProductVariant') {
      if (cartLine.merchandise.product.id === cavalliProductId) {
        cavalliInCart = true;
      } else {
        discounts.push({
          message: '10% Discount applied',
          targets: [
            {
              productVariant: {
                id: cartLine.merchandise.id,
              },
            },
          ],
          value: {
            percentage: {
              value: 10.0,
            },
          },
        });
      }
    }
  }

  res.json({
    discounts,
    discountApplicationStrategy: 'MAXIMUM',
  });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
