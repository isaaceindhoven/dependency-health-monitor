export const gitHubProfileMockHtml = `
<div class="container-xl px-3 px-md-4 px-lg-5">
  <div data-view-component="true" class="Layout Layout--flowRow-until-md Layout--sidebarPosition-start Layout--sidebarPosition-flowRow-start">
  
  <div data-view-component="true" class="Layout-sidebar">      <div class="h-card mt-md-n5" data-acv-badge-hovercards-enabled="" itemscope="" itemtype="http://schema.org/Person">
          <div class="js-profile-editable-replace">
    <div class="border-top color-border-muted pt-3 mt-3 d-none d-md-block"><h2 class="h4 mb-2">Highlights</h2><ul class="list-style-none"><li class="mt-2">
    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star color-fg-muted">
    <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
</svg>
<span title="Label: Pro" data-view-component="true" class="Label Label--purple text-uppercase">
  Pro
</span>
</li>
</ul></div>
    <div class="border-top color-border-muted pt-3 mt-3 clearfix hide-sm hide-md">
  <h2 class="mb-2 h4">Organizations</h2>

    <a aria-label="isaaceindhoven" itemprop="follows" class="avatar-group-item" data-hovercard-type="organization" data-hovercard-url="/orgs/isaaceindhoven/hovercard" data-octo-click="hovercard-link-click" data-octo-dimensions="link_type:self" data-hydro-click="{&quot;event_type&quot;:&quot;user_profile.click&quot;,&quot;payload&quot;:{&quot;profile_user_id&quot;:99197230,&quot;target&quot;:&quot;MEMBER_ORGANIZATION_AVATAR&quot;,&quot;user_id&quot;:99197230,&quot;originating_url&quot;:&quot;https://github.com/Ensar025&quot;}}" data-hydro-click-hmac="17206f47b1ea957bd90d0c766ef9ad5872c9f6c62d3f0b78d34950ac2c058a64" href="/isaaceindhoven">
      <img src="https://avatars.githubusercontent.com/u/2471852?s=64&amp;v=4" alt="@isaaceindhoven" size="32" height="32" width="32" data-view-component="true" class="avatar">
</a></div>

    
</div>

      </div>
</div>
  
</div></div>
`;

export const gitHubProfileMockWithoutOrganization = gitHubProfileMockHtml.replace(
  `
    <div class="border-top color-border-muted pt-3 mt-3 clearfix hide-sm hide-md">
        <h2 class="mb-2 h4">Organizations</h2>

        <a aria-label="isaaceindhoven" itemprop="follows" class="avatar-group-item" data-hovercard-type="organization" data-hovercard-url="/orgs/isaaceindhoven/hovercard" data-octo-click="hovercard-link-click" data-octo-dimensions="link_type:self" data-hydro-click="{&quot;event_type&quot;:&quot;user_profile.click&quot;,&quot;payload&quot;:{&quot;profile_user_id&quot;:99197230,&quot;target&quot;:&quot;MEMBER_ORGANIZATION_AVATAR&quot;,&quot;user_id&quot;:99197230,&quot;originating_url&quot;:&quot;https://github.com/Ensar025&quot;}}" data-hydro-click-hmac="17206f47b1ea957bd90d0c766ef9ad5872c9f6c62d3f0b78d34950ac2c058a64" href="/isaaceindhoven">
            <img src="https://avatars.githubusercontent.com/u/2471852?s=64&amp;v=4" alt="@isaaceindhoven" size="32" height="32" width="32" data-view-component="true" class="avatar">
        </a>
    </div>
    `,
  '',
);
