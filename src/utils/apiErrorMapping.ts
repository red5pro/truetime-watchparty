export const apiErrorMapping = (error: any) => {
  const errorResponse = {
    status: error.response?.status ? error.response?.status : 500,
    statusText: error.response?.statusText
      ? error.response?.statusText
      : error.response?.data?.error
      ? error.response.data.error
      : error.message,
  }

  return errorResponse
}
