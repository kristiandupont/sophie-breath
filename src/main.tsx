/** @jsxImportSource @b9g/crank */
import { Component, Context } from '@b9g/crank';
import { renderer } from '@b9g/crank/dom';

import './main.css';
import './smoky.css'

function* SmokyText({ text }: { text: string }) {
  for (let i = 0; i < text.length; i++) {
    console.log('render')
    setTimeout(() => this.refresh(), 50);
    yield <div>{
      text.slice(0, i + 1).split('').map((c) => <span class="smoky">{c === ' ' ? <>&nbsp;</> : c}</span>)
    }</div>;
  }

  setTimeout(() => this.refresh(), 3000);
  yield <div>{
    text.split('').map((c) => <span class="smoky">{c === ' ' ? <>&nbsp;</> : c}</span>)
  }</div>;


  yield <div>{
    text.split('').map((c) => <span class="breathing">{c === ' ' ? <>&nbsp;</> : c}</span>)
  }</div>;
}


const Home = () => (
  <div class="flex h-screen flex-col">
    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
      <div className="flex h-64 w-full max-w-screen-md items-center justify-center rounded-xl border-4 border-dotted border-gray-300 bg-gray-100/70 backdrop-blur-sm">
        <SmokyText text="This is a response from the AI." />
      </div>
    </div>
    {/* <FileHandler /> */}
  </div>
);

const routes: Record<string, Component> = {
  '/': Home,
  '/about': () => <div class="flex h-screen flex-col">About</div>,
  '/contact': () => <div class="flex h-screen flex-col">Contact</div>,
};

function* RoutedPanel(this: Context) {
  const onPopState = () => this.refresh();
  window.addEventListener('popstate', onPopState);

  try {
    while (true) {
      const path = window.location.pathname;
      const Route = routes[path];
      yield (
        <div class="flex h-screen flex-col">
          <Route x={Math.random()} />
        </div>
      );
    }
  } finally {
    console.log('unmount');
    window.removeEventListener('popstate', onPopState);
  }
}

function Link({ href, children }: { href: string; children: any }) {
  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <a href={href} onclick={onClick}>
      {children}
    </a>
  );
}

const App = () => (
  <div>
    {/* <div className="flex flex-row space-x-2">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </div> */}
    <RoutedPanel />
  </div>
);

(async () => {
  await renderer.render(
    <div>
      <App />
    </div>,
    document.body,
  );
})();
