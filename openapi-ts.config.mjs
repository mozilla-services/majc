export default {
  input: 'packages/heyapi/mars.yml',
  output: 'packages/heyapi/src',
  plugins: [{
    name: '@hey-api/client-fetch',
    bundle: true,
  }],
}
