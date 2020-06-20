import lzstring from "./vendor/lzstring.min"
import { CompilerOptions } from "typescript"

/**
 * Grabs the sourcecode for an example from the query hash or local storage
 * @param fallback if nothing is found return this
 * @param location DI'd copy of document.location
 */
export const getInitialCode = (
  fallback: string,
  location: Location,
  defaultFilename: string
): Record<string, string> => {
  const result: Record<string, string> = {}

  // Old school support
  if (location.hash.startsWith("#src")) {
    const code = location.hash.replace("#src=", "").trim()
    result[defaultFilename] = code
    return result
  }

  // New school support
  if (location.hash.startsWith("#code")) {
    const code = location.hash.replace("#code/", "").trim()
    let userCode = lzstring.decompressFromEncodedURIComponent(code)
    // Fallback incase there is an extra level of decoding:
    // https://gitter.im/Microsoft/TypeScript?at=5dc478ab9c39821509ff189a
    if (!userCode) userCode = lzstring.decompressFromEncodedURIComponent(decodeURIComponent(code))

    result[defaultFilename] = userCode
    return result
  }

  if (location.hash.startsWith("#files")) {
    const code = location.hash.replace("#files/", "").trim()
    let userFiles = lzstring.decompressFromEncodedURIComponent(code)
    // Fallback incase there is an extra level of decoding:
    // https://gitter.im/Microsoft/TypeScript?at=5dc478ab9c39821509ff189a
    if (!userFiles) userFiles = lzstring.decompressFromEncodedURIComponent(decodeURIComponent(code))
    try {
      return JSON.parse(userFiles)
    } catch (error) {
      result[defaultFilename] = fallback
      return result
    }
  }

  // TODO: Do this
  // Local copy fallback
  if (localStorage.getItem("sandbox-history")) {
    // result[filename] = userCode
  }

  if (defaultFilename in result === false) {
    result[defaultFilename] = fallback
  }

  return result
}
