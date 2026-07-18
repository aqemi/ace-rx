import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import HistoryIcon from '@mui/icons-material/History';
import BlockIcon from '@mui/icons-material/Block';

export default function HeaderMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color='inherit' onClick={handleClick} title='Меню'>
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            props.openSettings();
          }}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText>Настройки/Тема</ListItemText>
        </MenuItem>
        <MenuItem
          component='a'
          href={import.meta.env.VITE_TG_LINK}
          target='_blank'
          onClick={handleClose}
          nativeButton={false}
        >
          <ListItemIcon>
            <TelegramIcon />
          </ListItemIcon>
          <ListItemText>Телеграм</ListItemText>
        </MenuItem>
        <MenuItem
          component='a'
          href={import.meta.env.VITE_GH_LINK}
          target='_blank'
          onClick={handleClose}
          nativeButton={false}
        >
          <ListItemIcon>
            <GitHubIcon />
          </ListItemIcon>
          <ListItemText>Github</ListItemText>
        </MenuItem>
        <MenuItem
          component='a'
          href={`mailto:${atob(__APP_EMAIL_B64__)}`}
          onClick={handleClose}
          nativeButton={false}
        >
          <ListItemIcon>
            <EmailIcon />
          </ListItemIcon>
          <ListItemText>Написать нам</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            props.openLogPicker();
          }}
        >
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText>Логи чата</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            props.ignoreClear();
          }}
        >
          <ListItemIcon>
            <ClearAllIcon />
          </ListItemIcon>
          <ListItemText>Очистить игнор-лист</ListItemText>
        </MenuItem>
        {props.displayAdminControls && (
          <MenuItem
            onClick={() => {
              handleClose();
              props.openBanManager();
            }}
          >
            <ListItemIcon>
              <BlockIcon />
            </ListItemIcon>
            <ListItemText>Управление банами</ListItemText>
          </MenuItem>
        )}
        <Divider />
        <MenuItem disabled>
          <ListItemText>Версия</ListItemText>
          <ListItemText secondary={__APP_VERSION__} />
        </MenuItem>
      </Menu>
    </>
  );
}
