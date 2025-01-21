import { defineStore } from "pinia"

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [
      {
        userId: 1,
        username: "SoCrafty",
        certified: true,
        pdp: 'https://i.pravatar.cc/100?img=11',
        followers: 24,
        following: 103,
        description: `Hi, I'm Amicole! I'm an experienced project manager with a track record of successfully managing complex projects. I'm skilled in planning, scheduling, and budgeting and am comfortable working with cross-functional teams. I'm a natural leader and always looking for ways to motivate and inspire my team. In my free time, I enjoy playing soccer and traveling.`,
        wallpaper: 'https://images.unsplash.com/photo-1508247967583-7d982ea01526?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80'
      },
      {
        userId: 2,
        username: "Oskava",
        certified: false,
        pdp: 'https://i.pravatar.cc/100?img=0',
        followers: 2459,
        following: 1,
        description: `Hey, I'm Oska! I'm a talented writer with a passion for storytelling. I've written for a variety of publications, including newspapers, magazines, and websites. I'm skilled in research and interviews and have a knack for finding the most interesting and compelling stories. In my free time, I enjoy hiking and practicing yoga.`,
        wallpaper: 'https://images.unsplash.com/photo-1684610527815-4065010f393e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2832&q=80'
      },
      {
        userId: 3,
        username: "Maëve",
        certified: false,
        pdp: 'https://i.pravatar.cc/100?img=1',
        followers: 9,
        following: 18,
        description: `Hello, I'm Maëve! I'm a dedicated teacher with a passion for helping my students reach their full potential. I have a master's degree in education and have been teaching for over 15 years. I'm patient and empathetic, and I strive to create a positive and engaging learning environment. In my free time, I enjoy hiking and reading.`,
        wallpaper: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      },
      {
        userId: 4,
        username: "Mickaël J",
        certified: false,
        pdp: 'https://i.pravatar.cc/100?img=2',
        followers: 12,
        following: 987,
        description: `Hi there, I'm Mick! I'm a skilled financial analyst with experience in budgeting, forecasting, and financial modeling. I've worked with a variety of companies, from small startups to large corporations, and I'm comfortable working with complex financial data. I'm detail-oriented and always looking for ways to improve processes and optimize results. Outside of work, I enjoy playing guitar and volunteering at my local animal shelter.`,
        wallpaper: 'https://images.unsplash.com/photo-1564509261027-29e141e2c598?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kZXx8fHx8fDE2ODUzMTMxOTc&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900'
      },
      {
        userId: 5,
        certified: false,
        username: 'John Doe',
        pdp: 'https://i.pravatar.cc/100?img=3',
        followers: 34,
        following: 18,
        description: `Hi, I'm John! I'm a passionate software engineer with over 5 years of experience in developing web applications. I've worked with several programming languages and frameworks, including Java, React, and Angular. When I'm not coding, I enjoy hiking and playing basketball.`,
        // wallpaper: 'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyfHx8fHx8MTY4NTMxMjg4Nw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900'
        wallpaper: 'https://images.unsplash.com/photo-1684289496952-f061ced830e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      },
      {
        userId: 6,
        certified: true,
        username: 'Jane Doe',
        pdp: 'https://i.pravatar.cc/100?img=4',
        followers: 12678,
        following: 126,
        description: '',
        wallpaper: 'https://images.unsplash.com/photo-1514227765494-1bbd6ba05916?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyfHx8fHx8MTY4NTMxMjk4OQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900'
      },
      {
        userId: 7,
        certified: false,
        username: 'Anna Polla',
        pdp: 'https://i.pravatar.cc/100?img=5',
        followers: 909,
        following: 304,
        description: `Hey there, I'm Anna! I'm a creative graphic designer with a keen eye for detail. I've worked with a variety of clients to create logos, brochures, and websites. I'm proficient in Adobe Creative Suite and always stay up-to-date with the latest design trends. Outside of work, I enjoy painting and traveling.`,
        wallpaper: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyfHx8fHx8MTY4NTMxMzA4Ng&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=900'
      },
    ]
  }),
})
