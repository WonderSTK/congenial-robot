import { defineStore } from 'pinia'

export const useUpgradesPlanStore = defineStore('upgradesPlan', {
  state: () => ({
    plans: [
      {
        id: 1,
        title: "Free",
        description: "Default plan",
        costs: {
          month: 0,
          year: 0,
        },
        rss: 5,
        tags: 5,
        readLater: 10,
        canExport: false,
        canPromoteContent: true,
        canDeactivateAccount: false,
        features: [
          {
            unlock: false,
            content: "Weekly Planner"
          },
          {
            unlock: true,
            content: "5 Rss Feeds"
          },
          {
            unlock: true,
            content: "5 Custom tags"
          },
          {
            unlock: true,
            content: "10 Read later"
          },
          {
            unlock: false,
            content: "Export content to CSV"
          },
          {
            unlock: false,
            content: "Deactivate account option"
          },
          {
            unlock: false,
            content: "Blue tick"
          }
        ]
      },
      {
        id: 2,
        title: "Essential",
        stripe_id: "prod_OvWRJ6ncSCHTQT",
        price_id_month: "price_1O7fOwHpvCWGf2YPLVWljWAt",
        price_id_year: "price_1O7fOwHpvCWGf2YPrWn0yJnS",
        description: "Unlock the essentials, paving the way to a world of convenience and seamless experiences",
        costs: {
          month: 4.99,
          year: 49.99,
        },
        rss: 10,
        tags: 10,
        readLater: 30,
        canExport: true,
        canPromoteContent: true,
        canDeactivateAccount: true,
        features: [
          {
            unlock: true,
            content: "Weekly Planner"
          },
          {
            unlock: true,
            content: "10 Rss Feeds"
          },
          {
            unlock: true,
            content: "10 Custom tags"
          },
          {
            unlock: true,
            content: "30 Read later"
          },
          {
            unlock: true,
            content: "Export content to CSV"
          },
          {
            unlock: true,
            content: "Deactivate account option"
          },
          {
            unlock: true,
            content: "Blue tick"
          }
        ]
      },
      {
        id: 3,
        title: "Plus",
        stripe_id: "prod_OvWUZtCWf43LAp",
        price_id_month: "price_1O7fRCHpvCWGf2YPP3TXg1JL",
        price_id_year: "price_1O7fRCHpvCWGf2YPGFDyKnkn",
        description: "Elevate your journey with the Plus plan where added value meets exceptional perks for a premium lifestyle",
        costs: {
          month: 9.99,
          year: 99.99,
        },
        rss: 15,
        tags: 15,
        readLater: 50,
        canExport: true,
        canPromoteContent: true,
        canDeactivateAccount: true,
        features: [
          {
            unlock: true,
            content: "Weekly Planner"
          },
          {
            unlock: true,
            content: "15 Rss Feeds"
          },
          {
            unlock: true,
            content: "15 Custom tags"
          },
          {
            unlock: true,
            content: "50 Read later"
          },
          {
            unlock: true,
            content: "Export content to CSV"
          },
          {
            unlock: true,
            content: "Deactivate account option"
          },
          {
            unlock: true,
            content: "Blue tick"
          }
        ]
      },
      {
        id: 4,
        stripe_id: "prod_OvWWY1ejPPGXGD",
        price_id_month: "price_1O7fTTHpvCWGf2YPPsQ6vz5i",
        price_id_year: "price_1O7fTTHpvCWGf2YPi2yrOzfy",
        title: "Premium",
        description: " Indulge in the epitome of luxury and exclusivity with our Premium plan crafted for those who seek the extraordinary",
        costs: {
          month: 19.99,
          year: 199.99,
        },
        rss: 30,
        tags: 30,
        readLater: 100,
        canExport: true,
        canPromoteContent: true,
        canDeactivateAccount: true,
        features: [
          {
            unlock: true,
            content: "Weekly Planner"
          },
          {
            unlock: true,
            content: "30 Rss Feeds"
          },
          {
            unlock: true,
            content: "30 custom tags"
          },
          {
            unlock: true,
            content: "100 Read later"
          },
          {
            unlock: true,
            content: "Export content to CSV"
          },
          {
            unlock: true,
            content: "Deactivate account option"
          },
          {
            unlock: true,
            content: "Blue tick"
          }
        ]
      }
    ],
  }),
})
