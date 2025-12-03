import { basename } from 'node:path'
import { glob } from 'tinyglobby'
import { exec } from 'tinyexec'
import { consola } from 'consola'

const packages = await glob([
  'examples/**/package.json',
  '!**/node_modules',
  '!**/.nitro',
  '!**/.vercel',
  '!**/.output'
], { absolute: true })

for (const pkg of packages) {
  const cwd = pkg.replace('/package.json', '')

  const vueRes = await exec('vue-tsc', ['--noEmit'], { nodeOptions: { cwd } })
  if (vueRes.exitCode !== 0) {
    consola.withTag(basename(cwd)).error(vueRes.stdout.trim())
    process.exit(1)
  }

  const typecheckRes = await exec('pnpm', ['run', 'typecheck'], { nodeOptions: { cwd } })
  if (typecheckRes.exitCode !== 0) {
    consola.withTag(basename(cwd)).error(typecheckRes.stdout.trim())
    process.exit(1)
  } else {
    consola.success('type checked', basename(cwd))
  }
}
