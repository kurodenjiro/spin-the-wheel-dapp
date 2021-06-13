## test
```bash
truffle test
cd client
yarn test --watchAll=false
```

## build
```bash
maid compile
cd client
yarn build
```

## deploy:client
```bash
cd client
yarn gh-pages -d build
```

## migrate
```bash
rm -r migrations || true
tsc -p ./tsconfig.migrate.json --outDir ./migrations
truffle migrate $@
```

## compile
```bash
truffle compile
maid generate-types
```

## generate-types
```bash
rm -r types/truffle-contracts || true
typechain --target=truffle-v5 client/src/contracts/**/*.json
rm -r types/web3-v1-contracts || true
typechain --target=web3-v1 client/src/contracts/**/*.json
```
