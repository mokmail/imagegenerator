import React, { useState } from "react";

const ImageGenerator = () => {
  const huggingFaceApiKey = process.env.REACT_APP_API_KEY;
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addWatermark = async (imageBlob) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Add watermark
        ctx.font = "16px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.textAlign = "right";
        ctx.fillText("kmail.at", canvas.width - 10, canvas.height - 10);

        canvas.toBlob((watermarkedBlob) => {
          resolve(watermarkedBlob);
        });
      };

      img.src = URL.createObjectURL(imageBlob);
    });
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    const apiUrl = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large"; // Replace with the desired model

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${huggingFaceApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const imageBlob = await response.blob();
      const watermarkedBlob = await addWatermark(imageBlob);
      const imageUrl = URL.createObjectURL(watermarkedBlob);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-4">
      <div className="text-3xl p-4">Kmail Image Generator</div>

      <textarea
        className="form-control border w-full"
        placeholder="Enter a prompt to generate an image..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows="4"
        cols="50"
        style={{ marginBottom: "10px", padding: "10px", fontSize: "16px" }}
      />
      <br />
      <button
        className="border border-primary bg-slate-950 w-full text-white px-4 py-2 rounded"
        onClick={handleGenerateImage}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {generatedImage && (
        <div style={{ marginTop: "20px" }}>
          <h3>Generated Image:</h3>
          <img src={generatedImage} alt="Generated" style={{ maxWidth: "100%" }} />
          <br />
          <a
            href={generatedImage}
            download="generated_image.png"
            className="border border-primary bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block"
            style={{ textDecoration: "none", marginTop: "10px" }}
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
