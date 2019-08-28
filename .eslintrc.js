module.exports = {
  root: true,
  extends: [
    'wesbos',
    '@react-native-community'
  ],
  "rules": {
    "no-console": 2,
    "no-shadow": "off",
    "prettier/prettier": [
      "error",
      {
        "trailingComma": "es5",
        "singleQuote": true,
        "printWidth": 120,
        "tabWidth": 2,
      }
    ]
  }
};