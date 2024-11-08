import { expect, test, beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const server = setupServer(
  http.post("https://example.com/upload", async ({ request }) => {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return new HttpResponse("Missing document", { status: 400 });
    }

    if (!(file instanceof File)) {
      return new HttpResponse("Uploaded document is not a File", {
        status: 400,
      });
    }

    return HttpResponse.json({
      contents: await file.text(),
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("file upload", async () => {
  const data = new FormData();
  const file = new File(["Hello", "world"], "hello.png", {
    type: "image/png",
  });

  data.set("file", file, "doc.txt");

  const response = await fetch("https://example.com/upload", {
    method: "POST",
    body: data,
  }).then((res) => res.json());

  expect(response.contents).toBe("Helloworld");
});
