import { NextRequest, NextResponse } from "next/server";

const ENGINE_ID = "stable-diffusion-v1-6";
const API_HOST = "https://api.stability.ai";

interface RequestBody {
  prompt: string;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.STABILITY_API_KEY;

  if (!apiKey) {
    console.error("Stability AI API Key is not defined.");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const { prompt } = (await request.json()) as RequestBody;

    if (!prompt) {
      console.error("Missing required argument 'prompt'");
      return NextResponse.json({ error: "Argument error" }, { status: 400 });
    }

    const response = await fetch(
      `${API_HOST}/v1/generation/${ENGINE_ID}/text-to-image`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "image/png",
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
      const error = response.toString();
      throw new Error(`Stability AI API error: ${response.status}: ${error}`);
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(imageBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Error generating image" },
      { status: 500 }
    );
  }
}
