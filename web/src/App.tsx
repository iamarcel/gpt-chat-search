import type { Component } from "solid-js";

import styles from "./App.module.css";
import Chatbot from "./Chatbot";

const App: Component = () => {
  return (
    <div>
      <Chatbot />
    </div>
  );
};

export default App;
