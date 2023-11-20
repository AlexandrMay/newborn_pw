import { test, expect } from "@playwright/test";
import Customer from "../models/customer.model";

// ONLY FOR MYSQL!!!

test("DB", async ({page}) => {
    const customer = await Customer.findOne({ where: { customer_id: 1 } }) as unknown as {_previousDataValues: Customer};
    console.log(customer._previousDataValues.email);
});


