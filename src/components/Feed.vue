<template>
  <div class="grid grid-cols-1 gap-4">
    <div v-for="(post, index) in data.posts" :key="index" class="card shadow-lg bg-base-100 indicator w-full">
      <router-link v-if="postTargeted && post.parent_id" :to="'/post/' + post.parent_id" class="flex items-center ml-8 mt-2 w-fit text-accent hover:text-accent-focus hover:underline">
        <i class="fa-solid fa-arrow-left"></i>
        <p class="ml-2">See original</p>
      </router-link>

      <DeleteContent v-if="post.deleted_at" :post="post" />

      <router-link v-else draggable="false" :to="`/post/${post.id}`" class="select-text card-body group rounded-box" :class="(!postTargeted ? 'hover:bg-base-200' : 'cursor-default')">
        <div class="flex items-center gap-4">
          <router-link :to="'/profile/' + post.user_id" class="hover:brightness-90">
            <div class="avatar" :class="post.online ? 'online' : ''">
              <div class="w-12 rounded-full">
                <img :src="authStore.getPdpLink(post.profiles)" :alt="'Avatar ' + post.profiles.username" />
              </div>
            </div>
          </router-link>
          <div>
            <router-link :to="'/profile/' + post.user_id" class="flex items-baseline gap-1 font-bold hover:underline">{{ post.profiles.username }} <img v-if="post.profiles.certified" src="/src/assets/certificate.svg" alt="certificate icon" /></router-link>
            <div @click.prevent class="cursor-text text-xs font-extralight">{{ new Date(post.published_at).toDateString() }}</div>
          </div>
        </div>

        <EditView v-if="post.onEdit" :post="post" @editEnd="initClipLinks()" />

        <template v-else>
          <div class="flex flex-col gap-4 mt-4">
            <!-- Promoted content -->
            <template v-if="post.promoted">
              <p @click.prevent class="cursor-text break-words">{{ post.description }}</p>
              <a class="flex flex-col gap-2" @click.stop :href="'http://' + post.link" target="_blank">
                <div v-if="post.showcase || post.showcasePreview" class="showcase-back flex items-center justify-center rounded-box h-96 w-full" :style="`background-image: url(${getShowcase(post)})`">
                  <div class="showcase flex items-center justify-center rounded-box h-96 w-full" :style="`background-image: url(${getShowcase(post)})`">
                  </div>
                </div>
                <button class="btn btn-accent w-full">
                  <span class="max-w-[50%] truncate">{{ post.link }}</span>
                  <i class="fa-solid fa-up-right-from-square ml-2"></i>
                </button>
              </a>
            </template>

            <!-- Basic content -->
            <template v-else>
              <div v-if="post.link" class="flex items-center gap-4">
                <a @click.stop class="tag-link flex gap-2 text-blue-500 max-w-full" :href="'http://' + post.link" target="_blank">
                  <svg class="w-4" width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path class="fill-blue-500" d="M10.5431 15.081C10.6051 15.0997 10.6465 15.1372 10.6671 15.1934C10.6878 15.2495 10.6775 15.3057 10.6361 15.3619L8.06307 17.6937C7.64972 18.0682 7.17437 18.3679 6.63702 18.5926C6.09967 18.8174 5.55199 18.9485 4.99397 18.986C4.43595 19.0234 3.87794 18.986 3.31992 18.8736C2.7619 18.7612 2.25555 18.5271 1.80087 18.1712C1.24286 17.7779 0.808843 17.3004 0.498834 16.7385C0.188824 16.1766 0.0234856 15.6148 0.00281827 15.0529C-0.017849 14.491 0.0751538 13.9198 0.281827 13.3392C0.4885 12.7586 0.839844 12.2529 1.33586 11.8222L5.33498 8.19813C5.97567 7.61754 6.71969 7.18677 7.56705 6.90584C8.41441 6.62491 9.28244 6.54999 10.1711 6.68109C10.9565 6.79347 11.5765 6.99948 12.0312 7.29915C12.4859 7.59881 12.8475 7.94529 13.1162 8.3386C13.1576 8.43224 13.1524 8.50248 13.1007 8.5493C13.0491 8.59612 12.9922 8.63826 12.9302 8.67572C12.8682 8.71317 12.7959 8.76936 12.7132 8.84428L12.4962 9.04093C12.2895 9.24695 12.0415 9.34996 11.7522 9.34996C11.4628 9.34996 11.1993 9.24226 10.9617 9.02688C10.724 8.8115 10.4605 8.64762 10.1711 8.53525C9.88179 8.42288 9.56145 8.37606 9.2101 8.39478C8.85876 8.41351 8.54875 8.46034 8.28007 8.53525C8.0114 8.61017 7.73239 8.77873 7.44305 9.04093L2.85491 13.1987C2.58623 13.4422 2.38989 13.7231 2.26589 14.0415C2.14188 14.3599 2.10055 14.6783 2.14188 14.9967C2.18322 15.3151 2.28656 15.6335 2.45189 15.9519C2.61723 16.2703 2.88591 16.5231 3.25792 16.7104C3.7746 17.0288 4.33262 17.1412 4.93197 17.0475C5.53132 16.9539 6.03767 16.7291 6.45102 16.3733L8.43508 14.6034C8.47641 14.5472 8.53841 14.5379 8.62108 14.5753C9.2411 14.8188 9.88179 14.9873 10.5431 15.081ZM19.1614 0.865784C19.7194 1.25909 20.1534 1.72731 20.4634 2.27045C20.7735 2.81359 20.9491 3.37545 20.9905 3.95605C21.0318 4.53664 20.9388 5.11723 20.7115 5.69783C20.4841 6.27842 20.1224 6.7841 19.6264 7.21487L15.6273 10.8389C14.9866 11.4195 14.2426 11.8409 13.3952 12.1031C12.5479 12.3653 11.6695 12.4402 10.7601 12.3278C9.97479 12.2342 9.36511 12.0282 8.93109 11.7098C8.49708 11.3914 8.1354 11.0449 7.84606 10.6703C7.80472 10.5954 7.81506 10.5299 7.87706 10.4737L8.43508 9.96801C8.66242 9.78072 8.92076 9.68708 9.2101 9.68708C9.49944 9.68708 9.74745 9.78072 9.95412 9.96801C10.2021 10.1928 10.4811 10.3613 10.7912 10.4737C11.1012 10.5861 11.4215 10.6422 11.7522 10.6422C12.0829 10.6422 12.4032 10.5861 12.7132 10.4737C13.0232 10.3613 13.2919 10.1928 13.5192 9.96801L18.1074 5.8383C18.376 5.59482 18.5724 5.30452 18.6964 4.9674C18.8204 4.63028 18.8617 4.30253 18.8204 3.98414C18.7791 3.66575 18.6654 3.35672 18.4794 3.05706C18.2934 2.7574 18.0247 2.50456 17.6734 2.29854C17.1773 1.99888 16.6297 1.88651 16.0303 1.96142C15.431 2.03634 14.9143 2.27045 14.4803 2.66375L12.5272 4.43363C12.4652 4.48982 12.4032 4.49918 12.3412 4.46172C11.7625 4.23698 11.1218 4.05905 10.4191 3.92795C10.3365 3.92795 10.2951 3.89049 10.2951 3.81558C10.2951 3.74066 10.3055 3.69384 10.3261 3.67511L12.8992 1.34337C13.3126 0.968793 13.7879 0.669131 14.3253 0.444385C14.8626 0.219638 15.4 0.079172 15.9373 0.0229854C16.4747 -0.0332012 17.0327 0.013621 17.6114 0.163452C18.19 0.313283 18.7067 0.547393 19.1614 0.865784Z" fill="#B7E9FF" fill-opacity="0.6"/>
                  </svg>
                  <div class="link-content">
                    {{ post.link }}
                  </div>
                  <span ref="spanRefs"></span>
                </a>
              </div>
              <p @click.prevent class="cursor-text break-words">{{ post.description }}</p>
            </template>
          </div>

          <div class="flex flex-wrap gap-4 justify-between items-baseline">
            <div class="flex flex-wrap mt-4 gap-2 items-center">
              <router-link :to="`/explore?s=${tag.name}`" v-for="(tag, index) in post.tags?.filter(tag => tagsToDisplay ? tagsToDisplay.includes(tag.name) : true)" :key="index" class="badge badge-ghost whitespace-nowrap hover:cursor-pointer hover:invert" :class="postTargeted ? '' : 'group-hover:bg-base-100'">
                {{ tag.name }}
              </router-link>
              <template v-if="post.myTags && tagsToDisplay">
                <router-link :to="`/explore?s=${tag}`" v-for="(tag, index) in [...post.myTags].filter(tag => tagsToDisplay.includes(tag))" :key="index" class="badge badge-neutral whitespace-nowrap hover:cursor-pointer hover:invert" :class="postTargeted ? '' : 'group-hover:bg-base-100'">
                  {{ tag }}
                </router-link>
              </template>

              <!-- Toggle modal tag-management -->
              <label v-if="tagsToDisplay" for="tag-management" @click.prevent.stop="$emit('showTagManagement', post.id)">
                <span class="btn btn-neutral btn-circle min-h-0 h-6 w-6">
                  <i class="fa-solid fa-circle-plus"></i>
                </span>
              </label>
            </div>

            <div v-if="authStore.user" class="flex flex-wrap gap-2 ml-auto">
              <ReactionButton @click.prevent="postStore.like(post, authStore.user.userId)" :identifiant="`${post.profiles.username}-${index}-like`" :checked="containsMyId(post.usersIdsWhoLiked, authStore.user.userId)" :icon="'fa-heart'" :btnColor="'btn-error'" :number="post.usersIdsWhoLiked?.length" />
              <ReactionButton @click="targetComment" :identifiant="`${post.id}-comment`" :icon="'fa-comment'" :btnColor="'btn-ghost'" :number="post.comments.length" />
              <ReactionButton v-if="!post.parent_id" @click.prevent="postStore.bookmark(post, authStore.user.userId)" :identifiant="`${post.profiles.username}-${index}-bookmark`" :checked="containsMyId(post.usersIdsWhoBookmarked, authStore.user.userId)" :icon="'fa-bookmark'" :btnColor="'btn-accent'" :string="'Bookmark'" />
            </div>
          </div>
        </template>

        <div v-if="post.promoted" class="font-extralight">
          <i class="fa-solid fa-rectangle-ad" />
          Promoted
        </div>
      </router-link>

      <!-- Actions -->
      <Actions v-if="authStore.user" class="absolute right-6 top-6 z-10" :post="post" />

      <!-- Stats of post -->
      <section v-if="postTargeted" class="card-body pt-0">
        <hr class="thin" />
        <div class="flex gap-4 px-4">
          <!-- Toggle modal users who liked -->
          <label for="users-who-liked" @click="authStore.currentPostSelected = post; authStore.action = 'who-liked';">
            <p class="cursor-pointer hover:underline">
              <span class="font-extrabold">{{ post.usersIdsWhoLiked.length }}</span>
              Likes
            </p>
          </label>
          <div>
            <span class="font-extrabold">{{ post.comments.length }}</span>
            Comments
          </div>
          <div v-if="!post.parent_id">
            <span class="font-extrabold">{{ post.usersIdsWhoBookmarked.length }}</span>
            Bookmarks
          </div>
        </div>
        <hr class="thin" />
      </section>

      <!-- Send comment -->
      <SendCommentForm v-if="postTargeted" :post="post" />

      <!-- Comments -->
      <Comments v-if="postTargeted" :comments="post.comments.map(c => ({ ...c, index: 1 }))" />
    </div>

    <!-- Modal -->
    <Report />
    <Share />
    <WhoLiked />
  </div>
