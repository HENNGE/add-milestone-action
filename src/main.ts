import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'

async function run(): Promise<void> {
  try {
    const {
      repo,
      payload: {pull_request, sender},
      issue: {number: issue_number}
    } = context

    if (!pull_request) {
      core.info('Event was not a pull request.')
      return
    }

    if (pull_request.milestone) {
      core.info('Milestone already selected.')
      return
    }

    const ignoredSenders = core.getInput('ignore_senders')
    if (sender && ignoredSenders) {
      const shouldIgnore = ignoredSenders.split(',').includes(sender['login'])
      if (shouldIgnore) {
        core.info(`Ignoring sender: ${sender['login']}`)
        return
      }
    }

    const octo = getOctokit(core.getInput('token'))
    const useOldest = core.getBooleanInput('add_policy')
    const {data: milestones} = await octo.rest.issues.listMilestones({
      ...repo,
      state: 'open',
      sort: 'due_on',
      direction: useOldest ? 'desc' : 'asc'
    })

    if (milestones.length === 0) {
      if (core.getBooleanInput('fail_on_none')) {
        core.setFailed('No milestones were found.')
        return
      }
      core.info('No milestones were found')
      return
    }

    await octo.rest.issues.update({
      ...repo,
      issue_number,
      milestone: milestones[0].number
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
