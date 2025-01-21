<template>
  <nav class="bg-base-100 p-2 rounded-box flex flex-col shadow-lg">
    <div class="flex flex-col gap-2 p-2">
      <div class="flex justify-between">
        <router-link :to="authStore.getProfileLink()" active-class="ring ring-primary ring-offset-base-100 ring-offset-2" class="w-12 h-12 rounded-full hover:brightness-90">
          <div class="avatar">
            <div class="w-12 rounded-full">
              <img :src="authStore.getPdpLink()" :alt="authStore.getUsername() + ' avatar'"/>
            </div>
          </div>
        </router-link>
        <!-- Log out -->
        <button v-if="authStore.user" @click="authStore.logout()" class="xl:block hidden btn btn-square">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
      <router-link :to="authStore.getProfileLink()" class="xl:flex xl:gap-1 hidden text-md font-bold hover:underline">{{ authStore.getUsername() }} <img v-if="authStore.user && authStore.user.certified" src="/src/assets/certificate.svg" alt="certificate icon" /></router-link>
      <div class="xl:flex hidden gap-2">
        <div><span class="font-extralight">{{ authStore.getFollowing().count }}</span> Following</div>
        <div><span class="font-extralight">{{ authStore.getFollowers().count }}</span> Followers</div>
      </div>
    </div>

    <div class="hidden xl:flex divider"></div>

    <ul class="menu p-2 rounded-box space-y-2">

      <!-- Home -->
      <li class="xl:block hidden">
        <router-link to="/" active-class="active">
          <i class="fa-solid fa-house"></i>
          Home
        </router-link>
      </li>
      <div class="tooltip tooltip-right xl:hidden" data-tip="Home">
        <li>
          <router-link to="/" active-class="active">
            <i class="fa-solid fa-house"></i>
          </router-link>
        </li>
      </div>

      <!-- Explore -->
      <li class="xl:block hidden">
        <router-link to="/explore" active-class="active">
          <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M181.3 32.4c17.4 2.9 29.2 19.4 26.3 36.8L197.8 128h95.1l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3s29.2 19.4 26.3 36.8L357.8 128H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H347.1L325.8 320H384c17.7 0 32 14.3 32 32s-14.3 32-32 32H315.1l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.8-58.7H155.1l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8L90.2 384H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l21.3-128H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3zM187.1 192L165.8 320h95.1l21.3-128H187.1z"/>
          </svg>
          <p>Explore</p>
        </router-link>
      </li>
      <div class="tooltip tooltip-right xl:hidden" data-tip="Explore">
        <li>
          <router-link to="/explore" active-class="active">
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M181.3 32.4c17.4 2.9 29.2 19.4 26.3 36.8L197.8 128h95.1l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3s29.2 19.4 26.3 36.8L357.8 128H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H347.1L325.8 320H384c17.7 0 32 14.3 32 32s-14.3 32-32 32H315.1l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.8-58.7H155.1l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8L90.2 384H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l21.3-128H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3zM187.1 192L165.8 320h95.1l21.3-128H187.1z"/>
            </svg>
          </router-link>
        </li>
      </div>

      <!-- Today -->
      <li class="xl:block hidden">
        <router-link to="/today" active-class="active">
          <svg width="20" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 9H9V14H4M16 18H2V7H16M16 2H15V0H13V2H5V0H3V2H2C1.46957 2 0.960859 2.21071 0.585786 2.58579C0.210714 2.96086 0 3.46957 0 4V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V4C18 3.46957 17.7893 2.96086 17.4142 2.58579C17.0391 2.21071 16.5304 2 16 2Z" fill="#A6ADBB"/>
          </svg>
          <p>Today</p>
        </router-link>
      </li>
      <div class="tooltip tooltip-right xl:hidden" data-tip="Today">
        <li>
          <router-link to="/today" active-class="active">
            <svg width="20" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 9H9V14H4M16 18H2V7H16M16 2H15V0H13V2H5V0H3V2H2C1.46957 2 0.960859 2.21071 0.585786 2.58579C0.210714 2.96086 0 3.46957 0 4V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V4C18 3.46957 17.7893 2.96086 17.4142 2.58579C17.0391 2.21071 16.5304 2 16 2Z" fill="#A6ADBB"/>
            </svg>
          </router-link>
        </li>
      </div>

      <!-- My RSS -->
      <li class="xl:block hidden">
        <router-link to="/rss" active-class="active">
          <svg width="20" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 17C1.45 17 0.979 16.8043 0.587 16.413C0.195667 16.021 0 15.55 0 15C0 14.45 0.195667 13.979 0.587 13.587C0.979 13.1957 1.45 13 2 13C2.55 13 3.02067 13.1957 3.412 13.587C3.804 13.979 4 14.45 4 15C4 15.55 3.804 16.021 3.412 16.413C3.02067 16.8043 2.55 17 2 17ZM14 17C14 15.0667 13.6333 13.254 12.9 11.562C12.1667 9.87067 11.1627 8.38733 9.888 7.112C8.61267 5.83733 7.12933 4.83333 5.438 4.1C3.746 3.36667 1.93333 3 0 3V0C2.35 0 4.55833 0.446 6.625 1.338C8.69167 2.22933 10.4917 3.44167 12.025 4.975C13.5583 6.50833 14.771 8.30833 15.663 10.375C16.5543 12.4417 17 14.65 17 17H14ZM8 17C8 14.7833 7.22067 12.896 5.662 11.338C4.104 9.77933 2.21667 9 0 9V6C1.53333 6 2.96667 6.28767 4.3 6.863C5.63333 7.43767 6.796 8.22067 7.788 9.212C8.77933 10.204 9.56233 11.3667 10.137 12.7C10.7123 14.0333 11 15.4667 11 17H8Z" fill="#A6ADBB"/>
          </svg>
          <p>My RSS</p>
        </router-link>
      </li>
      <div class="tooltip tooltip-right xl:hidden" data-tip="My RSS">
        <li>
          <router-link to="/rss" active-class="active">
            <svg width="20" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 17C1.45 17 0.979 16.8043 0.587 16.413C0.195667 16.021 0 15.55 0 15C0 14.45 0.195667 13.979 0.587 13.587C0.979 13.1957 1.45 13 2 13C2.55 13 3.02067 13.1957 3.412 13.587C3.804 13.979 4 14.45 4 15C4 15.55 3.804 16.021 3.412 16.413C3.02067 16.8043 2.55 17 2 17ZM14 17C14 15.0667 13.6333 13.254 12.9 11.562C12.1667 9.87067 11.1627 8.38733 9.888 7.112C8.61267 5.83733 7.12933 4.83333 5.438 4.1C3.746 3.36667 1.93333 3 0 3V0C2.35 0 4.55833 0.446 6.625 1.338C8.69167 2.22933 10.4917 3.44167 12.025 4.975C13.5583 6.50833 14.771 8.30833 15.663 10.375C16.5543 12.4417 17 14.65 17 17H14ZM8 17C8 14.7833 7.22067 12.896 5.662 11.338C4.104 9.77933 2.21667 9 0 9V6C1.53333 6 2.96667 6.28767 4.3 6.863C5.63333 7.43767 6.796 8.22067 7.788 9.212C8.77933 10.204 9.56233 11.3667 10.137 12.7C10.7123 14.0333 11 15.4667 11 17H8Z" fill="#A6ADBB"/>
            </svg>
          </router-link>
        </li>
      </div>

      <!-- Read Later -->
      <li class="xl:block hidden">
        <router-link to="/read-later" active-class="active">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM14.2 14.2L9 11V5H10.5V10.2L15 12.9L14.2 14.2Z" fill="#A6ADBB"/>
          </svg>
          <p>Read Later</p>
        </router-link>
      </li>
      <div class="tooltip tooltip-right xl:hidden" data-tip="Read Later">
        <li>
          <router-link to="/read-later" active-class="active">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM14.2 14.2L9 11V5H10.5V10.2L15 12.9L14.2 14.2Z" fill="#A6ADBB"/>
            </svg>
          </router-link>
        </li>
      </div>

      <!-- Weekly Planner -->
      <li class="xl:block hidden">
        <router-link to="/weekly-planner" active-class="active">
          <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 0H7.5V6H1.5V0ZM3.5 2V4H5.5V2H3.5ZM9.5 2H19.5V4H9.5V2ZM9.5 10H19.5V12H9.5V10ZM3.5 15L0 11.5L1.41 10.09L3.5 12.17L8.09 7.59L9.5 9L3.5 15Z" fill="#A6ADBB"/>
          </svg>
          <p>Weekly Planner</p>
        </router-link>
      </li>
      <div class="tooltip tooltip-right xl:hidden" data-tip="Weekly Planner">
        <li>
          <router-link to="/weekly-planner" active-class="active">
            <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 0H7.5V6H1.5V0ZM3.5 2V4H5.5V2H3.5ZM9.5 2H19.5V4H9.5V2ZM9.5 10H19.5V12H9.5V10ZM3.5 15L0 11.5L1.41 10.09L3.5 12.17L8.09 7.59L9.5 9L3.5 15Z" fill="#A6ADBB"/>
            </svg>
          </router-link>
        </li>
      </div>
      
      <!-- View Bookmarked links -->
      <li class="xl:block hidden">
        <router-link to="/bookmark" active-class="active">
          <svg width="20" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 18V2C0 1.45 0.196 0.979 0.588 0.587C0.98 0.195 1.45067 -0.000666876 2 -2.09555e-07H12C12.55 -2.09555e-07 13.021 0.196 13.413 0.588C13.805 0.98 14.0007 1.45067 14 2V18L7 15L0 18Z" fill="#A6ADBB"/>
          </svg>
          <p>View Bookmarked links</p>
        </router-link>
      </li>
      <div class="tooltip tooltip-right xl:hidden" data-tip="View Bookmarked links">
        <li>
          <router-link to="/bookmark" active-class="active">
            <svg width="20" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 18V2C0 1.45 0.196 0.979 0.588 0.587C0.98 0.195 1.45067 -0.000666876 2 -2.09555e-07H12C12.55 -2.09555e-07 13.021 0.196 13.413 0.588C13.805 0.98 14.0007 1.45067 14 2V18L7 15L0 18Z" fill="#A6ADBB"/>
            </svg>
          </router-link>
        </li>
      </div>
      <template v-if="authStore.user">
        <div class="divider"></div>

        <!-- Notifications -->
        <div class="tooltip tooltip-right lg:hidden" data-tip="Notifications">
          <li>
            <router-link to="/notifications" active-class="active">
              <div class="relative">
                <span v-if="authStore.user && authStore.user.reactions_not_seen" class="absolute bg-secondary -right-3 -top-2 scale-90 rounded-full w-5 h-5 text-secondary-content text-[.55rem] leading-5">
                  {{ formatNumberNotif(authStore.user.reactions_not_seen) }}
                </span>
                <i class="fa-solid fa-bell"></i>
              </div>
            </router-link>
          </li>
        </div>

        <!-- Settings -->
        <div class="tooltip tooltip-right lg:hidden" data-tip="Settings">
          <li>
            <router-link to="/settings" active-class="active">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.2233 10C17.2233 9.77 17.2133 9.55 17.1933 9.32L19.0533 7.91C19.4533 7.61 19.5633 7.05 19.3133 6.61L17.4433 3.38C17.3234 3.16818 17.1295 3.00814 16.8987 2.93062C16.668 2.8531 16.4168 2.86356 16.1933 2.96L14.0433 3.87C13.6733 3.61 13.2833 3.38 12.8733 3.19L12.5833 0.88C12.5233 0.38 12.0933 0 11.5933 0H7.8633C7.3533 0 6.9233 0.38 6.8633 0.88L6.5733 3.19C6.1633 3.38 5.7733 3.61 5.4033 3.87L3.2533 2.96C2.7933 2.76 2.2533 2.94 2.0033 3.38L0.133298 6.62C-0.116702 7.06 -0.00670207 7.61 0.393298 7.92L2.2533 9.33C2.21184 9.77905 2.21184 10.231 2.2533 10.68L0.393298 12.09C-0.00670207 12.39 -0.116702 12.95 0.133298 13.39L2.0033 16.62C2.2533 17.06 2.7933 17.24 3.2533 17.04L5.4033 16.13C5.7733 16.39 6.1633 16.62 6.5733 16.81L6.8633 19.12C6.9233 19.62 7.3533 20 7.8533 20H11.5833C12.0833 20 12.5133 19.62 12.5733 19.12L12.8633 16.81C13.2733 16.62 13.6633 16.39 14.0333 16.13L16.1833 17.04C16.6433 17.24 17.1833 17.06 17.4333 16.62L19.3033 13.39C19.5533 12.95 19.4433 12.4 19.0433 12.09L17.1833 10.68C17.2133 10.45 17.2233 10.23 17.2233 10ZM9.7633 13.5C7.8333 13.5 6.2633 11.93 6.2633 10C6.2633 8.07 7.8333 6.5 9.7633 6.5C11.6933 6.5 13.2633 8.07 13.2633 10C13.2633 11.93 11.6933 13.5 9.7633 13.5Z" fill="#A6ADBB"/>
              </svg>
            </router-link>
          </li>
        </div>

        <!-- Upgrades -->
        <li class="xl:block hidden">
          <router-link to="/upgrades" active-class="active">
            <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.63099 15.4125L4.96224 18.225C4.75599 18.3563 4.54036 18.4125 4.31536 18.3937C4.09036 18.375 3.89349 18.3 3.72474 18.1688C3.55599 18.0375 3.42474 17.8733 3.33099 17.676C3.23724 17.4788 3.21849 17.2586 3.27474 17.0156L4.51224 11.7L0.37786 8.12813C0.19036 7.95938 0.0733603 7.767 0.0268603 7.551C-0.0196397 7.335 -0.0057648 7.12425 0.0684852 6.91875C0.143485 6.7125 0.255985 6.54375 0.405985 6.4125C0.555985 6.28125 0.762235 6.19688 1.02474 6.15938L6.48099 5.68125L8.59036 0.675C8.68411 0.45 8.82961 0.28125 9.02686 0.16875C9.22411 0.0562501 9.42549 0 9.63099 0C9.83724 0 10.0386 0.0562501 10.2351 0.16875C10.4316 0.28125 10.5771 0.45 10.6716 0.675L12.781 5.68125L18.2372 6.15938C18.4997 6.19688 18.706 6.28125 18.856 6.4125C19.006 6.54375 19.1185 6.7125 19.1935 6.91875C19.2685 7.125 19.2827 7.33613 19.2362 7.55213C19.1897 7.76813 19.0724 7.96013 18.8841 8.12813L14.7497 11.7L15.9872 17.0156C16.0435 17.2594 16.0247 17.4799 15.931 17.6771C15.8372 17.8744 15.706 18.0383 15.5372 18.1688C15.3685 18.3 15.1716 18.375 14.9466 18.3937C14.7216 18.4125 14.506 18.3563 14.2997 18.225L9.63099 15.4125Z" fill="#A6ADBB"/>
            </svg>
            <p>Upgrades</p>
          </router-link>
        </li>
        <div class="tooltip tooltip-right xl:hidden" data-tip="Upgrades">
          <li>
            <router-link to="/upgrades" active-class="active">
              <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.63099 15.4125L4.96224 18.225C4.75599 18.3563 4.54036 18.4125 4.31536 18.3937C4.09036 18.375 3.89349 18.3 3.72474 18.1688C3.55599 18.0375 3.42474 17.8733 3.33099 17.676C3.23724 17.4788 3.21849 17.2586 3.27474 17.0156L4.51224 11.7L0.37786 8.12813C0.19036 7.95938 0.0733603 7.767 0.0268603 7.551C-0.0196397 7.335 -0.0057648 7.12425 0.0684852 6.91875C0.143485 6.7125 0.255985 6.54375 0.405985 6.4125C0.555985 6.28125 0.762235 6.19688 1.02474 6.15938L6.48099 5.68125L8.59036 0.675C8.68411 0.45 8.82961 0.28125 9.02686 0.16875C9.22411 0.0562501 9.42549 0 9.63099 0C9.83724 0 10.0386 0.0562501 10.2351 0.16875C10.4316 0.28125 10.5771 0.45 10.6716 0.675L12.781 5.68125L18.2372 6.15938C18.4997 6.19688 18.706 6.28125 18.856 6.4125C19.006 6.54375 19.1185 6.7125 19.1935 6.91875C19.2685 7.125 19.2827 7.33613 19.2362 7.55213C19.1897 7.76813 19.0724 7.96013 18.8841 8.12813L14.7497 11.7L15.9872 17.0156C16.0435 17.2594 16.0247 17.4799 15.931 17.6771C15.8372 17.8744 15.706 18.0383 15.5372 18.1688C15.3685 18.3 15.1716 18.375 14.9466 18.3937C14.7216 18.4125 14.506 18.3563 14.2997 18.225L9.63099 15.4125Z" fill="#A6ADBB"/>
              </svg>
            </router-link>
          </li>
        </div>
      </template>
    </ul>

    <div v-if="authStore.user" class="dropdown dropdown-top flex justify-center h-12 xl:hidden">
      <div tabindex="0" class="avatar cursor-pointer space-x-4 items-center">
        <button name="more" class="btn btn-circle btn-outline btn-sm">
          <i class="fa-solid fa-ellipsis" />
        </button>
      </div>
      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 gap-2 left-0">
        <li>
          <button @click="authStore.logout()">
            <i class="fa-solid fa-right-from-bracket"></i>
            Log out
          </button>
        </li>
        <li class="lg:hidden">
          <router-link to="/inbox" active-class="active">
            <i class="fa-solid fa-envelope"></i>
            Inbox
            <div v-if="authStore.user && unread_messages" class="badge badge-secondary">{{ formatNumberNotif(unread_messages) }}</div>
          </router-link>
        </li>
        <li>
          <router-link :to="authStore.getProfileLink()" active-class="active">
            <i class="fa-solid fa-user"></i>
            Profile
          </router-link>
        </li>
      </ul>
    </div>

    <div class="mt-auto flex justify-center xl:justify-start p-4">
      <SwitchTheme />
    </div>
  </nav>
</template>

<script setup>
import { defineAsyncComponent } from "vue"
const SwitchTheme = defineAsyncComponent(() => import ("@/components/SwitchTheme.vue"))

import { useUnreadMessages } from '@/modules/unreadMessagesModule.js'
const { unread_messages } = useUnreadMessages()
import { formatNumberNotif } from '@/utils/notif'
</script>

<style scoped lang="scss">
.menu path {
  fill: currentColor;
}

.tooltip {
  width: 100%;
  a {
    width: 100%;
  }
}
</style>
