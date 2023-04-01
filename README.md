# Task it easy

A offline-first task management app. The readme **still not finished**, if you want to know more details go to the [Task it easy about page](https://task-it-easy-beta.netlify.app/about/get-started/the-project).

#### 🤔 **Why build yet another task management app?**

Many online tools out there offer a good amount of features and user experience before the paywall. However, the fact that they are server-first just doesn't feel right.

That's why I decided to start Task it Easy, an offline-first task management app that is totally free, anonymous, and open-source. This app has three fundamental directions:

-   Offline-first
-   JSON format
-   Make it extensible

The inpiration is Obsidian.md a note-taking app that have similar goals. The experience of using Obsidian for task management feels also wrong because it's primerly a note-taking app, so all plugins made feels not optimal for this specific solution and task it easy also aims to provide an interface for colaborative work.

#### 💡 How it works

Task it easy primerely works using the IndexedDB API to persist and serach data on the user browser, it can also export data to a `JSON` file or even integrate with `Google Sheets` to store and get your data.

```diff
- Deleting your browser data also deletes taskt it easy data.
```

#### ➡️ Future

This session is dedicated to elaborate future features of task it easy

##### **1. Electron support**

To be a true offline-first app, we need to get rid of browsers.

##### **2. Task it easy server**

A possible solution to share data is to have your own server. An easy-to-use CLI application that runs a server in the background that stores and serves data using endpoints can be a good idea. The implementations could be in many languages and have different approaches as long as it implements all endspoints needed.

##### **3. Teams**

Some task/project management services on web charges every person of the team to use their infrastructure. Using a common server for everyone is more cheap and effective.

##### **4. Shared spaces**

Sometimes you just need to share your space with someone, this could be a reality with a server.

##### **5. Natural Processing Language for create tasks**

Now creating tasks still easy, but it could be more pleasant to just write "Check this every Sunday" then task it easy understands everything.

##### **6. Keyboard shortcuts**

Improving the produtivity and the user experience.

##### **7. Plugins Interface**

Instead of implmenting and making PR's people could just write and realease their own plugins.

##### **8. Calendar and Habits**

Calendars are important piece of the workflow, a one place that centralize all your actions it's a really good idea.

#### 🧩 Extensions VS Code

-   [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
