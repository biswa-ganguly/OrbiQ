import axios from "axios";

export async function POST(req) {
  const { runId } = await req.json();
  const result = await axios.get(`${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`, {
    headers: {
      Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
    },
  });
  return new Response(JSON.stringify(result.data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
