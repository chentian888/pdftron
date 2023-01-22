module.exports = {
  mode: 'jit',
  content: [
    './src/pages/**/*.tsx',
    './src/components/**/*.tsx',
    './src/layouts/**/*.tsx',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      width: {
        1200: '1200px',
      },
    },
  },
};
