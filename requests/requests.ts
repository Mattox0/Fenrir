interface getMethod {
  method: string
  headers: {
    'Content-Type': string
    Authorization?: string
  }
}
export const get = async (url: string, token: string | null = null): Promise<Response> => {
  const init: getMethod = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (token !== null) {
    init.headers.Authorization = `Bearer ${token}`;
  }

  return await fetch(url, init);
};

interface postMethod {
  method: string
  headers: {
    'Content-Type': string
    Authorization?: string
  }
  body: string
}

export const post = async (url: string, body: unknown, token: string | null = null): Promise<Response> => {
  const init: postMethod = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
  if (token !== null) {
    init.headers.Authorization = `Bearer ${token}`;
  }

  console.log(`POST ${url} with body ${JSON.stringify(body)}`);

  return await fetch(url, init);
};

export const put = async (url: string, body: unknown, token: string | null = null): Promise<Response> => {
  const init: postMethod = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
  if (token !== null) {
    init.headers.Authorization = `Bearer ${token}`;
  }

  return await fetch(url, init);
};

export const del = async (url: string, token: string | null = null): Promise<Response> => {
  const init: getMethod = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (token !== null) {
    init.headers.Authorization = `Bearer ${token}`;
  }

  return await fetch(url, init);
};
