module.exports = async (method, url, headers, params) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers
    }
  };

  if (params) {
    // currently not using GET parameters
    // if (method === "GET")
    //   url += new URLSearchParams(params).toString();

    if (method === "POST") options.body = JSON.stringify(params);
  }

  const res = await fetch(url, options);
  const data = await res.json();

  const status = res.status;
  return { status, data };
};
