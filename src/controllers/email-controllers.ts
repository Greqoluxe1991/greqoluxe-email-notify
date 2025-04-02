import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { transporter } from "../config/email-config";
import { createShopifyCustomerController } from "./shopify-controller";

export const sendEmailToGreqoluxe = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      phone,
      email,
      product_id,
      product_name,
      product_url,
      message,
    } = req.body;

    const subject = `client: ${name.toUpperCase()} is interested in your product: ${product_name}`;
    const text = `client: ${name.toUpperCase()} is interested in your product: ${product_name}`;
    const html = `
          <h2>Customer Interest in Your Product</h2>
          <p><strong>Client Name:</strong> ${name}</p>
          <p><strong>Contact Number:</strong> ${phone}</p>
          <p><strong>Contact Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Product ID:</strong> ${product_id}</p>
          <p><strong>Product URL:</strong> <a href="https://www.greqoluxe.com${product_url}" target="_blank">www.greqoluxe.com${product_url}</a></p>
          <p><strong>Product Name:</strong> ${product_name}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p>The client has shown interest in this product and would like more information or assistance.</p>
        `;
    try {
      await transporter.sendMail({
        from: `"GreqoLuxe" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject,
        text,
        html,
      });

      const nameSplit = name.split(" ");
      const firstName = nameSplit[0];
      const lastName = nameSplit.splice(1).join(" ");

      console.log({ firstName, lastName, product_id });
      await createShopifyCustomerController({
        firstName,
        lastName,
        email,
        phone,
      });

      res.status(200).send({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).send({ error: "Failed to send email", log: error });
    }
  }
);
