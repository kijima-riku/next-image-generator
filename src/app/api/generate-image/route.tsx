import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const engineId = "stable-diffusion-v1-6";
  const apiKey = process.env.NEXT_PUBLIC_STABILITY_API_KEY;
  const apiHost = "https://api.stability.ai";

  try {
    const response = await fetch(
      `${apiHost}/v1/generation/${engineId}/text-to-image`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
            },
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Stability AI API error: ${await response.text()}`);
    }

    const responseJSON = await response.json();
    const base64Image = responseJSON.artifacts[0].base64;

    return NextResponse.json({ image: base64Image });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Error generating image" },
      { status: 500 }
    );
  }
}
