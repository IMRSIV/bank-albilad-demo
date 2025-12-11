const fs = require('fs')
const path = require('path')

const basePath = '/bank-albilad-demo'
const outDir = path.join(__dirname, '..', 'out')

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false

  // Fix _next paths
  const nextPathRegex = /(href|src)="\/_next\//g
  if (nextPathRegex.test(content)) {
    content = content.replace(/(href|src)="\/_next\//g, `$1="${basePath}/_next/`)
    modified = true
  }

  // Fix assetPrefix in script tags
  if (content.includes('"assetPrefix":""')) {
    content = content.replace(/"assetPrefix":""/g, `"assetPrefix":"${basePath}"`)
    modified = true
  }

  // Fix initialCanonicalUrl
  if (content.includes('"initialCanonicalUrl":"/",') || content.includes('"initialCanonicalUrl":"/"')) {
    content = content.replace(/"initialCanonicalUrl":"\/"/g, `"initialCanonicalUrl":"${basePath}/"`)
    modified = true
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`Fixed: ${filePath}`)
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir)
  
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      walkDir(filePath)
    } else if (file.endsWith('.html') || file.endsWith('.js')) {
      fixFile(filePath)
    }
  }
}

console.log('Fixing base path in generated files...')
walkDir(outDir)
console.log('Done!')

