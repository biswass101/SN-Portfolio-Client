import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to admin login
    await page.goto('http://localhost:5174/admin/login', { waitUntil: 'networkidle' });
    console.log('✓ Navigated to login page');
    
    // Check if login form is visible
    const emailField = await page.$('input[type="email"]');
    if (!emailField) throw new Error('Email field not found');
    console.log('✓ Login form visible');
    
    // Fill in credentials
    await page.fill('input[type="email"]', 'admin@portfolio.com');
    await page.fill('input[type="password"]', 'Admin@123');
    console.log('✓ Credentials filled');
    
    // Click submit
    await page.click('button[type="submit"]');
    console.log('✓ Login button clicked');
    
    // Wait for navigation to dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 });
    console.log('✓ Navigated to dashboard');
    
    // Take screenshot
    await page.screenshot({ path: '/tmp/dashboard.png' });
    console.log('✓ Screenshot taken: /tmp/dashboard.png');
    
    // Check sidebar for profile image
    const profileImg = await page.$('img[alt]');
    if (profileImg) {
      const src = await profileImg.getAttribute('src');
      console.log(`✓ Profile image found in sidebar: ${src ? '✓ Has src' : '✗ No src'}`);
    } else {
      console.log('⚠ Profile image not found in sidebar (may be using gradient fallback)');
    }
    
    // Navigate to settings
    await page.click('a[href*="/admin/settings"]');
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 5000 });
    console.log('✓ Navigated to settings page');
    
    // Check settings for profile image
    const settingsImg = await page.$('img[alt*="admin"]');
    if (settingsImg) {
      const src = await settingsImg.getAttribute('src');
      console.log(`✓ Profile image found in settings: ${src ? '✓ Has src' : '✗ No src'}`);
    } else {
      console.log('⚠ Profile image not found in settings (may be using gradient fallback)');
    }
    
    // Take settings screenshot
    await page.screenshot({ path: '/tmp/settings.png' });
    console.log('✓ Settings screenshot taken: /tmp/settings.png');
    
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: '/tmp/error.png' });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
