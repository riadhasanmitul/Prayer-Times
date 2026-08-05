module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json', '.svg'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@store': './src/store',
          '@types': './src/types',
          '@theme': './src/theme',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@native': './src/native',
          '@prayer': './src/prayer',
          '@data': './src/data',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
