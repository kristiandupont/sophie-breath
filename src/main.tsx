/** @jsxImportSource @b9g/crank */
import { Component, Context } from "@b9g/crank";
import { renderer } from "@b9g/crank/dom";

import "./main.css";
import "./smoky.css";
import { Home } from "./Home";
import { TokenPage } from "./TokenPage";

const routes: Record<string, Component> = {
  "/": Home,
  "/token": TokenPage,
};

function* Router(this: Context) {
  const onPopState = () => this.refresh();
  window.addEventListener("popstate", onPopState);

  try {
    while (true) {
      const basePath = import.meta.env.BASE_URL;
      const path = window.location.pathname.substring(basePath.length) || "/";
      console.log("Rendering: ", path);
      const Route = routes[path];
      yield (
        <div class="flex h-screen flex-col">
          <Route x={Math.random()} />
        </div>
      );
    }
  } finally {
    console.log("unmount");
    window.removeEventListener("popstate", onPopState);
  }
}

const App = () => (
  <>
    <Router />
  </>
);

(async () => {
  await renderer.render(
    <div id="root">
      <App />
    </div>,
    document.body
  );
})();
