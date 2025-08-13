import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      queryFn: async ({ queryKey }) => {
        const response = await apiRequest('GET', queryKey[0])
        return response.json()
      },
    },
  },
})

export async function apiRequest(method, url, data = null) {
  const baseURL = 'http://127.0.0.1:5000/'
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (data) {
    if (data instanceof FormData) {
      delete options.headers['Content-Type']
      options.body = data
    } else {
      options.body = JSON.stringify(data)
    }
  }

  const response = await fetch(`${baseURL}${url}`, options)
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response
}