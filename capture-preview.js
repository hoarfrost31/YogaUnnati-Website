const path = require("path");
const puppeteer = require("puppeteer-core");

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    defaultViewport: {
      width: 1440,
      height: 1200,
      deviceScaleFactor: 1,
    },
    args: [
      "--allow-file-access-from-files",
      "--disable-web-security",
      "--no-first-run",
      "--no-default-browser-check",
    ],
  });

  try {
    const page = await browser.newPage();
    const fileUrl = `file:///${path.resolve("index.html").replace(/\\/g, "/")}`;
    await page.goto(fileUrl, { waitUntil: "networkidle0" });
    await page.screenshot({
      path: path.resolve("preview.png"),
      fullPage: true,
    });
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
