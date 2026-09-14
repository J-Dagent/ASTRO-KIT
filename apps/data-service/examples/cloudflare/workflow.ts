import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";

interface ExampleWorkflowParams {
  dataToPassIn: unknown;
}

export class ExampleWorkflow extends WorkflowEntrypoint<
  Cloudflare.Env,
  ExampleWorkflowParams
> {
  async run(
    event: Readonly<WorkflowEvent<ExampleWorkflowParams>>,
    step: WorkflowStep,
  ) {
    const randomNumber = await step.do("Get random number", async () => {
      return Math.floor(Math.random() * 10) + 1;
    });

    await step.sleep("Wait for random number of seconds", `${randomNumber} seconds`);
    await step.do("Log data in payload", async () => {
      console.log(event.payload);
    });
  }
}
