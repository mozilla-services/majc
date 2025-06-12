# Publishing a new MAJC version

1. Go to our repo's [github Releases page](https://github.com/mozilla-services/majc/releases) and Draft a new release.
  *  Create a new tag for this release. It should use the `version` value that's currently in the `package.json`, prefixed with a `v`, for example: `v1.2.3`
  *  The release title should be the same as the version tag from above.
  *  Use the "Generate Release Notes" button to add the detailed commit history to the release.
  *  Optionally, add a summary of the key points of the release above the generated notes.
  *  Publish the release.

2. When the release the published, the `main` branch will be tagged with the version, and this will kick off the github actions workflow that publishes the release to `npm`. See `./.github/workflows/publish_to_npm.yml` for the details.
  * Note that any time you push a tag, it will trigger the publish workflow, but without creating the associated release from step 3. So if it's necessary to directly push a tag for some reason, just make sure to create a corresponding release in github.)

3. Create a version bump PR. This makes it so ther version on `main` is always ahead of the latest released version. This PR should contain:
  * A change to increment the `version` field of `package.json`.
  * A newly built `dist` directory.
  * For example and example, check out `343129c` or `23286d1`

4. Get approval and merge the version bump PR.

5. Pat yourself on the back, another release is shipped :-)
