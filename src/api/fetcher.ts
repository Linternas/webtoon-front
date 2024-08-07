const baseURL = 'http://192.168.0.10:3001/api';
// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${baseURL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
