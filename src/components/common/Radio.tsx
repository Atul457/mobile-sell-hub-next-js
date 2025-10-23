import { Box } from '@mui/material';

interface Props {
    selected: boolean;
    type?: 'addOns' | 'payment' | 'default';
}

const Radio = (props: Props) => {
    const { selected, type } = props
    return (
        <Box sx={{
            marginRight: 1.5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {selected && type == 'addOns' ?
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="icon icon-tabler icons-tabler-filled icon-tabler-circle-check"
                    viewBox="0 0 24 24"
                    color='#002047'
                >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M17 3.34a10 10 0 11-14.995 8.984L2 12l.005-.324A10 10 0 0117 3.34zm-1.293 5.953a1 1 0 00-1.32-.083l-.094.083L11 12.585l-1.293-1.292-.094-.083a1 1 0 00-1.403 1.403l.083.094 2 2 .094.083a1 1 0 001.226 0l.094-.083 4-4 .083-.094a1 1 0 00-.083-1.32z"></path>
                </svg>
                : selected && type == 'payment' ?
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        className="icon icon-tabler icons-tabler-filled icon-tabler-circle"
                        viewBox="0 0 24 24"
                        color='#002047'
                    >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path d="M7 3.34a10 10 0 11-4.995 8.984L2 12l.005-.324A10 10 0 017 3.34z"></path>
                    </svg>
                    :
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-circle"
                        viewBox="0 0 24 24"
                        color='#002047'
                    >
                        <path stroke="none" d="M0 0h24v24H0z"></path>
                        <path d="M3 12a9 9 0 1018 0 9 9 0 10-18 0"></path>
                    </svg>
            }
        </Box>
    )
}

export default Radio
