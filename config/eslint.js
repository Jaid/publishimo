const OFF = 0
const WARN = 1
const ERROR = 2

const styleRules = {
  "new-cap": WARN,
  "no-array-constructor": WARN,
  "no-multi-assign": WARN,
  "no-multiple-empty-lines": ERROR,
  "no-nested-ternary": WARN,
  "no-trailing-spaces": WARN,
  "no-underscore-dangle": WARN,
  "no-unneeded-ternary": WARN,
  "no-whitespace-before-property": WARN,
  "object-curly-newline": [
    WARN,
    {
      ObjectExpression: {
        consistent: true,
        minProperties: 2,
        multiline: true
      },
      ObjectPattern: "never"
    }
  ],
  "object-curly-spacing": WARN,
  "object-property-newline": WARN,
  "one-var": [WARN, "never"],
  "operator-linebreak": [WARN, "before"],
  "padded-blocks": [
    WARN,
    {
      blocks: "never",
      classes: "always",
      switches: "never"
    }
  ],
  "padding-line-between-statements": [
    ERROR,
    {
      blankLine: "always",
      prev: "multiline-block-like",
      next: "block-like"
    }
  ],
  "space-before-blocks": WARN,
  "space-before-function-paren": [WARN, "never"],
  "space-in-parens": WARN,
  "space-infix-ops": WARN,
  "spaced-comment": WARN,
  "switch-colon-spacing": WARN,
  "template-tag-spacing": ERROR,
  "array-bracket-newline": [
    WARN,
    {multiline: true}
  ],
  "array-bracket-spacing": WARN,
  "array-element-newline": [WARN, "consistent"],
  "block-spacing": WARN,
  "brace-style": WARN,
  "comma-dangle": [WARN, "never"],
  "comma-spacing": WARN,
  "comma-style": WARN,
  "computed-property-spacing": WARN,
  curly: [WARN, "all"],
  "dot-location": [WARN, "property"],
  "dot-notation": WARN,
  "func-call-spacing": WARN,
  "func-style": [
    WARN,
    "expression",
    {
      allowArrowFunctions: true
    }
  ],
  "function-paren-newline": [WARN, "never"],
  "implicit-arrow-linebreak": WARN,
  indent: [WARN, 2],
  "jsx-quotes": WARN,
  "key-spacing": WARN,
  "keyword-spacing": WARN,
  "linebreak-style": WARN,
  "lines-around-comment": WARN,
  "lines-between-class-members": WARN,
  "multiline-comment-style": WARN,
  quotes: WARN,
  "arrow-body-style": [WARN, "as-needed"],
  "arrow-parens": [WARN, "as-needed"],
  "arrow-spacing": WARN,
  "template-curly-spacing": WARN,
  "rest-spread-spacing": WARN,
  "yield-star-spacing": WARN,
  "quote-props": [WARN, "as-needed"]
}

const esRules = {
  "constructor-super": ERROR,
  "no-class-assign": ERROR,
  "no-dupe-class-members": ERROR,
  "no-new-symbol": ERROR,
  "no-const-assign": ERROR,
  "no-this-before-super": ERROR,
  "no-useless-computed-key": WARN,
  "no-useless-constructor": WARN,
  "no-useless-rename": WARN,
  "no-var": ERROR,
  "object-shorthand": WARN,
  "prefer-spread": WARN,
  "prefer-template": WARN,
  "require-yield": WARN,
  "prefer-destructuring": [
    WARN, {
      array: false // https://eslint.org/docs/rules/prefer-destructuring#when-not-to-use-it
    }
  ],
  "array-callback-return": WARN,
  "callback-return": WARN,
  eqeqeq: [ERROR, "smart"],
  "getter-return": WARN,
  "no-alert": WARN,
  "no-buffer-constructor": ERROR,
  "no-caller": ERROR,
  "no-compare-neg-zero": WARN,
  "no-cond-assign": WARN,
  "no-delete-var": ERROR,
  "no-dupe-args": ERROR,
  "no-dupe-keys": ERROR,
  "no-duplicate-case": ERROR,
  "no-empty-character-class": WARN,
  "no-empty-pattern": WARN,
  "no-eval": ERROR,
  "no-ex-assign": ERROR,
  "no-extra-bind": WARN,
  "no-extra-boolean-cast": WARN,
  "no-extra-label": WARN,
  "no-extra-semi": WARN,
  "no-fallthrough": WARN,
  "no-func-assign": WARN,
  "no-global-assign": WARN,
  "no-implicit-coercion": WARN,
  "no-inner-declarations": WARN,
  "no-invalid-regexp": ERROR,
  "no-irregular-whitespace": WARN,
  "no-iterator": ERROR,
  "no-label-var": WARN,
  "no-mixed-requires": ERROR,
  "no-multi-spaces": WARN,
  "no-multi-str": ERROR,
  "no-new": WARN,
  "no-new-func": ERROR,
  "no-new-require": ERROR,
  "no-obj-calls": WARN,
  "no-octal": ERROR,
  "no-path-concat": ERROR,
  "no-proto": WARN,
  "no-redeclare": WARN,
  "no-regex-spaces": WARN,
  "no-return-await": ERROR,
  "no-self-assign": ERROR,
  "no-self-compare": ERROR,
  "no-sequences": ERROR,
  "no-shadow": WARN,
  "no-sparse-arrays": WARN,
  "no-throw-literal": ERROR,
  "no-unexpected-multiline": WARN,
  "no-unreachable": WARN,
  "no-unsafe-finally": WARN,
  "no-unsafe-negation": WARN,
  "no-unused-labels": WARN,
  "no-unused-vars": WARN,
  "no-useless-call": WARN,
  "no-useless-concat": WARN,
  "no-useless-escape": WARN,
  "no-useless-return": WARN,
  "no-void": WARN,
  "prefer-promise-reject-errors": WARN,
  radix: WARN,
  "require-await": WARN,
  "use-isnan": ERROR,
  "valid-typeof": WARN,
  yoda: ERROR
}

const pluginPromiseRules = {
  "promise/catch-or-return": ERROR,
  "promise/no-return-wrap": WARN,
  "promise/param-names": ERROR,
  "promise/no-promise-in-callback": WARN,
  "promise/no-callback-in-promise": WARN,
  "promise/avoid-new": WARN,
  "promise/no-return-in-finally": WARN,
  "promise/prefer-await-to-callbacks": WARN
}

const regexRules = {
  "optimize-regex/optimize-regex": WARN
}

module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 10,
    sourceType: "module"
  },
  plugins: ["promise", "optimize-regex"],
  rules: Object.assign({},
    esRules,
    styleRules,
    regexRules,
    pluginPromiseRules)
}
