# Dependency Health Monitor

A lot of Open-Source projects suffer from financial sustainability and face the risk of not getting maintained due to a lack of resources. Use the Dependency Health Monitor to view the financial state of your dependencies and support your dependency!

## Getting started

- Install all dependencies:  
  `npm install`

- (Optional) Add environment variables:
  1. `cd packages/backend`
  2. `touch local.settings.json`
  3. Paste the following:
  ```json
  {
    "Values": {
      "FUNCTIONS_WORKER_RUNTIME": "node",
      "GITHUB_PERSONAL_ACCESS_TOKEN": "your GitHub access token",
      "OPEN_COLLECTIVE_API_KEY": "your OpenCollective api key"
    }
  }
  ```
- Run the Dependency Health Monitor:  
  `npm run dev`

## Bug reports

If you have found a bug, please file an issue. Please include as much detail as possible to help us properly address your issue. If we need to triage issues and constantly ask people for more detail, that's time taken away from actually fixing issues. Help us be as efficient as possible by including a lot of detail in your issues.

## Requesting changes

If you would like to request a change, please create a new issue and include the following:

- The problem you want to solve
- Your take on the current solution to the problem

Please include as much detail as possible to help us properly address your issue. If we need to triage issues and constantly ask people for more detail, that's time taken away from actually fixing issues. Help us be as efficient as possible by including a lot of detail in your issues.
