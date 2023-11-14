import { test, expect } from "@playwright/test";
import { ApiHelper } from "../helpers/apiHelper";
import dataset from '../test_data.json';

let token: string;
let parsed: object[];
parsed = JSON.parse(JSON.stringify(dataset));

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
  //   update: true
  // });
  await page.goto("/overview");
  //expect(page).toHaveScreenshot('overview.png');
  const firstCard = page.locator('.card-content').first();
  //await expect(firstCard).toHaveScreenshot('first_card.png');
  await page.context().storageState({ path: "auth.json" });
});

for (const data of parsed) {
  test(`Create a category with name ${data.name}`, async ({page}) => {
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
    await page.waitForLoadState('domcontentloaded');
    const allCategoryNames = await categoriesListElements.allTextContents();
    const allCategoryNamesTrimmed = allCategoryNames.map((el) => el.trim());
    const categories = await ApiHelper.getCategories(token);
    const categoryNamesFromApi = categories.map((el: any) => el.name);
    expect(allCategoryNamesTrimmed).toEqual(categoryNamesFromApi);
    await addCategoryBtn.click();
    await categoryName.fill(data.name);
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByText("Завантажити зображення").click();
    const fileChooser = await fileChooserPromise;
    expect(fileChooser.isMultiple()).toBeFalsy;
    await fileChooser.setFiles("image.jpg");
    const responsePromise = page.waitForResponse('/api/category');
    await page.getByText("Зберегти зміни").click();
    const response = await responsePromise;
    console.log(await response.json());
    await page.waitForLoadState('networkidle');
  });
}


