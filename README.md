# Introduction

Openboxes mobile app built using React Native.


## ⭐ Prerequisites

**iOS** : XCode(10.2) onwards

**Android** : Android Studio(3.4) with gradle(5.1.1) onwards

**Editor** : Visual Studio Code


## 🔩 How to Setup Project

**Step 1:** Clone this repository.
    ```
    git clone git@github.com:openboxes/openboxes-mobile.git 
    ```

**Step 2:** Go to the cloned repo and open in terminal.

**Step 3:** Install the dependencies with `$ npm i or yarn install`

**Step 4:** Run the npm script to install the cocoapods `$ npm run pod install`

## 🕵️ How to Run the Project

1. Install dependencies
    ```bash
    yarn install
    ```
1. Run and build for either OS. (Replace `npm` with `npx` if you don't have these packages installed globally, [reference](https://www.freecodecamp.org/news/npm-vs-npx-whats-the-difference/.))
    * Run iOS app
        ```bash
        npx react-native run-ios
        yarn ios
        ```
      To run in a specific simulators, run
      ```bash
      npx react-native run-ios --simulator="iPhone 11 Pro (14.4)"
       ```
    * Run Android app
      * Start Genymotion or Native emulator
      ```bash
      npm run android // runs -debug by default
      yarn android
      ```
      To run a specific environment (not in package.json yet):
      ```bash
      npm run android -debug // .env
      npm run android -release // .env
      ```
    * Note: These npm scripts will lint your code first. If there are no lint errors, then it will run the iOS or Android app. Otherwise it will show the lint errors in the terminal.


## 🧶 Coding Style

This project adheres to Typescript Standard for coding style. To maintain coding standards and follow best practices of react-native, this project also uses [ES6](http://es6-features.org/#Constants), some rules of [eslint-airbnb](https://www.npmjs.com/package/eslint-config-airbnb-typescript), [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) and [eslint-plugin-react-native](https://github.com/intellicode/eslint-plugin-react-native).

**Do not disable lint inside the code. Try to understand the rule and then follow it into your code. Disabling lint will be considered a violation of coding standards. Exceptions will be allowed by the code-reviewer and team lead after understanding the need to ignore lint.**

1. **To Lint**

   - Use the npm script `lint`. To run it
    ```bash
      npm run lint
    ```
2. **Auto Lint on Commit**

   - This is implemented using [husky](https://github.com/typicode/husky). Husky will prevent code commits having lint errors.

3. **Understanding Linting Errors**

   - The linting rules are from JS Standard and React-Standard.  [Regular JS errors can be found with descriptions here](http://eslint.org/docs/rules/), while [React errors and descriptions can be found here](https://github.com/yannickcr/eslint-plugin-react).
  

## 👼🏻 Check that an EnvironmentActual.ts exists and has API_BASE_URL defined
```
$ cat app/utils/EnvironmentActual.ts 
import {Environment} from "./Environment";
export const EnvironmentActual: Environment = {
  API_BASE_URL: "https://openboxes.ngrok.io/openboxes/api"
}
```

## 📜 Start Metro server 
The Metro server is supposed to start when running the yarn android command, but it was not working for me on 
Ubuntu 18.04. Therefore I had to start it up myself. See this issue for more details https://github.com/openboxes/openboxes-mobile/issues/10
```
$ npx react-native start
```

## 🕐 Automated builds 

We are currently using bitrise.io for automated builds.
https://app.bitrise.io/dashboard/builds

### On Android
```
yarn android
```

Depending on whether an Android device is already connected to the machine, it will try running the app on that device,
or it will try launching an emulator.

### On iOS
```
yarn ios
```

<<<<<<< HEAD
## Automated builds 

We are currently using bitrise.io for automated builds.
https://app.bitrise.io/dashboard/builds
=======
[**Sentry**](https://sentry.io/organizations/openboxes/projects/openboxes-mobile) - for error logging

>>>>>>> 066318bb09b5e7fa073028447bd7df3b1737ed16
