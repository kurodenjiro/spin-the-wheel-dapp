## generate-types
```bash
rm -r types/truffle-contracts || true
typechain --target=truffle-v5 client/src/contracts/**/*.json
rm -r types/web3-v1-contracts || true
typechain --target=web3-v1 client/src/contracts/**/*.json
```

## migrate
```bash
rm -r migrations || true
tsc -p ./tsconfig.migrate.json --outDir ./migrations
truffle migrate $@
```

## test
```bash
truffle test
cd client && yarn test --watchAll=false
```
