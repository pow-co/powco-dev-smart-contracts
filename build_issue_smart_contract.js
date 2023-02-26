
import { join } from 'path'

import scrypt from 'scryptlib'

import { readFileSync } from 'fs'

const { buildContractClass, ContractArtificat } = scrypt

export function loadArtifact(fileName) {
  return JSON.parse(readFileSync(fileName).toString());
}

const artifact = join('.', 'src', 'contracts', 'DevIssue.json')

const DevIssue = buildContractClass(loadArtifact(artifact))

export async function buildContractForDevIssue({
  org,
  repo,
  issue_number,
  title,
  description
}) {

  const issue = new DevIssue(
    0n,
    Buffer.from(org).toString('hex'),
    Buffer.from(repo).toString('hex'),
    issue_number,
    Buffer.from(title).toString('hex'),
    Buffer.from(description).toString('hex')
  );

  return {
    issue: issue,
    lockingScript: issue.lockingScript.buffer.toString('hex')
  }

}

async function start() {

  const { issue, lockingScript } = await buildContractForDevIssue({
    platform: 'github',
    org: 'pow-co',
    repo: 'powco.dev',
    issue_number: 0,
    title: 'Automatically Post New DevIssue Instance On New Issue Created',
    description: 'Then index the issue in the database so no duplicates are created'
  }) 

  console.log(issue, {
    lockingScript: {
      hex: lockingScript,
      asm: issue.lockingScript.toString()
    }
  })

}

start()

