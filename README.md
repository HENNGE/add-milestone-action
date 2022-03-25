<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Add milestone action

Use this action to add a milestone to PR's.
To use the action, create a workflow that runs when PRs are opened in your repository. Run this action in a step, optionally configuring the settings.

```yaml
name: Add oldest milestone to PR

on:
  pull_request:
    types: ['opened', 'reopened', 'synchronize']

jobs:
  arbitrary-job:
    name: Arbitrary Job
    runs-on: ubuntu-latest
    steps:
      - uses: HENNGE/add-milestone@v1.0.0
        with:
          token: ${{ github.token }}
          ignore_senders: 'dependabot[bot],dontTriggerUser'
          use_oldest: true
```

## Inputs

- `token` is a [personal access token](https://github.com/settings/tokens/new) . By
  default `${{github.token}}` is used.
- `use_oldest` will use the oldest milestone available. By default, the newest
  is used.
- `ignore_senders` is a comma-separated list of senders to ignore. Pull request's opened by these senders will not have a milestone added to it
- `fail_on_none` will cause the action to fail if no milestones are available. By default this is disabled.
