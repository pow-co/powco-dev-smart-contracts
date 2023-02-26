import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    ByteString,
    SigHash
} from 'scrypt-ts'

export class DevIssue extends SmartContract {
    @prop(true)
    count: bigint
 
    @prop()
    org: ByteString;

    @prop()
    repo: ByteString;

    @prop()
    issue_number: bigint;

    @prop()
    title: ByteString;

    @prop()
    description: ByteString;

    constructor(
      count: bigint,
      org: ByteString,
      repo: ByteString,
      issue_number: bigint,
      title: ByteString,
      description: ByteString
    ) {
        super(count, org, repo, issue_number, title, description)
        this.count = count
        this.org = org
        this.repo = repo
        this.issue_number = issue_number
        this.title = title
        this.description = description
    }

    @method(SigHash.ANYONECANPAY_SINGLE)
    public increment() {
        this.count++

        // make sure balance in the contract does not change
        const amount: bigint = this.ctx.utxo.value
        // output containing the latest state
        const output: ByteString = this.buildStateOutput(amount)
        // verify current tx has this single output
        assert(this.ctx.hashOutputs === hash256(output), 'hashOutputs mismatch')
    }
}
