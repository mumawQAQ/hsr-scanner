import * as React from 'react';
import {useEffect} from 'react';
import {styled} from '@mui/material/styles';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import Autocomplete, {autocompleteClasses, AutocompleteCloseReason} from '@mui/material/Autocomplete';
import ButtonBase from '@mui/material/ButtonBase';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import {RelicType} from "../../types.ts";
import relicUtils from "@/utils/relicUtils.ts";

const labels = Object.values(RelicType);

interface PopperComponentProps {
    anchorEl?: any;
    disablePortal?: boolean;
    open: boolean;
}

const StyledAutocompletePopper = styled('div')(({theme}) => ({
    [`& .${autocompleteClasses.paper}`]: {
        boxShadow: 'none',
        margin: 0,
        color: 'inherit',
        fontSize: 13,
    },
    [`& .${autocompleteClasses.listbox}`]: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 0,
        [`& .${autocompleteClasses.option}`]: {
            padding: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            '&[aria-selected="true"]': {
                backgroundColor: 'transparent',
            },
            [`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focused}[aria-selected="true"]`]:
                {
                    backgroundColor: theme.palette.action.hover,
                },
        },
    },
    [`&.${autocompleteClasses.popperDisablePortal}`]: {
        position: 'relative',
    },
}));

function PopperComponent(props: PopperComponentProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {disablePortal, anchorEl, open, ...other} = props;
    return <StyledAutocompletePopper {...other} />;
}

const StyledPopper = styled(Popper)(({theme}) => ({
    border: `1px solid ${theme.palette.mode === 'light' ? '#e1e4e8' : '#30363d'}`,
    boxShadow: `0 8px 24px rgba(149, 157, 165, 0.2)`,
    borderRadius: 6,
    width: 300,
    zIndex: theme.zIndex.modal,
    fontSize: 13,
    color: theme.palette.mode === 'light' ? '#24292e' : '#c9d1d9',
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
}));


const Button = styled(ButtonBase)(({theme}) => ({
    fontSize: 13,
    width: '100%',
    textAlign: 'left',
    paddingBottom: 8,
    color: theme.palette.mode === 'light' ? '#586069' : '#8b949e',
    fontWeight: 600,
    '&:hover,&:focus': {
        color: theme.palette.mode === 'light' ? '#0366d6' : '#58a6ff',
    },
    '& span': {
        width: '100%',
    },
    '& svg': {
        width: 16,
        height: 16,
    },
}));


const Input = styled(InputBase)(() => ({
    padding: 10,
    width: '100%',
    borderBottom: `1px solid #eaecef`,
}))

interface IValuableSubListProps {
    relicTitle: string;
    mainRelicStats: string;
    valuableSubStats: string[];
}


const ValuableSubList: React.FC<IValuableSubListProps> =
    ({
         valuableSubStats,
         relicTitle,
         mainRelicStats
     }) => {
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const [value, setValue] = React.useState<string[]>(valuableSubStats);
        const [pendingValue, setPendingValue] = React.useState<string[]>([]);


        useEffect(() => {
            setValue(valuableSubStats)
        }, [valuableSubStats])

        const handleClick = (event: React.MouseEvent<HTMLElement>) => {
            setPendingValue(value);
            setAnchorEl(event.currentTarget);
        };

        const handleClose = async () => {
            setValue(pendingValue);
            // update the user's valuable relic sub stats
            const result = await relicUtils.updateRelicRatingValuableSub(relicTitle, mainRelicStats, pendingValue)

            // TODO: show message to user when update relic rating failed
            if (result) {
                console.log("update relic rating success")
            } else {
                console.log("update relic rating failed")
            }
            if (anchorEl) {
                anchorEl.focus();
            }
            setAnchorEl(null);
        };


        const open = Boolean(anchorEl);
        const id = open ? 'sub-stats' : undefined;

        return (
            <React.Fragment>
                <Box sx={{width: 200, fontSize: 13, marginTop: '20px'}}>
                    <Button disableRipple aria-describedby={id} onClick={handleClick}>
                        <span>Valuable Sub Stats</span>
                        <SettingsIcon/>
                    </Button>
                    {value.map((label) => (
                        <Box
                            key={label}
                            sx={{
                                mt: '3px',
                                height: 20,
                                padding: '.15em 4px',
                                fontWeight: 600,
                                lineHeight: '15px',
                                borderRadius: '2px',
                            }}
                        >
                            {label}
                        </Box>
                    ))}
                </Box>
                <StyledPopper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
                    <ClickAwayListener onClickAway={handleClose}>
                        <div>
                            <Box
                                sx={{
                                    borderBottom: `1px solid #eaecef`,
                                    padding: '8px 10px',
                                    fontWeight: 600,
                                }}
                            >
                                Update Sub Stats
                            </Box>
                            <Autocomplete
                                open
                                multiple
                                onClose={(
                                    _,
                                    reason: AutocompleteCloseReason,
                                ) => {
                                    if (reason === 'escape') {
                                        handleClose();
                                    }
                                }}
                                value={pendingValue}
                                onChange={(event, newValue, reason) => {
                                    if (
                                        event.type === 'keydown' &&
                                        ((event as React.KeyboardEvent).key === 'Backspace' ||
                                            (event as React.KeyboardEvent).key === 'Delete') &&
                                        reason === 'removeOption'
                                    ) {
                                        return;
                                    }
                                    setPendingValue(newValue);
                                }}
                                disableCloseOnSelect
                                PopperComponent={PopperComponent}
                                renderTags={() => null}
                                noOptionsText="No Sub Stats"
                                renderOption={(props, option, {selected}) => (
                                    <li {...props}>
                                        <Box
                                            component={DoneIcon}
                                            style={{
                                                visibility: selected ? 'visible' : 'hidden',
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                flexGrow: 1,
                                                '& span': {
                                                    color: '#586069',
                                                },
                                            }}
                                        >
                                            {option}
                                        </Box>
                                        <Box
                                            component={CloseIcon}
                                            sx={{opacity: 0.6, width: 18, height: 18}}
                                            style={{
                                                visibility: selected ? 'visible' : 'hidden',
                                            }}
                                        />
                                    </li>
                                )}
                                options={[...labels].sort((a, b) => {
                                    // Display the selected labels first.
                                    let ai = value.indexOf(a);
                                    ai = ai === -1 ? value.length + labels.indexOf(a) : ai;
                                    let bi = value.indexOf(b);
                                    bi = bi === -1 ? value.length + labels.indexOf(b) : bi;
                                    return ai - bi;
                                })}

                                getOptionLabel={(option) => option}
                                renderInput={(params) => (
                                    <Input
                                        ref={params.InputProps.ref}
                                        inputProps={params.inputProps}
                                        autoFocus
                                        placeholder="Filter Sub Stats"
                                    />
                                )}
                            />
                        </div>
                    </ClickAwayListener>
                </StyledPopper>
            </React.Fragment>
        );
    }

export default ValuableSubList;
