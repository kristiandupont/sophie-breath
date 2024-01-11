/*
PlayHT API Docs:

curl --request POST \
     --url https://play.ht/api/v2/tts \
     --header 'AUTHORIZATION: Bearer YOUR_SECRET_KEY_HERE' \
     --header 'X-USER-ID: YOUR_USER_ID_HERE' \
     --header 'accept: text/event-stream' \
     --header 'content-type: application/json' \
     --data '
{
  "text": "Check out this realistic generated speech!",
  "voice": "s3://peregrine-voices/oliver_narrative2_parrot_saad/manifest.json",
  "voice_engine": "PlayHT2.0"
}
'

Replace YOUR_SECRET_KEY_HERE and YOUR_USER_ID_HERE with your actual API Secret Key and User ID.

The response, as specified by the accept header, will be a text event stream:
event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0,"stage":"queued"}

event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0.01,"stage":"active"}

event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0.01,"stage":"preload","stageProgress":0}

event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0.11,"stage":"preload","stageProgress":0.5}

event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0.21,"stage":"preload","stageProgress":1}

event: ping
data: 2023-03-27T02:20:37.800Z

event: ping
data: 2023-03-27T02:20:52.801Z

event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0.21,"stage":"generate","stageProgress":0}

event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0.32,"stage":"generate","stageProgress":0.2}

event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0.53,"stage":"generate","stageProgress":0.6}

event: ping
data: 2023-03-27T02:21:07.801Z

event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0.55,"stage":"generate","stageProgress":0.64}

event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0.57,"stage":"generate","stageProgress":0.68}

event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0.74,"stage":"generate","stageProgress":1}

event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0.74,"stage":"postprocessing","stageProgress":0}

event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0.82,"stage":"postprocessing","stageProgress":0.33}

event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0.91,"stage":"postprocessing","stageProgress":0.67}

event: generating
data: {"id":"1i01A5fd8O35iLkhuJ","progress":0.99,"stage":"postprocessing","stageProgress":1}

event: completed
data: {"id":"1i01A5fd8O35iLkhuJ","progress":1,"stage":"complete","url":"https://peregrine-results.s3.amazonaws.com/pigeon/IZ5jJmV1ecnZaVuoIK_0.mp3","duration":2.4107,"size":49965}

The audio URL will be available in the last event, completed, in the url property. In this case, https://peregrine-results.s3.amazonaws.com/pigeon/IZ5jJmV1ecnZaVuoIK_0.mp3.

You just generated your first audio with the PlayHT API!

*/

async function fetchStream(url, headers, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });
  const reader = response.body.getReader();
  const stream = new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        controller.enqueue(value);
      }
      controller.close();
    },
  });

  return new Response(stream);
}

export async function getSpeech(text: string): Promise<string> {
  const apiKey = localStorage.getItem("playht-token") || "";
  const proxy = localStorage.getItem("proxy-url") || "";

  const headers = {
    AUTHORIZATION: "Bearer " + apiKey,
    "X-USER-ID": "Z79sRfVkSyP3AxwOcrfZkNPhHFq1",
    accept: "text/event-stream",
    "content-type": "application/json",
    "x-cors-headers": "X-USER-ID, AUTHORIZATION, accept, content-type",
    cookies: "x=123",
  };

  const body = {
    text: text,
    voice:
      "s3://voice-cloning-zero-shot/f41cbb3f-3a6b-49a4-a121-6f2255a4b7d4/sophie-2/manifest.json",
    voice_engine: "PlayHT2.0",
  };

  const response = await fetchStream(
    `${proxy}?https://play.ht/api/v2/tts`,
    headers,
    body
  );

  const data = await response.text();
  const lines = data.split("\n");
  const lastLine = lines[lines.length - 3]; // Last line is empty, and there are \r's in the lines
  const jsonString = lastLine.substring(lastLine.indexOf("{"));
  const json = JSON.parse(jsonString);
  const audioUrl = json.url;

  console.log("AUDIO URL: ", audioUrl);
  return audioUrl;
}
