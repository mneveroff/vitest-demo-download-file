import logo from "./assets/logo.svg";
import "./App.css";
import Download from "./components/download";

function App() {
  return (
    <>
      <div>
        <a href="https://neveroff.dev" target="_blank">
          <img src={logo} className="logo" alt="NeverOff logo" />
        </a>
      </div>
      <h1>NeverOff Demo</h1>
      <h2>vitest-file-download</h2>
      <p>
        This is a demo of testing file download via vitest. Read the blog post{" "}
        <a href="https://neveroff.dev/blog/vitest-file-download">here</a>.
      </p>
      <div className="card">
        <Download />
      </div>
    </>
  );
}

export default App;