</template>

<script setup>
import { defineAsyncComponent, reactive, computed, ref, onMounted, onUpdated, watch, inject } from "vue"
import { usePostsStore } from '@/stores/postsStore'

const ReactionButton = defineAsyncComponent(() => import ("@/components/ReactionButton.vue"))
const Actions = defineAsyncComponent(() => import ("@/components/Actions.vue"))
const Comments = defineAsyncComponent(() => import ("@/components/Comments.vue"))
const SendCommentForm = defineAsyncComponent(() => import ("@/components/SendCommentForm.vue"))
const DeleteContent = defineAsyncComponent(() => import ("@/components/DeleteContent.vue"))
const EditView = defineAsyncComponent(() => import ("@/components/EditView.vue"))

// Modal
const Report = defineAsyncComponent(() => import ("@/components/Modal/Report.vue"))
const Share = defineAsyncComponent(() => import ("@/components/Modal/Share.vue"))
const WhoLiked = defineAsyncComponent(() => import ("@/components/Modal/WhoLiked.vue"))

const getShowcase = (post) => {
  if (post.showcasePreview) return post.showcasePreview
  return `${import.meta.env.VITE_SUPAURL}/storage/v1/object/public/showcase/${post.showcase}`
}

const props = defineProps({
  posts: {
    type: Array,
    required: false
  },
  tagsToDisplay: {
    type: Array,
    required: false
  },
  postTargeted: {
    type: Boolean,
    default: false
  },
  newPost: {
    type: Object,
    required: false
  },
})

