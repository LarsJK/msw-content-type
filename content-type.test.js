import { expect, test, beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const server = setupServer(
  http.post("https://example.com/upload", async ({ request }) => {
    const data = await request.formData();

    return HttpResponse.text("ok");
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

  data.append("files[]", file);

  const response = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://example.com/upload", true);
    xhr.send(data);

    xhr.addEventListener("load", (e) => {
      console.log(xhr.status);
      resolve(xhr.response);
    });
  });

  expect(response).toBe("ok");
});
