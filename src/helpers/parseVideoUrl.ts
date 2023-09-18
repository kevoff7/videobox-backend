export const parseVideoUrl = (url: string) => {
  const newUrl = new URL(url)
  const pathNameUrl = newUrl.pathname.split('/')
  const extractedPart = pathNameUrl[pathNameUrl.length - 1]
  const urlClean = `https://www.youtube.com/embed/${extractedPart}${newUrl.search}`
  return urlClean
}
