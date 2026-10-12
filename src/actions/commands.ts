import { Page } from '@playwright/test';

export interface Command {
  execute(): Promise<void>;
}

export class ClickCommand implements Command {
  constructor(private page: Page, private selector: string) {}

  async execute(): Promise<void> {
    console.log(`[Command] Executing click on: ${this.selector}`);
    await this.page.click(this.selector);
  }
}

export class TypeCommand implements Command {
  constructor(private page: Page, private selector: string, private text: string) {}

  async execute(): Promise<void> {
    console.log(`[Command] Executing type "${this.text}" into: ${this.selector}`);
    await this.page.fill(this.selector, this.text);
  }
}

export class TestActionInvoker {
  /**
   * Executes a command with built-in retry logic
   */
  public async executeAction(command: Command, maxRetries = 3): Promise<void> {
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        await command.execute();
        return;
      } catch (error) {
        attempts++;
        console.warn(`⚠️ Action failed. Attempt ${attempts}/${maxRetries}. Retrying...`);
        if (attempts >= maxRetries) {
          throw new Error(`Action permanently failed after ${maxRetries} attempts. Original error: ${error}`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}
