export * from './run';

// Define the API endpoint and Storefront access token
const shopifyEndpoint = 'https://your-shop-name.myshopify.com/api/2023-07/graphql.json';
const accessToken = 'your-storefront-access-token';

// GraphQL query to get products and discounts
const query = `
  {
    products(first: 10) {
      edges {
        node {
          id
          title
          description
          variants(first: 5) {
            edges {
              node {
                id
                title
                price
              }
            }
          }
        }
      }
    }
    discountNodes(first: 5) {
      edges {
        node {
          discount {
            ... on DiscountCode {
              code
              status
              endsAt
            }
            ... on AutomaticDiscount {
              title
              status
              startsAt
              endsAt
            }
          }
        }
      }
    }
  }
`;

// Function to fetch data from Shopify Storefront API
async function fetchShopifyData() {
  try {
    const response = await fetch(shopifyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken
      },
      body: JSON.stringify({ query })
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
    } else {
      console.log('Products and Discounts:', result.data);
    }

  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Call the function to retrieve the products and discounts
fetchShopifyData();
