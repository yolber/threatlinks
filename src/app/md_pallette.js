angular.module('myApp', ['ngMaterial']).config(function ($mdThemingProvider, palettes) {
    var customPrimary = {
        '50': '#2cfecd',
        '100': '#12fec7',
        '200': '#01f5bc',
        '300': '#01dca9',
        '400': '#01c295',
        '500': '#01a982',
        '600': '#01906e',
        '700': '#01765b',
        '800': '#015d47',
        '900': '#004434',
        'A100': '#45fed3',
        'A200': '#5efed9',
        'A400': '#78fedf',
        'A700': '#002a20'
    };
    $mdThemingProvider
        .definePalette('customPrimary', 
                        customPrimary);

    var customAccent = {
        '50': '#11524f',
        '100': '#156863',
        '200': '#197d78',
        '300': '#1d928c',
        '400': '#22a7a0',
        '500': '#26bdb5',
        '600': '#3dd8d0',
        '700': '#52dcd5',
        '800': '#68e1da',
        '900': '#7de5df',
        'A100': '#3dd8d0',
        'A200': '#2AD2C9',
        'A400': '#26bdb5',
        'A700': '#92e9e5'
    };
    $mdThemingProvider
        .definePalette('customAccent', 
                        customAccent);

    var customWarn = {
        '50': '#fff1ec',
        '100': '#ffddd3',
        '200': '#ffc9b9',
        '300': '#ffb5a0',
        '400': '#ffa186',
        '500': '#FF8D6D',
        '600': '#ff7953',
        '700': '#ff653a',
        '800': '#ff5120',
        '900': '#ff3d07',
        'A100': '#ffffff',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#ec3400'
    };
    $mdThemingProvider
        .definePalette('customWarn', 
                        customWarn);

    var customBackground = {
        '50': '#737373',
        '100': '#666666',
        '200': '#595959',
        '300': '#4d4d4d',
        '400': '#404040',
        '500': '#333',
        '600': '#262626',
        '700': '#1a1a1a',
        '800': '#0d0d0d',
        '900': '#000000',
        'A100': '#808080',
        'A200': '#8c8c8c',
        'A400': '#999999',
        'A700': '#000000'
    };
    $mdThemingProvider
        .definePalette('customBackground', 
                        customBackground);

   $mdThemingProvider.theme('default')
       .primaryPalette('customPrimary')
       .accentPalette('customAccent')
       .warnPalette('customWarn')
       .backgroundPalette('customBackground')
});