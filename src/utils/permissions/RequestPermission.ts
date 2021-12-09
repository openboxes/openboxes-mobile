// import * as ExpoPermissions from 'expo-permissions';
// import showPopup from '../../components/Popup';
// import {Linking, Platform} from 'react-native';
// import * as IntentLauncher from 'expo-intent-launcher';
// import * as Application from 'expo-application';
//
// export enum PermissionType {
//   CAMERA,
// }
//
// export interface PermissionRequest {
//   type: PermissionType;
//   reason: string;
//   notGrantedErrorMessage: string;
// }
//
// export function requestPermission(
//   request: PermissionRequest,
// ): Promise<boolean> {
//   return new Promise<boolean>(async (resolve, reject) => {
//     const status = await getPermissionStatus(request.type);
//     if (status.granted) {
//       resolve(true);
//       return;
//     }
//     if (status.canAskAgain) {
//       const rationaleAccepted = await showPermissionRationale(request.reason);
//       if (rationaleAccepted) {
//         const granted = await askPermission(request.type);
//         if (!granted) {
//           showNotGrantedErrorMessage(request.notGrantedErrorMessage);
//         }
//         resolve(granted);
//       } else {
//         showNotGrantedErrorMessage(request.notGrantedErrorMessage);
//         resolve(false);
//       }
//     } else {
//       await openPermissionSettingsMenu();
//       const newStatus = await getPermissionStatus(request.type);
//       if (!newStatus.granted) {
//         showNotGrantedErrorMessage(request.notGrantedErrorMessage);
//       }
//       resolve(newStatus.granted);
//     }
//   });
// }
//
// function getPermissionStatus(
//   type: PermissionType,
// ): Promise<ExpoPermissions.PermissionResponse> {
//   const expoPermissionType = getExpoPermissionType(type);
//   return ExpoPermissions.getAsync(expoPermissionType);
// }
//
// function showPermissionRationale(reason: string): Promise<boolean> {
//   return showPopup({
//     message: reason,
//     title: 'Permission required',
//     positiveButtonText: 'Allow',
//     negativeButtonText: 'Deny',
//   });
// }
//
// function askPermission(type: PermissionType): Promise<boolean> {
//   const expoPermissionType = getExpoPermissionType(type);
//   return ExpoPermissions.askAsync(expoPermissionType).then(
//     result => result.granted,
//   );
// }
//
// function showNotGrantedErrorMessage(message: string) {
//   (async () => {
//     await showPopup({
//       message: message,
//     });
//   })();
// }
//
// function openPermissionSettingsMenu(): Promise<void> {
//   if (Platform.OS === 'ios') {
//     return Linking.openURL('app-settings:');
//   } else {
//     return IntentLauncher.startActivityAsync(
//       IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
//       {
//         data: `package:${Application.applicationId}`,
//       },
//     ).then(result => undefined);
//   }
// }
//
// function getExpoPermissionType(
//   type: PermissionType,
// ): ExpoPermissions.PermissionType {
//   switch (type) {
//     case PermissionType.CAMERA:
//       return ExpoPermissions.CAMERA;
//     default:
//       throw Error(`Unexpected type = ${type}`);
//   }
// }
