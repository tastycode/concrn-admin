const fs = require('fs')
const promisify = require('util').promisify
const glob = promisify(require('glob'))
const path = require('path')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

async function main() {
  const indices = await glob('src/**/index.js')
  for (let index of indices) {
    console.log('processing ', index)
    const indexEligible = await verifyIndexEligible(index)
    if (!indexEligible) {
      continue
    }
    const generatedIndex = await regenerateIndex(index)
    await writeFile(index, generatedIndex)
  }
}

async function verifyIndexEligible(index) {
  const contents = (await readFile(index)).toString()
  return /AUTO_INDEX/.test(contents)
}

async function regenerateIndex(index) {
  const baseDirectory = path.dirname(index)
  const modules = (await glob(`${baseDirectory}/*.js`)).filter(file =>
    path.basename(file) != 'index.js'
  ).map( file => path.basename(file, '.js') )
  const imports = modules.map(module => `import ${module} from './${module}'`).join("\n")
  const exports = `
export {
  ${modules.join(",")}
}
  `
  return `/* AUTO_INDEX */
${imports}
${exports}`
}

main()
