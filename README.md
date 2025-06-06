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

**Step 3:** Install the dependencies with `yarn install`

**Step 4:** Run the npm script to install the cocoapods `yarn pod install`

## 🕵️ How to Run the Project

1. Run and build for either OS. (Replace `npm` with `npx` if you don't have these packages installed globally, [reference](https://www.freecodecamp.org/news/npm-vs-npx-whats-the-difference/.))
   - Run iOS app
     1. Start metro terminal in a separate window
     ```bash
     yarn start
     ```
     2. Compile code and launch a simulator
     ```bash
     yarn ios
     ```
     3. To run in a specific simulator, run
     ```bash
     yarn ios --simulator="iPhone 16 Pro"
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

## App Customization via Branding

This project uses a branding system to allow easy customization of app assets (icons, logos, splash screens) and configurations (like the app display name) for different project builds (e.g., "vipr", "default", etc.).

### Core Concept

You will place all custom assets for a specific brand into a dedicated folder within the `branding/` directory. A script will then copy these assets to the correct locations in the application before you build.

### Step 1: Prepare Your Brand Assets

For each brand you want to create (e.g., "vipr"), you'll need to prepare several assets:

1.  **Master Source Icon (named `splash.png`):**

    - Create a **1024x1024 PNG image**. This will be your primary master source icon.
    - **Name this file `splash.png`**.
    - Place this `splash.png` file directly into your brand's directory (e.g., `branding/vipr/splash.png`).
    - This `splash.png` will be:
      - Uploaded to the icon generator (see next point).
      - Used by the branding script as the source for the application's actual splash screen.
    - **Requirements for this `splash.png` (master source icon):**
      - Format: PNG
      - Size: 1024x1024 pixels
      - Background: Transparent or solid (consider Android adaptive icon needs if using transparency for the foreground layer).
      - Quality: High resolution, clean design.
    - _Note: Using a large 1024x1024 image as the direct source for all splash screen densities (as the script currently does) might increase app size. For optimization, you might later consider providing density-specific splash images or using Android's newer splash screen APIs._

2.  **Generate Platform-Specific App Icons & Initial Store Icons:**

    - Go to an icon generator like [https://www.appicon.co/](https://www.appicon.co/).
    - Upload your **`splash.png`** (the 1024x1024 master source icon you prepared in the previous point).
    - Select both **iOS** (for future use) and **Android** platforms.
    - Click **Generate** and download the generated zip file (e.g., `AppIcons.zip`).
    - **Crucial Step:** Ensure your brand's main directory exists (e.g., `branding/vipr/`).
    - **Extract the entire contents of the downloaded zip file directly into your specific brand's directory** (e.g., into `branding/vipr/`).
      - This will typically create `android/` (containing `mipmap-*` folders with `ic_launcher.png` files) and `ios/Assets.xcassets/` subfolders within your brand directory.
      - The extracted files will also include high-resolution images intended for store listings, such as `appstore.png` (1024x1024) and `playstore.png` (512x512), usually at the root of the extracted content or in a clearly identifiable location.

3.  **Other Brand Assets:**
    - **In-App Logo (`logo.png`):**
      - This is the logo used internally within the application (e.g., on login screen).
      - Prepare a `logo.png` file.
      - Place this directly inside your brand's directory (e.g., `branding/vipr/logo.png`).
      - The branding script will copy this file to replace `src/assets/images/logo.png` in your project.
    - **Configuration File (`settings.json`):**
      - A JSON file to define brand-specific settings. Place this directly inside your brand's directory (e.g., `branding/vipr/settings.json`).
      - It should contain the app's display name:
        ```json
        // Example: branding/vipr/settings.json
        {
          "app_name": "VIPR"
        }
        ```
      - _Note: If your app name contains special XML characters (`&`, `<`, `>`, `"`, `'`) and you are relying on `sed` (the script's primary method), ensure they are XML-escaped in this file (e.g., `My App &amp; Co.`)._

### Step 2: Verify Your Brand's Directory Structure

After preparing and placing all assets, your brand's directory (e.g., `branding/vipr/`) should look similar to this.

| Path within `branding/<brand_name>/`     | Description                                                                                                       | Used by Script? |
| :--------------------------------------- | :---------------------------------------------------------------------------------------------------------------- | :-------------- |
| `android/mipmap-mdpi/ic_launcher.png`    | Android MDPI launcher icon (from AppIcon.co output)                                                               | **Yes**         |
| `android/mipmap-hdpi/ic_launcher.png`    | Android HDPI launcher icon (from AppIcon.co output)                                                               | **Yes**         |
| `android/mipmap-xhdpi/ic_launcher.png`   | Android XHDPI launcher icon (from AppIcon.co output)                                                              | **Yes**         |
| `android/mipmap-xxhdpi/ic_launcher.png`  | Android XXHDPI launcher icon (from AppIcon.co output)                                                             | **Yes**         |
| `android/mipmap-xxxhdpi/ic_launcher.png` | Android XXXHDPI launcher icon (from AppIcon.co output)                                                            | **Yes**         |
| `Assets.xcassets/`                       | iOS icons and assets (from AppIcon.co output)                                                                     | No (Future)     |
| `appstore.png`                           | 1024x1024 icon for iOS App Store submission (typically renamed from AppIcon.co output like `iTunesArtwork.png`)   | No (Manual)     |
| `logo.png`                               | In-app logo, replaces `src/assets/images/logo.png`                                                                | **Yes**         |
| `playstore.png`                          | 512x512 icon for Google Play Store submission (typically renamed from AppIcon.co output like `PlayStoreIcon.png`) | No (Manual)     |
| `settings.json`                          | Configuration file (e.g., for `app_name`)                                                                         | **Yes**         |
| `splash.png`                             | 1024x1024 master source icon, also used as the source for Android splash screens                                  | **Yes**         |

**Important Notes on Asset Usage by the Current Script:**

- The `apply_branding.sh` script currently processes the files marked "Yes" in the table above for Android customization and shared assets.
- Files like `Assets.xcassets/`, `appstore.png`, and `playstore.png` are included in the branding kit for completeness, potential future script enhancements (e.g., iOS support), or manual store submission processes.

**Android Icon Naming:**

- The source files in your `branding/<brand_name>/android/mipmap-*/` directories (from AppIcon.co) **must be named `ic_launcher.png`**.
- The branding script will automatically copy these and rename them to `ic_launcher_foreground.png` in the application's `android/app/src/main/res/mipmap-*/` directories. This `ic_launcher_foreground.png` is typically used for the foreground layer of Android Adaptive Icons.
- The script also copies `branding/<brand_name>/splash.png` (your 1024x1024 master) to `android/app/src/main/res/mipmap-*/logo_splash.png` for each density.

### Step 3: Apply the Branding

1.  Open your terminal in the project root directory.
2.  Run the npm script corresponding to your desired brand. For example, to apply the "vipr" branding:
    ```bash
    npm run branding:vipr
    ```
    This command executes the `scripts/apply_branding.sh vipr` script, which handles:
    - Copying the Android launcher icons (renaming to `ic_launcher_foreground.png`).
    - Copying the splash screen (from `branding/<brand_name>/splash.png`, renaming to `logo_splash.png` for Android).
    - Copying the in-app logo to `src/assets/images/logo.png`.
    - Updating the Android app display name in `strings.xml` using the `app_name` from your brand's `settings.json`.

### Step 4: Clean, Build, and Run Your Application

After applying the branding, follow these steps to see the changes:

1.  **Clean the Android project (Recommended):**
    This helps ensure old cached resources are removed.

    ```bash
    cd android && ./gradlew clean && cd ..
    ```

2.  **Start the Metro Bundler (in one terminal):**
    The Metro bundler is responsible for packaging your JavaScript code and assets. It needs to be running for development.
    Open a new terminal window/tab in your project root and run:

    ```bash
    npx react-native start
    ```

    Keep this terminal window open.

3.  **Run the Application (in another terminal):**
    With the Metro bundler running in one terminal, open a _separate_ terminal window/tab in your project root. Then, run the command to build and install the app on your Android emulator or device. You can use your project's standard command to run on Android (assuming it's defined in your `package.json`):

    ```bash
    npm run android
    ```

4.  **Verify Changes:**
    The application should build and install on your device/emulator.
    - **Launcher Icon & Name:** Check your device's app drawer for the new icon and app name.
    - **Splash Screen:** The new splash screen should appear when the app launches. (Note: Splash screen changes sometimes require a full uninstall and reinstall of the app if cached heavily by the OS or a splash screen library).
    - **In-App Logo:** The new logo should appear where it's used within the app.
    - The Metro bundler will automatically reload the JavaScript and assets. If you have an existing app instance running, it should refresh to reflect the new in-app logo. For launcher icon and app name changes, a fresh install (which running the app typically does) is usually required.
