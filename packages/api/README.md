# Maker Badges Merkle Service

A micro service for the Maker Badges to ease client burden.

## Getting Started

1. Clone the repo to your local machine.
2. Make sure you've got the required global tools by running:
    - `npm install -g yarn ts-node`
3. Restore packages by running `yarn`
4. Check everything works locally by running `yarn test`
5. Deploy to AWS by running `yarn deploy`
    - Hint set your `AWS_PROFILE` environment variable if not using the default
      - On fish: `set -x AWS_PROFILE profile`
      - On bash: `export AWS_PROFILE=profile`

Other commands:
- Check the serverless packaging works locally: `yarn package`
- Clean generated files left over from build: `yarn clean`

## Writing Tests

Jest has been configured to run any file ending in `*.test.ts`, `*.test.tsx` or `*.test.js`. You can put these in the `test` folder, but they can also live alongside your code in the `src` folder if you prefer.
