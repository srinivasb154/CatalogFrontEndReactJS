export const getProducts = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/products?` +
      new URLSearchParams(queryParams),
  )

  return await res.json()
}

export const createProduct = async (product) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  return await res.json()
}
