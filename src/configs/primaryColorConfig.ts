export type PrimaryColorConfig = {
    name?: string;
    light?: string;
    main: string;
    dark?: string;
};

// Dark / Gray-based palette
const primaryColorConfig: PrimaryColorConfig[] = [
    {
        name: 'primary-1',
        light: '#1C1C1C', // lighter charcoal
        main: '#0F0F0F', // deep black
        dark: '#000000' // pure black
    },
    {
        name: 'primary-2',
        light: '#2A2A2A', // medium gray
        main: '#1E1E1E', // darker neutral gray
        dark: '#141414' // near-black tone
    },
    {
        name: 'primary-3',
        light: '#3B3B3B', // softer gray (card backgrounds)
        main: '#2C2C2C', // balanced gray (containers)
        dark: '#1E1E1E' // base background gray
    },
    {
        name: 'primary-4',
        light: '#4A4A4A', // muted text gray
        main: '#3A3A3A', // neutral divider gray
        dark: '#2A2A2A' // strong contrast section gray
    },
    {
        name: 'primary-5',
        light: '#5A5A5A', // medium-light gray
        main: '#4A4A4A', // regular UI gray
        dark: '#3A3A3A' // slightly darker for hover states
    }
];

export default primaryColorConfig;
