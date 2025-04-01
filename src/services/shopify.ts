import dotenv from "dotenv";
dotenv.config();

export const checkCustomerExists = async (email: string) => {
  const url = `https://${process.env.SHOPIFY_STORE}/admin/api/2023-01/graphql.json`;

  const query = `
    query checkCustomerByEmail($email: String!) {
      customers(query: "email:${email}") {
        edges {
          node {
            id
            email
            firstName
            lastName
          }
        }
      }
    }
  `;

  const variables = { email };

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": process.env.ACCESS_TOKEN ?? "", // Replace with your actual access token
  };

  const body = JSON.stringify({
    query,
    variables,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.data.customers.edges.length > 0) {
      // Customer found, return customer details
      return data.data.customers.edges[0].node;
    } else {
      // No customer found, return null
      return null;
    }
  } catch (error) {
    console.error("Error checking customer existence:", error);
    return null;
  }
};
