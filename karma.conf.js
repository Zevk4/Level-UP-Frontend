module.exports = function(config) {
  config.set({
    basePath: '',
  // Usar Jasmine y webpack para compilar/transpilar los tests
  frameworks: ['jasmine'],
    files: [
      // Incluir únicamente los archivos de prueba; karma-typescript hará el bundle de las dependencias
      { pattern: 'src/**/*.spec.ts' },
      { pattern: 'src/**/*.spec.tsx' }
    ],
    exclude: [],
    // Preprocesar con webpack y sourcemap
    preprocessors: {
      'src/**/*.spec.ts': ['webpack', 'sourcemap'],
      'src/**/*.spec.tsx': ['webpack', 'sourcemap']
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
  // Nivel de log aumentado para diagnóstico en la consola
  logLevel: config.LOG_DEBUG,
  // No observar archivos en modo single-run
  autoWatch: false,
  // Usar Chrome (no headless) para poder ver la consola del navegador y depurar
  browsers: ['Chrome'],
  // Ejecutar una sola vez en esta invocación de diagnóstico
    singleRun: true,
    // Evitar desconexiones al iniciar Chrome en máquinas lentas o CI
    browserDisconnectTimeout: 20000,
    browserNoActivityTimeout: 60000,
    captureTimeout: 120000,
    // Capturar consola del navegador y reenviarla al proceso de Karma
    client: {
      captureConsole: true,
      clearContext: false
    },
    concurrency: Infinity
    ,
    // Usar webpack para bundle/transpile durante las pruebas
    webpack: require('./webpack.test.js'),
    webpackMiddleware: {
      stats: 'errors-only',
      noInfo: true
    },
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text' }
      ]
    }
  });
};