import { defineStore } from "pinia"
import { useUpgradesPlanStore } from "@/stores/upgradesPlan"
import router from '@/router'
import { supabase } from "../utils/supabase"
import axios from 'axios'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    currentPostSelected: null,
    action: null, // Used for open modal
    rssIds: null,
    myPlan: null,
    object: null,
  }),
  actions: {
    closeModal (bool) {
      if (bool) this.action = null
    },

    async logout() {
      const { error } = await supabase.auth.signOut()
      if (error) return
      this.user = null
      router.go()
    },

    async signIn(email, password, captchaToken) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken
        }
      })
      if (error) return false
      router.go()
      return true
    },

    async getUserInfos(id) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username, certified, description, pdp, wallpaper, followers:following!following_user_follow_id_fkey(user_id), following:following!following_user_id_fkey(user_follow_id), deleted_at')
        .eq('user_id', id)
      if (!error) return profile[0]
    },

    async reactivateUser(user_id) {
      await supabase
        .from('profiles')
        .update({ deleted_at: null })
        .eq('user_id', user_id)
    },

    async setUser(data, meta, recovery) {
      if (recovery) await this.reactivateUser(data.user.id)

      if (!meta) {
        meta = await this.getUserInfos(data.user.id)
      }

      if (meta && meta.deleted_at) {
        this.user = { userId: data.user.id }
        this.logout()
        return   
      }

      const { data: reactions_not_seen, error } = await supabase.rpc('reactions_not_seen', { authenticated_user_id: data.user.id })

      this.user = {
        userId: data.user.id,
        email: data.user.email,
        ...meta,
        reactions_not_seen: reactions_not_seen[0]
      }

      await this.loadUserPlan(this.user.userId)
    },

    async loadUserPlan(userId) {
      const { data: plan, error } = await supabase
        .from('user_plan')
        .select('*')
        .gt('ending_at', new Date().toDateString())
        .lte('starting_at', new Date().toDateString())
        .eq('user_id', userId)

      if (!error) {
        // Check plan validity
        const upgradesPlanStore = useUpgradesPlanStore()
        const plans = upgradesPlanStore.plans
        const myPlan = plan && plan.length && !(new Date(plan[0].ending_at) < new Date()) ? plan[0] : { plan_id: 1 }
        this.myPlan = { ...plans.find(p => p.id === myPlan.plan_id), ...myPlan }
      }
    },

    async signUp(datas) {
      const { error } = await supabase.auth.signUp({
        email: datas.email,
        password: datas.password,
        options: {
          emailRedirectTo: `${location.origin}/account/login`,
          data: {
            username: datas.username,
          },
          captchaToken: datas.captchaToken
        },
      })
      return !error
    },

    async checkIfUsernameExist(username) {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)

      return !!(error || (data && data.length))
    },

    async createProfile(user) {
      // Create public profile for user
      await supabase
        .from('profiles')
        .insert([{ user_id: user.id, username: user.user_metadata.username }])

      // Create stripe_customer
      axios.post(`http://localhost:3000/create-customer`, {
        email: user.email,
      })
      .then(async function (response) {
        await supabase
          .from('stripe_customers')
          .upsert([
            {
              user_id: user.id,
              customer_id: response.data.customer.id,
            },
          ])
      })
    },

    async forgotPassword(datas) {
      await supabase.auth.resetPasswordForEmail(datas.email, {
        redirectTo: `${location.origin}`,
        captchaToken: datas.captchaToken
      })
    },

    async follow(userId) {
      if (!this.user) return router.push('/login')
      if (this.getFollowing().ids.includes(userId)) {
        const { error } = await supabase
          .from('following')
          .delete()
          .eq('user_id', this.user.userId)
          .eq('user_follow_id', userId)
        if (!error) this.user.following = this.user.following.filter(f => f.user_follow_id != userId)
      } else {
        const { error } = await supabase
          .from('following')
          .insert([
            { user_id: this.user.userId, user_follow_id: userId },
          ])
        if (!error) this.user.following.push({ user_follow_id: userId })
      }
    },

    async getRssIds() {
      if (!this.rssIds) {
        const { data, error } = await supabase
          .from('readLater')
          .select('rss_link')
          .eq('user_id', this.user.userId)

        if (!error) this.rssIds = data.map((item) => item.rss_link)
      }
    },

    /* Getters */
    getProfileLink() {
      return this.user ? `/profile/${this.user.userId}` : '/login'
    },

    getUsername() {
      return this.user ? this.user.username : 'Guest'
    },

    getPdpLink(user) {
      if(!user) user = this.user
      return user && user.pdpPreview ?
        user.pdpPreview
        : user && user.pdp ?
          `${import.meta.env.VITE_SUPAURL}/storage/v1/object/public/avatars/${user.pdp}`
          : '/guest.png'
    },

    getWallpaperLink(user) {
      return user && user.wallpaperPreview ?
        user.wallpaperPreview
        : user && user.wallpaper ?
          `${import.meta.env.VITE_SUPAURL}/storage/v1/object/public/wallpapers/${user.wallpaper}`
          : null
    },

    getFollowers() {
      return { ids: this.user?.followers.map(f => f.user_id) || [], count: this.user?.followers.length }
    },

    getFollowing() {
      return { ids: this.user?.following.map(f => f.user_follow_id) || [], count: this.user?.following.length }
    },
  }
})
