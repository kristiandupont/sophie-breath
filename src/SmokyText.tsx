import { Context } from "@b9g/crank";

export function* SmokyText(this: Context, { text }: { text: string }) {
  setTimeout(() => this.refresh(), 3000 + text.length * 100);
  yield (
    <div>
      {text.split("").map((c, i) => (
        <span class="enter" style={{ "animation-delay": `${i / 10}s` }}>
          {c === " " ? <>&nbsp;</> : c}
        </span>
      ))}
    </div>
  );

  setTimeout(() => this.refresh(), 3000 + text.length * 100);
  yield (
    <div>
      {text.split("").map((c) => (
        <span class="breathing">{c === " " ? <>&nbsp;</> : c}</span>
      ))}
    </div>
  );

  setTimeout(() => this.refresh(), 3000 + text.length * 100);
  yield (
    <div>
      {text.split("").map((c, i) => (
        <span class="exit" style={{ "animation-delay": `${i / 50}s` }}>
          {c === " " ? <>&nbsp;</> : c}
        </span>
      ))}
    </div>
  );
}
