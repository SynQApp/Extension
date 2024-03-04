# Contribution Guidelines

When contributing to SynQ, whether on GitHub or in other community spaces:

- Be respectful, civil, and open-minded.
- Before opening a new pull request, try searching through the [issue tracker](https://github.com/SynQ/Extension/issues) for known issues or fixes.
- If you want to make code changes based on your personal opinion(s), make sure you open an issue first describing the changes you want to make, and open a pull request only when your suggestions get approved by maintainers.
- Read the [Walkthrough](https://github.com/SynQApp/Extension/tree/main/docs/Walkthrough.md) guide to learn more about how the code is structure.

## How to Contribute

### Prerequisites

In order to not waste your time implementing a change that has already been declined, or is generally not needed, start by [opening an issue](https://github.com/SynQ/Extension/issues/new/choose) describing the problem you would like to solve.

### Setup your environment locally

_Some commands will assume you have the Github CLI installed, if you haven't, consider [installing it](https://github.com/cli/cli#installation), but you can always use the Web UI if you prefer that instead._

In order to contribute to this project, you will need to fork the repository:

```bash
gh repo fork SynQ/Extension
```

then, clone it to your local machine:

```bash
gh repo clone <your-github-name>/Extension
```

This project uses [pnpm](https://pnpm.io) as its package manager. Install it if you haven't already:

```bash
npm install -g pnpm
```

Then, install the project's dependencies:

```bash
pnpm install
```

Next, run an initial build:

*Chrome*

```bash
pnpm build
```

*Edge*

```bash
pnpm build --target=edge-mv3
```

### Add the local build to your browser

1. Go to `chrome://extensions` or `edge://extensions/`
1. Enable Developer Mode (top right for Chrome, left sidebar for Edge)
1. Select "Load Unpacked"
1. Navigate to `/build` and select either the `/chrome-mv3-prod` or `/edge-mv3-prod` folder

If it worked, the onboarding screen should have loaded in a new tab!

### Implement your changes

Now you're all setup and can start implementing your changes. This project uses the [Plasmo](https://www.plasmo.com/) browser extension framework, so consider referring to their documentation for additional resources.

If you're adding a new music service adapter or modifying an existing adapter, please utilize the [Guide to Building Adapters](https://github.com/SynQApp/Extension/blob/main/docs/BuildingAnAdapter.md) to help you understand the structure of Adapters.

Here are some useful scripts for when you are developing:

| Command                        | Description                                         |
| ------------------------------ | --------------------------------------------------- |
| `pnpm dev`                     | Builds and starts the extension in watch mode.      |
| `pnpm build`                   | Creates a Chrome production build of the extension. |
| `pnpm build --target=edge-mv3` | Creates an Edge production build of the extension.  |
| `pnpm package`                 | Packages the production build for deployment.       |
| `pnpm format:all`              | Formats the code.                                   |
| `pnpm format:check`            | Checks if the code is formatted.                    |
| `pnpm lint:all`                | Lints the code and fixes any errors.                |
| `pnpm lint:check`              | Checks if the code is linted.                       |
| `pnpm check`                   | Checks if the code is linted and formatted.         |

When making commits, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines, i.e. prepending the message with `feat:`, `fix:`, `chore:`, `docs:`, etc... You can use `git status` to double check which files have not yet been staged for commit:

```bash
git add <file> && git commit -m "feat/fix/chore/docs: commit message"
```

### When you're done

Check that your code follows the project's style guidelines by running:

```bash
pnpm check
```

Please also make a manual, functional test of your changes.

When all that's done, it's time to file a pull request to upstream:

```bash
gh pr create --web
```

and fill out the title and body appropriately. Again, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines for your title.

## Credits

This document was inspired by the contributing guidelines for [create-t3-app](https://github.com/t3-oss/create-t3-app/blob/main/CONTRIBUTING.md?plain=1) and [cloudflare/wrangler2](https://github.com/cloudflare/wrangler2/blob/main/CONTRIBUTING.md).
