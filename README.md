# Introduction

Openboxes mobile app built using React Native.

## ⭐ Prerequisites

**iOS** : XCode(10.2) onwards

**Android** : Android Studio(3.4) with gradle(5.1.1) onwards

**Editor** : Visual Studio Code

## 🔩 How to Setup Project

**Step 1:** Clone this repository.
`git clone git@github.com:openboxes/openboxes-mobile.git`

**Step 2:** Go to the cloned repo and open in terminal.

**Step 3:** Install the dependencies with `$ npm i or yarn install`

**Step 4:** Run the npm script to install the cocoapods `$ npm run pod install`

## 🕵️ How to Run the Project

1. Install dependencies
   ```bash
   yarn install
   ```
1. Run and build for either OS. (Replace `npm` with `npx` if you don't have these packages installed globally, [reference](https://www.freecodecamp.org/news/npm-vs-npx-whats-the-difference/.))
   - Run iOS app
     ```bash
     npx react-native run-ios
     yarn ios
     ```
     To run in a specific simulators, run
     ```bash
     npx react-native run-ios --simulator="iPhone 11 Pro (14.4)"
     ```
   - Run Android app
     - Start Genymotion or Native emulator
     ```bash
     npm run android // runs -debug by default
     yarn android
     ```
     To run a specific environment (not in package.json yet):
     ```bash
     npm run android -debug // .env
     npm run android -release // .env
     ```
   - Note: These npm scripts will lint your code first. If there are no lint errors, then it will run the iOS or Android app. Otherwise it will show the lint errors in the terminal.

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

   - The linting rules are from JS Standard and React-Standard. [Regular JS errors can be found with descriptions here](http://eslint.org/docs/rules/), while [React errors and descriptions can be found here](https://github.com/yannickcr/eslint-plugin-react).

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

[**Sentry**](https://sentry.io/organizations/openboxes/projects/openboxes-mobile) - for error logging

## Changing App Name

### Android

1. Navigate to `android/app/src/main/res/values/strings.xml`
2. Update the `app_name` value:

```xml
<resources>
    <string name="app_name">openboxes_mobile_o</string>
</resources>
```

### iOS

1. Open `ios/openboxes_mobile_o/Info.plist`
2. Update the `CFBundleDisplayName` value:

```xml
<key>CFBundleDisplayName</key>
<string>Your New App Name</string>
```

## Changing App Name

### Android

1. Navigate to `android/app/src/main/res/values/strings.xml`
2. Update the `app_name` value:

```xml
<resources>
    <string name="app_name">openboxes_mobile_o</string>
</resources>
```

### iOS

1. Open `ios/openboxes_mobile_o/Info.plist`
2. Update the `CFBundleDisplayName` value:

```xml
<key>CFBundleDisplayName</key>
<string>Your New App Name</string>
```

## Changing App Icon

### Step 1: Prepare Your Master Icon

**Create a 1024x1024 PNG image** of your app icon. This will be your master icon from which all other sizes will be generated.

**Requirements:**

- Format: PNG
- Size: 1024x1024 pixels
- Background: Transparent or solid (depending on your design)
- Quality: High resolution, clean design

### Step 2: Generate Icon Sizes

1. Go to [https://www.appicon.co/](https://www.appicon.co/)
2. Upload your 1024x1024 PNG image
3. Select both **iOS** and **Android** platforms
4. Click **Generate** to create all required sizes
5. Download the generated zip file

### Android

#### Icon Requirements

After generating icons with AppIcon.co, you'll need these sizes in their respective directories under `android/app/src/main/res/`. All icon files must be named `ic_launcher_foreground.png` and placed in their respective directories:

| Directory        | Size    | Purpose                        |
| ---------------- | ------- | ------------------------------ |
| `mipmap-mdpi`    | 48x48   | Medium density                 |
| `mipmap-hdpi`    | 72x72   | High density                   |
| `mipmap-xhdpi`   | 96x96   | Extra high density             |
| `mipmap-xxhdpi`  | 144x144 | Extra extra high density       |
| `mipmap-xxxhdpi` | 192x192 | Extra extra extra high density |

#### How to Add Android Icons

1. **Extract the downloaded zip** from AppIcon.co
2. **Navigate to the Android folder** in the extracted files
3. **Copy the mipmap folders** from the extracted Android folder into `android/app/src/main/res/` in your project
4. **Copy and rename the icons:**

```bash
   # Navigate to Android res directory
   cd android/app/src/main/res/

   # Copy ic_launcher to ic_launcher_foreground in each directory
  cp mipmap-mdpi/ic_launcher.png mipmap-mdpi/ic_launcher_foreground.png
  cp mipmap-hdpi/ic_launcher.png mipmap-hdpi/ic_launcher_foreground.png
  cp mipmap-xhdpi/ic_launcher.png mipmap-xhdpi/ic_launcher_foreground.png
  cp mipmap-xxhdpi/ic_launcher.png mipmap-xxhdpi/ic_launcher_foreground.png
  cp mipmap-xxxhdpi/ic_launcher.png mipmap-xxxhdpi/ic_launcher_foreground.png

  # Copy ic_launcher to logo_splash in each directory
  cp mipmap-mdpi/ic_launcher.png mipmap-mdpi/logo_splash.png
  cp mipmap-hdpi/ic_launcher.png mipmap-hdpi/logo_splash.png
  cp mipmap-xhdpi/ic_launcher.png mipmap-xhdpi/logo_splash.png
  cp mipmap-xxhdpi/ic_launcher.png mipmap-xxhdpi/logo_splash.png
  cp mipmap-xxxhdpi/ic_launcher.png mipmap-xxxhdpi/logo_splash.png
```

5. **Clean the project**:

```bash
cd android && ./gradlew clean && cd ..
```

6. **Rebuild and run**:

```bash
npm run android && npx react-native run-android
```
