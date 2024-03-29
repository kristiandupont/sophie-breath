import { Context } from "@b9g/crank";
import getAiResponse from "./getAiResponse";
import Response from "./Response";

export function* Home(this: Context) {
  if (
    !localStorage.getItem("openai-token") ||
    !localStorage.getItem("playht-token") ||
    !localStorage.getItem("proxy-url")
  ) {
    setTimeout(() => {
      console.log('Token not found. Redirecting to "/token"');
      history.pushState({}, "", `${import.meta.env.BASE_URL}/token`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }, 100);
    console.log("Home: Yielding null after redirect");
    yield null;
  }

  let stream;

  const onSubmit = async (e: Event) => {
    e.preventDefault();

    const query = (document.getElementById("query") as HTMLInputElement)
      .value as string;

    console.log("Home: refreshing before query");
    await this.refresh();
    console.log("Sending query");
    stream = await getAiResponse(query);

    console.log("Home: refreshing after query");
    await this.refresh();
  };

  while (true) {
    console.log("Home: A");
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
                placeholder="How do you feel?"
                autofocus
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

    console.log("Home: B");
    yield (
      <div class="flex h-screen flex-col">
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="flex w-full flex-row items-center justify-center">
              <span className="breathing">...</span>
            </div>
          </div>
        </div>
      </div>
    );

    console.log("Home: C");
    yield (
      <Response
        stream={stream}
        onProceed={() => {
          console.log("ON PROCEED");
          this.refresh();
        }}
      />
    );
  }
}
