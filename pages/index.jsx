import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

// const example = (arr) => { arr.map(item => console.log(item)) };

const Home = () => {
  const [codeInput, setCodeInput] = useState("");
  const [result, setResult] = useState();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: codeInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setCodeInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      <Head>
        <title>OpenAI API</title>
        <link rel="icon" href="/code.svg" />
      </Head>

      <main className={styles.main}>
        <img src="/code.svg" className={styles.icon} />
        <h3>Time Complexity</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="prompt"
            placeholder="Enter a piece of code"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
          />
          <input type="submit" value="Find time complexity" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
};

export default Home;
