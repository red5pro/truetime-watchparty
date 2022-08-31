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

enum Errortype {
  NO_EPISODES = 'NO_EPISODES',
  NO_SERIES = 'NO_SERIES',
}

export const ERROR_TYPE = {
  [Errortype.NO_SERIES]: 'There are not current series. Please check back later!',
  [Errortype.NO_EPISODES]: 'There are not current events. Please check back later!',
}
