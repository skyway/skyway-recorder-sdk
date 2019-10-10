module.exports = async (method, url, headers, body) => {
  // TODO: may rejects with failed to fetch by no-network
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
