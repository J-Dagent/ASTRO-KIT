import { DurableObject } from "cloudflare:workers";

export class ExampleDurableObject extends DurableObject {
  savedData: string | undefined;

  constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      this.savedData = await ctx.storage.get<string>("savedData");
    });
  }

  async saveData(data: string) {
    await this.ctx.storage.put("savedData", data);
    this.savedData = data;
  }
}
