import { test, expect } from "@playwright/test";
import { ApiHelper } from "../helpers/apiHelper";
import { DbHelper } from "../helpers/dbHelper";

let token: string;
let categoryId: string;

test.beforeAll(async () => {
  token = await ApiHelper.getToken({
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  });
});

test.beforeEach(async ({page}) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("auth-token", value);
  }, token);
  // await page.routeFromHAR('hars/categories.har', {
  //   url: '/api/category',
  //   //update: true
  // });
  await page.goto("/overview");
  // await expect(page).toHaveScreenshot('overview.png');
  // const firstCard = page.locator('.card-content').first();
  // await expect(firstCard).toHaveScreenshot('first_card.png');
  // await page.context().storageState({ path: "auth.json" });
});

test("Create a category with positions", async ({page}) => {
  // const client = await page.context().newCDPSession(page);
  // await client.send('Performance.enable');
  const categoriesMenuItem = page
    .getByRole("listitem")
    .filter({ hasText: "Асортимент" });
  const categoriesListElements = page
    .locator("app-categories-page")
    .getByRole("link");
  const addCategoryBtn = page.getByText("Додати категорію");
  const categoryName = page.locator("#name");
  await categoriesMenuItem.click();
  await page.waitForLoadState('networkidle');
  // await page.waitForLoadState('domcontentloaded');
  // await page.waitForTimeout(5000);
  // const allCategoryNames = await categoriesListElements.allTextContents();
  // const allCategoryNamesTrimmed = allCategoryNames.map((el) => el.trim());
  // const categories = await ApiHelper.getCategories(token);
  // const categoryNamesFromApi = categories.map((el: any) => el.name);
  // expect(allCategoryNamesTrimmed).toEqual(categoryNamesFromApi);
  await addCategoryBtn.click();
  await categoryName.fill("PW Test category");
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByText("Завантажити зображення").click();
  const fileChooser = await fileChooserPromise;
  // expect(fileChooser.isMultiple()).toBeFalsy;
  await fileChooser.setFiles("image.jpg");
  // Interception
  const responsePromise = page.waitForResponse('/api/category');
  await page.getByText("Зберегти зміни").click();
  const response = await responsePromise;
  const parsed = await response.json();
  categoryId = parsed._id;


  await page.waitForLoadState('networkidle');
  const data = {
    name: "TEST POSITION",
    cost: 100,
    category: categoryId
  };
  const response1 = await ApiHelper.createPosition(token, data);
  console.log(response1);
  // let performanceMetrics = await client.send('Performance.getMetrics');
  // console.log(performanceMetrics.metrics);
});

// test('DB', async () => {
//   console.log(await DbHelper.getCategories());
// });



