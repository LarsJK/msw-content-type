import { expect, test, beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from 'msw'

let contentType = null;

const server = setupServer(
  http.post("https://example.com/headers", ({ request }) => {
    contentType = request.headers.get('content-type')

    return new HttpResponse(null, {
      status: 201,
    });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("content-type", async () => {
  await fetch("https://example.com/headers", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: '{}'
  });
  expect(contentType).toBe("text/html; charset=utf-8");
});
