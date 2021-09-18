# Introduction

Openboxes mobile app built using React Native.

## Getting Started

- Checkout the source code
    ```
    git clone git@github.com:openboxes/openboxes-mobile.git
    ```
- Download app dependencies
    ```
    cd openboxes-mobile
    yarn install
    ```
- At this point the necessary dependencies would have been downloaded and further development can happen.
  
## Environment setup
Follow the instructions given [here](https://reactnative.dev/docs/environment-setup#development-os) to set up your 
environment depending on the OS running on your machine(Windows, MacOS, Linux), and the mobile device you want to 
run the app on(Android, iOS).

### Set Java 8 as default JRE
```
$ sudo update-alternatives --config java
[sudo] password for jmiranda: 
There are 5 choices for the alternative java (providing /usr/bin/java).

  Selection    Path                                            Priority   Status
------------------------------------------------------------
  0            /usr/lib/jvm/java-11-openjdk-amd64/bin/java      1111      auto mode
  1            /usr/lib/jvm/java-11-openjdk-amd64/bin/java      1111      manual mode
* 2            /usr/lib/jvm/java-7-openjdk-amd64/jre/bin/java   1071      manual mode
  3            /usr/lib/jvm/java-7-oracle/jre/bin/java          1073      manual mode
  4            /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java   1081      manual mode
  5            /usr/lib/jvm/java-9-openjdk-amd64/bin/java       1091      manual mode
  
Press <enter> to keep the current choice[*], or type selection number: 4
update-alternatives: using /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java to provide /usr/bin/java (java) in manual mode
```
### Set JAVA_HOME to Java 8
```
export JAVA_HOME = /usr/lib/jvm/java-8-openjdk-amd64
```

### Set Android Home and PATH environment variables
```
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Check version of Android Debugger
```
$ adb --version
Android Debug Bridge version 1.0.41
Version 31.0.3-7562133
Installed as /home/jmiranda/Android/Sdk/platform-tools/adb
```

### Connect to Android phone over USB
I think we should see the Android device in the list of emulators, but I don't see mine yet :(
```
$ emulator -list-avds
Nexus_5X_API_28
TestAVD
```

### Check that an EnvironmentActual.ts exists and has API_BASE_URL defined
```
$ cat app/utils/EnvironmentActual.ts 
import {Environment} from "./Environment";
export const EnvironmentActual: Environment = {
  API_BASE_URL: "https://openboxes.ngrok.io/openboxes/api"
}
```

### Start Metro server 
The Metro server is supposed to start when running the yarn android command, but it was not working for me on 
Ubuntu 18.04. Therefore I had to start it up myself. See this issue for more details https://github.com/openboxes/openboxes-mobile/issues/10
```
$ npx react-native start
```


## Build and run the app

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
