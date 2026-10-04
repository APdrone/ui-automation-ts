abstract class Car {
  constructor(public model: string, public productionYear: number) {}

  abstract displayCarInfo(): void;
}


/**
 * Concrete Products
 */
class Sedan extends Car {
  constructor(model: string, productionYear: number) {
    super(model, productionYear);
  }

  public displayCarInfo(): void {
    console.log(
      `Sedan - Model: ${this.model}, Year: ${this.productionYear}`
    );
  }
}

class SUV extends Car {
  constructor(model: string, productionYear: number) {
    super(model, productionYear);
  }

  public displayCarInfo(): void {
    console.log(`SUV - Model: ${this.model}, Year: ${this.productionYear}`);
  }
}

/**
 * Concrete Creator
 */
class CarFactory {
  public createCar(type: string, model: string, year: number): Car {
    if (type === "Sedan") {
      return new Sedan(model, year);
    } else if (type === "SUV") {
      return new SUV(model, year);
    } else {
      throw new Error(`Unknown car type: ${type}`);
    }
  }
}

const carFactory = new CarFactory();

const sedan = carFactory.createCar("Sedan", "Camry", 2023);
sedan.displayCarInfo();
// This is a Sedan. Model: Camry, Production Year: 2023

const suv = carFactory.createCar("SUV", "RAV4", 2023);
suv.displayCarInfo(); //
// This is an SUV. Model: RAV4, Production Year: 2023

const hatchback = carFactory.createCar("Hatchback", "Corolla", 2023);
hatchback.displayCarInfo();




/* example */
// browserFactory.ts
import { chromium, firefox, webkit, Browser } from 'playwright';

export class BrowserFactory {
    /**
     * Centralized method to create and return the correct browser instance.
     * Enforces a unified interface while hiding the creation details.
     */
    public static async createBrowser(browserType: string): Promise<Browser> {
        const type = browserType.toLowerCase();

        switch (type) {
            case 'chrome':
            case 'chromium':
                return await chromium.launch({ headless: true, args: ['--start-maximized'] });
            
            case 'firefox':
                return await firefox.launch({ headless: true });
            
            case 'safari':
            case 'webkit':
                return await webkit.launch({ headless: true });
            
            default:
                throw new Error(`Unsupported browser type provided: "${browserType}". Please use Chrome, Firefox, or Safari.`);
        }
    }
}


// // e2e.test.ts
// import { Browser, Page } from 'playwright';
// // import { BrowserFactory } from './browserFactory';

// describe('E2E Test Suite with Dynamic Browser Provisioning', () => {
//     let browser: Browser;
//     let page: Page;

//     beforeAll(async () => {
//         // Read browser type from environment variables (e.g., BROWSER=firefox npm test)
//         const targetBrowser = process.env.BROWSER || 'chrome';
        
//         // The test does not know or care *how* the browser is configured or launched.
//         // It simply asks the factory for an instance.
//         browser = await BrowserFactory.createBrowser(targetBrowser);
//     });

//     beforeEach(async () => {
//         page = await browser.newPage();
//     });

//     afterEach(async () => {
//         await page.close();
//     });

//     afterAll(async () => {
//         await browser.close();
//     });

//     test('Should load the homepage successfully', async () => {
//         await page.goto('https://example.com');
//         // Assertions go here
//     });
// });


