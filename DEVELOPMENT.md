# Development

These notes are reminders to myself about how to do certain things.

## Releasing a New Version

1. Change the version in `package.json`.
2. Update `CHANGELOG.md`. Move any entries in the `Unreleased` section into a
   new section for the new version. Update the links at the bottom.
3. Create a pull request to make sure CI passes.
4. Merge the pull request.
5. Switch to the `main` branch locally and pull to make sure it's up to date.
6. Create a new, signed tag with something like `git tag -s v1.2.3`.
7. Push the tag with `git push --tags`.
8. The CD GitHub Action should automatically create a new GitHub release.
9. Update the release's description with the changelog text.
10. Run `./dev sh` and then `yarn publish` within the shell.
