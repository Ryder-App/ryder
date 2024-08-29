# ryder

## About the Project

This is a dispatch/delivery application. This project is built on Node.js and utilizes multiple packages, which can be found in the `package.json` files of different folders.

## Requirements

To run the codebase on your local machine during development, you need to meet these base requirements on your system:

- Node.js
- Npm
- TypeScript
- PostgreSql

## Setup

To set up the project locally:

1. Clone the repository.
2. Navigate to the cloned repository on your computer using the CLI or any other prefered method.
3. Navigate to the root of the repository, the server and the client directories and install all dependencies using:

   ```bash
   npm install
   ```

   in each of those directories.

4. Start the app from the root using:

   ```bash
   npm run dev
   ```

   `For more contextual information`:
   Check the READMe.md files in the client and server folders for appropriate guidelines.

## Contributing

When contributing to the codebase, it is expected that you to follow these rules

1. If you previously have the codebase locally, you are expected to pull all recent changes in the `staging branch` or clone again.
2. Create a new Branch from the `staging branch` before making any changes and ensure all changes are made on same branch. Your branch name should be named in this order

- `name_of_contributor/name_of_fix_or_feature`

  ```bash
  git checkout -b name_of_contributor/name_of_fix_or_feature
  ```

3. After all changes has been made and tested locally, pull all recent changes in the `staging branch` again, merge the `staging branch` with your branch and fix all conflicts, if any, then add a very descriptive commit message and push

4. Create a pull request to staging branch and reach out for a review and possible merge

---

**Git flow**

```bash
git checkout dev
git pull || git pull origin dev
git checkout -b <your-branch>
# after making changes
git add .
git commit -m "Descriptive commit message"
git pull --rebase origin dev
# resolve conflicts if any
git push origin HEAD
```

**Git flow** _from current branch_ (example with existing commit)

```
git add .
git commit --amend --no-edit
git pull --rebase origin dev
git push origin HEAD -f
```
