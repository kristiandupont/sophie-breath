import { Context } from "@b9g/crank";
import { getAiResponse } from "./getAiResponse";

async function* Response(this: Context, { stream }: { stream: any }) {
  let response = "";

  for await (const part of stream) {
    response += part.choices[0].delta.content;
    yield (
      <div class="flex h-screen flex-col p-8">
        <div className="flex h-full w-full items-start justify-start">
          <div className="flex h-full w-full flex-col items-start justify-start">
            <div className="">
              {/* <SmokyText text={response} /> */}
              {response.split(" ").map((c, i) => (
                <span class="enter mx-2">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export function* Home(this: Context) {
  if (!localStorage.getItem("openai-token")) {
    window.location.pathname = "/token";
    yield null;
  }

  let stream;

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    console.log("Submitting...", e);

    const query = (document.getElementById("query") as HTMLInputElement)
      .value as string;

    await this.refresh();
    console.log("Sending query");

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // response = `Response from the AI: ${query}`;
    stream = await getAiResponse(query);

    await this.refresh();
  };

  while (true) {
    yield (
      <div class="flex h-screen flex-col">
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          <div className="flex h-full w-full flex-col items-center justify-center">
            <form
              onsubmit={onSubmit}
              className="flex w-full flex-row items-center justify-center"
            >
              <input
                id="query"
                type="text"
                placeholder="Tell me how you're feeling..."
                className="m-2 w-full max-w-screen-md rounded-md border-2 border-gray-500 p-2"
              />
              <button
                type="submit"
                className="m-2 rounded-md border-2 border-gray-500 p-2"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      </div>
    );

    yield <div>Waiting for response...</div>;

    setTimeout(() => this.refresh(), 100000);
    yield <Response stream={stream} />;
  }
}
