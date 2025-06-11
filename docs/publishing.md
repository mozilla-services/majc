# Publishing a new MAJC version

1. Create a version bump PR, containing only a change to the `version` field of `package.json` and a newly built `dist` directory.
(Check out `343129c` or `23286d1` for an example)

2. Merge the PR

3. Tag that PR's commit on `main` with the new version number: `git tag v0.1.1`

4. Push the tag to `main`, which will kick off the publishing workflow (see `./.github/workflows/publish_to_npm.yml`)

5.
