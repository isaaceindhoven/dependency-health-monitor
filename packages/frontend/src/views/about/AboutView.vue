<template>
  <!-- <div>
    <h1>Dependency Health Monitor</h1>
    <h4>
      The Dependency Health Monitor is an application that is capable of determining the financial health of your
      dependencies in an equitable manner. To determine the financial health, several criteria have been set up. We
      believe these criteria are capable of describing the financial health of a project. To find out what criteria are
      used and how the equity of the financial health is determined, check the links below!
    </h4>
  </div> -->
  <router-view></router-view>
</template>

<style lang="scss">
// prefers dark #071426
code {
  background-color: var(--surface-d);
  border-radius: 5px;
  padding: 0.25rem 0.5rem;
}

h2,
h3,
h4,
h5,
h6 {
  margin-top: 1rem;
  margin-bottom: 1rem;

  border-bottom: 1px solid var(--text-color-secondary);
}

ul {
  margin: 0.5rem 0;
}

ul ul,
ul ol,
ol ol,
ol ul {
  margin: 0;
}

p {
  margin-bottom: 0.5rem;
}

table {
  border-collapse: collapse;
  margin: 0.5rem 0;
}

tr {
  &:nth-child(odd) {
    td {
      background-color: var(--surface-d);
    }
  }
}

td,
th {
  padding: 0.125rem 0.5rem;
  border: 1px solid var(--text-color-secondary);
}
</style>
