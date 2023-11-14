import { test, expect, Page, BrowserContext } from "@playwright/test";

let token: string;
let page: Page;
let context: BrowserContext

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext({ storageState: "auth.json" });
  page = await context.newPage();
  await page.goto("/");
  const localStorage = await page.evaluate(() =>
    JSON.stringify(window.localStorage)
  );
  const obj = JSON.parse(localStorage);
  token = obj["auth-token"];
});

test.beforeEach(async () => {
  await page.goto("/overview");
});

test("Check tab switch", async () => {
  const analyticsMenuItem = page
    .getByRole("listitem")
    .filter({ hasText: "Аналітика" });
  const analyticsPagePromise = page.waitForEvent('popup');
  await analyticsMenuItem.click();
  const analyticsPage = await analyticsPagePromise;
  await analyticsPage.waitForLoadState('networkidle');
  const analyticsPageTitle = await analyticsPage.locator('.page-title').textContent();
  expect(analyticsPageTitle).toEqual('Аналітика');
  const categoriesMenuItem = page.getByRole('listitem').filter({hasText: "Асортимент"});
  await categoriesMenuItem.click();
  page.waitForLoadState('networkidle');
  const pageTitle = await page.locator('.page-title h4').textContent();
  expect(pageTitle).toEqual('Категорії');
});