const postStore = usePostsStore()
const data = reactive({ 
  posts: props.posts,
})

const containsMyId = (obj, userId) => {
  return obj.some(o => o.user_id === userId)
}

const spanRefs = ref(null)
const initClipLinks = () => {
  if (spanRefs.value && spanRefs.value.length) {
    data.posts.forEach((post, index) => {
      const spanRef = spanRefs.value[index]
      if (spanRef) {
        spanRef.style = `clip: rect(calc(${spanRef.offsetHeight}px - 16px), 1000px, 1000px, calc(${spanRef.offsetWidth}px - 16px))`
        window.addEventListener('resize', () => {
          spanRef.style = `clip: rect(calc(${spanRef.offsetHeight}px - 16px), 1000px, 1000px, calc(${spanRef.offsetWidth}px - 16px))`
        })
      }
    })
  }
}

const targetComment = (e) => {
  if (props.postTargeted) {
    e.preventDefault()
    document.getElementById('newComment')?.focus()
  }
}

const authStore = inject('authStore')
onMounted(async () => {
  initClipLinks()

  if (!data.posts) {
    const posts = await postStore.retrievePosts({ page: 0, perPage: 5, usersIdsThatIFollow: authStore.user ? authStore.getFollowing().ids.concat([authStore.user.userId]) : null })
    data.posts = posts
  }
})

