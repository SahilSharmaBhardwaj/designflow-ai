import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'public/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const EDGE_PATHS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];

let executablePath = EDGE_PATHS.find(p => fs.existsSync(p));

async function capture() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Landing Page
  console.log('1. Capturing Landing Page...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-landing-page.png') });

  // 2. Dashboard
  console.log('2. Capturing Dashboard...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-dashboard.png') });

  // 3. Create Project Wizard
  console.log('3. Capturing Requirements Wizard...');
  await page.goto('http://localhost:3000/project/new', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-create-project.png') });

  // 4. Workbench - User Flow
  console.log('4. Capturing Workbench (User Flow)...');
  await page.goto('http://localhost:3000/project/proj-bondspe-trading', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-workbench-userflow.png') });

  // Helper to click tab by text in page
  async function clickTabByText(textMatch, filename) {
    const clicked = await page.evaluate((text) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const found = btns.find(b => b.textContent && b.textContent.includes(text));
      if (found) {
        found.click();
        return true;
      }
      return false;
    }, textMatch);

    if (clicked) {
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, filename) });
      console.log(`Saved ${filename}`);
    } else {
      console.warn(`Could not find button containing '${textMatch}'`);
    }
  }

  // 5. UX & A11y Audit
  console.log('5. Capturing UX & A11y Audit...');
  await clickTabByText('UX & A11y', '05-workbench-ux-audit.png');

  // 6. User Stories
  console.log('6. Capturing User Stories...');
  await clickTabByText('User Stories', '06-workbench-user-stories.png');

  // 7. UX Research
  console.log('7. Capturing UX Research...');
  await clickTabByText('UX Research', '07-workbench-research.png');

  // 8. Usability Testing
  console.log('8. Capturing Usability Testing...');
  await clickTabByText('Usability Test', '08-workbench-usability-test.png');

  // 9. Design Brief
  console.log('9. Capturing Design Brief...');
  await clickTabByText('Design Brief', '09-workbench-design-brief.png');

  await browser.close();
  console.log('All detailed screenshots captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
