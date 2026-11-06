const { getDefaultConfig } = require('metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true
        }
      })
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      // Native build output churns rapidly during Android/iOS builds and is never bundled by
      // Metro; watching it races with Gradle/Xcode and can crash the watcher (ENOENT on a
      // directory that's created/removed mid-build, e.g. merged_native_libs/.../armeabi-v7a).
      blockList: exclusionList([
        /android\/app\/build\/.*/,
        /android\/build\/.*/,
        /android\/\.gradle\/.*/,
        /ios\/build\/.*/,
        /ios\/Pods\/.*/
      ])
    }
  };
})();
