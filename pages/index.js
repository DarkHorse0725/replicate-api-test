import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(URL.createObjectURL(selectedImage));

    const reader = new FileReader();
    let base64String = "";
    URL.createObjectURL(selectedImage).substring(5);
    reader.readAsDataURL(selectedImage);
    reader.onload = async function () {
      base64String = `${reader.result
        .replace("data:", "")
        .replace(/^.+,/, "")}`;

      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: {
        //   image: base64String,
        // },
        body: JSON.stringify({
          image: JSON.stringify(base64String),
        }),
      });
      let prediction = await response.json();
      if (response.status !== 201) {
        setError(prediction.detail);
        return;
      }
      setPrediction(prediction);

      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
      ) {
        await sleep(1000);
        const response = await fetch("/api/predictions/" + prediction.id);
        prediction = await response.json();
        if (response.status !== 200) {
          setError(prediction.detail);
          return;
        }
        console.log({ prediction });
        setPrediction(prediction);
      }
    };
  };

  return (
    <div className="container max-w-2xl mx-auto p-5">
      <Head>
        <title>Replicate + Next.js</title>
      </Head>

      <h1 className="py-6 text-center font-bold text-2xl">
        Dream something with{" "}
        <a href="https://replicate.com/stability-ai/stable-diffusion">
          Stable Diffusion
        </a>
      </h1>

      <form className="w-full flex" onSubmit={handleSubmit}>
        <input
          type="file"
          className="flex-grow"
          name="image"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
        <button className="button" type="submit">
          Go!
        </button>
      </form>

      {error && <div>{error}</div>}

      {prediction && (
        <>
          {prediction.output &&
            prediction.output.map((row) => {
              return (
                <div className="image-wrapper mt-5 flex items-center justify-center">
                  <img
                    src={row}
                    alt="output"
                    style={{ width: "400px", height: "400px" }}
                  />
                </div>
              );
            })}
          <p className="py-3 text-sm opacity-50">status: {prediction.status}</p>
        </>
      )}
    </div>
  );
}
