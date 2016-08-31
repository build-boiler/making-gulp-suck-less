import path from 'path'

/**
 * Rename a file path with it's dirname and filename minus extension
 * @param {String} fp filepath
 * @return {String} filepath dirname/basename
 */
export default function(fp) {
  return path.join(
    path.basename(path.dirname(fp)),
    path.basename(fp, path.extname(fp))
  )
}
