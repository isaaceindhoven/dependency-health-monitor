# Scoring the Equity in a financial context
The goal of the Financial Health Monitor is to help users decide which dependencies to provide funding to in an _equitable_ manner, with an emphasis on the word equitable. By providing an Equity score, the Financial Health Monitor tries to describe how equitable the financial health is for a project.

## Inspiration
The Equity score is inspired by an article from André Staltz named ["Software below the poverty line"](https://staltz.com/software-below-the-poverty-line.html). In this article, André measures how many Open-Source software projects are below the poverty line, and tries to illustrate how unrightful it is to expect those projects to be maintained with such little funding. One of the results of his research is the following graph: 

![Software below the poverty line - André Staltz](images/Software%20below%20the%20poverty%20line.png)

With the Equity score, the Dependency Health Monitor tries to illustrate the same problem of how equitable the funding received for a project is compared to the usage.

## Differences with André Staltz' Software below the poverty line
There are three differences with André Staltz' Software below the poverty line. The first, and obvious, difference is that the Dependency Health Monitor is going to illustrate the equity of received funding using a score, per project, instead of creating a graph with multiple projects in it. The second difference is that André Staltz measured the popularity of a project using the GitHub stars given to the project. The Dependency Health Monitor is not going to measure the popularity, but instead, the usage of a project (NPM weekly downloads). The reason for this is that the Dependency Health Monitor is interested more in the usage as it indicates better how reliant developers are of a project. Not every user of a project is giving out GitHub stars to repositories they like or use. Finally, the last difference is that the equity score of the Dependency Health Monitor makes use of the financial health score, instead of funding received, to illustrate how financially well a project is doing.

## Measuring the Equity score of a project
The equity score indicates if the received financial health score is fair compared to the usage of that project. The equity score, thus, is in need of the following data:
- Financial health score: Measured by [these criteria](Scoring%20financial%20health.md)
- Usage: Measured by taking the NPM weekly downloads
<br></br>
> **_NOTE:_** _Deciding the relation of financial health and usage of the project to measure the equity is quite hard to do. We are open to suggestions, if you think you can improve the measurement of the equity score, please contribute!_

To measure the equity of a project's financial health, the following scale has been created:

| Downloads per week | Minimum financial health score ± 5|
| :----------------: | :------------: |
| 0     | 30    |
| 100K  | 30    |
| 1M    | 65    |
| 10M   | 75    |
| 100M  | 85    |

This scale shows what financial health score we, the Dependency Health Monitor team, think projects should have relative to their weekly downloads. Projects will only be seen as equitable if they are close or above to the minimum financial health score for their downloads per week. To illustrate, a project with a financial health score of 80 and 120M downloads per week is seen as equitable (the minimum financial health score has a margin of 5).

To measure the severity of the equity, the distance of a project's financial health score (FH) to the minimum financial health score (MFH) relative to the project's weekly downloads will be used. For this, the following scale will be used:

| Result of FH - MFH  | Equity score |
| :----------------: | :------------ |
| 11 or higher     | Extremely equitable   |
| Between 6 and 10  | Very equitable    |
| Between -5 and +5    | Equitable    |
| Between -6 and -10   | Very inequitable   |
| -11 or lower  | Extremely inequitable    |