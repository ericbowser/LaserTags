/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './build/*.{js, html}',
        './public/*.html',
        './src/**/*.js',
        './src/components/*.js',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'back': "url('/src/assets/circle-scatter-haikei.svg')",
            },
            anotherBackgrounImage: {
                'back': "url('')",
            },
        },
    },
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
    ],
}

