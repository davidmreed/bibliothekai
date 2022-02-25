module.exports = {
    preset: '@lwc/jest-preset',
    moduleNameMapper: {
        '^(my-namespace)/(.+)$': '<rootDir>/path/to/my/modules/$1/$2/$2'
    }
};
