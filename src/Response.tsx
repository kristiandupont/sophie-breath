import { Context } from "@b9g/crank";
import { addToTTSQueue } from "./tts-logic";

function makeClickPromise() {
  return new Promise((resolve) => {
    const onClick = () => {
      document.removeEventListener("click", onClick);
      resolve(0);
    };
    document.addEventListener("click", onClick);
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function* Response(
  this: Context,
  { stream, onProceed }: { stream: any; onProceed: any }
) {
  let response = "";
  let currentParagraph = "";

  for await (const part of stream) {
    const token = part.choices[0].delta.content;
    if (token) {
      response += token;
      currentParagraph += token;

      // if (token.endsWith(".")) {
      //   const paragraph = currentParagraph.trim();
      //   console.log("Paragraph: ", paragraph);
      //   addToTTSQueue(paragraph);
      // }
    }

    yield (
      <div class="flex h-screen flex-col p-8">
        <div className="flex h-full w-full items-start justify-start">
          <div className="flex h-full w-full flex-col items-start justify-start">
            <div className="">
              {response.split(" ").map((c) => (
                <span class="enter mx-2">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  addToTTSQueue(response);

  await sleep(3000);

  yield (
    <div class="flex h-screen flex-col p-8">
      <div className="flex h-full w-full items-start justify-start">
        <div className="flex h-full w-full flex-col items-start justify-start">
          <div className="">
            {response.split(" ").map((c) => (
              <span class="breathing mx-2">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  await makeClickPromise();

  yield (
    <div class="flex h-screen flex-col p-8" onclick={() => this.refresh()}>
      <div className="flex h-full w-full items-start justify-start">
        <div className="flex h-full w-full flex-col items-start justify-start">
          <div className="">
            {response.split(" ").map((c) => (
              <span class="exit mx-2">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  await sleep(3000);
  onProceed();
  console.log("Response: Yielding null");
  yield null;
}

export default Response;