watch(
  () => props.posts,
  (newVal) => {
    if (newVal) {
      data.posts = newVal
    }
  }
)

const globalData = inject('globalData')
const page = ref(0)
let isLoading = false
let endReached = false
watch(
  () => globalData.scrollEndTriggered,
  async(newVal) => {
    if (newVal && !isLoading && !endReached && !props.posts) {
      page.value += 1
      isLoading = true
      const posts = await postStore.retrievePosts({ page: page.value, perPage: 5, usersIdsThatIFollow: authStore.user ? authStore.getFollowing().ids.concat([authStore.user.userId]) : null })
      data.posts = data.posts.concat(...posts)
      endReached = !posts.length
      isLoading = false
    }
    globalData.scrollEndTriggered = false
  }
)

watch(
  () => props.newPost,
  (newVal) => {
    if (newVal) {
      if (data.posts) data.posts.unshift(newVal)
      else data.posts = [newVal]
    }
  }
)

onUpdated(() => {
  initClipLinks()
})
</script>

<style scoped lang="scss">
.tag-link {
  box-shadow: inset 0 0 0 1px rgb(59 130 246 / var(--tw-text-opacity));
  color: rgb(59 130 246 / var(--tw-text-opacity));
  position: relative;
  padding: 0 .5rem 0 .5rem;

  > span, &::before {
    content: "";
    margin: -5px;
    box-shadow: inset 0 0 0 2px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    box-sizing: border-box;
  }

  svg {
    margin-top: .2rem; 
  }

  &::before {
    clip: rect(0px, 15px, 15px, 0px);
  }

  .link-content {
    width: calc(100% - 1.5rem);
    word-wrap: break-word;
  }
}

.thin {
  border-top-width: .1px;
}

.showcase {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  backdrop-filter: brightness(0.5) blur(2px);
}

.showcase-back {
  background-size: contain;
}
</style>
