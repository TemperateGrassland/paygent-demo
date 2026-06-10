import { getRalioClient } from "@/lib/ralio";

export async function POST(req: Request) {
  const { message } = await req.json();
  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
  }

  const ralio = await getRalioClient();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const event of ralio.chat.stream({ message })) {
          if (event.event === "text_delta") {
            controller.enqueue(encoder.encode(event.text));
          } else if (event.event === "tool_started") {
            controller.enqueue(encoder.encode(`\n[${event.data.tool_name}]\n`));
          }
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`\nError: ${(err as Error).message}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
