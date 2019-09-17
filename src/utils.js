export async function postJSON(url, headers, body) {
  const res = await fetch(url, {
    method: "post",
    headers: Object.assign(
      {
        "Content-Type": "application/json"
      },
      headers
    ),
    body: JSON.stringify(body)
  });
  const json = await res.json();

  return json;
}
