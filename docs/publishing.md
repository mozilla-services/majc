# Publishing a new MAJC version

1. Create a version bump PR, containing only a change to the `version` field of `package.json` and a newly built `dist` directory.
(Check out `343129c` or `23286d1` for an example)

2. Merge the PR

3. Go to our repo's [github Releases page](https://github.com/mozilla-services/majc/releases) and Draft a new release.
  *  Create a new tag for this release. It should be the same `version` value as the version bump PR created above.
  *  The release title should also be the same `version` value as the version bump PR, something like `v0.1.2`.
  *  Use the Generate Release notes to add the detailed commit history to the release.
  *  Optionally, add a summry of the key points of the release above the generated notes.
  *  Publish the release.

4. When the relase the published, the `main` branch will be tagged with the version, and this will kick off the github actions workflow that publishes the release to `npm`. See `./.github/workflows/publish_to_npm.yml` for the details.

5. Pat yourself on the back, another release is shipped :-)
