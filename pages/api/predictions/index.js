import Replicate from "replicate";
import * as fs from "fs";
import * as readBlob from "read-blob";
import { Blob } from "buffer";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }
  // const result = await fs.readFile(req.body.image, {
  //   encoding: "utf-8",
  // });
  // const buffer = fs.readFileSync(req.body.image).then((res) => {
  //   console.log("this is res = ", res);
  // });
  // const obj = { hello: "world" };
  // const blob = new Blob([JSON.stringify(obj, null, 2)], {
  //   type: "application/json",
  // });

  // const blob = new Blob(req.body.image);
  // console.log("blob = ", blob);
  // readBlob(blob, req.body.image, function (err, dataurl) {
  //   if (err) throw err;

  //   console.log("that was simple!");
  //   img.src = dataurl;
  // });
  // console.log("result = ", result);
  // const data = await fs.readFile(URL.createObjectURL(req.body.image), "utf-8");
  // const base64 = data.toString("base64");
  const mimeType = "image/png";
  // const dataURI = `data:${mimeType};base64,${base64}`;

  // console.log("dataURI = ", dataURI);
  // replicate
  //   .run(
  //     "mcai/edge-of-realism-v2.0-img2img:036ae758dd0d0e018bce79a0c59dbdd346652f16833f9f5d093f9df1984a79be",
  //     {
  //       input: {
  //         image: req.body.image,
  //       },
  //     }
  //   )
  //   .then((res) => {
  //     console.log("This is res = ", res);
  //   });

  // const reader = new FileReader();
  // let base64String = "";

  // reader.readAsDataURL(req.body.image);
  // reader.onload = async function () {
  //   base64String = `${reader.result.replace("data:", "").replace(/^.+,/, "")}`;
  console.log("start");
  replicate.predictions
    .create({
      version:
        "036ae758dd0d0e018bce79a0c59dbdd346652f16833f9f5d093f9df1984a79be",
      input: {
        image: `data:${mimeType};base64,${req.body.image}`,
      },
      webhook: "https://example.com/your-webhook",
      webhook_events_filter: ["completed"],
    })
    .then((output) => {
      if (output?.error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ detail: output.error }));
        return;
      }

      res.statusCode = 201;
      res.end(JSON.stringify(output));
    });
}
