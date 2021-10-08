module.exports = {
    mode: 'jit',
    purge: [
        './src/**/*.{js,ts,jsx,tsx}'
    ],
    plugins: [
        require('daisyui')
    ],

    // config (optional)
    daisyui: {
      themes: [
      {
        'heartdrops': {                          /* your theme name */
           'primary' : '#5200AD',           /* Primary color */
           'primary-focus' : '#390079',     /* Primary color - focused */
           'primary-content' : '#ffffff',   /* Foreground content color to use on primary color */

           'secondary' : '#E800F6',         /* Secondary color */
           'secondary-focus' : '#C900D5',   /* Secondary color - focused */
           'secondary-content' : '#003F50', /* Foreground content color to use on secondary color */

           'accent' : '#01C6FA',            /* Accent color */
           'accent-focus' : '#03A6D2',      /* Accent color - focused */
           'accent-content' : '#ffffff',    /* Foreground content color to use on accent color */

           'neutral' : '#3d4451',           /* Neutral color */
           'neutral-focus' : '#2a2e37',     /* Neutral color - focused */
           'neutral-content' : '#ffffff',   /* Foreground content color to use on neutral color */

           'base-100' : '#ffffff',          /* Base color of page, used for blank backgrounds */
           'base-200' : '#f9fafb',          /* Base color, a little darker */
           'base-300' : '#d1d5db',          /* Base color, even more darker */
           'base-content' : '#1f2937',      /* Foreground content color to use on base color */

           'info' : '#01C6FA',              /* Info */
           'success' : '#FE0000',           /* Success */
           'warning' : '#ff9900',           /* Warning */
           'error' : '#ff9900',             /* Error */
        },
      },
    {
      extend: {
        boxShadow: {
          blue: '0 4px 14px 0 rgba(19, 51, 81, 0.39)',
        }
      }
    }
    ],
    },
}
