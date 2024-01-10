import { Context } from "@b9g/crank";

export function TokenPage(this: Context) {
  const openAIToken = localStorage.getItem("openai-token") || "";
  const playHTToken = localStorage.getItem("playht-token") || "";
  const proxyUrl = localStorage.getItem("proxy-url") || "";

  const onOpenAIInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    localStorage.setItem("openai-token", target.value);
  };

  const onPlayHTIInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    localStorage.setItem("playht-token", target.value);
  };

  const onProxyUrlInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    localStorage.setItem("proxy-url", target.value);
  };

  const onClick = () => {
    history.pushState({}, "", `${import.meta.env.BASE_URL}/`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div class="flex h-screen flex-col">
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="flex w-full flex-row items-center justify-center">
            <input
              type="text"
              value={openAIToken}
              oninput={onOpenAIInput}
              placeholder="OpenAI API Token"
              className="m-2 w-full max-w-screen-md rounded-md border-2 border-gray-500 p-2"
            />
          </div>
          <div className="flex w-full flex-row items-center justify-center">
            <input
              type="text"
              value={playHTToken}
              oninput={onPlayHTIInput}
              placeholder="PlayHT API Token"
              className="m-2 w-full max-w-screen-md rounded-md border-2 border-gray-500 p-2"
            />
          </div>
          <div className="flex w-full flex-row items-center justify-center">
            <input
              type="text"
              value={proxyUrl}
              oninput={onProxyUrlInput}
              placeholder="Proxy URL"
              className="m-2 w-full max-w-screen-md rounded-md border-2 border-gray-500 p-2"
            />
          </div>
          <div className="flex flex-row">
            <button
              onclick={onClick}
              className="m-2 rounded-md border-2 border-gray-500 p-2"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
