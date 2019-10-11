exports.fetchJSON = async (method, url, headers, body) => {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json();
  const status = res.status;
  return { status, data };
};
