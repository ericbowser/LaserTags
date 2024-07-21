/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './build/*.{js, html}',
        './public/*.html',
        './src/**/*.js',
        './src/components/*.js',
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
    ],
}

