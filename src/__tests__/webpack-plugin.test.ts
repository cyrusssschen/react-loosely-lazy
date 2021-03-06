import webpack from 'webpack';
import { ReactLooselyLazyPlugin, getBundleFiles } from '../webpack';
import path from 'path';

const manifestFilename = 'rll-manifest.json';
const config = {
  entry: {
    main: path.join(__dirname, '__fixtures__/webpack/app/index.js'),
  },
  output: {
    path: path.join(__dirname, '__fixtures__/webpack/output'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/output/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['@babel/preset-env', { modules: false }],
              '@babel/preset-react',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      test: path.resolve(__dirname, 'webpack'),
    },
  },
  plugins: [
    new ReactLooselyLazyPlugin({
      filename: manifestFilename,
    }),
  ],
};

describe('plugin functionality', () => {
  const expectedManifest = {
    react: {
      id: 0,
      name: './node_modules/react/index.js',
      file: 'main.js',
      publicPath: '/output/main.js',
    },
    'object-assign': {
      id: 1,
      name: './node_modules/object-assign/index.js',
      file: 'main.js',
      publicPath: '/output/main.js',
    },
    'react-dom': {
      id: 2,
      name: './node_modules/react-dom/index.js',
      file: 'main.js',
      publicPath: '/output/main.js',
    },
    './cjs/react.production.min.js': {
      id: 3,
      name: './node_modules/react/cjs/react.production.min.js',
      file: 'main.js',
      publicPath: '/output/main.js',
    },
    './cjs/react-dom.production.min.js': {
      id: 4,
      name: './node_modules/react-dom/cjs/react-dom.production.min.js',
      file: 'main.js',
      publicPath: '/output/main.js',
    },
    scheduler: {
      id: 5,
      name: './node_modules/scheduler/index.js',
      file: 'main.js',
      publicPath: '/output/main.js',
    },
    './cjs/scheduler.production.min.js': {
      id: 6,
      name: './node_modules/scheduler/cjs/scheduler.production.min.js',
      file: 'main.js',
      publicPath: '/output/main.js',
    },
    './components/dynamic.js': {
      id: 8,
      name: './src/__tests__/__fixtures__/webpack/app/components/dynamic.js',
      file: '1.js',
      publicPath: '/output/1.js',
    },
    './components/lazy.js': {
      id: 9,
      name: './src/__tests__/__fixtures__/webpack/app/components/lazy.js',
      file: '2.js',
      publicPath: '/output/2.js',
    },
  };

  it('should create the manifest', done => {
    webpack(config, function (err, stats) {
      const asset = stats.compilation.assets[manifestFilename];
      const manifest = JSON.parse(asset.source());

      expect(err).toBeNull();
      expect(manifest).toEqual(expect.objectContaining(manifest));

      done();
    });
  });

  it('should get the module files based on the moduleIds provided', () => {
    const result = getBundleFiles(expectedManifest, ['react', 'react-dom']);

    expect(result).toEqual(expect.arrayContaining(['main.js', 'main.js']));
  });
});
