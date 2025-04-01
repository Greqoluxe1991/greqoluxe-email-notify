import { checkCustomerExists } from "../services/shopify";
import dotenv from "dotenv";
dotenv.config();

export const createShopifyCustomerController = async (customerData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}) => {
  const existingCustomer = await checkCustomerExists(customerData.email);

  if (existingCustomer) {
    // If customer already exists, return the customer data
    console.log("Customer already exists:", existingCustomer);
    return;
  }

  // If customer doesn't exist, proceed with creation
  const url = `https://${process.env.SHOPIFY_STORE}/admin/api/2023-01/graphql.json`;

  const mutation = `
    mutation createCustomer($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
          phone
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
      phone: customerData.phone,
    },
  };

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": process.env.ACCESS_TOKEN ?? "", // Replace with your actual access token
  };

  const body = JSON.stringify({
    query: mutation,
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

    if (data.data.customerCreate.userErrors.length > 0) {
      // If there are errors in the response
      console.error("User errors:", data.data.customerCreate.userErrors);
    } else {
      // Handle success - New customer created
      const newCustomer = data.data.customerCreate.customer;
      console.log("Customer created:", newCustomer);
    }
  } catch (error) {
    console.error("Error creating Shopify customer:", error);
  }
};
