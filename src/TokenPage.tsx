import { Context } from "@b9g/crank";

export function TokenPage(this: Context) {
  const token = localStorage.getItem("openai-token") || "";

  const onInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    localStorage.setItem("openai-token", target.value);
  };

  const onClick = () => {
    window.location.pathname = "/";
  };

  return (
    <div class="flex h-screen flex-col">
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="flex w-full flex-row items-center justify-center">
            <input
              type="text"
              value={token}
              oninput={onInput}
              placeholder="OpenAI API Token"
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
