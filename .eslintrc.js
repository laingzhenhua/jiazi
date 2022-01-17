module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "plugin:vue/essential",
        // '@vue/standard'
    ],
    parserOptions: {
        parser: "babel-eslint",
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        // 'semi': ['warn', 'always'], //启用
        // 'space-before-function-paren': 'off',
        "vue/script-indent": [
            "error",
            4,
            {
                "baseIndent": 1,
                "switchCase": 1,
            },
        ],
    },
    overrides: [
        {
            'files': ['*.vue'],
            'rules': {'indent': 'off'}
        }
    ]
};
