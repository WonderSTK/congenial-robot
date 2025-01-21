export const cleanUrl = (url) => {
  try {
    const parsedUrl = new URL(`https://${url.replace(/^(https?|ftp):\/\//, '')}`)
    return parsedUrl.hostname + parsedUrl.pathname + parsedUrl.search + parsedUrl.hash
  } catch (error) {
    return false
  }
}

export const validateTags = (tags) => {
  const maxLength = 25
  const minLength = 3
  const invalidTags = tags.filter(tag => tag.length > maxLength || tag.replace(/\s/g, '') !== tag || tag.length < minLength)
  return !invalidTags.length
}
